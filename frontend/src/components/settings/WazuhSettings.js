import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';
import api from '../../services/api';

const WazuhSettings = () => {
  const [settings, setSettings] = useState({ wazuhApiUrl: '', wazuhApiKey: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/settings/wazuh');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch Wazuh settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.post('/settings/wazuh', settings);
      setTestResult({ success: true, message: 'Settings saved successfully!' });
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to save settings.' });
      console.error("Failed to save Wazuh settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTestResult(null);
      setIsSaving(true);
      const response = await api.post('/settings/wazuh/test');
      setTestResult({ success: true, message: response.data.message });
    } catch (error) {
      setTestResult({ success: false, message: error.response?.data?.message || 'Connection failed.' });
      console.error("Failed to test Wazuh connection:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={4} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Wazuh API Configuration
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Wazuh API URL"
          name="wazuhApiUrl"
          value={settings.wazuhApiUrl}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="e.g., https://wazuh.example.com:55000"
        />
        <TextField
          label="Wazuh API Key"
          name="wazuhApiKey"
          type="password"
          value={settings.wazuhApiKey}
          onChange={handleChange}
          fullWidth
          margin="normal"
          placeholder="Enter your Wazuh API Key"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
          <Button variant="outlined" onClick={handleTest} disabled={isSaving}>
            Test Connection
          </Button>
        </Box>
        {testResult && (
          <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mt: 2 }}>
            {testResult.message}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default WazuhSettings; 