const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Vulnerability = require('../../models/vulnerability');

// @desc    Get all vulnerabilities
// @route   GET /api/vulnerabilities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { scan, target, severity, status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (scan) query.scan = scan;
    if (target) query.target = target;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    // Execute query with pagination
    const vulnerabilities = await Vulnerability.find(query)
      .populate('scan', 'name status')
      .populate('target', 'name url')
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Vulnerability.countDocuments(query);
    
    res.json({
      vulnerabilities,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    res.status(500).json({ message: 'Error fetching vulnerabilities' });
  }
});

// @desc    Get vulnerability by ID
// @route   GET /api/vulnerabilities/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id)
      .populate('scan', 'name status')
      .populate('target', 'name url')
      .populate('createdBy', 'name email');
    
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    
    res.json(vulnerability);
  } catch (error) {
    console.error('Error fetching vulnerability:', error);
    res.status(500).json({ message: 'Error fetching vulnerability' });
  }
});

// @desc    Update vulnerability status
// @route   PATCH /api/vulnerabilities/:id
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const vulnerability = await Vulnerability.findById(req.params.id);
    
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    
    // Update fields
    if (status) vulnerability.status = status;
    if (notes) vulnerability.notes = notes;
    
    await vulnerability.save();
    
    res.json(vulnerability);
  } catch (error) {
    console.error('Error updating vulnerability:', error);
    res.status(500).json({ message: 'Error updating vulnerability' });
  }
});

// @desc    Get vulnerability statistics
// @route   GET /api/vulnerabilities/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Vulnerability.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const statusStats = await Vulnerability.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      bySeverity: stats,
      byStatus: statusStats
    });
  } catch (error) {
    console.error('Error fetching vulnerability statistics:', error);
    res.status(500).json({ message: 'Error fetching vulnerability statistics' });
  }
});

module.exports = router; 