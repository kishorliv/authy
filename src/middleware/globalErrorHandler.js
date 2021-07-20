const ApplicationError = require('src/lib/error/ApplicationError');
const CommonError = require('src/lib/error/commonErrors');
const formatError = require('src/lib/error/formatError');
const mapToApplicationError = require('src/lib/error/mapToApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = globalErrorHandler;

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode || 500).json(formatError(err));
  }

  if (err instanceof Error) {
    const newError = mapToApplicationError(err);
    return res.status(err.statusCode || 500).json(formatError(newError));
  }

  const unknownError = new ApplicationError(CommonError.UNKNOWN_ERROR);
  return res.status(err.statusCode || 500).json(formatError(unknownError));
}
