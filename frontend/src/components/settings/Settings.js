import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Chip,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  DataUsage as DataUsageIcon,
  BugReport as BugReportIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { API_URL } from '../../services/auth';
import axios from 'axios';

const Settings = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '24h',
    autoRefresh: true,
    refreshInterval: 30,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    emailAddress: '',
    scanComplete: true,
    vulnerabilityFound: true,
    systemUpdates: true,
    weeklyReports: true,
    notificationSound: true,
    desktopNotifications: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    failedLoginAttempts: 5,
    ipWhitelist: [],
    apiKeyRotation: 30,
    encryptionLevel: 'high',
  });

  // Scan Settings
  const [scanSettings, setScanSettings] = useState({
    concurrentScans: 3,
    scanTimeout: 3600,
    defaultScanType: 'full',
    autoRetry: true,
    maxRetries: 3,
    excludePaths: [],
    includePaths: [],
    customHeaders: {},
  });

  // Storage Settings
  const [storageSettings, setStorageSettings] = useState({
    maxStorage: 10000,
    retentionPeriod: 90,
    autoCleanup: true,
    backupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    compressionEnabled: true,
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    rateLimit: 100,
    timeout: 30,
    corsEnabled: true,
    allowedOrigins: [],
    apiVersion: 'v1',
    documentationEnabled: true,
  });

  // UI State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Save settings
  const saveSettings = async () => {
    try {
      const settings = {
        general: generalSettings,
        notifications: notificationSettings,
        security: securitySettings,
        scan: scanSettings,
        storage: storageSettings,
        api: apiSettings,
      };

      await axios.post(`${API_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error',
      });
    }
  };

  // Load settings
  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { general, notifications, security, scan, storage, api } = response.data;
      setGeneralSettings(general);
      setNotificationSettings(notifications);
      setSecuritySettings(security);
      setScanSettings(scan);
      setStorageSettings(storage);
      setApiSettings(api);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load settings',
        severity: 'error',
      });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render General Settings
  const renderGeneralSettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={generalSettings.language}
              label="Language"
              onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
              <MenuItem value="de">German</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select
              value={generalSettings.theme}
              label="Theme"
              onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={generalSettings.timezone}
              label="Timezone"
              onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="EST">EST</MenuItem>
              <MenuItem value="PST">PST</MenuItem>
              <MenuItem value="GMT">GMT</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={generalSettings.autoRefresh}
                onChange={(e) => setGeneralSettings({ ...generalSettings, autoRefresh: e.target.checked })}
              />
            }
            label="Auto Refresh"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Refresh Interval (seconds)</Typography>
          <Slider
            value={generalSettings.refreshInterval}
            onChange={(e, value) => setGeneralSettings({ ...generalSettings, refreshInterval: value })}
            min={10}
            max={300}
            step={10}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Render Notification Settings
  const renderNotificationSettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
              />
            }
            label="Email Notifications"
          />
        </Grid>
        {notificationSettings.emailNotifications && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              value={notificationSettings.emailAddress}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAddress: e.target.value })}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Types
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Scan Complete" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.scanComplete}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, scanComplete: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Vulnerability Found" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.vulnerabilityFound}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, vulnerabilityFound: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="System Updates" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.systemUpdates}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Weekly Reports" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationSettings.weeklyReports}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Security Settings
  const renderSecuritySettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
              />
            }
            label="Two-Factor Authentication"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Session Timeout (minutes)</Typography>
          <Slider
            value={securitySettings.sessionTimeout}
            onChange={(e, value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
            min={5}
            max={120}
            step={5}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Password Expiry (days)</Typography>
          <Slider
            value={securitySettings.passwordExpiry}
            onChange={(e, value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
            min={30}
            max={365}
            step={30}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            IP Whitelist
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="IP Address"
              placeholder="Enter IP address"
            />
            <Button variant="contained" startIcon={<AddIcon />}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {securitySettings.ipWhitelist.map((ip, index) => (
              <Chip
                key={index}
                label={ip}
                onDelete={() => {
                  const newList = [...securitySettings.ipWhitelist];
                  newList.splice(index, 1);
                  setSecuritySettings({ ...securitySettings, ipWhitelist: newList });
                }}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Render Scan Settings
  const renderScanSettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Concurrent Scans</Typography>
          <Slider
            value={scanSettings.concurrentScans}
            onChange={(e, value) => setScanSettings({ ...scanSettings, concurrentScans: value })}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Scan Timeout (seconds)</Typography>
          <Slider
            value={scanSettings.scanTimeout}
            onChange={(e, value) => setScanSettings({ ...scanSettings, scanTimeout: value })}
            min={300}
            max={7200}
            step={300}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Default Scan Type</InputLabel>
            <Select
              value={scanSettings.defaultScanType}
              label="Default Scan Type"
              onChange={(e) => setScanSettings({ ...scanSettings, defaultScanType: e.target.value })}
            >
              <MenuItem value="quick">Quick</MenuItem>
              <MenuItem value="full">Full</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={scanSettings.autoRetry}
                onChange={(e) => setScanSettings({ ...scanSettings, autoRetry: e.target.checked })}
              />
            }
            label="Auto Retry Failed Scans"
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Render Storage Settings
  const renderStorageSettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Maximum Storage (MB)</Typography>
          <Slider
            value={storageSettings.maxStorage}
            onChange={(e, value) => setStorageSettings({ ...storageSettings, maxStorage: value })}
            min={1000}
            max={100000}
            step={1000}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Retention Period (days)</Typography>
          <Slider
            value={storageSettings.retentionPeriod}
            onChange={(e, value) => setStorageSettings({ ...storageSettings, retentionPeriod: value })}
            min={30}
            max={365}
            step={30}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={storageSettings.autoCleanup}
                onChange={(e) => setStorageSettings({ ...storageSettings, autoCleanup: e.target.checked })}
              />
            }
            label="Automatic Cleanup"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={storageSettings.backupEnabled}
                onChange={(e) => setStorageSettings({ ...storageSettings, backupEnabled: e.target.checked })}
              />
            }
            label="Enable Automatic Backups"
          />
        </Grid>
        {storageSettings.backupEnabled && (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Backup Frequency</InputLabel>
                <Select
                  value={storageSettings.backupFrequency}
                  label="Backup Frequency"
                  onChange={(e) => setStorageSettings({ ...storageSettings, backupFrequency: e.target.value })}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Backup Time"
                value={storageSettings.backupTime}
                onChange={(e) => setStorageSettings({ ...storageSettings, backupTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );

  // Render API Settings
  const renderApiSettings = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Rate Limit (requests per minute)</Typography>
          <Slider
            value={apiSettings.rateLimit}
            onChange={(e, value) => setApiSettings({ ...apiSettings, rateLimit: value })}
            min={10}
            max={1000}
            step={10}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Timeout (seconds)</Typography>
          <Slider
            value={apiSettings.timeout}
            onChange={(e, value) => setApiSettings({ ...apiSettings, timeout: value })}
            min={5}
            max={60}
            step={5}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={apiSettings.corsEnabled}
                onChange={(e) => setApiSettings({ ...apiSettings, corsEnabled: e.target.checked })}
              />
            }
            label="Enable CORS"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={apiSettings.documentationEnabled}
                onChange={(e) => setApiSettings({ ...apiSettings, documentationEnabled: e.target.checked })}
              />
            }
            label="Enable API Documentation"
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<SettingsIcon />} label="General" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<SpeedIcon />} label="Scan" />
            <Tab icon={<StorageIcon />} label="Storage" />
            <Tab icon={<CodeIcon />} label="API" />
          </Tabs>
        </Box>

        {activeTab === 0 && renderGeneralSettings()}
        {activeTab === 1 && renderNotificationSettings()}
        {activeTab === 2 && renderSecuritySettings()}
        {activeTab === 3 && renderScanSettings()}
        {activeTab === 4 && renderStorageSettings()}
        {activeTab === 5 && renderApiSettings()}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSettings}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveSettings}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
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