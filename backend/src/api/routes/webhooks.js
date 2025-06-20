const express = require('express');
const router = express.Router();
const Webhook = require('../../models/webhook');
const { authenticateToken, authorize } = require('../middleware/auth');
const fetch = require('node-fetch');

// List all webhooks
router.get('/', authenticateToken, authorize('admin'), async (req, res) => {
  const webhooks = await Webhook.find();
  res.json(webhooks);
});

// Create a webhook
router.post('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { url, event, enabled } = req.body;
    const webhook = new Webhook({
      url,
      event,
      enabled,
      createdBy: req.user._id,
    });
    await webhook.save();
    res.status(201).json(webhook);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create webhook.' });
  }
});

// Update a webhook
router.put('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { url, event, enabled } = req.body;
    const webhook = await Webhook.findByIdAndUpdate(
      req.params.id,
      { url, event, enabled },
      { new: true }
    );
    if (!webhook) return res.status(404).json({ message: 'Webhook not found.' });
    res.json(webhook);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update webhook.' });
  }
});

// Delete a webhook
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const webhook = await Webhook.findByIdAndDelete(req.params.id);
    if (!webhook) return res.status(404).json({ message: 'Webhook not found.' });
    res.json({ message: 'Webhook deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete webhook.' });
  }
});

// Test a webhook
router.post('/test', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { url, event } = req.body;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, test: true, message: 'Test webhook from Security Scanner.' })
    });
    if (response.ok) {
      res.json({ success: true, message: 'Webhook test successful.' });
    } else {
      res.status(400).json({ success: false, message: 'Webhook test failed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error testing webhook.' });
  }
});

module.exports = router; 