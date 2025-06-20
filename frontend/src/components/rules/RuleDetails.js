import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRule } from '../../services/wazuhApi';
import { Card, CardContent, Typography, CircularProgress, Alert, Button } from '@mui/material';

const RuleDetails = () => {
  const { ruleId } = useParams();
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRule = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRule(ruleId);
        setRule(res.data);
      } catch (err) {
        setError('Failed to fetch rule details');
      }
      setLoading(false);
    };
    fetchRule();
  }, [ruleId]);

  return (
    <div>
      <Button component={Link} to="/rules" variant="outlined" sx={{ mb: 2 }}>Back to Rules</Button>
      <h2>Rule Details</h2>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && rule && (
        <Card>
          <CardContent>
            <Typography variant="h6">ID: {rule.id}</Typography>
            <Typography>Level: {rule.level || '-'}</Typography>
            <Typography>Description: {rule.description || '-'}</Typography>
            {/* Add more rule fields as needed */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RuleDetails; 