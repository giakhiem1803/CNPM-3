import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const allowed = new Set(['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg']);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(currentDir, '../../uploads');
mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`)
});

export const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 20) * 1024 * 1024 },
  fileFilter: (req, file, cb) => allowed.has(path.extname(file.originalname).toLowerCase())
    ? cb(null, true)
    : cb(Object.assign(new Error('Định dạng file không được hỗ trợ.'), { status: 400 }))
});
