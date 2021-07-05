const express = require('express');

const app = express();
const cors = require('cors');

const swaggerRouter = require('./api/docs/swagger');
const accountRouter = require('./api/v1/account/account.controller');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

// routes
app.use('/api/v1/ping', (req, res) =>
  res.status(200).json({ message: 'Server running.' }),
);

app.use('/api/v1/account', accountRouter);

// swagger docs
app.use('/api/v1/api-docs', swaggerRouter);

// global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (typeof err === 'string') {
    // custom application error
    const is404 = err.toLowerCase().endsWith('not found');
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ error: true, message: err });
  }
  // send internal server error messages in development only
  return process.env.NODE_ENV === 'production'
    ? res.status(500)
    : res.status(500).json({ error: true, message: err.message });
});

module.exports = app;
