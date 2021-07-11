const mongoose = require('mongoose');

const Account = require('../api/v1/account/account.model');
const RefreshToken = require('../api/v1/account/refresh-token.model');

mongoose.set('useCreateIndex', true);

function connectDB() {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
}

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: true,
//   })
//   .catch((error) => {
//     console.error(error);
//   });

module.exports = { connectDB, Account, RefreshToken };
