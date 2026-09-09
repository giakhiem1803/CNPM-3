import fs from 'fs/promises';
import path from 'path';
import { Op } from 'sequelize';
import { Router } from 'express';
import { Approval, Category, DownloadHistory, Favorite, LearningResource, ResourceFile, Subject, User, sequelize } from '../models/index.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logActivity } from '../utils/activity.js';

const router = Router();
const publicFileAttributes = ['id', 'originalName', 'mimeType', 'extension', 'size', 'resourceId'];
const include = [{ model: User, as: 'uploader', attributes: ['id', 'fullName'] }, Subject, Category, { model: ResourceFile, as: 'file', attributes: publicFileAttributes }];
const validAccessLevels = new Set(['AUTHENTICATED', 'LECTURER_ONLY']);
const clean = (value) => typeof value === 'string' ? value.trim() : value;

async function validateCatalog(subjectId, categoryId) {
  const [subject, category] = await Promise.all([Subject.findByPk(subjectId), Category.findByPk(categoryId)]);
  if (!subject || !category) return false;
  return true;
}

router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9));
  const where = { status: 'APPROVED' };
  if (req.query.search) where[Op.or] = ['title', 'description', 'keywords'].map((field) => ({ [field]: { [Op.like]: `%${req.query.search}%` } }));
  if (req.query.subjectId) where.subjectId = req.query.subjectId;
  if (req.query.categoryId) where.categoryId = req.query.categoryId;
  const sortMap = { newest: ['createdAt','DESC'], oldest: ['createdAt','ASC'], popular: ['downloadCount','DESC'] };
  const resourceInclude = include.map(x => x.as === 'file' && req.query.fileType ? { ...x, where: { extension: `.${String(req.query.fileType).toLowerCase().replace('.','')}` } } : x);
  const result = await LearningResource.findAndCountAll({ where, include:resourceInclude, distinct: true, order: [sortMap[req.query.sort] || sortMap.newest], offset: (page - 1) * limit, limit });
  res.json({ items: result.rows, pagination: { page, limit, total: result.count, pages: Math.ceil(result.count / limit) } });
}));

router.get('/my-resources', authenticate, authorize('LECTURER', 'ADMIN'), asyncHandler(async (req, res) => res.json({ items: await LearningResource.findAll({ where: { uploaderId: req.user.id }, include, order: [['createdAt', 'DESC']] }) })));

router.get('/:id', asyncHandler(async (req, res) => { const item = await LearningResource.findOne({ where: { id: req.params.id, status: 'APPROVED' }, include }); return item ? res.json({ item }) : res.status(404).json({ message: 'Không tìm thấy học liệu.' }); }));

router.post('/', authenticate, authorize('LECTURER', 'ADMIN'), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn file học liệu.' });
  const title = clean(req.body.title), description = clean(req.body.description), keywords = clean(req.body.keywords);
  const { subjectId, categoryId } = req.body;
  const accessLevel = req.body.accessLevel || 'AUTHENTICATED';
  const removeUploadedFile = () => fs.unlink(req.file.path).catch(() => {});
  if (!title || !description || !subjectId || !categoryId) { await removeUploadedFile(); return res.status(400).json({ message: 'Thiếu tiêu đề, mô tả, môn học hoặc danh mục.' }); }
  if (!validAccessLevels.has(accessLevel)) { await removeUploadedFile(); return res.status(400).json({ message: 'Quyền truy cập không hợp lệ.' }); }
  if (!(await validateCatalog(subjectId, categoryId))) { await removeUploadedFile(); return res.status(400).json({ message: 'Môn học hoặc danh mục không tồn tại.' }); }
  const transaction = await sequelize.transaction();
  let resource;
  try {
    resource = await LearningResource.create({ title, description, subjectId, categoryId, keywords, accessLevel, uploaderId: req.user.id }, { transaction });
    await ResourceFile.create({ resourceId: resource.id, originalName: req.file.originalname, storedName: req.file.filename, path: req.file.path, mimeType: req.file.mimetype, extension: path.extname(req.file.originalname).toLowerCase(), size: req.file.size }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    await removeUploadedFile();
    throw error;
  }
  await logActivity(req.user.id, 'RESOURCE_UPLOAD', `Học liệu #${resource.id}: ${title}`);
  res.status(201).json({ message: 'Upload thành công, tài liệu đang chờ duyệt.', item: await LearningResource.findByPk(resource.id, { include }) });
}));

