const logger = require('../logger/logger');
const config = require('../configs/customEnvVariables');

const globalErrorHandler = (err, req, res, next) => {
  logger.error('Middleware Error Handling:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const stack = config.nodeEnv === 'development' ? err.stack : {};

  res.status(status).json({
    success: false,
    status,
    message,
    stack,
  });
};

module.exports = globalErrorHandler;
