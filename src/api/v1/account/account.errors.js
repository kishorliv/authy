const ApplicationError = require('src/lib/error/ApplicationError');

module.exports = {
  EMAIL_ALREADY_TAKEN_VERIFIED: {
    type: ApplicationError.type.AUTHY,
    code: 'EMAIL_ALREADY_TAKEN_VERIFIED',
    message: 'Account with the given email address already exists!',
    statusCode: 400,
  },
  EMAIL_ALREADY_TAKEN_NOT_VERIFIED: {
    type: ApplicationError.type.AUTHY,
    code: 'EMAIL_ALREADY_TAKEN_NOT_VERIFIED',
    message:
      'Account with this email already exists! Please check your email for verification instructions.',
    statusCode: 400,
  },
  AUTH_WEAK_PASSWORD: {
    type: ApplicationError.type.AUTHY,
    code: 'AUTH_WEAK_PASSWORD',
    message: 'The given password is easy to guess, provide strong password!',
    statusCode: 400,
  },
  INCORRECT_CREDENTIALS: {
    type: ApplicationError.type.AUTHY,
    code: 'INCORRECT_CREDENTIALS',
    message: 'Incorrect email or password!',
    statusCode: 400,
  },
  EMAIL_VERIFICATION_FAILED: {
    type: ApplicationError.type.AUTHY,
    code: 'EMAIL_VERIFICATION_FAILED',
    message: 'Email verification failed!',
    statusCode: 400,
  },
  INVALID_REFRESH_TOKEN: {
    type: ApplicationError.type.AUTHY,
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Invalid refresh token or token not found!',
    statusCode: 400,
  },
};
