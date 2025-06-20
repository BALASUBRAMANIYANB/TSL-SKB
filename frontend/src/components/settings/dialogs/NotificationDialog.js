import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Chip,
  Autocomplete,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const NotificationDialog = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    email: {
      enabled: false,
      recipients: [],
      events: []
    },
    webhook: {
      enabled: false,
      url: '',
      events: []
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const availableEvents = [
    { value: 'scan_started', label: 'Scan Started' },
    { value: 'scan_completed', label: 'Scan Completed' },
    { value: 'scan_error', label: 'Scan Error' },
    { value: 'vulnerability_found', label: 'Vulnerability Found' },
    { value: 'scan_scheduled', label: 'Scan Scheduled' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Notification Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Email Notifications */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Email Notifications</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.email.enabled}
                    onChange={(e) => handleChange('email', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Email Notifications"
              />
            </Box>
            {formData.email.enabled && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.email.recipients}
                    onChange={(_, newValue) => handleChange('email', 'recipients', newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Email Recipients"
                        placeholder="Add email addresses"
                        helperText="Enter email addresses and press Enter"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={availableEvents}
                    getOptionLabel={(option) => option.label}
                    value={availableEvents.filter(event => formData.email.events.includes(event.value))}
                    onChange={(_, newValue) => handleChange('email', 'events', newValue.map(v => v.value))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Notification Events"
                        placeholder="Select events"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Webhook Notifications */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Webhook Notifications</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.webhook.enabled}
                    onChange={(e) => handleChange('webhook', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Webhook Notifications"
              />
            </Box>
            {formData.webhook.enabled && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Webhook URL"
                    value={formData.webhook.url}
                    onChange={(e) => handleChange('webhook', 'url', e.target.value)}
                    placeholder="https://your-webhook-url.com/endpoint"
                    helperText="Enter the URL where notifications should be sent"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={availableEvents}
                    getOptionLabel={(option) => option.label}
                    value={availableEvents.filter(event => formData.webhook.events.includes(event.value))}
                    onChange={(_, newValue) => handleChange('webhook', 'events', newValue.map(v => v.value))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Notification Events"
                        placeholder="Select events"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog; 