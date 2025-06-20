import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import api from '../../services/api';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, HourglassEmpty as HourglassEmptyIcon, PlayCircle as PlayCircleIcon } from '@mui/icons-material';

const getStatusChip = (status) => {
  const statusMap = {
    completed: { label: 'Completed', color: 'success', icon: <CheckCircleIcon /> },
    failed: { label: 'Failed', color: 'error', icon: <ErrorIcon /> },
    running: { label: 'Running', color: 'info', icon: <PlayCircleIcon /> },
    queued: { label: 'Queued', color: 'warning', icon: <HourglassEmptyIcon /> },
    pending: { label: 'Pending', color: 'default', icon: <HourglassEmptyIcon /> },
  };
  const { label, color, icon } = statusMap[status] || statusMap.pending;
  return <Chip label={label} color={color} icon={icon} size="small" />;
};

const ScanProgress = ({ scan }) => {
  const [progress, setProgress] = useState(null);
  const isRunning = scan.status === 'running' || scan.status === 'queued';

  useEffect(() => {
    let intervalId;

    const fetchProgress = async () => {
      try {
        const response = await api.get(`/scans/${scan._id}/progress`);
        setProgress(response.data);
        // If scan is finished, stop polling
        if (response.data.status === 'completed' || response.data.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Failed to fetch scan progress:', error);
        clearInterval(intervalId);
      }
    };

    if (isRunning) {
      fetchProgress(); // Initial fetch
      intervalId = setInterval(fetchProgress, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [scan._id, isRunning]);

  if (!isRunning || !progress) {
    return getStatusChip(scan.status);
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Typography variant="body2" color="text.secondary">{`${progress.currentPhase || 'Scanning'}...`}</Typography>
        <LinearProgress variant="determinate" value={progress.progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(progress.progress)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default ScanProgress; 