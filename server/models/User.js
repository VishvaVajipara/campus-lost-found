const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validators');

// A schema describes the shape of the documents stored in a collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // MongoDB will refuse two users with the same email
    lowercase: true,
    trim: true,
    match: [EMAIL_REGEX, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // stored as a bcrypt hash, never plain text
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
