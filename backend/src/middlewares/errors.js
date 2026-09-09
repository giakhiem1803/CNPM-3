export function notFound(req, res) {
  res.status(404).json({ message: `Không tìm thấy ${req.method} ${req.originalUrl}.` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status
    || (error.code === 'LIMIT_FILE_SIZE' ? 400 : null)
    || (['SequelizeValidationError', 'SequelizeForeignKeyConstraintError'].includes(error.name) ? 400 : 500);
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status === 500 ? 'Đã xảy ra lỗi hệ thống.' : error.message });
}
