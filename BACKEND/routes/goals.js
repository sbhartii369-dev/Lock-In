const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Create a goal
router.post('/', async (req, res) => {
  try {
    const goal = new Goal(req.body);
    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: 'anonymous' });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete a goal
router.patch('/:id', async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
    res.json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
