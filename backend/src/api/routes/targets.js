const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateTarget } = require('../middleware/validation');
const Target = require('../../models/target');

// Get all targets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const targets = await Target.find({ user: req.user.id });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single target
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const target = await Target.findOne({ _id: req.params.id, user: req.user.id });
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }
    res.json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create target
router.post('/', authenticateToken, validateTarget, async (req, res) => {
  try {
    const target = new Target({
      ...req.body,
      user: req.user.id
    });
    const newTarget = await target.save();
    res.status(201).json(newTarget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update target
router.put('/:id', authenticateToken, validateTarget, async (req, res) => {
  try {
    const target = await Target.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }
    res.json(target);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete target
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const target = await Target.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }
    res.json({ message: 'Target deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 