import React, { useEffect, useState } from 'react';
import { getMitreInfo } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';

// TODO: Implement MITRE ATT&CK overview using wazuhApi.getMitreInfo
const MitreOverview = () => {
  const [mitre, setMitre] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMitre = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMitreInfo();
      setMitre(res.data);
    } catch (err) {
      setError('Failed to fetch MITRE ATT&CK data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMitre();
  }, []);

  return (
    <div>
      <h2>MITRE ATT&CK Overview</h2>
      <Button variant="contained" onClick={fetchMitre} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Technique ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mitre && mitre.length > 0 ? mitre.map((tech, idx) => (
                <TableRow key={idx}>
                  <TableCell>{tech.id || '-'}</TableCell>
                  <TableCell>{tech.name || '-'}</TableCell>
                  <TableCell>{tech.description || '-'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No MITRE ATT&CK data found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MitreOverview; 