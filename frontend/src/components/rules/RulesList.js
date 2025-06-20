import React, { useEffect, useState } from 'react';
import { getRules } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const RulesList = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRules();
      setRules(res.data);
    } catch (err) {
      setError('Failed to fetch rules');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div>
      <h2>Wazuh Rules</h2>
      <Button variant="contained" onClick={fetchRules} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules && rules.length > 0 ? rules.map(rule => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.id}</TableCell>
                  <TableCell>{rule.level || '-'}</TableCell>
                  <TableCell>{rule.description || '-'}</TableCell>
                  <TableCell>
                    <Button component={Link} to={`/rules/${rule.id}`} variant="outlined" size="small">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No rules found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RulesList; 