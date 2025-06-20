import React from 'react';
import { Paper, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { Shield as ShieldIcon, CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

const StatBox = ({ title, value, icon }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }}
  >
    {icon}
    <Box ml={2}>
      <Typography variant="h6" color="text.primary">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const WazuhOverview = ({ wazuhData, isLoading }) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  const { total_agents = 0, active_agents = 0, disconnected_agents = 0 } = wazuhData || {};

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ShieldIcon sx={{ color: 'primary.main', mr: 1.5 }} />
        <Typography variant="h5" component="h2" fontWeight="bold">
          Wazuh Status
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatBox title="Total Agents" value={total_agents} icon={<ShieldIcon color="primary" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox title="Active Agents" value={active_agents} icon={<CheckCircleOutlineIcon color="success" sx={{ fontSize: 40 }} />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox title="Disconnected" value={disconnected_agents} icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WazuhOverview; 