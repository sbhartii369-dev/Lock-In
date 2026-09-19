const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', GoalSchema);
