const express = require('express');
const router = express.Router();
const metricsService = require('../../services/metricsService');
const { protect } = require('../middleware/auth');

// Get overall scan metrics
router.get('/scans', protect, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    const metrics = await metricsService.getScanMetrics(timeframe);
    res.json(metrics);
  } catch (error) {
    console.error('Error getting scan metrics:', error);
    res.status(500).json({ message: 'Error getting scan metrics' });
  }
});

// Get metrics for a specific target
router.get('/targets/:targetId', protect, async (req, res) => {
  try {
    const { targetId } = req.params;
    const timeframe = req.query.timeframe || '30d';
    const metrics = await metricsService.getTargetMetrics(targetId, timeframe);
    res.json(metrics);
  } catch (error) {
    console.error('Error getting target metrics:', error);
    res.status(500).json({ message: 'Error getting target metrics' });
  }
});

// Get trend analysis
router.get('/trends', protect, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '90d';
    const trends = await metricsService.getTrendAnalysis(timeframe);
    res.json(trends);
  } catch (error) {
    console.error('Error getting trend analysis:', error);
    res.status(500).json({ message: 'Error getting trend analysis' });
  }
});

module.exports = router; 