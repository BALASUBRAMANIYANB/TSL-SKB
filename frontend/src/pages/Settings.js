import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tabs,
  Tab,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { updateUserSettings, changePassword, deleteAccount } from '../store/slices/authSlice';
import UserProfileSettings from '../components/settings/UserProfileSettings';
import ScannerSettings from '../components/settings/ScannerSettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({
    email: user?.email || '',
    name: user?.name || '',
    role: user?.role || 'User',
    lastLogin: user?.lastLogin || new Date().toISOString(),
    notifications: {
      email: true,
      scanComplete: true,
      criticalFindings: true,
    },
    scanner: {
      defaultTimeout: 3600,
      concurrentScans: 2,
      autoRetry: true,
      maxRetries: 3,
    },
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordChange({
      ...passwordChange,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserSettings(settings));
      setSnackbar({
        open: true,
        message: 'Settings updated successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update settings',
        severity: 'error',
      });
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error',
      });
      return;
    }

    const passwordErrors = validatePassword(passwordChange.newPassword);
    if (passwordErrors.length > 0) {
      setSnackbar({
        open: true,
        message: passwordErrors.join('\n'),
        severity: 'error',
      });
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: passwordChange.currentPassword,
        newPassword: passwordChange.newPassword,
      })).unwrap();

      setSnackbar({
        open: true,
        message: 'Password updated successfully',
        severity: 'success',
      });
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update password',
        severity: 'error',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setSnackbar({
        open: true,
        message: 'Please type DELETE to confirm',
        severity: 'error',
      });
      return;
    }

    try {
      await dispatch(deleteAccount()).unwrap();
      // Redirect will be handled by the auth slice
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete account',
        severity: 'error',
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="User Profile" id="settings-tab-0" />
            <Tab label="Scanner" id="settings-tab-1" />
          </Tabs>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <UserProfileSettings />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ScannerSettings />
        </TabPanel>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete your account and all associated data.
            Please type DELETE to confirm.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Type DELETE to confirm"
            fullWidth
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 