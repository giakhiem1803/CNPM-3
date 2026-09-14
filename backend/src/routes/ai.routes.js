import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const allowedActions = new Set(['summarize', 'keywords']);

router.use(authenticate, authorize('LECTURER', 'ADMIN'));

router.post('/:action', asyncHandler(async (req, res) => {
  const { action } = req.params;
  if (!allowedActions.has(action)) return res.status(404).json({ message: 'Chức năng AI không tồn tại.' });
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
  if (text.length < 20 || text.length > 12000) {
    return res.status(400).json({ message: 'Nội dung AI phải có từ 20 đến 12.000 ký tự.' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status === 503 ? 503 : 502).json({
        message: data.detail || 'Dịch vụ AI tạm thời không khả dụng.'
      });
    }
    return res.json(data);
  } catch (error) {
    return res.status(503).json({
      message: error.name === 'AbortError' ? 'Dịch vụ AI phản hồi quá thời gian.' : 'Không thể kết nối dịch vụ AI.'
    });
  } finally {
    clearTimeout(timer);
  }
}));

export default router;
