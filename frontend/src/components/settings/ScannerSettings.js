import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Paper,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import ProfileDialog from './dialogs/ProfileDialog';
import ScriptDialog from './dialogs/ScriptDialog';
import ScheduleDialog from './dialogs/ScheduleDialog';
import NotificationDialog from './dialogs/NotificationDialog';
import axios from 'axios';
import api from '../../services/api';
import WazuhSettings from './WazuhSettings';

const ScannerSettings = ({ settings, onSave }) => {
  const [scannerSettings, setScannerSettings] = useState({
    // Basic Settings
    timeout: settings?.timeout || 30,
    threads: settings?.threads || 2,
    depth: settings?.depth || 1,
    defaultScanType: settings?.defaultScanType || 'standard',
    // Advanced Settings
    advanced: {
      followRedirects: settings?.advanced?.followRedirects ?? true,
      verifySSL: settings?.advanced?.verifySSL ?? true,
      rateLimit: settings?.advanced?.rateLimit || 100,
      proxy: settings?.advanced?.proxy || {
        enabled: false,
        host: '',
        port: 8080,
        username: '',
        password: '',
      },
      authentication: settings?.advanced?.authentication || {
        enabled: false,
        type: 'basic',
        credentials: {},
      },
    },
    // Scan Profiles
    scanProfiles: settings?.scanProfiles || [],
    // Custom Scripts
    customScripts: settings?.customScripts || [],
    // Scheduling
    scheduling: settings?.scheduling || {
      enabled: false,
      schedules: [],
    },
  });

  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogData, setDialogData] = useState(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/scan-templates');
        setTemplates(response.data);
      } catch (error) {
        console.error("Failed to fetch scan templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleChange = (section, field, value) => {
    if (section) {
      setScannerSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setScannerSettings(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(scannerSettings);
  };

  const handleAddProfile = () => {
    setDialogType('profile');
    setDialogData(null);
    setOpenDialog(true);
  };

  const handleEditProfile = (profile) => {
    setDialogType('profile');
    setDialogData(profile);
    setOpenDialog(true);
  };

  const handleDeleteProfile = (index) => {
    const newProfiles = [...scannerSettings.scanProfiles];
    newProfiles.splice(index, 1);
    handleChange('scanProfiles', newProfiles);
  };

  const handleAddScript = () => {
    setDialogType('script');
    setDialogData(null);
    setOpenDialog(true);
  };

  const handleEditScript = (script) => {
    setDialogType('script');
    setDialogData(script);
    setOpenDialog(true);
  };

  const handleDeleteScript = (index) => {
    const newScripts = [...scannerSettings.customScripts];
    newScripts.splice(index, 1);
    handleChange('customScripts', newScripts);
  };

  const handleAddSchedule = () => {
    setDialogType('schedule');
    setDialogData(null);
    setOpenDialog(true);
  };

  const handleEditSchedule = (schedule) => {
    setDialogType('schedule');
    setDialogData(schedule);
    setOpenDialog(true);
  };

  const handleDeleteSchedule = (index) => {
    const newSchedules = [...scannerSettings.scheduling.schedules];
    newSchedules.splice(index, 1);
    handleChange('scheduling.schedules', newSchedules);
  };

  const handleDialogSave = (data) => {
    switch (dialogType) {
      case 'profile':
        if (dialogData) {
          // Edit existing profile
          const index = scannerSettings.scanProfiles.findIndex(p => p.name === dialogData.name);
          const newProfiles = [...scannerSettings.scanProfiles];
          newProfiles[index] = data;
          handleChange('scanProfiles', newProfiles);
        } else {
          // Add new profile
          handleChange('scanProfiles', [...scannerSettings.scanProfiles, data]);
        }
        break;
      case 'script':
        if (dialogData) {
          // Edit existing script
          const index = scannerSettings.customScripts.findIndex(s => s.name === dialogData.name);
          const newScripts = [...scannerSettings.customScripts];
          newScripts[index] = data;
          handleChange('customScripts', newScripts);
        } else {
          // Add new script
          handleChange('customScripts', [...scannerSettings.customScripts, data]);
        }
        break;
      case 'schedule':
        if (dialogData) {
          // Edit existing schedule
          const index = scannerSettings.scheduling.schedules.findIndex(s => s.name === dialogData.name);
          const newSchedules = [...scannerSettings.scheduling.schedules];
          newSchedules[index] = data;
          handleChange('scheduling.schedules', newSchedules);
        } else {
          // Add new schedule
          handleChange('scheduling.schedules', [...scannerSettings.scheduling.schedules, data]);
        }
        break;
      default:
        break;
    }
  };

  const handleNotificationSave = async (notificationData) => {
    try {
      const response = await axios.put('/api/settings/notifications', notificationData);
      setScannerSettings(prev => ({
        ...prev,
        notifications: response.data
      }));
    } catch (error) {
      console.error('Error saving notification settings:', error);
      // Handle error (show error message to user)
    }
  };

  const handleOpenScheduleDialog = (template) => {
    setSelectedTemplate(template);
    setScheduleDialogOpen(true);
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <Box>
      <WazuhSettings />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Scanner Settings
        </Typography>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Basic" />
          <Tab label="Advanced" />
          <Tab label="Profiles" />
          <Tab label="Scripts" />
          <Tab label="Scheduling" />
          <Tab label="Notifications" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Basic Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Timeout (seconds)</Typography>
                <Slider
                  value={scannerSettings.timeout}
                  onChange={(e, value) => handleChange(null, 'timeout', value)}
                  min={10}
                  max={600}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Threads</Typography>
                <Slider
                  value={scannerSettings.threads}
                  onChange={(e, value) => handleChange(null, 'threads', value)}
                  min={1}
                  max={16}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Default Scan Type</InputLabel>
                  <Select
                    value={scannerSettings.defaultScanType}
                    label="Default Scan Type"
                    onChange={(e) => handleChange(null, 'defaultScanType', e.target.value)}
                  >
                    <MenuItem value="quick">Quick</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="thorough">Thorough</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Advanced Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scannerSettings.advanced.followRedirects}
                      onChange={(e) => handleChange('advanced', 'followRedirects', e.target.checked)}
                    />
                  }
                  label="Follow Redirects"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={scannerSettings.advanced.verifySSL}
                      onChange={(e) => handleChange('advanced', 'verifySSL', e.target.checked)}
                    />
                  }
                  label="Verify SSL"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography gutterBottom>Rate Limit (requests/second)</Typography>
                <Slider
                  value={scannerSettings.advanced.rateLimit}
                  onChange={(e, value) => handleChange('advanced', 'rateLimit', value)}
                  min={1}
                  max={1000}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Proxy Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scannerSettings.advanced.proxy.enabled}
                          onChange={(e) => handleChange('advanced.proxy', 'enabled', e.target.checked)}
                        />
                      }
                      label="Enable Proxy"
                    />
                  </Grid>
                  {scannerSettings.advanced.proxy.enabled && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Proxy Host"
                          value={scannerSettings.advanced.proxy.host}
                          onChange={(e) => handleChange('advanced.proxy', 'host', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Proxy Port"
                          type="number"
                          value={scannerSettings.advanced.proxy.port}
                          onChange={(e) => handleChange('advanced.proxy', 'port', parseInt(e.target.value))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={scannerSettings.advanced.proxy.username}
                          onChange={(e) => handleChange('advanced.proxy', 'username', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Password"
                          type="password"
                          value={scannerSettings.advanced.proxy.password}
                          onChange={(e) => handleChange('advanced.proxy', 'password', e.target.value)}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Authentication Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scannerSettings.advanced.authentication.enabled}
                          onChange={(e) => handleChange('advanced.authentication', 'enabled', e.target.checked)}
                        />
                      }
                      label="Enable Authentication"
                    />
                  </Grid>
                  {scannerSettings.advanced.authentication.enabled && (
                    <>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Authentication Type</InputLabel>
                          <Select
                            value={scannerSettings.advanced.authentication.type}
                            label="Authentication Type"
                            onChange={(e) => handleChange('advanced.authentication', 'type', e.target.value)}
                          >
                            <MenuItem value="basic">Basic Auth</MenuItem>
                            <MenuItem value="form">Form-based</MenuItem>
                            <MenuItem value="token">Token-based</MenuItem>
                            <MenuItem value="oauth">OAuth</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Scan Profiles</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddProfile}
              >
                Add Profile
              </Button>
            </Box>
            <List>
              {scannerSettings.scanProfiles.map((profile, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={profile.name}
                    secondary={profile.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditProfile(profile)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteProfile(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Custom Scripts</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddScript}
              >
                Add Script
              </Button>
            </Box>
            <List>
              {scannerSettings.customScripts.map((script, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={script.name}
                    secondary={`${script.language} - ${script.type}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditScript(script)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteScript(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {activeTab === 4 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Scheduled Scans</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleAddSchedule}
              >
                Add Schedule
              </Button>
            </Box>
            <List>
              {scannerSettings.scheduling.schedules.map((schedule, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={schedule.name}
                    secondary={`${schedule.frequency} - ${schedule.time}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditSchedule(schedule)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSchedule(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {activeTab === 5 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setNotificationDialogOpen(true)}
                startIcon={<SettingsIcon />}
              >
                Configure Notifications
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Email Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={scannerSettings.notifications?.email?.enabled || false}
                    disabled
                  />
                }
                label="Email Notifications"
              />
              {scannerSettings.notifications?.email?.enabled && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Recipients: {scannerSettings.notifications.email.recipients.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Events: {scannerSettings.notifications.email.events.join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Webhook Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={scannerSettings.notifications?.webhook?.enabled || false}
                    disabled
                  />
                }
                label="Webhook Notifications"
              />
              {scannerSettings.notifications?.webhook?.enabled && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    URL: {scannerSettings.notifications.webhook.url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Events: {scannerSettings.notifications.webhook.events.join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            Save Settings
          </Button>
        </Box>

        {dialogType === 'profile' && (
          <ProfileDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSave={handleDialogSave}
            profile={dialogData}
          />
        )}

        {dialogType === 'script' && (
          <ScriptDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSave={handleDialogSave}
            script={dialogData}
          />
        )}

        {dialogType === 'schedule' && (
          <ScheduleDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onSave={handleDialogSave}
            schedule={dialogData}
            availableTargets={[]} // TODO: Get from props
            availableProfiles={scannerSettings.scanProfiles}
          />
        )}

        <NotificationDialog
          open={notificationDialogOpen}
          onClose={() => setNotificationDialogOpen(false)}
          onSave={handleNotificationSave}
          initialData={scannerSettings.notifications}
        />

        <Paper elevation={4} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Scan Templates
          </Typography>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {templates.map(template => (
                <ListItem
                  key={template._id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="schedule" onClick={() => handleOpenScheduleDialog(template)}>
                        <ScheduleIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={template.name}
                    secondary={template.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button variant="contained" sx={{ mt: 2 }}>
            New Template
          </Button>
          {selectedTemplate && (
            <ScheduleDialog
              open={scheduleDialogOpen}
              onClose={handleCloseScheduleDialog}
              template={selectedTemplate}
            />
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default ScannerSettings; 