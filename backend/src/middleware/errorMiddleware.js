const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.statusCode || (error.name === 'SequelizeValidationError' ? 400 : 500);
  const errors = error.errors?.map(item => item.message) || [];
  console.error(error);
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : error.message,
    errors
  });
};

module.exports = { notFound, errorHandler };
