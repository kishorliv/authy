const mongoose = require('mongoose');
const Account = require('../api/v1/account/account.model');

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

module.exports = { Account };
