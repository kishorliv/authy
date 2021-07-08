/* eslint-disable no-prototype-builtins */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const validation = require('./account.validation');
const accountService = require('./account.service');
const utils = require('./account.utils');
const authorize = require('../../../middleware/authorize');

router.post('/register', validation.registerSchema, register);
router.post('/login', validation.loginSchema, login);
router.post('/verify-email', validation.verifyEmailSchema, verifyEmail);
router.post('/refresh-token', validation.refreshTokenSchema, refreshToken);
router.post(
  '/revoke-token',
  authorize(),
  validation.revokeTokenSchema,
  revokeToken,
);

module.exports = router;

function register(req, res, next) {
  accountService
    .register(req.body, req.get('origin'))
    .then(() =>
      res.json({
        message:
          'Registration successful. Please check your email for verification.',
      }),
    )
    .catch(next);
}

function login(req, res, next) {
  accountService
    .login(req.body, req.get('origin'))
    .then(({ refreshToken, ...account }) => {
      utils.setTokenInHttpOnlyCookie(res, refreshToken);
      res.status(200).json(account);
    })
    .catch(next);
}

function verifyEmail(req, res, next) {
  accountService
    .verifyEmail(req.body.emailVerificationToken)
    .then(() =>
      res.status(200).json({
        message: 'Registration successful. You can login now.',
      }),
    )
    .catch(next);
}

function refreshToken(req, res, next) {
  if (
    !req.hasOwnProperty('cookies') ||
    !req.cookies.hasOwnProperty('refreshToken')
  ) {
    // eslint-disable-next-line no-throw-literal
    throw 'Token not found in the request!';
  }

  const token = req.cookies.refreshToken;

  accountService
    .refreshToken(token)
    .then(({ refreshToken, ...account }) => {
      utils.setTokenInHttpOnlyCookie(res, refreshToken);
      res.json(account);
    })
    .catch(next);
}

// eslint-disable-next-line consistent-return
function revokeToken(req, res, next) {
  const token = req.body.token || req.cookies.refreshToken;

  if (!token || !req.user.ownsToken(token)) {
    return res
      .status(400)
      .json({ error: true, message: 'Unauthorized or no token found!' });
  }

  accountService
    .revokeToken(token)
    .then(() =>
      res.status(200).json({ message: 'Token revoked successfully.' }),
    )
    .catch(next);
}
