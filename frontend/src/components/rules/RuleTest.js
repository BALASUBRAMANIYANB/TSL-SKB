import React, { useState } from 'react';
import { testRule } from '../../services/wazuhApi';
import { TextField, Button, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';

// TODO: Implement rule/decoder testing using wazuhApi.testRule
const RuleTest = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await testRule({ input });
      setResult(res.data);
    } catch (err) {
      setError('Failed to test rule/decoder');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Test Wazuh Rule/Decoder</h2>
      <form onSubmit={handleTest} style={{ marginBottom: 16 }}>
        <TextField
          label="Test Data"
          value={input}
          onChange={e => setInput(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" disabled={loading}>
          Test
        </Button>
      </form>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {result && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Test Result</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RuleTest; 