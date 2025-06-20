const express = require('express');
const router = express.Router();
const Report = require('../../models/report');
const Scan = require('../../models/scan');
const Vulnerability = require('../../models/vulnerability');
const { validate, schemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const ReportService = require('../../services/reports/reportService');

// @route   GET /api/reports
// @desc    Get all reports
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user.id })
      .populate('scan', 'type status')
      .populate('target', 'name url')
      .populate({
          path: 'content.vulnerabilities',
          model: 'Vulnerability',
          populate: [
              { path: 'assignedTo', select: 'name email' },
              { path: 'comments.user', select: 'name email' }
          ]
      })
      .sort('-createdAt');

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
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
      .populate('createdBy', 'username')
      .populate({
          path: 'content.vulnerabilities',
          model: 'Vulnerability',
          populate: [
              { path: 'assignedTo', select: 'name email' },
              { path: 'comments.user', select: 'name email' }
          ]
      });

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

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
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
    const { scanId, name, type, format } = req.body;

    // 1. Fetch the scan and its vulnerabilities
    const scan = await Scan.findById(scanId).populate('target');
    if (!scan) {
        return res.status(404).json({ message: 'Scan not found' });
    }
    const vulnerabilities = await Vulnerability.find({ scan: scanId });

    // 2. Create the initial report record in the database
    const report = new Report({
      name,
      type,
      format,
      scan: scanId,
      target: scan.target._id,
      createdBy: req.user.id,
      status: 'generating',
      content: {
        summary: {
          totalVulnerabilities: vulnerabilities.length,
          criticalCount: vulnerabilities.filter(v => v.severity === 'critical').length,
          highCount: vulnerabilities.filter(v => v.severity === 'high').length,
          mediumCount: vulnerabilities.filter(v => v.severity === 'medium').length,
          lowCount: vulnerabilities.filter(v => v.severity === 'low').length,
          scanDate: scan.createdAt,
        },
        vulnerabilities: vulnerabilities.map(v => v._id)
      }
    });
    await report.save();

    // 3. Asynchronously generate the report file
    // We don't wait for this to finish, allowing a quick API response.
    const fullReportForGeneration = await Report.findById(report._id)
        .populate('target')
        .populate({
            path: 'content.vulnerabilities',
            model: 'Vulnerability'
        });
    
    new ReportService(fullReportForGeneration).generate()
      .catch(err => console.error(`Failed to generate report file for ${report._id}:`, err));

    // 4. Respond to the client immediately
    res.status(202).json({
      success: true,
      message: 'Report generation has started.',
      data: report
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// @route   GET /api/reports/:id/download
// @desc    Download a generated report
// @access  Private
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    if (report.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to download this report.' });
    }
    if (report.status !== 'completed' || !report.filePath) {
      return res.status(400).json({ message: 'Report is not ready for download or generation failed.' });
    }

    res.download(report.filePath, `report-${report.name.replace(/ /g, '_')}.pdf`, (err) => {
      if (err) {
        console.error('Error sending report file:', err);
      }
    });

  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ message: 'Server error while downloading report.' });
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