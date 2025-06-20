import React, { useEffect, useState } from 'react';
import { getManagerInfo, getManagerStats, getClusterInfo } from '../../services/wazuhApi';
import { Card, CardContent, Typography, CircularProgress, Alert, Grid, Button } from '@mui/material';

// TODO: Implement manager and cluster status using wazuhApi.getManagerInfo, getManagerStats, getClusterInfo
const ManagerStatus = () => {
  const [managerInfo, setManagerInfo] = useState(null);
  const [managerStats, setManagerStats] = useState(null);
  const [clusterInfo, setClusterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [infoRes, statsRes, clusterRes] = await Promise.all([
        getManagerInfo(),
        getManagerStats(),
        getClusterInfo(),
      ]);
      setManagerInfo(infoRes.data);
      setManagerStats(statsRes.data);
      setClusterInfo(clusterRes.data);
    } catch (err) {
      setError('Failed to fetch manager or cluster info');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Wazuh Manager & Cluster Status</h2>
      <Button variant="contained" onClick={fetchData} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Manager Info</Typography>
                <Typography>ID: {managerInfo?.id || '-'}</Typography>
                <Typography>Version: {managerInfo?.version || '-'}</Typography>
                <Typography>Node Name: {managerInfo?.node_name || '-'}</Typography>
                {/* Add more manager info fields as needed */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Manager Stats</Typography>
                <Typography>Events Processed: {managerStats?.events_processed || '-'}</Typography>
                <Typography>Alerts Generated: {managerStats?.alerts_generated || '-'}</Typography>
                {/* Add more stats fields as needed */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Cluster Info</Typography>
                <Typography>Status: {clusterInfo?.status || '-'}</Typography>
                <Typography>Nodes: {Array.isArray(clusterInfo?.nodes) ? clusterInfo.nodes.length : '-'}</Typography>
                {/* Add more cluster info fields as needed */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default ManagerStatus; 