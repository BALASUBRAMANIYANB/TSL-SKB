const Scan = require('../../models/scan');
const Target = require('../../models/target');
const ScanTemplate = require('../../models/scanTemplate');

// @desc    Get all scans
// @route   GET /api/scans
// @access  Private
exports.getScans = async (req, res) => {
  try {
    const scans = await Scan.find({ createdBy: req.user.id })
      .populate('target', 'name url')
      .sort('-createdAt');

    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single scan
// @route   GET /api/scans/:id
// @access  Private
exports.getScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id)
      .populate('target', 'name url')
      .populate('createdBy', 'username');

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    // Make sure user owns scan
    if (scan.createdBy._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this scan'
      });
    }

    res.json({
      success: true,
      data: scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create scan from a template
// @route   POST /api/scans
// @access  Private
exports.createScan = async (req, res) => {
  try {
    const { target: targetId, template: templateId } = req.body;

    // Verify target exists and user owns it
    const target = await Target.findById(targetId);
    if (!target) {
      return res.status(404).json({ success: false, error: 'Target not found' });
    }
    if (target.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to scan this target' });
    }

    // Verify template exists
    const template = await ScanTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Scan template not found' });
    }

    // Create scan from template
    const scan = await Scan.create({
      name: `${template.name} - ${target.name}`,
      target: targetId,
      template: templateId,
      scanType: template.scanType,
      wazuhModule: template.wazuhModule,
      wazuhParams: template.wazuhParams,
      tools: template.tools,
      toolConfig: template.toolConfig,
      createdBy: req.user.id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update scan
// @route   PUT /api/scans/:id
// @access  Private
exports.updateScan = async (req, res) => {
  try {
    let scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    // Make sure user owns scan
    if (scan.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this scan'
      });
    }

    scan = await Scan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete scan
// @route   DELETE /api/scans/:id
// @access  Private
exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    // Make sure user owns scan
    if (scan.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this scan'
      });
    }

    await scan.remove();

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
}; 