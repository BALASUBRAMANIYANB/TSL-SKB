import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const RecommendationsList = ({ recommendations }) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'implemented':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper>
      <List>
        {recommendations.map((recommendation, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <LightbulbIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">
                      {recommendation.title}
                    </Typography>
                    <Chip
                      label={recommendation.priority}
                      size="small"
                      color={getPriorityColor(recommendation.priority)}
                    />
                    {recommendation.status && (
                      <Chip
                        label={recommendation.status}
                        size="small"
                        color={getStatusColor(recommendation.status)}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {recommendation.description}
                    </Typography>
                    {recommendation.steps && (
                      <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                        {recommendation.steps.map((step, stepIndex) => (
                          <Typography
                            key={stepIndex}
                            component="li"
                            variant="body2"
                            color="textSecondary"
                          >
                            {step}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {recommendation.references && (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {recommendation.references.map((ref, refIndex) => (
                          <Button
                            key={refIndex}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="outlined"
                          >
                            {ref.title || ref.url}
                          </Button>
                        ))}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < recommendations.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecommendationsList; 