import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { jest } from '@jest/globals';
import app from '../src/app.js';
import { ActivityLog, Category, Favorite, LearningResource, ResourceFile, Role, Subject, User, sequelize } from '../src/models/index.js';

const secret = 'test-secret-at-least-for-smoke-tests';
let filesToCleanup = [];

afterEach(async () => {
  jest.restoreAllMocks();
  await Promise.all(filesToCleanup.map((file) => fs.unlink(file).catch(() => {})));
  filesToCleanup = [];
});

describe('API smoke and security checks', () => {
  it('returns service status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok', service: 'Digital Learning Resources API' });
  });

  it('returns JSON 404 for an unknown endpoint', async () => {
    const response = await request(app).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Không tìm thấy');
  });

  it('rejects malformed login input before querying the database', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'invalid', password: '' });
    expect(response.status).toBe(400);
  });

  it('rejects registration with a password shorter than six characters', async () => {
    const response = await request(app).post('/api/auth/register').send({ fullName: 'Sinh viên Test', email: 'new@test.local', password: '12345' });
    expect(response.status).toBe(400);
  });

  it('registers a valid student without exposing the password hash', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(Role, 'findOne').mockResolvedValue({ id: 1, name: 'STUDENT' });
    jest.spyOn(User, 'create').mockImplementation(async (data) => ({ id: 9, ...data, status: 'ACTIVE', createdAt: new Date(), Role: { name: 'STUDENT' }, reload: jest.fn() }));
    jest.spyOn(ActivityLog, 'create').mockResolvedValue({});
    const response = await request(app).post('/api/auth/register').send({ fullName: 'Sinh viên Mới', email: 'new@test.local', password: 'Strong@123' });
    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe('STUDENT');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a duplicate registration email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 });
    const response = await request(app).post('/api/auth/register').send({ fullName: 'Sinh viên Trùng', email: 'duplicate@test.local', password: 'Strong@123' });
    expect(response.status).toBe(409);
  });

  it('protects the current-user endpoint', async () => {
    process.env.JWT_SECRET = secret;
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  it('protects resource upload', async () => {
    process.env.JWT_SECRET = secret;
    const response = await request(app).post('/api/resources');
    expect(response.status).toBe(401);
  });

  it('protects administration endpoints', async () => {
    process.env.JWT_SECRET = secret;
    const response = await request(app).get('/api/admin/statistics');
    expect(response.status).toBe(401);
  });

  it('logs in an active user and returns a signed JWT', async () => {
    process.env.JWT_SECRET = secret;
    const passwordHash = await bcrypt.hash('Correct@123', 4);
    jest.spyOn(User, 'findOne').mockResolvedValue({
      id: 2, fullName: 'Giảng viên Test', email: 'lecturer@test.local',
      passwordHash, status: 'ACTIVE', Role: { name: 'LECTURER' }, createdAt: new Date()
    });
    jest.spyOn(ActivityLog, 'create').mockResolvedValue({});
    const response = await request(app).post('/api/auth/login').send({ email: 'lecturer@test.local', password: 'Correct@123' });
    expect(response.status).toBe(200);
    expect(jwt.verify(response.body.token, secret)).toMatchObject({ id: 2, role: 'LECTURER' });
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects an incorrect password', async () => {
    process.env.JWT_SECRET = secret;
    const passwordHash = await bcrypt.hash('Correct@123', 4);
    jest.spyOn(User, 'findOne').mockResolvedValue({ passwordHash, status: 'ACTIVE', Role: { name: 'STUDENT' } });
    const response = await request(app).post('/api/auth/login').send({ email: 'student@test.local', password: 'Wrong@123' });
    expect(response.status).toBe(401);
  });

  it('rejects a locked account', async () => {
    process.env.JWT_SECRET = secret;
    const passwordHash = await bcrypt.hash('Correct@123', 4);
    jest.spyOn(User, 'findOne').mockResolvedValue({ passwordHash, status: 'LOCKED', Role: { name: 'STUDENT' } });
    const response = await request(app).post('/api/auth/login').send({ email: 'locked@test.local', password: 'Correct@123' });
    expect(response.status).toBe(403);
  });

  it('denies an authenticated student access to administration', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 3, status: 'ACTIVE', Role: { name: 'STUDENT' } });
    const token = jwt.sign({ id: 3, role: 'STUDENT' }, secret);
    const response = await request(app).get('/api/admin/statistics').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it('rejects unsupported upload extensions', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 2, status: 'ACTIVE', Role: { name: 'LECTURER' } });
    const token = jwt.sign({ id: 2, role: 'LECTURER' }, secret);
    const response = await request(app).post('/api/resources').set('Authorization', `Bearer ${token}`).attach('file', Buffer.from('not allowed'), 'malware.exe');
    expect(response.status).toBe(400);
  });

  it('uploads a valid PDF as a pending resource in one transaction', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 2, status: 'ACTIVE', Role: { name: 'LECTURER' } });
    jest.spyOn(Subject, 'findByPk').mockResolvedValue({ id: 1 });
    jest.spyOn(Category, 'findByPk').mockResolvedValue({ id: 1 });
    const transaction = { commit: jest.fn(), rollback: jest.fn() };
    jest.spyOn(sequelize, 'transaction').mockResolvedValue(transaction);
    jest.spyOn(LearningResource, 'create').mockResolvedValue({ id: 101, status: 'PENDING' });
    jest.spyOn(ResourceFile, 'create').mockImplementation(async (data) => { filesToCleanup.push(data.path); return data; });
    jest.spyOn(LearningResource, 'findByPk').mockResolvedValue({ id: 101, title: 'PDF kiểm thử', status: 'PENDING', file: { originalName: 'test.pdf', extension: '.pdf', size: 8 } });
    jest.spyOn(ActivityLog, 'create').mockResolvedValue({});
    const token = jwt.sign({ id: 2, role: 'LECTURER' }, secret);
    const response = await request(app).post('/api/resources').set('Authorization', `Bearer ${token}`)
      .field('title', 'PDF kiểm thử').field('description', 'Tài liệu hợp lệ').field('subjectId', '1').field('categoryId', '1')
      .attach('file', Buffer.from('%PDF-1.4'), 'test.pdf');
    expect(response.status).toBe(201);
    expect(response.body.item.status).toBe('PENDING');
    expect(transaction.commit).toHaveBeenCalled();
    expect(transaction.rollback).not.toHaveBeenCalled();
  });

  it('rejects a file larger than the configured 20 MB limit', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 2, status: 'ACTIVE', Role: { name: 'LECTURER' } });
    const token = jwt.sign({ id: 2, role: 'LECTURER' }, secret);
    const response = await request(app).post('/api/resources').set('Authorization', `Bearer ${token}`)
      .field('title', 'File lớn').field('description', 'Vượt giới hạn').field('subjectId', '1').field('categoryId', '1')
      .attach('file', Buffer.alloc(20 * 1024 * 1024 + 1), 'large.pdf');
    expect(response.status).toBe(400);
  });

  it('only searches approved learning resources', async () => {
    const query = jest.spyOn(LearningResource, 'findAndCountAll').mockResolvedValue({ rows: [], count: 0 });
    const response = await request(app).get('/api/resources?search=node&page=1&limit=9');
    expect(response.status).toBe(200);
    expect(query.mock.calls[0][0].where.status).toBe('APPROVED');
  });

  it('applies subject filtering and pagination offset', async () => {
    const query = jest.spyOn(LearningResource, 'findAndCountAll').mockResolvedValue({ rows: [], count: 0 });
    const response = await request(app).get('/api/resources?subjectId=5&page=3&limit=4');
    expect(response.status).toBe(200);
    expect(query.mock.calls[0][0]).toMatchObject({ offset: 8, limit: 4 });
    expect(query.mock.calls[0][0].where).toMatchObject({ status: 'APPROVED', subjectId: '5' });
  });

  it('lets a lecturer update their own resource and resets it to pending', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 2, status: 'ACTIVE', Role: { name: 'LECTURER' } });
    const item = { id: 10, uploaderId: 2, title: 'Cũ', description: 'Mô tả', subjectId: 1, categoryId: 1, accessLevel: 'AUTHENTICATED', keywords: '', update: jest.fn(async function (data) { Object.assign(this, data); }) };
    jest.spyOn(LearningResource, 'findByPk').mockResolvedValue(item);
    jest.spyOn(Subject, 'findByPk').mockResolvedValue({ id: 1 });
    jest.spyOn(Category, 'findByPk').mockResolvedValue({ id: 1 });
    jest.spyOn(ActivityLog, 'create').mockResolvedValue({});
    const token = jwt.sign({ id: 2, role: 'LECTURER' }, secret);
    const response = await request(app).put('/api/resources/10').set('Authorization', `Bearer ${token}`).send({ title: 'Tiêu đề mới' });
    expect(response.status).toBe(200);
    expect(item.status).toBe('PENDING');
  });

  it('prevents a lecturer from updating another lecturer resource', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 2, status: 'ACTIVE', Role: { name: 'LECTURER' } });
    jest.spyOn(LearningResource, 'findByPk').mockResolvedValue({ id: 10, uploaderId: 99 });
    const token = jwt.sign({ id: 2, role: 'LECTURER' }, secret);
    const response = await request(app).put('/api/resources/10').set('Authorization', `Bearer ${token}`).send({ title: 'Không được phép' });
    expect(response.status).toBe(403);
  });

  it('does not create a duplicate favorite and can remove it', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 3, status: 'ACTIVE', Role: { name: 'STUDENT' } });
    jest.spyOn(LearningResource, 'findOne').mockResolvedValue({ id: 10, status: 'APPROVED', accessLevel: 'AUTHENTICATED' });
    jest.spyOn(Favorite, 'findOrCreate').mockResolvedValueOnce([{}, true]).mockResolvedValueOnce([{}, false]);
    jest.spyOn(Favorite, 'destroy').mockResolvedValue(1);
    const token = jwt.sign({ id: 3, role: 'STUDENT' }, secret);
    const first = await request(app).post('/api/favorites/10').set('Authorization', `Bearer ${token}`);
    const second = await request(app).post('/api/favorites/10').set('Authorization', `Bearer ${token}`);
    const removed = await request(app).delete('/api/favorites/10').set('Authorization', `Bearer ${token}`);
    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect(removed.status).toBe(200);
  });

  it('updates the current user profile', async () => {
    process.env.JWT_SECRET = secret;
    const user = { id: 3, fullName: 'Tên cũ', email: 'student@test.local', status: 'ACTIVE', Role: { name: 'STUDENT' }, save: jest.fn() };
    jest.spyOn(User, 'findByPk').mockResolvedValue(user);
    const token = jwt.sign({ id: 3, role: 'STUDENT' }, secret);
    const response = await request(app).put('/api/auth/profile').set('Authorization', `Bearer ${token}`).send({ fullName: 'Tên mới' });
    expect(response.status).toBe(200);
    expect(response.body.user.fullName).toBe('Tên mới');
  });

  it('previews an approved PDF', async () => {
    process.env.JWT_SECRET = secret;
    const previewPath = path.resolve('uploads', 'jest-preview.pdf');
    await fs.mkdir(path.dirname(previewPath), { recursive: true });
    await fs.writeFile(previewPath, '%PDF-1.4 test');
    filesToCleanup.push(previewPath);
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 3, status: 'ACTIVE', Role: { name: 'STUDENT' } });
    jest.spyOn(LearningResource, 'findOne').mockResolvedValue({ id: 10, status: 'APPROVED', accessLevel: 'AUTHENTICATED', file: { extension: '.pdf', originalName: 'preview.pdf', path: previewPath } });
    const token = jwt.sign({ id: 3, role: 'STUDENT' }, secret);
    const response = await request(app).get('/api/resources/10/preview').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/pdf');
  });

  it('requires a reason when an admin rejects a resource', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, status: 'ACTIVE', Role: { name: 'ADMIN' } });
    const token = jwt.sign({ id: 1, role: 'ADMIN' }, secret);
    const response = await request(app).put('/api/admin/approvals/99/reject').set('Authorization', `Bearer ${token}`).send({ reason: '' });
    expect(response.status).toBe(400);
  });

  it('prevents an admin from locking their own account', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, status: 'ACTIVE', Role: { name: 'ADMIN' } });
    const token = jwt.sign({ id: 1, role: 'ADMIN' }, secret);
    const response = await request(app).put('/api/admin/users/1/status').set('Authorization', `Bearer ${token}`).send({ status: 'LOCKED' });
    expect(response.status).toBe(400);
  });

  it('returns conflict when deleting a catalog item in use', async () => {
    process.env.JWT_SECRET = secret;
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, status: 'ACTIVE', Role: { name: 'ADMIN' } });
    jest.spyOn(Category, 'findByPk').mockResolvedValue({ name: 'Đang sử dụng', destroy: jest.fn().mockRejectedValue(new Error('foreign key')) });
    const token = jwt.sign({ id: 1, role: 'ADMIN' }, secret);
    const response = await request(app).delete('/api/categories/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(409);
  });

  it('does not expose passwordHash after an admin changes user status', async () => {
    process.env.JWT_SECRET = secret;
    const admin = { id: 1, status: 'ACTIVE', Role: { name: 'ADMIN' } };
    const target = { id: 2, fullName: 'Người dùng Test', email: 'user@test.local', passwordHash: 'secret-hash', status: 'ACTIVE', roleId: 1, update: jest.fn(async function (data) { Object.assign(this, data); }) };
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce(admin).mockResolvedValueOnce(target);
    jest.spyOn(ActivityLog, 'create').mockResolvedValue({});
    const token = jwt.sign({ id: 1, role: 'ADMIN' }, secret);
    const response = await request(app).put('/api/admin/users/2/status').set('Authorization', `Bearer ${token}`).send({ status: 'LOCKED' });
    expect(response.status).toBe(200);
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.body.user.status).toBe('LOCKED');
  });
});
