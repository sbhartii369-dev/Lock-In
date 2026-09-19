const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' }, // Mock user for now
  subject: { type: String, required: true },
  goal: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  technique: { type: String, required: true },
  completed: { type: Boolean, default: false },
  interrupted: { type: Boolean, default: false },
  distractions: [{ type: String }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
});

module.exports = mongoose.model('Session', SessionSchema);
