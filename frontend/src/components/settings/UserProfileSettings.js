import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, TextField, Button, Switch, FormControlLabel, Divider, Avatar, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { updateUserSettings, changePassword, deleteAccount } from '../../store/slices/authSlice';

const UserProfileSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // State for user settings
  const [settings, setSettings] = useState({
    email: user?.email || '',
    name: user?.name || '',
    notifications: {
      email: true,
      scanComplete: true,
      criticalFindings: true,
    },
  });

  // State for password change
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Handlers for state changes...
  const handleChange = (section, field, value) => {
    if (section) {
      setSettings(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordChange(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(updateUserSettings(settings));
  };
  
  const handlePasswordSubmit = (e) => {
      e.preventDefault();
      if (passwordChange.newPassword !== passwordChange.confirmPassword) return;
      dispatch(changePassword({ currentPassword: passwordChange.currentPassword, newPassword: passwordChange.newPassword }));
  };
  
  const handleDeleteAccount = () => {
      if (deleteConfirm !== 'DELETE') return;
      dispatch(deleteAccount());
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main', fontSize: '2rem' }}>
            {settings.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom>Profile Settings</Typography>
            <Typography variant="body2" color="text.secondary">Update your profile information.</Typography>
          </Box>
        </Box>
        
        {/* ... (rest of the form fields: name, email, etc.) ... */}

        <Divider sx={{ my: 3 }} />
        
        {/* ... (password change section) ... */}

        <Divider sx={{ my: 3 }} />

        {/* ... (notification settings section) ... */}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialog(true)}>
            Delete Account
          </Button>
          <Button type="submit" variant="contained" color="primary" size="large">
            Save Changes
          </Button>
        </Box>
      </form>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. To confirm, type "DELETE" below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Confirmation"
            type="text"
            fullWidth
            variant="standard"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfileSettings; 