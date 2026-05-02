const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:             { type: String, required: true, unique: true },
  password:          { type: String, required: true },
  isAdmin:           { type: Boolean, default: false },
  name:              { type: String },
  phone:             { type: String },
  address:           { type: String },
  isVerified:        { type: Boolean, default: false },
  verificationToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);