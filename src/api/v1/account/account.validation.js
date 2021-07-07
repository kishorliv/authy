/* eslint-disable no-use-before-define */
const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  revokeTokenSchema,
};

function registerSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  validateRequest(req, next, schema);
}

function loginSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  validateRequest(req, next, schema);
}

function verifyEmailSchema(req, res, next) {
  const schema = Joi.object({
    emailVerificationToken: Joi.string().required(),
  });

  validateRequest(res, next, schema);
}

function refreshTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(''),
  });

  validateRequest(res, next, schema);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(''),
  });

  validateRequest(res, next, schema);
}
