const Joi = require('joi');

const ApplicationError = require('src/lib/error/ApplicationError');
const mapJoiValidationError = require('src/lib/error/joiError/mapJoiValidationError');

// eslint-disable-next-line no-use-before-define
module.exports = mapToApplicationError;

/**
 * Creates an 'ApplicationError' by mapping errors from third party libraries
 * @param {*} error error object
 * @param {*} overrides custom props
 * @returns
 */
function mapToApplicationError(error, overrides = {}) {
  switch (error) {
    case error instanceof Joi.ValidationError:
      return new ApplicationError(mapJoiValidationError(error), overrides);
    default:
      return new ApplicationError(error, overrides);
  }
}
