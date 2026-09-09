import { Box, Typography, Button } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

const EmptyState = ({ message, action, actionLabel }) => {
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
      <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {message || 'No data found'}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action} sx={{ mt: 2 }}>
          {actionLabel || 'Add New'}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
