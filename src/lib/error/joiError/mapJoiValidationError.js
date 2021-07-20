const ApplicationError = require('src/lib/error/ApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = mapJoiValidationError;

// Joi error object format
//  {
//     name: 'ValidationError',
//     isJoi,
//     details: [
//       {
//         message,
//         path,
//         type,
//         context: {
//           key,
//           label,
//           value,
//         },
//       },
//     ],
//   };

/**
 * Map Joi Validation error to 'ApplicationError' type
 * @param {*} joiError Joi error object
 *
 */
// eslint-disable-next-line no-underscore-dangle
function mapJoiValidationError(joiError) {
  return {
    type: ApplicationError.type.APP_NAME,
    code: 'VALIDATION_ERROR',
    message: 'Joi validation error.',
    errors: joiError.details,
    statusCode: 400,
    meta: {},
  };
}
