import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFIMEvents } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';

// TODO: Implement FIM events view using wazuhApi.getFIMEvents
const FIMEvents = () => {
  const { agentId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFIMEvents(agentId);
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch FIM events');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [agentId]);

  return (
    <div>
      <h2>File Integrity Monitoring (FIM) Events</h2>
      <Button variant="contained" onClick={fetchEvents} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events && events.length > 0 ? events.map((event, idx) => (
                <TableRow key={idx}>
                  <TableCell>{event.timestamp ? new Date(event.timestamp * 1000).toLocaleString() : '-'}</TableCell>
                  <TableCell>{event.file || '-'}</TableCell>
                  <TableCell>{event.action || '-'}</TableCell>
                  <TableCell>{event.user || '-'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No FIM events found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default FIMEvents; 