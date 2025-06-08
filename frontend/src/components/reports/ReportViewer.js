import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const ReportViewer = ({ report, open, onClose }) => {
  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{report.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Summary</Typography>
          <Typography paragraph>{report.summary}</Typography>
          
          <Typography variant="h6">Findings</Typography>
          {report.findings?.map((finding, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{finding.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Severity: {finding.severity}
              </Typography>
              <Typography paragraph>{finding.description}</Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportViewer; 