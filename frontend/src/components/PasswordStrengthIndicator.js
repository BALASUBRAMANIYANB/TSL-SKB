import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 40) return 'error';
    if (strength < 70) return 'warning';
    return 'success';
  };

  const getStrengthText = (strength) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const strength = calculateStrength(password);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={getStrengthColor(strength)}
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography
        variant="caption"
        color={getStrengthColor(strength)}
        sx={{ mt: 0.5, display: 'block' }}
      >
        Password Strength: {getStrengthText(strength)}
      </Typography>
    </Box>
  );
};

export default PasswordStrengthIndicator; 