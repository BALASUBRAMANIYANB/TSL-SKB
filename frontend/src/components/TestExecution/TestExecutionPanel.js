import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { executeTest, getTestResults } from '../../redux/actions/testActions';
import TestResultsView from './TestResultsView';
import WazuhStatus from './WazuhStatus';
import VulnerabilityList from './VulnerabilityList';
import RecommendationsList from './RecommendationsList';
import RiskAssessment from './RiskAssessment';

const TestExecutionPanel = ({ target, onTestComplete }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [testConfig, setTestConfig] = useState({
    tools: [],
    wazuhIntegration: {
      enabled: true,
      checkAgentStatus: true,
      checkVulnerabilities: true,
      checkSecurityEvents: true,
      checkCompliance: true
    }
  });

  const {
    loading,
    error,
    results,
    executing
  } = useSelector(state => state.testExecution);

  useEffect(() => {
    if (results && onTestComplete) {
      onTestComplete(results);
    }
  }, [results, onTestComplete]);

  const handleExecuteTest = async () => {
    await dispatch(executeTest({
      target,
      ...testConfig
    }));
  };

  const handleStopTest = () => {
    // Implement stop test logic
  };

  const handleRefreshResults = async () => {
    if (results?.testId) {
      await dispatch(getTestResults(results.testId));
    }
  };

  const handleDownloadResults = () => {
    // Implement download results logic
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderStatusChip = () => {
    if (executing) {
      return (
        <Chip
          icon={<CircularProgress size={16} />}
          label="Executing"
          color="primary"
        />
      );
    }
    if (error) {
      return (
        <Chip
          icon={<ErrorIcon />}
          label="Error"
          color="error"
        />
      );
    }
    if (results) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Completed"
          color="success"
        />
      );
    }
    return (
      <Chip
        icon={<WarningIcon />}
        label="Not Started"
        color="default"
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Test Execution
          </Typography>
          {renderStatusChip()}
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayIcon />}
                onClick={handleExecuteTest}
                disabled={executing}
              >
                Execute Test
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<StopIcon />}
                onClick={handleStopTest}
                disabled={!executing}
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshResults}
                disabled={!results}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadResults}
                disabled={!results}
              >
                Download Results
              </Button>
            </Box>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {results && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Summary" />
                <Tab label="Vulnerabilities" />
                <Tab label="Wazuh Status" />
                <Tab label="Recommendations" />
                <Tab label="Risk Assessment" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <TestResultsView results={results} />
              )}
              {activeTab === 1 && (
                <VulnerabilityList vulnerabilities={results.combinedResults.vulnerabilities} />
              )}
              {activeTab === 2 && (
                <WazuhStatus wazuhResults={results.wazuhResults} />
              )}
              {activeTab === 3 && (
                <RecommendationsList recommendations={results.combinedResults.recommendations} />
              )}
              {activeTab === 4 && (
                <RiskAssessment riskAssessment={results.combinedResults.riskAssessment} />
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TestExecutionPanel; 