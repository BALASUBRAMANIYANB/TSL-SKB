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

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchScans());
  }, [dispatch]);

  const handleCreateReport = async (reportData) => {
    await dispatch(createReport(reportData));
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
    if (!report?.downloadUrl) {
      console.error('No download URL available for this report');
      return;
    }
    // Implement report download logic
    const link = document.createElement('a');
    link.href = report.downloadUrl;
    link.download = `report-${report._id}.${reportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onView={handleViewReport}
              onDownload={handleDownloadReport}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Select Scan"
              margin="normal"
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
            onClick={() => handleCreateReport({ format: reportFormat })}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Viewer Dialog */}
      <Dialog
        open={viewReport}
        onClose={() => setViewReport(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Report Details
          <IconButton
            aria-label="close"
            onClick={() => setViewReport(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <ReportViewer report={selectedReport} />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Reports; 