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
  Tabs,
  Tab,
} from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';

const ScriptDialog = ({ open, onClose, onSave, script = null }) => {
  const [formData, setFormData] = useState(script || {
    name: '',
    description: '',
    type: 'inline',
    content: '',
    filePath: '',
    language: 'python',
    enabled: true,
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('content', e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {script ? 'Edit Custom Script' : 'Add Custom Script'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Script Name"
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

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Script Type</InputLabel>
              <Select
                value={formData.type}
                label="Script Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="inline">Inline Script</MenuItem>
                <MenuItem value="file">File Upload</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={formData.language}
                label="Language"
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="bash">Bash</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.type === 'inline' ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Script Content"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                multiline
                rows={10}
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                  },
                }}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed grey', p: 2, textAlign: 'center' }}>
                <input
                  type="file"
                  accept=".py,.js,.sh"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="script-file-upload"
                />
                <label htmlFor="script-file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CodeIcon />}
                  >
                    Upload Script File
                  </Button>
                </label>
                {formData.filePath && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {formData.filePath}
                  </Typography>
                )}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                />
              }
              label="Enable Script"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Script
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScriptDialog; 