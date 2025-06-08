const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateScan } = require('../middleware/validation');
const scanService = require('../../services/scanService');
const Scan = require('../../models/scan');
const Vulnerability = require('../../models/vulnerability');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// @desc    Get all scans
// @route   GET /api/scans
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const scans = await Scan.find()
      .populate('target', 'name url')
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json(scans);
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ message: 'Error fetching scans' });
  }
});

// @desc    Get scan by ID
// @route   GET /api/scans/:id
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id)
      .populate('target', 'name url')
      .populate('createdBy', 'name email');
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    res.json(scan);
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({ message: 'Error fetching scan' });
  }
});

// @desc    Create new scan
// @route   POST /api/scans
// @access  Private
router.post('/', authenticateToken, validateScan, async (req, res) => {
  try {
    const scan = await Scan.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    res.status(201).json(scan);
  } catch (error) {
    console.error('Error creating scan:', error);
    res.status(500).json({ message: 'Error creating scan' });
  }
});

// @desc    Start scan
// @route   POST /api/scans/:id/start
// @access  Private
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const scan = await scanService.startScan(req.params.id);
    res.json(scan);
  } catch (error) {
    console.error('Error starting scan:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Stop scan
// @route   POST /api/scans/:id/stop
// @access  Private
router.post('/:id/stop', authenticateToken, async (req, res) => {
  try {
    await scanService.stopScan(req.params.id);
    res.json({ message: 'Scan stopped successfully' });
  } catch (error) {
    console.error('Error stopping scan:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get scan progress
// @route   GET /api/scans/:id/progress
// @access  Private
router.get('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await scanService.getScanProgress(req.params.id);
    res.json(progress);
  } catch (error) {
    console.error('Error getting scan progress:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete scan
// @route   DELETE /api/scans/:id
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Only allow deletion if scan is not running
    if (scan.status === 'running') {
      return res.status(400).json({ message: 'Cannot delete running scan' });
    }
    
    await scan.remove();
    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({ message: 'Error deleting scan' });
  }
});

// @desc    Export scan results
// @route   GET /api/scans/:id/export
// @access  Private
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const scan = await Scan.findById(req.params.id)
      .populate('target', 'name url')
      .populate('createdBy', 'name email');
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    const vulnerabilities = await Vulnerability.find({ scan: scan._id })
      .populate('target', 'name url')
      .sort('severity');
    
    const data = {
      scan: {
        id: scan._id,
        name: scan.name,
        status: scan.status,
        tools: scan.tools,
        startedAt: scan.startedAt,
        completedAt: scan.completedAt,
        duration: scan.duration,
        target: scan.target,
        createdBy: scan.createdBy
      },
      vulnerabilities: vulnerabilities.map(v => ({
        id: v._id,
        title: v.title,
        description: v.description,
        severity: v.severity,
        status: v.status,
        location: v.location,
        evidence: v.evidence,
        recommendation: v.recommendation,
        createdAt: v.createdAt
      }))
    };
    
    switch (format.toLowerCase()) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=scan-${scan._id}.json`);
        res.json(data);
        break;
        
      case 'csv':
        const fields = [
          'id', 'title', 'description', 'severity', 'status',
          'location', 'evidence', 'recommendation', 'createdAt'
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(data.vulnerabilities);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=scan-${scan._id}.csv`);
        res.send(csv);
        break;
        
      case 'pdf':
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=scan-${scan._id}.pdf`);
        doc.pipe(res);
        
        // Add scan information
        doc.fontSize(20).text('Scan Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Target: ${scan.target.name} (${scan.target.url})`);
        doc.text(`Status: ${scan.status}`);
        doc.text(`Started: ${scan.startedAt}`);
        doc.text(`Completed: ${scan.completedAt}`);
        doc.text(`Duration: ${scan.duration} seconds`);
        doc.moveDown();
        
        // Add vulnerabilities
        doc.fontSize(16).text('Vulnerabilities');
        doc.moveDown();
        
        vulnerabilities.forEach(vuln => {
          doc.fontSize(14).text(vuln.title);
          doc.fontSize(12)
            .text(`Severity: ${vuln.severity}`)
            .text(`Status: ${vuln.status}`)
            .text(`Location: ${vuln.location}`)
            .text(`Description: ${vuln.description}`)
            .text(`Recommendation: ${vuln.recommendation}`);
          doc.moveDown();
        });
        
        doc.end();
        break;
        
      default:
        res.status(400).json({ message: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting scan:', error);
    res.status(500).json({ message: 'Error exporting scan' });
  }
});

// @desc    Compare two scans
// @route   GET /api/scans/compare
// @access  Private
router.get('/compare', authenticateToken, async (req, res) => {
  try {
    const { scan1, scan2 } = req.query;
    
    if (!scan1 || !scan2) {
      return res.status(400).json({ message: 'Both scan IDs are required' });
    }
    
    const [scan1Data, scan2Data] = await Promise.all([
      Scan.findById(scan1).populate('target'),
      Scan.findById(scan2).populate('target')
    ]);
    
    if (!scan1Data || !scan2Data) {
      return res.status(404).json({ message: 'One or both scans not found' });
    }
    
    const [vuln1, vuln2] = await Promise.all([
      Vulnerability.find({ scan: scan1 }),
      Vulnerability.find({ scan: scan2 })
    ]);
    
    // Compare vulnerabilities
    const comparison = {
      scan1: {
        id: scan1Data._id,
        name: scan1Data.name,
        target: scan1Data.target,
        totalVulns: vuln1.length,
        bySeverity: groupBySeverity(vuln1),
        byStatus: groupByStatus(vuln1)
      },
      scan2: {
        id: scan2Data._id,
        name: scan2Data.name,
        target: scan2Data.target,
        totalVulns: vuln2.length,
        bySeverity: groupBySeverity(vuln2),
        byStatus: groupByStatus(vuln2)
      },
      changes: {
        newVulns: findNewVulnerabilities(vuln1, vuln2),
        fixedVulns: findFixedVulnerabilities(vuln1, vuln2),
        severityChanges: findSeverityChanges(vuln1, vuln2)
      }
    };
    
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing scans:', error);
    res.status(500).json({ message: 'Error comparing scans' });
  }
});

// Helper functions for scan comparison
function groupBySeverity(vulnerabilities) {
  return vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});
}

function groupByStatus(vulnerabilities) {
  return vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.status] = (acc[vuln.status] || 0) + 1;
    return acc;
  }, {});
}

function findNewVulnerabilities(oldVulns, newVulns) {
  return newVulns.filter(newVuln => 
    !oldVulns.some(oldVuln => 
      oldVuln.title === newVuln.title && 
      oldVuln.location === newVuln.location
    )
  );
}

function findFixedVulnerabilities(oldVulns, newVulns) {
  return oldVulns.filter(oldVuln => 
    !newVulns.some(newVuln => 
      newVuln.title === oldVuln.title && 
      newVuln.location === oldVuln.location
    )
  );
}

function findSeverityChanges(oldVulns, newVulns) {
  const changes = [];
  
  oldVulns.forEach(oldVuln => {
    const newVuln = newVulns.find(v => 
      v.title === oldVuln.title && 
      v.location === oldVuln.location
    );
    
    if (newVuln && newVuln.severity !== oldVuln.severity) {
      changes.push({
        title: oldVuln.title,
        location: oldVuln.location,
        oldSeverity: oldVuln.severity,
        newSeverity: newVuln.severity
      });
    }
  });
  
  return changes;
}

module.exports = router; 