import { Box, Chip, Step, Stepper, StepLabel } from '@mui/material';
import { APPLICATION_STATUS } from '../../utils/constants';

const statusSteps = [
  { label: 'Pending', value: APPLICATION_STATUS.PENDING },
  { label: 'Approved', value: APPLICATION_STATUS.APPROVED },
  { label: 'Reserved', value: APPLICATION_STATUS.RESERVED },
  { label: 'Completed', value: APPLICATION_STATUS.COMPLETED },
];

const ApplicationStatus = ({ status, showStepper = false }) => {
  const getStatusIndex = () => {
    const index = statusSteps.findIndex(step => step.value === status);
    return index >= 0 ? index : 0;
  };

  const getStatusColor = () => {
    const colors = {
      [APPLICATION_STATUS.PENDING]: 'warning',
      [APPLICATION_STATUS.APPROVED]: 'info',
      [APPLICATION_STATUS.RESERVED]: 'secondary',
      [APPLICATION_STATUS.COMPLETED]: 'success',
      [APPLICATION_STATUS.REJECTED]: 'error'
    };
    return colors[status] || 'default';
  };

  if (showStepper && status !== APPLICATION_STATUS.REJECTED) {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={getStatusIndex()} alternativeLabel>
          {statusSteps.map((step) => (
            <Step key={step.value}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }

  return (
    <Chip
      label={status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      color={getStatusColor()}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

export default ApplicationStatus;
