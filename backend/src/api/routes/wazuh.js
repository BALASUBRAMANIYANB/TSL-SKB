const express = require('express');
const router = express.Router();
const wazuhService = require('../../services/wazuhService');
const { protect } = require('../middleware/auth');

// Get all Wazuh agents
router.get('/agents', protect, async (req, res) => {
  try {
    const agents = await wazuhService.getAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error getting Wazuh agents:', error);
    res.status(500).json({ message: 'Error getting Wazuh agents' });
  }
});

// Get agent status
router.get('/agents/:agentId/status', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const status = await wazuhService.getAgentStatus(agentId);
    res.json(status);
  } catch (error) {
    console.error('Error getting agent status:', error);
    res.status(500).json({ message: 'Error getting agent status' });
  }
});

// Get agent vulnerabilities
router.get('/agents/:agentId/vulnerabilities', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const vulnerabilities = await wazuhService.getAgentVulnerabilities(agentId);
    res.json(vulnerabilities);
  } catch (error) {
    console.error('Error getting agent vulnerabilities:', error);
    res.status(500).json({ message: 'Error getting agent vulnerabilities' });
  }
});

// Get agent security events
router.get('/agents/:agentId/events', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { limit } = req.query;
    const events = await wazuhService.getSecurityEvents(agentId, limit);
    res.json(events);
  } catch (error) {
    console.error('Error getting agent events:', error);
    res.status(500).json({ message: 'Error getting agent events' });
  }
});

// Get system health
router.get('/health', protect, async (req, res) => {
  try {
    const health = await wazuhService.getSystemHealth();
    res.json(health);
  } catch (error) {
    console.error('Error getting system health:', error);
    res.status(500).json({ message: 'Error getting system health' });
  }
});

// Get active threats
router.get('/threats', protect, async (req, res) => {
  try {
    const threats = await wazuhService.getActiveThreats();
    res.json(threats);
  } catch (error) {
    console.error('Error getting active threats:', error);
    res.status(500).json({ message: 'Error getting active threats' });
  }
});

// Get security alerts
router.get('/alerts', protect, async (req, res) => {
  try {
    const alerts = await wazuhService.getSecurityAlerts(req.query);
    res.json(alerts);
  } catch (error) {
    console.error('Error getting security alerts:', error);
    res.status(500).json({ message: 'Error getting security alerts' });
  }
});

// Get agent compliance status
router.get('/agents/:agentId/compliance', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const compliance = await wazuhService.getComplianceStatus(agentId);
    res.json(compliance);
  } catch (error) {
    console.error('Error getting agent compliance:', error);
    res.status(500).json({ message: 'Error getting agent compliance' });
  }
});

// Get system stats
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await wazuhService.getSystemStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting system stats:', error);
    res.status(500).json({ message: 'Error getting system stats' });
  }
});

// Get agent configuration
router.get('/agents/:agentId/config', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const config = await wazuhService.getAgentConfig(agentId);
    res.json(config);
  } catch (error) {
    console.error('Error getting agent config:', error);
    res.status(500).json({ message: 'Error getting agent config' });
  }
});

// Update agent configuration
router.put('/agents/:agentId/config', protect, async (req, res) => {
  try {
    const { agentId } = req.params;
    const config = await wazuhService.updateAgentConfig(agentId, req.body);
    res.json(config);
  } catch (error) {
    console.error('Error updating agent config:', error);
    res.status(500).json({ message: 'Error updating agent config' });
  }
});

module.exports = router; 