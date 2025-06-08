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
} from '@mui/material';
import { updateUserSettings } from '../store/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({
    email: user?.email || '',
    name: user?.name || '',
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              {/* Profile Settings */}
              <Typography variant="h6" gutterBottom>
                Profile Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={settings.name}
                    onChange={(e) => handleChange(null, 'name', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange(null, 'email', e.target.value)}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Notification Settings */}
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) =>
                          handleChange('notifications', 'email', e.target.checked)
                        }
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.scanComplete}
                        onChange={(e) =>
                          handleChange('notifications', 'scanComplete', e.target.checked)
                        }
                      />
                    }
                    label="Scan Completion"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.criticalFindings}
                        onChange={(e) =>
                          handleChange('notifications', 'criticalFindings', e.target.checked)
                        }
                      />
                    }
                    label="Critical Findings"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Scanner Settings */}
              <Typography variant="h6" gutterBottom>
                Scanner Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Timeout (seconds)"
                    type="number"
                    value={settings.scanner.defaultTimeout}
                    onChange={(e) =>
                      handleChange('scanner', 'defaultTimeout', parseInt(e.target.value))
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Concurrent Scans"
                    type="number"
                    value={settings.scanner.concurrentScans}
                    onChange={(e) =>
                      handleChange('scanner', 'concurrentScans', parseInt(e.target.value))
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.scanner.autoRetry}
                        onChange={(e) =>
                          handleChange('scanner', 'autoRetry', e.target.checked)
                        }
                      />
                    }
                    label="Auto Retry Failed Scans"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Retries"
                    type="number"
                    value={settings.scanner.maxRetries}
                    onChange={(e) =>
                      handleChange('scanner', 'maxRetries', parseInt(e.target.value))
                    }
                    margin="normal"
                    disabled={!settings.scanner.autoRetry}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary">
                  Save Settings
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>

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