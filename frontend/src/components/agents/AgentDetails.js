import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAgent } from '../../services/wazuhApi';
import { Card, CardContent, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAgent(id);
        setAgent(res.data);
      } catch (err) {
        setError('Failed to fetch agent details');
      }
      setLoading(false);
    };
    fetchAgent();
  }, [id]);

  return (
    <div>
      <Button component={Link} to="/agents" variant="outlined" sx={{ mb: 2 }}>Back to Agents</Button>
      <h2>Agent Details</h2>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && agent && (
        <Card>
          <CardContent>
            <Typography variant="h6">ID: {agent.id}</Typography>
            <Typography>Name: {agent.name || '-'}</Typography>
            <Typography>Status: {agent.status || '-'}</Typography>
            <Typography>IP: {agent.ip || '-'}</Typography>
            <Typography>Version: {agent.version || '-'}</Typography>
            {/* Add more agent fields as needed */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentDetails; 