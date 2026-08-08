export function notFound(req, res) {
  res.status(404).json({ message: `Không tìm thấy ${req.method} ${req.originalUrl}.` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error);
  const status = error.status || (error.name === 'SequelizeValidationError' ? 400 : 500);
  res.status(status).json({ message: status === 500 ? 'Đã xảy ra lỗi hệ thống.' : error.message });
}

