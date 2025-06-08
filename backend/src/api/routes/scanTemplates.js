const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateScanTemplate } = require('../middleware/validation');
const ScanTemplate = require('../../models/scanTemplate');

// @desc    Get all scan templates
// @route   GET /api/scan-templates
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const query = {
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    };
    
    const templates = await ScanTemplate.find(query)
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching scan templates:', error);
    res.status(500).json({ message: 'Error fetching scan templates' });
  }
});

// @desc    Get scan template by ID
// @route   GET /api/scan-templates/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const template = await ScanTemplate.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    }).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({ message: 'Scan template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching scan template:', error);
    res.status(500).json({ message: 'Error fetching scan template' });
  }
});

// @desc    Create scan template
// @route   POST /api/scan-templates
// @access  Private
router.post('/', protect, validateScanTemplate, async (req, res) => {
  try {
    const template = await ScanTemplate.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating scan template:', error);
    res.status(500).json({ message: 'Error creating scan template' });
  }
});

// @desc    Update scan template
// @route   PUT /api/scan-templates/:id
// @access  Private
router.put('/:id', protect, validateScanTemplate, async (req, res) => {
  try {
    const template = await ScanTemplate.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Scan template not found' });
    }
    
    Object.assign(template, req.body);
    await template.save();
    
    res.json(template);
  } catch (error) {
    console.error('Error updating scan template:', error);
    res.status(500).json({ message: 'Error updating scan template' });
  }
});

// @desc    Delete scan template
// @route   DELETE /api/scan-templates/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const template = await ScanTemplate.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Scan template not found' });
    }
    
    res.json({ message: 'Scan template deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan template:', error);
    res.status(500).json({ message: 'Error deleting scan template' });
  }
});

// @desc    Create scan from template
// @route   POST /api/scan-templates/:id/create-scan
// @access  Private
router.post('/:id/create-scan', protect, async (req, res) => {
  try {
    const template = await ScanTemplate.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    });
    
    if (!template) {
      return res.status(404).json({ message: 'Scan template not found' });
    }
    
    const { target } = req.body;
    if (!target) {
      return res.status(400).json({ message: 'Target is required' });
    }
    
    const scan = await Scan.create({
      target,
      tools: template.tools,
      toolConfig: template.toolConfig,
      schedule: template.schedule,
      createdBy: req.user._id
    });
    
    res.status(201).json(scan);
  } catch (error) {
    console.error('Error creating scan from template:', error);
    res.status(500).json({ message: 'Error creating scan from template' });
  }
});

module.exports = router; 