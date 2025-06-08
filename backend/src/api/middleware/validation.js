const { body, validationResult } = require('express-validator');

const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateTarget = [
  body('name').notEmpty().withMessage('Name is required'),
  body('url').isURL().withMessage('Valid URL is required'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateScan = [
  body('target')
    .notEmpty()
    .withMessage('Target is required')
    .isMongoId()
    .withMessage('Invalid target ID'),
  
  body('tools')
    .isArray()
    .withMessage('Tools must be an array')
    .notEmpty()
    .withMessage('At least one tool must be selected'),
  
  body('tools.*')
    .isIn(['zap', 'nmap', 'nikto'])
    .withMessage('Invalid tool selected'),
  
  body('toolConfig')
    .optional()
    .isObject()
    .withMessage('Tool configuration must be an object'),
  
  body('toolConfig.zap')
    .optional()
    .isObject()
    .withMessage('ZAP configuration must be an object'),
  
  body('toolConfig.zap.level')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid ZAP scan level'),
  
  body('toolConfig.nmap')
    .optional()
    .isObject()
    .withMessage('Nmap configuration must be an object'),
  
  body('toolConfig.nmap.scanType')
    .optional()
    .isIn(['default', 'quick', 'comprehensive'])
    .withMessage('Invalid Nmap scan type'),
  
  body('toolConfig.nikto')
    .optional()
    .isObject()
    .withMessage('Nikto configuration must be an object'),
  
  body('toolConfig.nikto.plugins')
    .optional()
    .isIn(['all', 'default', 'none'])
    .withMessage('Invalid Nikto plugins option'),
  
  body('schedule')
    .optional()
    .isObject()
    .withMessage('Schedule must be an object'),
  
  body('schedule.type')
    .optional()
    .isIn(['once', 'daily', 'weekly', 'monthly'])
    .withMessage('Invalid schedule type'),
  
  body('schedule.time')
    .optional()
    .isString()
    .withMessage('Schedule time must be a string'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateScanTemplate = [
  body('name')
    .notEmpty()
    .withMessage('Template name is required')
    .trim(),
  
  body('description')
    .optional()
    .trim(),
  
  body('tools')
    .isArray()
    .withMessage('Tools must be an array')
    .notEmpty()
    .withMessage('At least one tool must be selected'),
  
  body('tools.*')
    .isIn(['zap', 'nmap', 'nikto'])
    .withMessage('Invalid tool selected'),
  
  body('toolConfig')
    .optional()
    .isObject()
    .withMessage('Tool configuration must be an object'),
  
  body('toolConfig.zap')
    .optional()
    .isObject()
    .withMessage('ZAP configuration must be an object'),
  
  body('toolConfig.zap.level')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid ZAP scan level'),
  
  body('toolConfig.nmap')
    .optional()
    .isObject()
    .withMessage('Nmap configuration must be an object'),
  
  body('toolConfig.nmap.scanType')
    .optional()
    .isIn(['default', 'quick', 'comprehensive'])
    .withMessage('Invalid Nmap scan type'),
  
  body('toolConfig.nikto')
    .optional()
    .isObject()
    .withMessage('Nikto configuration must be an object'),
  
  body('toolConfig.nikto.plugins')
    .optional()
    .isIn(['all', 'default', 'none'])
    .withMessage('Invalid Nikto plugins option'),
  
  body('schedule')
    .optional()
    .isObject()
    .withMessage('Schedule must be an object'),
  
  body('schedule.type')
    .optional()
    .isIn(['once', 'daily', 'weekly', 'monthly'])
    .withMessage('Invalid schedule type'),
  
  body('schedule.time')
    .optional()
    .isString()
    .withMessage('Schedule time must be a string'),
  
  body('schedule.days')
    .optional()
    .isArray()
    .withMessage('Schedule days must be an array'),
  
  body('schedule.days.*')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Invalid day number'),
  
  body('schedule.timezone')
    .optional()
    .isString()
    .withMessage('Timezone must be a string'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateReport = [
  body('scan').notEmpty().withMessage('Scan ID is required'),
  body('target').notEmpty().withMessage('Target ID is required'),
  body('findings').isArray().withMessage('Findings must be an array'),
  body('summary').optional().isString(),
  body('status').isIn(['draft', 'final']).withMessage('Status must be either draft or final'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

const schemas = {
  createUser: validateUser,
  createTarget: validateTarget,
  createScan: validateScan,
  createScanTemplate: validateScanTemplate,
  createReport: validateReport
};

module.exports = {
  validate,
  schemas,
  validateUser,
  validateLogin,
  validateTarget,
  validateScan,
  validateScanTemplate,
  validateReport
}; 