router.put('/:id', authenticate, authorize('LECTURER', 'ADMIN'), asyncHandler(async (req, res) => {
  const item = await LearningResource.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Không tìm thấy học liệu.' });
  if (req.user.Role.name !== 'ADMIN' && item.uploaderId !== req.user.id) return res.status(403).json({ message: 'Bạn chỉ được sửa học liệu của mình.' });
  const title = req.body.title === undefined ? item.title : clean(req.body.title);
  const description = req.body.description === undefined ? item.description : clean(req.body.description);
  const subjectId = req.body.subjectId ?? item.subjectId, categoryId = req.body.categoryId ?? item.categoryId;
  const accessLevel = req.body.accessLevel ?? item.accessLevel;
  if (!title || !description) return res.status(400).json({ message: 'Tiêu đề và mô tả không được để trống.' });
  if (!validAccessLevels.has(accessLevel)) return res.status(400).json({ message: 'Quyền truy cập không hợp lệ.' });
  if (!(await validateCatalog(subjectId, categoryId))) return res.status(400).json({ message: 'Môn học hoặc danh mục không tồn tại.' });
  await item.update({ title, description, subjectId, categoryId, keywords: req.body.keywords === undefined ? item.keywords : clean(req.body.keywords), accessLevel, status: 'PENDING', rejectionReason: null });
  await logActivity(req.user.id, 'RESOURCE_UPDATE', `Học liệu #${item.id}: ${item.title}`);
  res.json({ message: 'Đã cập nhật; tài liệu được chuyển về chờ duyệt.', item });
}));

router.delete('/:id', authenticate, authorize('LECTURER', 'ADMIN'), asyncHandler(async (req, res) => {
  const item = await LearningResource.findByPk(req.params.id, { include: [{ model: ResourceFile, as: 'file' }] });
  if (!item) return res.status(404).json({ message: 'Không tìm thấy học liệu.' });
  if (req.user.Role.name !== 'ADMIN' && item.uploaderId !== req.user.id) return res.status(403).json({ message: 'Bạn chỉ được xóa học liệu của mình.' });
  const filePath = item.file?.path;
  const transaction = await sequelize.transaction();
  try {
    await Promise.all([
      Approval.destroy({ where: { resourceId: item.id }, transaction }),
      DownloadHistory.destroy({ where: { resourceId: item.id }, transaction }),
      Favorite.destroy({ where: { resourceId: item.id }, transaction })
    ]);
    await ResourceFile.destroy({ where: { resourceId: item.id }, transaction });
    await item.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  if (filePath) await fs.unlink(filePath).catch((error) => console.warn('Không thể xóa file vật lý:', error.message));
  await logActivity(req.user.id, 'RESOURCE_DELETE', `Học liệu #${item.id}: ${item.title}`);
  res.json({ message: 'Đã xóa học liệu.' });
}));

router.get('/:id/preview', authenticate, asyncHandler(async (req, res) => {
  const item = await LearningResource.findOne({ where: { id: req.params.id, status: 'APPROVED' }, include: [{ model: ResourceFile, as: 'file' }] });
  if (!item?.file) return res.status(404).json({ message: 'Không tìm thấy file.' });
  if (item.accessLevel === 'LECTURER_ONLY' && req.user.Role.name === 'STUDENT') return res.status(403).json({ message: 'Tài liệu chỉ dành cho giảng viên.' });
  if (item.file.extension !== '.pdf') return res.status(415).json({ message: 'Chỉ hỗ trợ xem trước tài liệu PDF.' });
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(item.file.originalName)}`);
  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(path.resolve(item.file.path));
}));

router.get('/:id/download', authenticate, asyncHandler(async (req, res) => {
  const item = await LearningResource.findOne({ where: { id: req.params.id, status: 'APPROVED' }, include: [{ model: ResourceFile, as: 'file' }] });
  if (!item?.file) return res.status(404).json({ message: 'Không tìm thấy file.' });
  if (item.accessLevel === 'LECTURER_ONLY' && req.user.Role.name === 'STUDENT') return res.status(403).json({ message: 'Tài liệu chỉ dành cho giảng viên.' });
  await DownloadHistory.create({ userId: req.user.id, resourceId: item.id });
  await item.increment('downloadCount');
  res.download(path.resolve(item.file.path), item.file.originalName);
}));

export default router;
