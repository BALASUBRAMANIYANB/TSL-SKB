import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import {
  Warning as WarningIcon,
  Security as SecurityIcon,
  BugReport as BugIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const RiskAssessment = ({ riskAssessment }) => {
  const {
    overallRisk,
    riskFactors,
    impact,
    likelihood,
    recommendations
  } = riskAssessment;

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'critical':
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

  const renderRiskScore = () => (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h4" color={getRiskColor(overallRisk)}>
        {overallRisk}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Overall Risk Level
      </Typography>
      <LinearProgress
        variant="determinate"
        value={
          overallRisk === 'critical' ? 100 :
          overallRisk === 'high' ? 75 :
          overallRisk === 'medium' ? 50 :
          overallRisk === 'low' ? 25 : 0
        }
        color={getRiskColor(overallRisk)}
        sx={{ mt: 1, height: 8, borderRadius: 4 }}
      />
    </Paper>
  );

  const renderRiskFactors = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Risk Factors
      </Typography>
      <List>
        {riskFactors.map((factor, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color={getRiskColor(factor.severity)} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">
                      {factor.title}
                    </Typography>
                    <Chip
                      label={factor.severity}
                      size="small"
                      color={getRiskColor(factor.severity)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {factor.description}
                    </Typography>
                    <Box display="flex" gap={2} mt={1}>
                      <Chip
                        icon={<SecurityIcon />}
                        label={`Impact: ${factor.impact}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<BugIcon />}
                        label={`Likelihood: ${factor.likelihood}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < riskFactors.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const renderImpactAndLikelihood = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Impact & Likelihood Assessment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Impact
          </Typography>
          <List dense>
            {impact.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <SecurityIcon color={getRiskColor(item.level)} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Likelihood
          </Typography>
          <List dense>
            {likelihood.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <BugIcon color={getRiskColor(item.level)} />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderRecommendations = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Risk Mitigation Recommendations
      </Typography>
      <List>
        {recommendations.map((recommendation, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemIcon>
                <AssessmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={recommendation.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {recommendation.description}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 1 }}>
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

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {renderRiskScore()}
        </Grid>
        <Grid item xs={12} md={8}>
          {renderRiskFactors()}
        </Grid>
        <Grid item xs={12}>
          {renderImpactAndLikelihood()}
        </Grid>
        <Grid item xs={12}>
          {renderRecommendations()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskAssessment; 