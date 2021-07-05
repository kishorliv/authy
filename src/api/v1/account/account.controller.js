/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const validation = require('./account.validation');
const accountService = require('./account.service');

router.post('/register', validation.registerSchema, register);
router.post('/login', validation.loginSchema, login);
router.post('/verify-email', validation.verifyEmailSchema, verifyEmail);

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
    .then((account) => res.status(200).json(account))
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
