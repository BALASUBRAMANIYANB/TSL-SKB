const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const Vulnerability = require('../../models/vulnerability');
const User = require('../../models/user');

// @desc    Get all vulnerabilities
// @route   GET /api/vulnerabilities
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
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
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id)
      .populate('scan', 'name status')
      .populate('target', 'name url')
      .populate({
        path: 'comments.user',
        select: 'name email'
      })
      .populate('assignedTo', 'name email');
    
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
// @route   PUT /api/vulnerabilities/:id/status
// @access  Private
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const vulnerability = await Vulnerability.findById(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }

    vulnerability.status = status;
    await vulnerability.save();
    res.json(vulnerability);
  } catch (error) {
    console.error('Error updating vulnerability status:', error);
    res.status(500).json({ message: 'Error updating vulnerability status' });
  }
});

// @desc    Assign vulnerability to a user
// @route   PUT /api/vulnerabilities/:id/assign
// @access  Private
router.put('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const vulnerability = await Vulnerability.findById(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }

    if (userId) {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User to assign not found' });
        }
    }
    
    vulnerability.assignedTo = userId || null;
    await vulnerability.save();
    res.json(vulnerability);
  } catch (error) {
    console.error('Error assigning vulnerability:', error);
    res.status(500).json({ message: 'Error assigning vulnerability' });
  }
});

// @desc    Add a comment to a vulnerability
// @route   POST /api/vulnerabilities/:id/comments
// @access  Private
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const vulnerability = await Vulnerability.findById(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }

    const comment = {
      user: req.user._id,
      text: text,
    };

    vulnerability.comments.push(comment);
    await vulnerability.save();
    res.json(vulnerability);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// @desc    Get vulnerability statistics
// @route   GET /api/vulnerabilities/stats/overview
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
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