/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const db = require('../helpers/db');

// eslint-disable-next-line no-use-before-define
module.exports = authorize;

async function authorize(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ message: 'Auth token not found!' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
  const user = await db.Account.findById({ id: decodedToken.id });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  req.user = user; // attach user obj to the request
  next();
}
