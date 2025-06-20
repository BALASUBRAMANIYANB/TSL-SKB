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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { fetchReports, createReport, deleteReport } from '../store/slices/reportSlice';
import { fetchScans } from '../store/slices/scanSlice';
import ReportList from '../components/reports/ReportList';
import ReportViewer from '../components/reports/ReportViewer';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports = [], loading } = useSelector((state) => state.reports);
  const { scans = [] } = useSelector((state) => state.scans);
  const [openForm, setOpenForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewReport, setViewReport] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [selectedScan, setSelectedScan] = useState('');

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchScans());
  }, [dispatch]);

  const handleCreateReport = async () => {
    if (!selectedScan) {
      console.error('No scan selected');
      return;
    }
    await dispatch(createReport({ 
      scan: selectedScan,
      format: reportFormat 
    }));
    setOpenForm(false);
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await dispatch(deleteReport(reportId));
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setViewReport(true);
  };

  const handleDownloadReport = (report) => {
    if (report.status !== 'completed' || !report.downloadUrl) {
      alert('Report is not ready for download yet.');
      return;
    }
    const token = localStorage.getItem('token');
    // We need to construct a full URL for the download link
    const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${report.downloadUrl}?token=${token}`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const completedScans = Array.isArray(scans) ? scans.filter(scan => scan?.status === 'completed') : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Security Reports
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenForm(true)}
                sx={{ mr: 1 }}
                disabled={completedScans.length === 0}
              >
                Generate Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => dispatch(fetchReports())}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3}>
            <ReportList
              reports={reports}
              onDelete={handleDeleteReport}
              onViewReport={handleViewReport}
              onDownload={handleDownloadReport}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Select Scan"
              margin="normal"
              value={selectedScan}
              onChange={(e) => setSelectedScan(e.target.value)}
              required
            >
              {completedScans.map((scan) => (
                <MenuItem key={scan._id} value={scan._id}>
                  {scan.target?.name || 'Unknown Target'} - {new Date(scan.createdAt).toLocaleDateString()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Report Format"
              margin="normal"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateReport}
            disabled={!selectedScan}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Viewer Dialog */}
      <ReportViewer
        report={selectedReport}
        open={viewReport}
        onClose={() => setViewReport(false)}
      />
    </Container>
  );
};

export default Reports; 