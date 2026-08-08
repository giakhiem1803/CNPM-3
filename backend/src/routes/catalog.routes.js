import { Router } from 'express';
import { Category, Subject } from '../models/index.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logActivity } from '../utils/activity.js';

const router = Router();
const crud = (path, Model) => {
  router.get(`/${path}`, asyncHandler(async (req, res) => res.json({ items: await Model.findAll({ order: [['name', 'ASC']] }) })));
  router.post(`/${path}`, authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => { if (!req.body.name?.trim()) return res.status(400).json({ message: 'Tên không được để trống.' }); const item=await Model.create({ name:req.body.name.trim(), description:req.body.description }); await logActivity(req.user.id,'CATALOG_CREATE',`${path}: ${item.name}`); res.status(201).json({ message:'Đã tạo.',item }); }));
  router.put(`/${path}/:id`, authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => { const item = await Model.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' }); if (!req.body.name?.trim()) return res.status(400).json({ message: 'Tên không được để trống.' }); await item.update({ name: req.body.name.trim(), description: req.body.description }); await logActivity(req.user.id,'CATALOG_UPDATE',`${path}: ${item.name}`); res.json({ message: 'Đã cập nhật.', item }); }));
  router.delete(`/${path}/:id`, authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => { const item = await Model.findByPk(req.params.id); if (!item) return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' }); const name=item.name; try{await item.destroy()}catch{ return res.status(409).json({ message:'Không thể xóa vì dữ liệu đang được học liệu sử dụng.' }) } await logActivity(req.user.id,'CATALOG_DELETE',`${path}: ${name}`); res.json({ message: 'Đã xóa.' }); }));
};
crud('subjects', Subject);
crud('categories', Category);
export default router;
