import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { fetchScans, createScan, deleteScan, updateScan } from '../store/slices/scanSlice';
import { fetchTargets } from '../store/slices/targetSlice';
import ScanList from '../components/scans/ScanList';
import ScanForm from '../components/scans/ScanForm';

const ScanFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    dateRange: 'all',
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Severity</InputLabel>
            <Select
              value={filters.severity}
              label="Severity"
              onChange={(e) => handleChange('severity', e.target.value)}
            >
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => handleChange('dateRange', e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            fullWidth
            onClick={() => setFilters({ status: 'all', severity: 'all', dateRange: 'all' })}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ScanStats = ({ scans }) => {
  // Sample data for demonstration
  const sampleData = {
    total: 25,
    running: 3,
    completed: 18,
    failed: 2,
    critical: 7
  };

  const stats = {
    total: scans?.length || sampleData.total,
    running: scans?.filter(s => s.status === 'running').length || sampleData.running,
    completed: scans?.filter(s => s.status === 'completed').length || sampleData.completed,
    failed: scans?.filter(s => s.status === 'failed').length || sampleData.failed,
    critical: scans?.reduce((sum, scan) => 
      sum + (scan.results?.findings?.filter(f => f.severity === 'critical').length || 0), 0
    ) || sampleData.critical,
  };

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={2.4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {stats.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Scans
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="info.main">
            {stats.running}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Running
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {stats.completed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="error.main">
            {stats.failed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Failed
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={2.4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {stats.critical}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Critical Issues
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

const Scans = () => {
  const dispatch = useDispatch();
  const { items: scans, status: loading } = useSelector((state) => state.scans);
  const { items: targets } = useSelector((state) => state.targets);
  const [openForm, setOpenForm] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [viewResults, setViewResults] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    dateRange: 'all',
  });

  // Add console logs for debugging
  console.log('Redux State:', { scans, loading, targets });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching scans and targets...');
        await Promise.all([
          dispatch(fetchScans()),
          dispatch(fetchTargets())
        ]);
        console.log('Data fetched successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

  // Sample data for when API is not available
  const sampleScans = [
    {
      _id: '1',
      target: { name: 'Production Server', type: 'server' },
      status: 'running',
      createdAt: new Date().toISOString(),
      results: {
        findings: [
          { severity: 'critical', title: 'SQL Injection Vulnerability', description: 'Found potential SQL injection point' },
          { severity: 'high', title: 'XSS Vulnerability', description: 'Cross-site scripting vulnerability detected' }
        ]
      }
    },
    {
      _id: '2',
      target: { name: 'Staging Environment', type: 'server' },
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date().toISOString(),
      results: {
        findings: [
          { severity: 'medium', title: 'Outdated SSL', description: 'SSL certificate needs renewal' }
        ]
      }
    },
    {
      _id: '3',
      target: { name: 'Development API', type: 'api' },
      status: 'failed',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      results: {
        findings: []
      }
    }
  ];

  // Use sample data if no real data is available
  const displayScans = scans?.length > 0 ? scans : sampleScans;

  const handleCreateScan = async (scanData) => {
    await dispatch(createScan(scanData));
    setOpenForm(false);
  };

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Are you sure you want to delete this scan?')) {
      await dispatch(deleteScan(scanId));
    }
  };

  const handleViewResults = (scan) => {
    setSelectedScan(scan);
    setViewResults(true);
  };

  const handleStopScan = async (scanId) => {
    if (window.confirm('Are you sure you want to stop this scan?')) {
      await dispatch(updateScan({ id: scanId, status: 'stopped' }));
    }
  };

  const handleScheduleScan = (scanId) => {
    // Implement scan scheduling logic
  };

  const handleExportResults = (scan) => {
    // Implement export logic
  };

  const handleShareResults = (scan) => {
    // Implement sharing logic
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Security Scans
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenForm(true)}
                sx={{ mr: 1 }}
              >
                New Scan
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => dispatch(fetchScans())}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Scan Statistics */}
        <Grid item xs={12}>
          <ScanStats scans={displayScans} />
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <ScanFilters onFilterChange={handleFilterChange} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="All Scans" />
              <Tab label="Running" />
              <Tab label="Scheduled" />
              <Tab label="Completed" />
              <Tab label="Failed" />
            </Tabs>
            <Box sx={{ p: 2 }}>
              <ScanList
                scans={displayScans}
                onDelete={handleDeleteScan}
                onViewResults={handleViewResults}
                onStop={handleStopScan}
                onSchedule={handleScheduleScan}
                onExport={handleExportResults}
                onShare={handleShareResults}
                filters={filters}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* New Scan Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Security Scan</DialogTitle>
        <DialogContent>
          <ScanForm
            targets={targets}
            onSubmit={handleCreateScan}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Results View Dialog */}
      <Dialog
        open={viewResults}
        onClose={() => setViewResults(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Scan Results - {selectedScan?.target?.name}
          <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconButton
              aria-label="share"
              onClick={() => handleShareResults(selectedScan)}
              sx={{ mr: 1 }}
            >
              <ShareIcon />
            </IconButton>
            <IconButton
              aria-label="download"
              onClick={() => handleExportResults(selectedScan)}
              sx={{ mr: 1 }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              aria-label="close"
              onClick={() => setViewResults(false)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedScan && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Scan Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {selectedScan.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Started: {new Date(selectedScan.createdAt).toLocaleString()}
                      </Typography>
                      {selectedScan.completedAt && (
                        <Typography variant="body2" color="text.secondary">
                          Completed: {new Date(selectedScan.completedAt).toLocaleString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Findings: {selectedScan.results?.findings?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="error">
                        Critical: {selectedScan.results?.findings?.filter(f => f.severity === 'critical').length || 0}
                      </Typography>
                      <Typography variant="body2" color="warning.main">
                        High: {selectedScan.results?.findings?.filter(f => f.severity === 'high').length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Detailed Findings
              </Typography>
              {selectedScan.results?.findings?.map((finding, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" color="error">
                      {finding.title}
                    </Typography>
                    <Chip
                      label={finding.severity}
                      color={
                        finding.severity === 'critical' ? 'error' :
                        finding.severity === 'high' ? 'warning' :
                        finding.severity === 'medium' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {finding.description}
                  </Typography>
                  {finding.recommendation && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        Recommendation:
                      </Typography>
                      <Typography variant="body2">
                        {finding.recommendation}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Scans; 