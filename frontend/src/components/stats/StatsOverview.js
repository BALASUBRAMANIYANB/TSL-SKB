import React, { useEffect, useState } from 'react';
import { getStats } from '../../services/wazuhApi';
import { Card, CardContent, Typography, CircularProgress, Alert, Grid, Button } from '@mui/material';

// TODO: Implement stats overview using wazuhApi.getStats
const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Wazuh Stats Overview</h2>
      <Button variant="contained" onClick={fetchStats} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && stats && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Agents</Typography>
                <Typography>{stats.total_agents || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Events Processed</Typography>
                <Typography>{stats.events_processed || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Alerts Generated</Typography>
                <Typography>{stats.alerts_generated || '-'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Add more stats cards as needed */}
        </Grid>
      )}
    </div>
  );
};

export default StatsOverview; 