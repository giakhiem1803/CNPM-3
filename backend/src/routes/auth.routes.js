import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Role, User } from '../models/index.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logActivity } from '../utils/activity.js';

const router = Router();
const publicUser = (u) => ({ id: u.id, fullName: u.fullName, email: u.email, status: u.status, role: u.Role?.name, createdAt: u.createdAt });
const validate = (req, res, next) => { const errors = validationResult(req); return errors.isEmpty() ? next() : res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() }); };

router.post('/register', [body('fullName').trim().isLength({ min: 2 }).withMessage('Họ tên tối thiểu 2 ký tự.'), body('email').isEmail().withMessage('Email không hợp lệ.'), body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự.')], validate, asyncHandler(async (req, res) => {
  if (await User.findOne({ where: { email: req.body.email.toLowerCase() } })) return res.status(409).json({ message: 'Email đã được sử dụng.' });
  const role = await Role.findOne({ where: { name: 'STUDENT' } });
  const user = await User.create({ fullName: req.body.fullName, email: req.body.email.toLowerCase(), passwordHash: await bcrypt.hash(req.body.password, 10), roleId: role.id });
  await logActivity(user.id, 'REGISTER', 'Tạo tài khoản mới');
  await user.reload({ include: Role });
  res.status(201).json({ message: 'Đăng ký thành công.', user: publicUser(user) });
}));

router.post('/login', [body('email').isEmail().withMessage('Email không hợp lệ.'), body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu.')], validate, asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email.toLowerCase() }, include: Role });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
  if (user.status === 'LOCKED') return res.status(403).json({ message: 'Tài khoản đã bị khóa.' });
  const token = jwt.sign({ id: user.id, role: user.Role.name }, process.env.JWT_SECRET || 'development-secret-change-me', { expiresIn: '8h' });
  await logActivity(user.id, 'LOGIN', 'Đăng nhập thành công');
  res.json({ token, user: publicUser(user) });
}));

router.get('/me', authenticate, (req, res) => res.json({ user: publicUser(req.user) }));
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  if (!req.body.fullName?.trim()) return res.status(400).json({ message: 'Họ tên không được để trống.' });
  req.user.fullName = req.body.fullName.trim(); await req.user.save();
  res.json({ message: 'Đã cập nhật hồ sơ.', user: publicUser(req.user) });
}));

export default router;
