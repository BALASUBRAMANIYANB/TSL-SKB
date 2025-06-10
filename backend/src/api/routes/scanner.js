const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth');
const IntegrationService = require('../../services/scanner/integrationService');
const HistoryService = require('../../services/scanner/historyService');

// Start a new scan
router.post('/scan', authenticateToken, async (req, res) => {
  try {
    const { target, profile, options } = req.body;
    const userId = req.user.id;

    if (!target || !profile) {
      return res.status(400).json({ message: 'Target and profile are required' });
    }

    // Create scan record
    const scanRecord = await HistoryService.createScanRecord(userId, target, profile);
    
    // Update status to running
    await HistoryService.updateScanStatus(scanRecord._id, 'running');

    // Execute scan
    try {
      const scanResult = await IntegrationService.executeManualScan(userId, target, profile, options);
      
      // Update scan record with results
      await HistoryService.updateScanStatus(scanRecord._id, 'completed', scanResult);
      
      res.json(scanResult);
    } catch (error) {
      // Update scan record with error
      await HistoryService.updateScanStatus(scanRecord._id, 'failed', null, error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error starting scan:', error);
    res.status(500).json({ message: error.message || 'Error starting scan' });
  }
});

// Get scan status
router.get('/scan/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    const scan = await HistoryService.getScanReport(scanId);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    res.json(scan);
  } catch (error) {
    console.error('Error getting scan status:', error);
    res.status(500).json({ message: error.message || 'Error getting scan status' });
  }
});

// Cancel a scan
router.post('/scan/:scanId/cancel', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    // TODO: Implement actual scan cancellation in IntegrationService
    await HistoryService.updateScanStatus(scanId, 'cancelled');
    
    res.json({ message: 'Scan cancelled successfully' });
  } catch (error) {
    console.error('Error canceling scan:', error);
    res.status(500).json({ message: error.message || 'Error canceling scan' });
  }
});

// Get scan history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const history = await HistoryService.getScanHistory(userId, parseInt(page), parseInt(limit));
    res.json(history);
  } catch (error) {
    console.error('Error getting scan history:', error);
    res.status(500).json({ message: error.message || 'Error getting scan history' });
  }
});

// Get scan report
router.get('/report/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    const report = await HistoryService.getScanReport(scanId);
    if (!report) {
      return res.status(404).json({ message: 'Scan report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error getting scan report:', error);
    res.status(500).json({ message: error.message || 'Error getting scan report' });
  }
});

// Delete scan history
router.delete('/history/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    await HistoryService.deleteScanHistory(userId, scanId);
    res.json({ message: 'Scan history deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan history:', error);
    res.status(500).json({ message: error.message || 'Error deleting scan history' });
  }
});

module.exports = router; 