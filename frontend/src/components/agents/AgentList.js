import React, { useEffect, useState } from 'react';
import { listAgents } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAgents();
      setAgents(res.data);
    } catch (err) {
      setError('Failed to fetch agents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      <h2>Wazuh Agents</h2>
      <Button variant="contained" onClick={fetchAgents} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents && agents.length > 0 ? agents.map(agent => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.id}</TableCell>
                  <TableCell>{agent.name || '-'}</TableCell>
                  <TableCell>{agent.status || '-'}</TableCell>
                  <TableCell>
                    <Button component={Link} to={`/agents/${agent.id}`} variant="outlined" size="small">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No agents found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AgentList; 