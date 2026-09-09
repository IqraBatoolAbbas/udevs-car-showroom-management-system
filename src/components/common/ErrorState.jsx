import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const ErrorState = ({ message, onRetry, retryLabel = 'Retry' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {message || 'An error occurred'}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
          {retryLabel}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
