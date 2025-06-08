const Target = require('../../models/target');

// @desc    Get all targets
// @route   GET /api/targets
// @access  Private
exports.getTargets = async (req, res) => {
  try {
    const targets = await Target.find({ createdBy: req.user.id });
    res.json({
      success: true,
      count: targets.length,
      data: targets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single target
// @route   GET /api/targets/:id
// @access  Private
exports.getTarget = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        error: 'Target not found'
      });
    }

    // Make sure user owns target
    if (target.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this target'
      });
    }

    res.json({
      success: true,
      data: target
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create target
// @route   POST /api/targets
// @access  Private
exports.createTarget = async (req, res) => {
  try {
    const target = await Target.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: target
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update target
// @route   PUT /api/targets/:id
// @access  Private
exports.updateTarget = async (req, res) => {
  try {
    let target = await Target.findById(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        error: 'Target not found'
      });
    }

    // Make sure user owns target
    if (target.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this target'
      });
    }

    target = await Target.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: target
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete target
// @route   DELETE /api/targets/:id
// @access  Private
exports.deleteTarget = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);

    if (!target) {
      return res.status(404).json({
        success: false,
        error: 'Target not found'
      });
    }

    // Make sure user owns target
    if (target.createdBy.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this target'
      });
    }

    await target.remove();

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