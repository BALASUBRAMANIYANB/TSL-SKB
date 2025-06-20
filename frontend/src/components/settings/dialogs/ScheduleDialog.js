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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import api from '../../../services/api';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ScheduleDialog = ({ open, onClose, template }) => {
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('09:00');
  const [day, setDay] = useState('1'); // Day of week or month

  const handleSchedule = async () => {
    let cronString = '';
    const [hour, minute] = time.split(':');

    switch (frequency) {
      case 'daily':
        cronString = `${minute} ${hour} * * *`;
        break;
      case 'weekly':
        cronString = `${minute} ${hour} * * ${day}`;
        break;
      case 'monthly':
        cronString = `${minute} ${hour} ${day} * *`;
        break;
      default:
        return; // Or handle error
    }

    try {
      await api.post(`/scan-templates/${template._id}/schedule`, { schedule: cronString });
      onClose();
    } catch (error) {
      console.error('Failed to schedule the scan template:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Scan: {template?.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select value={frequency} label="Frequency" onChange={(e) => setFrequency(e.target.value)}>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Time (HH:MM)"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
            />
          </Grid>

          {frequency === 'weekly' && (
            <Grid item xs={12}>
              <ToggleButtonGroup value={day} exclusive onChange={(e, newDay) => setDay(newDay)} aria-label="day of week">
                {daysOfWeek.map((dayName, index) => (
                  <ToggleButton key={index} value={String(index)}>{dayName}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
          )}

          {frequency === 'monthly' && (
            <Grid item xs={12}>
              <TextField
                label="Day of Month"
                type="number"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                fullWidth
                inputProps={{ min: 1, max: 31 }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSchedule} variant="contained">Schedule</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog; 