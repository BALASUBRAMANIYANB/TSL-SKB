import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { fetchReports } from '../../store/slices/reportSlice';

const ReportList = ({ onViewReport }) => {
  const dispatch = useDispatch();
  const { items: reports, status, error } = useSelector((state) => state.reports);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReports());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Typography>Loading reports...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <List>
        {reports.map((report) => (
          <ListItem key={report._id}>
            <ListItemText
              primary={report.title}
              secondary={`Created: ${new Date(report.createdAt).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onViewReport(report)}>
                <VisibilityIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ReportList; 