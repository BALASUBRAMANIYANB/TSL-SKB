import React, { useEffect, useState } from 'react';
import { getRoles } from '../../services/wazuhApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from '@mui/material';

// TODO: Implement role list using wazuhApi.getRoles
const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      setError('Failed to fetch roles');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h2>Wazuh Roles</h2>
      <Button variant="contained" onClick={fetchRoles} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles && roles.length > 0 ? roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name || '-'}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No roles found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RoleList; 