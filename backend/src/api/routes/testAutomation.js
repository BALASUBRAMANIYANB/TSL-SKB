const express = require('express');
const router = express.Router();
const testAutomationService = require('../../services/testAutomationService');
const testResultsService = require('../../services/testResultsService');
const { protect } = require('../middleware/auth');

// Create a test suite
router.post('/suites', protect, async (req, res) => {
  try {
    const suite = await testAutomationService.createTestSuite({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(suite);
  } catch (error) {
    console.error('Error creating test suite:', error);
    res.status(500).json({ message: 'Error creating test suite' });
  }
});

// Run a test suite
router.post('/suites/:suiteId/run', protect, async (req, res) => {
  try {
    const { suiteId } = req.params;
    const results = await testAutomationService.runTestSuite(suiteId);
    res.json(results);
  } catch (error) {
    console.error('Error running test suite:', error);
    res.status(500).json({ message: 'Error running test suite' });
  }
});

// Get test history for a target
router.get('/targets/:targetId/history', protect, async (req, res) => {
  try {
    const { targetId } = req.params;
    const { limit } = req.query;
    const history = await testAutomationService.getTestHistory(targetId, limit);
    res.json(history);
  } catch (error) {
    console.error('Error getting test history:', error);
    res.status(500).json({ message: 'Error getting test history' });
  }
});

// Compare test results
router.get('/compare', protect, async (req, res) => {
  try {
    const { testId1, testId2 } = req.query;
    const comparison = await testAutomationService.compareTestResults(testId1, testId2);
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing test results:', error);
    res.status(500).json({ message: 'Error comparing test results' });
  }
});

// Get aggregated test results
router.get('/results/:scanId', protect, async (req, res) => {
  try {
    const { scanId } = req.params;
    const results = await testResultsService.aggregateTestResults(scanId);
    res.json(results);
  } catch (error) {
    console.error('Error getting test results:', error);
    res.status(500).json({ message: 'Error getting test results' });
  }
});

// Update test schedule
router.put('/tests/:testId/schedule', protect, async (req, res) => {
  try {
    const { testId } = req.params;
    const { schedule } = req.body;
    await testAutomationService.updateSchedule(testId, schedule);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating test schedule:', error);
    res.status(500).json({ message: 'Error updating test schedule' });
  }
});

// Remove test schedule
router.delete('/tests/:testId/schedule', protect, async (req, res) => {
  try {
    const { testId } = req.params;
    await testAutomationService.removeSchedule(testId);
    res.json({ message: 'Schedule removed successfully' });
  } catch (error) {
    console.error('Error removing test schedule:', error);
    res.status(500).json({ message: 'Error removing test schedule' });
  }
});

module.exports = router; 