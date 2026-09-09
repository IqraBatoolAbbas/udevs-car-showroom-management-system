import { Box, Chip, Typography } from '@mui/material';

const ColorSelector = ({ colors, selectedColor, onSelect, disabled = false }) => {
  return (
    <Box>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Select Color
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {colors?.map((color) => (
          <Chip
            key={color}
            label={color}
            onClick={() => !disabled && onSelect(color)}
            disabled={disabled}
            sx={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: selectedColor === color ? 'primary.main' : 'default',
              color: selectedColor === color ? 'white' : 'text.primary',
              border: selectedColor === color ? '2px solid primary.main' : '1px solid #e0e0e0',
              '&:hover': !disabled ? {
                backgroundColor: selectedColor === color ? 'primary.dark' : 'action.hover',
              } : {},
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ColorSelector;
