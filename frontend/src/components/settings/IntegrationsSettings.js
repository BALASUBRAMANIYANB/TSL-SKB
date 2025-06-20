import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, Snackbar, Alert, Grid } from '@mui/material';
import axios from 'axios';

const IntegrationsSettings = () => {
  // Jira state
  const [jira, setJira] = useState({ jiraUrl: '', jiraEmail: '', jiraApiToken: '', jiraProjectKey: '' });
  const [jiraLoading, setJiraLoading] = useState(false);
  const [jiraTestResult, setJiraTestResult] = useState(null);

  // Slack state
  const [slack, setSlack] = useState({ slackWebhookUrl: '' });
  const [slackLoading, setSlackLoading] = useState(false);
  const [slackTestResult, setSlackTestResult] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchJira();
    fetchSlack();
  }, []);

  const fetchJira = async () => {
    try {
      const res = await axios.get('/api/settings/jira');
      setJira(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load Jira settings.', severity: 'error' });
    }
  };

  const fetchSlack = async () => {
    try {
      const res = await axios.get('/api/settings/slack');
      setSlack(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load Slack settings.', severity: 'error' });
    }
  };

  const handleJiraChange = (e) => {
    setJira({ ...jira, [e.target.name]: e.target.value });
  };

  const handleSlackChange = (e) => {
    setSlack({ ...slack, [e.target.name]: e.target.value });
  };

  const saveJira = async () => {
    setJiraLoading(true);
    try {
      await axios.post('/api/settings/jira', jira);
      setSnackbar({ open: true, message: 'Jira settings saved.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save Jira settings.', severity: 'error' });
    }
    setJiraLoading(false);
  };

  const saveSlack = async () => {
    setSlackLoading(true);
    try {
      await axios.post('/api/settings/slack', slack);
      setSnackbar({ open: true, message: 'Slack settings saved.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save Slack settings.', severity: 'error' });
    }
    setSlackLoading(false);
  };

  const testJira = async () => {
    setJiraLoading(true);
    setJiraTestResult(null);
    try {
      const res = await axios.post('/api/settings/jira/test', jira);
      setJiraTestResult({ success: res.data.success, message: res.data.message });
    } catch (err) {
      setJiraTestResult({ success: false, message: 'Failed to connect to Jira.' });
    }
    setJiraLoading(false);
  };

  const testSlack = async () => {
    setSlackLoading(true);
    setSlackTestResult(null);
    try {
      const res = await axios.post('/api/settings/slack/test', slack);
      setSlackTestResult({ success: res.data.success, message: res.data.message });
    } catch (err) {
      setSlackTestResult({ success: false, message: 'Failed to send test message to Slack.' });
    }
    setSlackLoading(false);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Integrations</Typography>
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Typography variant="h6" gutterBottom>Jira Integration</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Jira URL" name="jiraUrl" value={jira.jiraUrl} onChange={handleJiraChange} fullWidth margin="normal" />
            <TextField label="Jira Email" name="jiraEmail" value={jira.jiraEmail} onChange={handleJiraChange} fullWidth margin="normal" />
            <TextField label="Jira API Token" name="jiraApiToken" value={jira.jiraApiToken} onChange={handleJiraChange} fullWidth margin="normal" type="password" />
            <TextField label="Jira Project Key" name="jiraProjectKey" value={jira.jiraProjectKey} onChange={handleJiraChange} fullWidth margin="normal" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={saveJira} disabled={jiraLoading}>Save</Button>
          <Button variant="outlined" onClick={testJira} disabled={jiraLoading}>Test Integration</Button>
          {jiraTestResult && (
            <Alert severity={jiraTestResult.success ? 'success' : 'error'} sx={{ ml: 2 }}>{jiraTestResult.message}</Alert>
          )}
        </Box>
      </Paper>
      <Divider sx={{ my: 4 }} />
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="h6" gutterBottom>Slack Integration</Typography>
        <TextField label="Slack Webhook URL" name="slackWebhookUrl" value={slack.slackWebhookUrl} onChange={handleSlackChange} fullWidth margin="normal" />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={saveSlack} disabled={slackLoading}>Save</Button>
          <Button variant="outlined" onClick={testSlack} disabled={slackLoading}>Test Integration</Button>
          {slackTestResult && (
            <Alert severity={slackTestResult.success ? 'success' : 'error'} sx={{ ml: 2 }}>{slackTestResult.message}</Alert>
          )}
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IntegrationsSettings; 