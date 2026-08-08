import { Router } from 'express';
import { Favorite, LearningResource, ResourceFile, Subject, Category, DownloadHistory } from '../models/index.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);
const include = [{ model: Subject }, { model: Category }, { model: ResourceFile, as: 'file' }];

router.get('/favorites', asyncHandler(async (req, res) => {
  const rows = await Favorite.findAll({ where: { userId: req.user.id } });
  const items = await LearningResource.findAll({ where: { id: rows.map(x => x.resourceId), status: 'APPROVED' }, include });
  res.json({ items });
}));
router.post('/favorites/:resourceId', asyncHandler(async (req, res) => { await Favorite.findOrCreate({ where: { userId: req.user.id, resourceId: req.params.resourceId } }); res.status(201).json({ message: 'Đã thêm vào yêu thích.' }); }));
router.delete('/favorites/:resourceId', asyncHandler(async (req, res) => { await Favorite.destroy({ where: { userId: req.user.id, resourceId: req.params.resourceId } }); res.json({ message: 'Đã bỏ yêu thích.' }); }));
router.get('/history/downloads', asyncHandler(async (req, res) => res.json({ items: await DownloadHistory.findAll({ where: { userId: req.user.id }, include: [{ model: LearningResource, include }], order: [['downloadedAt', 'DESC']] }) })));
export default router;

