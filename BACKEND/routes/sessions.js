const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// Create a new session
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    const savedSession = await session.save();
    res.status(201).json(savedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a session (e.g., complete or interrupt)
router.patch('/:id', async (req, res) => {
  try {
    const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get today's sessions for a user
router.get('/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const sessions = await Session.find({
      userId: 'anonymous', // hardcoded for now
      startTime: { $gte: startOfDay }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
