const { body, validationResult } = require('express-validator');
const cron = require('node-cron');

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
  body('scanType')
    .notEmpty()
    .withMessage('Scan type is required')
    .isString()
    .withMessage('Scan type must be a string'),
  body('wazuhParams')
    .optional()
    .isObject()
    .withMessage('Wazuh parameters must be an object'),
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
    .trim()
    .notEmpty().withMessage('Template name is required.')
    .isLength({ max: 100 }).withMessage('Template name cannot exceed 100 characters.'),
  
  body('description')
    .optional()
    .trim(),

  body('scanType')
    .isIn(['nmap', 'nikto', 'wazuh']).withMessage('Invalid scan type. Must be one of: nmap, nikto, wazuh.'),

  body('wazuhModule')
    .if(body('scanType').equals('wazuh'))
    .notEmpty().withMessage('Wazuh module is required when scanType is wazuh.'),

  body('schedule')
    .optional({ nullable: true })
    .trim()
    .custom((value) => {
      if (value && !cron.validate(value)) {
        throw new Error('Invalid cron expression.');
      }
      return true;
    }),

  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean.'),

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