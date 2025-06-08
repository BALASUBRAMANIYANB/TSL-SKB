import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Security as SecurityIcon,
  BugReport as BugIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const TestResultsView = ({ results }) => {
  const {
    combinedResults,
    wazuhResults,
    scanResults,
    testId,
    startTime,
    endTime,
    duration
  } = results;

  const {
    vulnerabilities,
    securityScore,
    recommendations,
    riskAssessment
  } = combinedResults;

  const getSeverityCount = (severity) => {
    return vulnerabilities.filter(v => v.severity === severity).length;
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderSecurityScore = () => (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h4" color="primary">
        {securityScore}%
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Security Score
      </Typography>
      <LinearProgress
        variant="determinate"
        value={securityScore}
        color={securityScore >= 80 ? 'success' : securityScore >= 60 ? 'warning' : 'error'}
        sx={{ mt: 1, height: 8, borderRadius: 4 }}
      />
    </Paper>
  );

  const renderVulnerabilitySummary = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Vulnerability Summary
      </Typography>
      <Grid container spacing={2}>
        {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
          <Grid item xs={3} key={severity}>
            <Box textAlign="center">
              <Typography variant="h4" color={`${getSeverityColor(severity)}.main`}>
                {getSeverityCount(severity)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {severity}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderWazuhStatus = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Wazuh Status
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            {wazuhResults.agentStatus === 'active' ? (
              <CheckCircleIcon color="success" />
            ) : (
              <ErrorIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Agent Status"
            secondary={wazuhResults.agentStatus}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SecurityIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Security Events"
            secondary={`${wazuhResults.securityEvents.length} events detected`}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BugIcon color="warning" />
          </ListItemIcon>
          <ListItemText
            primary="Wazuh Vulnerabilities"
            secondary={`${wazuhResults.vulnerabilities.length} vulnerabilities found`}
          />
        </ListItem>
      </List>
    </Paper>
  );

  const renderTestInfo = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Information
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Test ID"
            secondary={testId}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Start Time"
            secondary={new Date(startTime).toLocaleString()}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="End Time"
            secondary={new Date(endTime).toLocaleString()}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Duration"
            secondary={`${duration} seconds`}
          />
        </ListItem>
      </List>
    </Paper>
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {renderSecurityScore()}
        </Grid>
        <Grid item xs={12} md={8}>
          {renderVulnerabilitySummary()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderWazuhStatus()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderTestInfo()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestResultsView; 