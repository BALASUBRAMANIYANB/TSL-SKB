import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VulnerabilityDetails from './VulnerabilityDetails';

const ReportViewer = ({ report, open, onClose }) => {
  if (!report) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const renderSummary = () => {
    if (!report.content?.summary) return <Typography>No summary available.</Typography>;
    const { summary } = report.content;
    
    return (
      <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Scan Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">Total</Typography>
            <Typography variant="h4">{summary.totalVulnerabilities || 0}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">Critical</Typography>
            <Typography variant="h4" color="error">{summary.criticalCount || 0}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">High</Typography>
            <Typography variant="h4" color="warning.main">{summary.highCount || 0}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">Medium</Typography>
            <Typography variant="h4" color="info.main">{summary.mediumCount || 0}</Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderVulnerabilities = () => {
    const vulnerabilities = report.content?.vulnerabilities;
    if (!vulnerabilities?.length) {
      return <Typography>No vulnerabilities found in this report.</Typography>;
    }
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>Vulnerabilities</Typography>
        {vulnerabilities.map((vuln) => (
          <Accordion key={vuln._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="subtitle1">{vuln.name}</Typography>
                </Grid>
                <Grid item xs={6} sm={2}>
                  <Chip 
                    label={vuln.severity} 
                    color={getSeverityColor(vuln.severity)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                   <Chip 
                    label={vuln.status.replace('_', ' ')}
                    color={getStatusColor(vuln.status)}
                    size="small"
                  />
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <VulnerabilityDetails vulnerability={vuln} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const renderRecommendations = () => {
    if (!report.content?.recommendations?.length) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Recommendations</Typography>
        {report.content.recommendations.map((rec, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{rec.description}</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {rec.steps.map((step, stepIndex) => (
                <Typography component="li" key={stepIndex} variant="body2">
                  {step}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Report: {report.name}
        <Typography variant="body2" color="text.secondary">
          Generated on {new Date(report.createdAt).toLocaleDateString()}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {renderSummary()}
        {renderVulnerabilities()}
        {renderRecommendations()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportViewer; 