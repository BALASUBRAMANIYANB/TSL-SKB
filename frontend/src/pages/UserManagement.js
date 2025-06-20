import React from 'react';
import UserList from '../components/users/UserList';
import { Box, Typography } from '@mui/material';

const UserManagementPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <UserList />
    </Box>
  );
};

export default UserManagementPage; 