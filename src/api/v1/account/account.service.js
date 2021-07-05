/* eslint-disable no-throw-literal */
/* eslint-disable no-use-before-define */
const bcryptjs = require('bcryptjs');

const utils = require('./account.utils');
const db = require('../../../helpers/db');

module.exports = {
  register,
  login,
  verifyEmail,
};

/**
 *
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
 *
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

  // valid user details so generate jwt
  const jwtToken = utils.generateJwtToken(account);

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
  };
}

/**
 *
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
