import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Select, MenuItem, Switch, IconButton, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

const eventOptions = [
  { value: 'scan_completed', label: 'Scan Completed' },
  { value: 'vulnerability_found', label: 'Vulnerability Found' },
];

const WebhooksSettings = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ url: '', event: 'scan_completed', enabled: true });
  const [testResult, setTestResult] = useState(null);

  useEffect(() => { fetchWebhooks(); }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/webhooks');
      setWebhooks(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load webhooks.', severity: 'error' });
    }
    setLoading(false);
  };

  const handleOpenDialog = (webhook = null) => {
    setEditing(webhook);
    setForm(webhook ? { url: webhook.url, event: webhook.event, enabled: webhook.enabled } : { url: '', event: 'scan_completed', enabled: true });
    setDialogOpen(true);
    setTestResult(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm({ url: '', event: 'scan_completed', enabled: true });
    setTestResult(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`/api/webhooks/${editing._id}`, form);
        setSnackbar({ open: true, message: 'Webhook updated.', severity: 'success' });
      } else {
        await axios.post('/api/webhooks', form);
        setSnackbar({ open: true, message: 'Webhook created.', severity: 'success' });
      }
      fetchWebhooks();
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save webhook.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this webhook?')) return;
    try {
      await axios.delete(`/api/webhooks/${id}`);
      setSnackbar({ open: true, message: 'Webhook deleted.', severity: 'success' });
      fetchWebhooks();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete webhook.', severity: 'error' });
    }
  };

  const handleTest = async () => {
    setTestResult(null);
    try {
      const res = await axios.post('/api/webhooks/test', { url: form.url, event: form.event });
      setTestResult({ success: res.data.success, message: res.data.message });
    } catch (err) {
      setTestResult({ success: false, message: 'Webhook test failed.' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Webhooks</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>Add Webhook</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webhooks.map((wh) => (
              <TableRow key={wh._id}>
                <TableCell>{wh.url}</TableCell>
                <TableCell>{eventOptions.find(e => e.value === wh.event)?.label || wh.event}</TableCell>
                <TableCell><Switch checked={wh.enabled} disabled /></TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(wh)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(wh._id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {webhooks.length === 0 && !loading && (
              <TableRow><TableCell colSpan={4} align="center">No webhooks configured.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Edit Webhook' : 'Add Webhook'}</DialogTitle>
        <DialogContent>
          <TextField label="Webhook URL" name="url" value={form.url} onChange={handleFormChange} fullWidth margin="normal" />
          <Select label="Event" name="event" value={form.event} onChange={handleFormChange} fullWidth margin="normal">
            {eventOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </Select>
          <Box sx={{ mt: 2 }}>
            <Switch checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} name="enabled" /> Enabled
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={handleTest} startIcon={<CheckIcon />}>Test</Button>
            {testResult && (
              <Alert severity={testResult.success ? 'success' : 'error'} sx={{ ml: 2 }}>{testResult.message}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WebhooksSettings; 