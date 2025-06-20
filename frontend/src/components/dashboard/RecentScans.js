import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, CircularProgress, Box } from '@mui/material';
import { Plagiarism as PlagiarismIcon } from '@mui/icons-material';
import ScanProgress from '../scans/ScanProgress';

const RecentScans = ({ scans, isLoading }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PlagiarismIcon sx={{ color: 'primary.main', mr: 1.5 }} />
        <Typography variant="h5" component="h2" fontWeight="bold">
          Recent Scans
        </Typography>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List>
          {scans && scans.slice(0, 5).map(scan => (
            <ListItem key={scan._id} disablePadding sx={{ mb: 2 }}>
              <ListItemText
                primary={scan.name}
                secondary={`Target: ${scan.target?.name || 'N/A'}`}
              />
              <ListItemIcon sx={{ minWidth: 150, justifyContent: 'flex-end' }}>
                <ScanProgress scan={scan} />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecentScans; 