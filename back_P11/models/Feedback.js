const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user_name: String,
  message: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
