import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSyscollectorInfo } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';

const SyscollectorInfo = () => {
  const { agentId } = useParams();
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSyscollectorInfo(agentId);
      setInfo(res.data);
    } catch (err) {
      setError('Failed to fetch syscollector info');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line
  }, [agentId]);

  return (
    <div>
      <h2>Syscollector Info</h2>
      <Button variant="contained" onClick={fetchInfo} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CPU</TableCell>
                <TableCell>RAM</TableCell>
                <TableCell>OS</TableCell>
                <TableCell>Architecture</TableCell>
                <TableCell>Hostname</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {info && info.length > 0 ? info.map((hw, idx) => (
                <TableRow key={idx}>
                  <TableCell>{hw.cpu || '-'}</TableCell>
                  <TableCell>{hw.ram || '-'}</TableCell>
                  <TableCell>{hw.os || '-'}</TableCell>
                  <TableCell>{hw.architecture || '-'}</TableCell>
                  <TableCell>{hw.hostname || '-'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No syscollector info found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default SyscollectorInfo; 