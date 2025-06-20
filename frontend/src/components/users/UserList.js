import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Box,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, userId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { user: currentUser } = useSelector((state) => state.auth);


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users. You might not have permission to view this page.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
      setSnackbar({ open: true, message: 'User role updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update user role.', severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmDelete({ open: false, userId: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
      setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const openDeleteDialog = (userId) => {
    setConfirmDelete({ open: true, userId });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Button variant="contained" onClick={fetchUsers} sx={{ mb: 2 }}>Refresh</Button>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={user._id === currentUser.id}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => openDeleteDialog(user._id)} 
                      disabled={user._id === currentUser.id}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, userId: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, userId: null })}>Cancel</Button>
          <Button onClick={() => handleDeleteUser(confirmDelete.userId)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList; 