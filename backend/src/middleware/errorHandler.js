export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: error.message || 'Unexpected server error.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};
