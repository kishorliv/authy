/* eslint-disable no-throw-literal */
/* eslint-disable no-use-before-define */
const bcryptjs = require('bcryptjs');

const utils = require('./account.utils');
const db = require('../../../helpers/db');

module.exports = {
  register,
  login,
  verifyEmail,
  refreshToken,
  revokeToken,
};

/**
 * Register a user account
 * @param {object} userData An object containing user details
 * @param {string} origin Domain originating the call
 */
async function register(userData, origin) {
  const account = await db.Account.findOne({ email: userData.email });

  // account exists and verified
  if (account && account.isVerified) {
    throw 'Account with this email already exists!';
  }

  // account exists and not verified
  if (account && !account.isVerified) {
    await utils.sendVerificationEmail(account, origin);
    throw 'Account with this email already exists! Please check your email for verification instructions.';
  }

  const passwordHash = utils.hashPassword(userData.password);
  // eslint-disable-next-line no-param-reassign
  delete userData.password;
  // eslint-disable-next-line no-param-reassign
  delete userData.confirmPassword;

  const newAccount = new db.Account(userData);
  newAccount.passwordHash = passwordHash;
  newAccount.emailVerificationToken = utils.generateRandomToken();

  await newAccount.save();

  await utils.sendVerificationEmail(newAccount, origin);
}

/**
 * Authenticate an account
 * @param {object} userData An object containing user details
 * @param {string} origin Domain originating the call
 * @returns Authenticated user info
 */
async function login(userData, origin) {
  const { email, password } = userData;

  const account = await db.Account.findOne({ email });

  // account valid and not verified
  if (!account && !bcryptjs.compareSync(password, account.passwordHash)) {
    throw 'Incorrect email or password!';
  }

  if (account && !account.isVerified) {
    await utils.sendVerificationEmail(account, origin);
    throw 'Account is not verified! Please check your email for verification instructions.';
  }

  // valid user details so generate jwt access token and refresh token
  const jwtToken = utils.generateJwtToken(account);
  // eslint-disable-next-line no-shadow
  const refreshToken = utils.generateRefreshToken(account);

  await refreshToken.save();

  const {
    id,
    firstName,
    lastName,
    email: _email,
    createdAt,
    verifiedAt,
  } = account;

  return {
    id,
    firstName,
    lastName,
    email: _email,
    createdAt,
    verifiedAt,
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

/**
 * Verify email based on verfication token
 * @param {string} emailVerificationToken A token for verifying email
 */
async function verifyEmail(emailVerificationToken) {
  const account = await db.Account.findOne({ emailVerificationToken });

  if (!account) {
    throw 'Email verification failed!';
  }

  account.verifiedAt = Date.now();
  account.emailVerificationToken = undefined;

  await account.save();
}

/**
 * Replace token with new refresh token
 * @param {string} token Refresh token
 * @returns { object } Object containing new jwt and refresh token
 */
async function refreshToken(token) {
  const refToken = await db.RefreshToken.findOne({ token }).populate('account');
  if (!refToken || !refToken.isValid) throw 'Invalid token!';

  const newRefToken = utils.generateRefreshToken(refToken.account);

  refToken.revokedAt = Date.now();
  refToken.replacedByToken = newRefToken.token;

  await refToken.save();
  await newRefToken.save();

  const newJwt = utils.generateJwtToken(refToken.account);

  const { id, email } = refToken.account;

  return {
    id,
    email,
    newJwt,
    refreshToken: newRefToken.token,
  };
}

/**
 * Revoke token
 * @param {*} token Refresh token
 */
async function revokeToken(token) {
  const refToken = await db.RefreshToken.findOne({ token }).populate('account');
  if (!refToken || !refToken.isValid) throw 'Invalid token!';

  refToken.revokedAt = Date.now();

  await refToken.save();
}
