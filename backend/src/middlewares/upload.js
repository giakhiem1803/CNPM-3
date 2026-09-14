import multer from 'multer';
import path from 'path';

const allowed = new Set(['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg']);

export const upload = multer({
  // Keep the upload in memory until the route stores it transactionally in
  // the database. This survives Render restarts without requiring a disk.
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 20) * 1024 * 1024 },
  fileFilter: (req, file, cb) => allowed.has(path.extname(file.originalname).toLowerCase())
    ? cb(null, true)
    : cb(Object.assign(new Error('Định dạng file không được hỗ trợ.'), { status: 400 }))
});
