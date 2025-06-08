const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const targetRoutes = require('./targets');
const scanRoutes = require('./scans');
const vulnerabilityRoutes = require('./vulnerabilities');
const scanTemplateRoutes = require('./scanTemplates');
const metricsRoutes = require('./metrics');
const wazuhRoutes = require('./wazuh');
const testAutomationRoutes = require('./testAutomation');

router.use('/users', userRoutes);
router.use('/targets', targetRoutes);
router.use('/scans', scanRoutes);
router.use('/vulnerabilities', vulnerabilityRoutes);
router.use('/scan-templates', scanTemplateRoutes);
router.use('/metrics', metricsRoutes);
router.use('/wazuh', wazuhRoutes);
router.use('/test-automation', testAutomationRoutes);

module.exports = router; 