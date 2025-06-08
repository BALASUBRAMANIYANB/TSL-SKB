import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  Security as SecurityIcon,
  BugReport as BugIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';

const WazuhStatus = ({ wazuhResults }) => {
  const {
    agentStatus,
    agentInfo,
    vulnerabilities,
    securityEvents,
    compliance
  } = wazuhResults;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'disconnected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderAgentStatus = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Agent Status
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <ComputerIcon />
          </ListItemIcon>
          <ListItemText
            primary="Agent ID"
            secondary={agentInfo?.id || 'N/A'}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {agentStatus === 'active' ? (
              <CheckCircleIcon color="success" />
            ) : (
              <ErrorIcon color="error" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Status"
            secondary={
              <Chip
                label={agentStatus}
                size="small"
                color={getStatusColor(agentStatus)}
              />
            }
          />
        </ListItem>
        {agentInfo?.version && (
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Version"
              secondary={agentInfo.version}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );

  const renderVulnerabilities = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Wazuh Vulnerabilities
      </Typography>
      <List>
        {vulnerabilities.map((vuln, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <BugIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={vuln.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {vuln.description}
                    </Typography>
                    {vuln.cve && (
                      <Chip
                        label={vuln.cve}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < vulnerabilities.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const renderSecurityEvents = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Security Events
      </Typography>
      <List>
        {securityEvents.map((event, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={event.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {event.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(event.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < securityEvents.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const renderCompliance = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Compliance Status
      </Typography>
      <List>
        {compliance?.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                {item.status === 'passed' ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.requirement}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === 'passed' ? 'success' : 'error'}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                }
              />
            </ListItem>
            {index < compliance.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {renderAgentStatus()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderVulnerabilities()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSecurityEvents()}
        </Grid>
        <Grid item xs={12}>
          {renderCompliance()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default WazuhStatus; 