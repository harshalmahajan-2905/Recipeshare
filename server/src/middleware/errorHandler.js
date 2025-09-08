export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File upload error',
      details: err.message
    });
  }

  res.status(500).json({
    message: 'Internal server error'
  });
};