import { Chip } from '@mui/material';
import { getStatusColor } from '../../utils/formatters';

const StatusChip = ({ status, size = 'small' }) => {
  const color = getStatusColor(status);

  return (
    <Chip
      label={status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      size={size}
      sx={{
        backgroundColor: `${color}20`,
        color: color,
        fontWeight: 600,
        border: `1px solid ${color}`,
      }}
    />
  );
};

export default StatusChip;
