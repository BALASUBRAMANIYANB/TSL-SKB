import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { fetchScans } from '../store/slices/scanSlice';
import { fetchTargets } from '../store/slices/targetSlice';
import { fetchReports } from '../store/slices/reportSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          p: 1,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="p" color={color} sx={{ mb: 1 }}>
      {value}
    </Typography>
    {trend && (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TrendingUpIcon sx={{ color: trend > 0 ? 'success.main' : 'error.main', mr: 0.5 }} />
        <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
          {trend > 0 ? '+' : ''}{trend}% from last week
        </Typography>
      </Box>
    )}
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

const SecurityScoreCard = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: `linear-gradient(135deg, ${getScoreColor(score)}15 0%, ${getScoreColor(score)}05 100%)`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Security Score
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={score}
          size={120}
          thickness={4}
          sx={{ color: getScoreColor(score) }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" component="div" color={getScoreColor(score)}>
            {score}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Overall system security rating
      </Typography>
    </Paper>
  );
};

const QuickActions = () => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <Typography variant="h6" gutterBottom>
      Quick Actions
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{ mb: 1 }}
        >
          New Scan
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          fullWidth
          sx={{ mb: 1 }}
        >
          Export Report
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          fullWidth
        >
          Refresh Data
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          fullWidth
        >
          View Reports
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

const VulnerabilityTrendChart = ({ scans }) => {
  // Simplified data for the chart
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Critical Vulnerabilities',
        data: [4, 3, 5, 2, 4, 3, 2],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Total Vulnerabilities',
        data: [12, 10, 15, 8, 14, 11, 9],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vulnerability Trends (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
      <Line data={chartData} options={options} />
    </Paper>
  );
};

const SystemHealthStatus = ({ targets }) => {
  const getHealthStatus = (target) => {
    // Example health status calculation
    const status = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 100,
      storage: Math.random() * 100,
    };
    return status;
  };

  const getStatusColor = (value) => {
    if (value >= 80) return 'success.main';
    if (value >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        System Health Status
      </Typography>
      <Grid container spacing={2}>
        {targets.map((target) => {
          const health = getHealthStatus(target);
          return (
            <Grid item xs={12} key={target._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {target.name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MemoryIcon sx={{ mr: 1, color: getStatusColor(health.cpu) }} />
                        <Typography variant="body2">CPU</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={health.cpu}
                        color={health.cpu >= 80 ? 'success' : health.cpu >= 60 ? 'warning' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorageIcon sx={{ mr: 1, color: getStatusColor(health.memory) }} />
                        <Typography variant="body2">Memory</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={health.memory}
                        color={health.memory >= 80 ? 'success' : health.memory >= 60 ? 'warning' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <NetworkIcon sx={{ mr: 1, color: getStatusColor(health.network) }} />
                        <Typography variant="body2">Network</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={health.network}
                        color={health.network >= 80 ? 'success' : health.network >= 60 ? 'warning' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StorageIcon sx={{ mr: 1, color: getStatusColor(health.storage) }} />
                        <Typography variant="body2">Storage</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={health.storage}
                        color={health.storage >= 80 ? 'success' : health.storage >= 60 ? 'warning' : 'error'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: scans = [], status: scansLoading } = useSelector((state) => state.scans);
  const { items: targets = [], status: targetsLoading } = useSelector((state) => state.targets);
  const { status: reportsLoading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchScans());
    dispatch(fetchTargets());
    dispatch(fetchReports());
  }, [dispatch]);

  if (scansLoading === 'loading' || targetsLoading === 'loading' || reportsLoading === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalVulnerabilities = (scans || []).reduce((sum, scan) => 
    sum + (scan?.results?.findings?.length || 0), 0
  );

  const criticalVulnerabilities = (scans || []).reduce((sum, scan) => 
    sum + (scan?.results?.findings?.filter(f => f?.severity === 'critical').length || 0), 0
  );

  const recentScans = [...(scans || [])]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 5);

  // Calculate security score (example calculation)
  const securityScore = Math.max(0, Math.min(100, 
    100 - (criticalVulnerabilities * 20) - (totalVulnerabilities * 5)
  ));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Security Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => {
            dispatch(fetchScans());
            dispatch(fetchTargets());
            dispatch(fetchReports());
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Security Score */}
        <Grid item xs={12} md={4}>
          <SecurityScoreCard score={securityScore} />
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Scans"
                value={scans?.length || 0}
                icon={<AssessmentIcon color="primary" />}
                color="primary.main"
                trend={5}
                subtitle="Last 30 days"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Active Targets"
                value={targets?.length || 0}
                icon={<SecurityIcon color="success" />}
                color="success.main"
                trend={2}
                subtitle="Monitored systems"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Total Vulnerabilities"
                value={totalVulnerabilities}
                icon={<BugReportIcon color="error" />}
                color="error.main"
                trend={-8}
                subtitle="Across all systems"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Critical Issues"
                value={criticalVulnerabilities}
                icon={<WarningIcon color="warning" />}
                color="warning.main"
                trend={-12}
                subtitle="Requires immediate attention"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <QuickActions />
        </Grid>

        {/* Vulnerability Trend Chart */}
        <Grid item xs={12} md={8}>
          <VulnerabilityTrendChart scans={scans} />
        </Grid>

        {/* System Health Status */}
        <Grid item xs={12}>
          <SystemHealthStatus targets={targets} />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Timeline>
              {recentScans.map((scan) => (
                <TimelineItem key={scan?._id || Math.random()}>
                  <TimelineSeparator>
                    <TimelineDot 
                      color={scan?.status === 'completed' ? 'success' : 'primary'}
                      sx={{ 
                        boxShadow: '0 0 0 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {scan?.target?.name || 'Unknown Target'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {scan?.status || 'unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {scan?.createdAt ? new Date(scan.createdAt).toLocaleString() : 'Unknown date'}
                    </Typography>
                    {scan?.results?.findings?.length > 0 && (
                      <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
                        {scan.results.findings.length} vulnerabilities found
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 