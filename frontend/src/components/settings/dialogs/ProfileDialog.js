import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
} from '@mui/material';

const ProfileDialog = ({ open, onClose, onSave, profile = null }) => {
  const [formData, setFormData] = useState(profile || {
    name: '',
    description: '',
    settings: {
      scanType: 'standard',
      timeout: 30,
      threads: 2,
      depth: 1,
      advanced: {
        followRedirects: true,
        verifySSL: true,
        rateLimit: 100,
      },
    },
    isDefault: false,
  });

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {profile ? 'Edit Scan Profile' : 'Add Scan Profile'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Profile Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Scan Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Scan Type</InputLabel>
              <Select
                value={formData.settings.scanType}
                label="Scan Type"
                onChange={(e) => handleChange('settings.scanType', e.target.value)}
              >
                <MenuItem value="quick">Quick</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="thorough">Thorough</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Timeout (seconds)"
              type="number"
              value={formData.settings.timeout}
              onChange={(e) => handleChange('settings.timeout', parseInt(e.target.value))}
              inputProps={{ min: 10, max: 600 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Threads"
              type="number"
              value={formData.settings.threads}
              onChange={(e) => handleChange('settings.threads', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 16 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Scan Depth"
              type="number"
              value={formData.settings.depth}
              onChange={(e) => handleChange('settings.depth', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Advanced Settings
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.settings.advanced.followRedirects}
                  onChange={(e) => handleChange('settings.advanced.followRedirects', e.target.checked)}
                />
              }
              label="Follow Redirects"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.settings.advanced.verifySSL}
                  onChange={(e) => handleChange('settings.advanced.verifySSL', e.target.checked)}
                />
              }
              label="Verify SSL"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rate Limit (requests/second)"
              type="number"
              value={formData.settings.advanced.rateLimit}
              onChange={(e) => handleChange('settings.advanced.rateLimit', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 1000 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e) => handleChange('isDefault', e.target.checked)}
                />
              }
              label="Set as Default Profile"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog; 