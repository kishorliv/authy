/* eslint-disable no-use-before-define */
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const config = require('../../../../config.dev');

module.exports = {
  hashPassword,
  generateRandomToken,
  sendEmail,
  sendVerificationEmail,
  generateJwtToken,
};

async function sendVerificationEmail(account, origin) {
  let message;

  if (!origin) {
    message = `<p>Please use the token below to verify the api route /account/verify-email</p>
                   <p>${account.emailVerificationToken}</p>`;
  } else {
    message = `<p>Please use this link to verify:</p>
                   <p><a href="${verificationUrl}">${verificationUrl}</a></p>`;
  }

  const verificationUrl = `${origin}/account/verify-email?token=${account.emailVerificationToken}`;

  await sendEmail({
    to: account.email,
    subject: `Email verification from Authy`,
    html: `<h3>Verfiy email</h3>
               ${message}`,
  });
}

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcryptjs.hashSync(password, saltRounds);
}

function generateRandomToken() {
  const byteSize = 40;
  return crypto.randomBytes(byteSize).toString('hex');
}

function generateJwtToken(account) {
  jwt.sign({ sub: account.id, id: account.id }, process.env.SECRET_JWT, {
    expiresIn: '10m',
  });
}
