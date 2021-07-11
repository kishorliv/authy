const jwt = require('jsonwebtoken');
const db = require('../helpers/db');

// eslint-disable-next-line no-use-before-define
module.exports = authorize;

function authorize() {
  /* eslint-disable consistent-return */
  return async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
      return res
        .status(401)
        .json({ error: true, message: 'Auth token not found!' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    const user = await db.Account.findById({ id: decodedToken.id });

    if (!user) {
      return res.status(401).json({ error: true, message: 'Unauthorized!' });
    }

    const refreshTokens = await db.RefreshToken.find({ account: user.id });

    // attach user obj to the request
    req.user = user;
    req.user.ownsToken = (_token) =>
      !!refreshTokens.find((x) => x.token === _token);
    next();
  };
}
