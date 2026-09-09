import jwt from 'jsonwebtoken';
import { Role, User } from '../models/index.js';

export async function authenticate(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Máy chủ chưa được cấu hình JWT_SECRET.' });
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, { include: Role });
    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ message: 'Tài khoản không hợp lệ hoặc đã bị khóa.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

export const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.Role.name) ? next() : res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này.' });
