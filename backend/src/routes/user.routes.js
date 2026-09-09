import { Router } from 'express';
import { Favorite, LearningResource, ResourceFile, Subject, Category, DownloadHistory } from '../models/index.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const include = [{ model: Subject }, { model: Category }, { model: ResourceFile, as: 'file', attributes: ['id', 'originalName', 'mimeType', 'extension', 'size', 'resourceId'] }];

router.get('/favorites', authenticate, asyncHandler(async (req, res) => {
  const rows = await Favorite.findAll({ where: { userId: req.user.id } });
  const items = await LearningResource.findAll({ where: { id: rows.map(x => x.resourceId), status: 'APPROVED' }, include });
  res.json({ items });
}));
router.post('/favorites/:resourceId', authenticate, asyncHandler(async (req, res) => {
  const resource = await LearningResource.findOne({ where: { id: req.params.resourceId, status: 'APPROVED' } });
  if (!resource) return res.status(404).json({ message: 'Không tìm thấy học liệu đã được duyệt.' });
  if (resource.accessLevel === 'LECTURER_ONLY' && req.user.Role.name === 'STUDENT') return res.status(403).json({ message: 'Tài liệu chỉ dành cho giảng viên.' });
  const [, created] = await Favorite.findOrCreate({ where: { userId: req.user.id, resourceId: resource.id } });
  res.status(created ? 201 : 200).json({ message: created ? 'Đã thêm vào yêu thích.' : 'Học liệu đã có trong danh sách yêu thích.' });
}));
router.delete('/favorites/:resourceId', authenticate, asyncHandler(async (req, res) => { await Favorite.destroy({ where: { userId: req.user.id, resourceId: req.params.resourceId } }); res.json({ message: 'Đã bỏ yêu thích.' }); }));
router.get('/history/downloads', authenticate, asyncHandler(async (req, res) => res.json({ items: await DownloadHistory.findAll({ where: { userId: req.user.id }, include: [{ model: LearningResource, include }], order: [['downloadedAt', 'DESC']] }) })));
export default router;
