const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  token: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  revokedAt: Date,
});

schema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

schema.virtual('isValid').get(function () {
  return !this.revokedAt && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', schema);
