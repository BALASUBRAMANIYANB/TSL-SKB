import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, CircularProgress, Box } from '@mui/material';
import { CalendarMonth as CalendarMonthIcon, Update as UpdateIcon } from '@mui/icons-material';

const ScheduledScans = ({ templates, isLoading }) => {
  const scheduledTemplates = templates?.filter(t => t.isScheduled) || [];

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
        <CalendarMonthIcon sx={{ color: 'primary.main', mr: 1.5 }} />
        <Typography variant="h5" component="h2" fontWeight="bold">
          Upcoming Scans
        </Typography>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List>
          {scheduledTemplates.length > 0 ? (
            scheduledTemplates.slice(0, 5).map(template => (
              <ListItem key={template._id} disablePadding>
                <ListItemIcon>
                  <UpdateIcon />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondary={`Schedule: ${template.schedule}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No scans scheduled.</Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

export default ScheduledScans; 