const express = require('express');
const router = express.Router();
const Report = require('../../models/report');
const { validate, schemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id })
      .populate('scan', 'type status')
      .populate('target', 'name url')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('scan', 'type status')
      .populate('target', 'name url')
      .populate('createdBy', 'username');

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Make sure user owns report
    if (report.createdBy._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this report'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   POST /api/reports
// @desc    Create report
// @access  Private
router.post('/', authenticateToken, validate(schemas.createReport), async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Make sure user owns report
    if (report.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this report'
      });
    }

    await report.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router; 