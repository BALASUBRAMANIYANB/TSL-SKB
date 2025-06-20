import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Download as DownloadIcon 
} from '@mui/icons-material';

const ReportList = ({ reports = [], onDelete, onViewReport, onDownload }) => {
  if (!reports || reports.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">No reports available</Typography>
      </Box>
    );
  }

  return (
    <List>
      {reports.map((report) => (
        <ListItem key={report._id}>
          <ListItemText
            primary={report.name || 'Unnamed Report'}
            secondary={
              <>
                <Typography component="span" variant="body2" color="text.primary">
                  {report.type} Report
                </Typography>
                {` — Created: ${new Date(report.createdAt).toLocaleDateString()}`}
              </>
            }
          />
          <ListItemSecondaryAction>
            <IconButton 
              edge="end" 
              onClick={() => onViewReport(report)}
              sx={{ mr: 1 }}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton 
              edge="end" 
              onClick={() => onDownload(report)}
              sx={{ mr: 1 }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton 
              edge="end" 
              onClick={() => onDelete(report._id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ReportList; 