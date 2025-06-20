const express = require('express');
const router = express.Router();
const Target = require('../../models/target');
const Scan = require('../../models/scan');
const Vulnerability = require('../../models/vulnerability');
const { authenticateToken, authorize } = require('../middleware/auth');

// GET /api/topology
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all targets
    const targets = await Target.find();
    // Fetch all scans
    const scans = await Scan.find().populate('target');
    // Fetch all vulnerabilities
    const vulns = await Vulnerability.find();

    // Build nodes
    const nodes = targets.map(target => {
      // Find all scans for this target
      const targetScans = scans.filter(s => s.target._id.equals(target._id));
      // Find all vulns for this target
      const targetVulns = vulns.filter(v => v.target.equals(target._id));
      // Collect open ports from scans (if any)
      const openPorts = Array.from(new Set(targetScans.flatMap(s => s.openPorts || [])));
      // Calculate risk (simple: count of high/critical vulns)
      const risk = targetVulns.reduce((acc, v) => acc + (['high', 'critical'].includes(v.severity) ? 1 : 0), 0);
      return {
        id: target._id,
        label: target.name || target.url || target.ip,
        ip: target.ip,
        type: target.type,
        openPorts,
        vulnerabilities: targetVulns.map(v => ({ id: v._id, name: v.name, severity: v.severity })),
        risk,
      };
    });

    // Build edges (simple: same subnet or parent/child if available)
    const edges = [];
    for (let i = 0; i < targets.length; i++) {
      for (let j = i + 1; j < targets.length; j++) {
        // Example: same /24 subnet
        if (targets[i].ip && targets[j].ip && targets[i].ip.split('.').slice(0, 3).join('.') === targets[j].ip.split('.').slice(0, 3).join('.')) {
          edges.push({ from: targets[i]._id, to: targets[j]._id, label: 'subnet' });
        }
        // Example: parent/child (if you have such a field)
        // if (targets[i].parent && targets[i].parent.equals(targets[j]._id)) {
        //   edges.push({ from: targets[j]._id, to: targets[i]._id, label: 'parent' });
        // }
      }
    }

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error building topology:', error);
    res.status(500).json({ message: 'Error building topology' });
  }
});

module.exports = router; 