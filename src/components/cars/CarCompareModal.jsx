import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { Close, DeleteOutline, CompareArrows, CheckCircle } from '@mui/icons-material';
import { formatCurrency, formatCarName } from '../../utils/formatters';

const CarCompareModal = ({ open, onClose, compareCars = [], onRemoveCar, onSelectCar }) => {
  if (compareCars.length === 0) return null;

  const specs = [
    { label: 'Vehicle', key: 'name', render: (car) => (
      <Box sx={{ textAlign: 'center' }}>
        <Box
          component="img"
          src={car.images?.[0] || 'https://via.placeholder.com/300x180?text=No+Image'}
          alt={formatCarName(car)}
          sx={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 2, mb: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#071321' }}>
          {formatCarName(car)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {car.variant}
        </Typography>
      </Box>
    )},
    { label: 'Selling Price', key: 'sellingPrice', render: (car) => (
      <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 700, textAlign: 'center' }}>
        {formatCurrency(car.sellingPrice)}
      </Typography>
    )},
    { label: 'Model Year', key: 'year', render: (car) => (
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
        {car.year}
      </Typography>
    )},
    { label: 'Fuel Type', key: 'fuel', render: (car) => (
      <Box sx={{ textAlign: 'center' }}>
        <Chip label={car.fuel} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
      </Box>
    )},
    { label: 'Transmission', key: 'transmission', render: (car) => (
      <Box sx={{ textAlign: 'center' }}>
        <Chip label={car.transmission} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
      </Box>
    )},
    { label: 'Engine Capacity', key: 'engine', render: (car) => (
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        {car.engine || 'Standard'}
      </Typography>
    )},
    { label: 'Mileage', key: 'mileage', render: (car) => (
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        {car.mileage ? `${car.mileage.toLocaleString()} km` : 'Brand New (0 km)'}
      </Typography>
    )},
    { label: 'Available Colors', key: 'colors', render: (car) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
        {car.availableColors?.map(color => (
          <Chip key={color} label={color} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
        ))}
      </Box>
    )},
    { label: 'Stock Status', key: 'stock', render: (car) => (
      <Box sx={{ textAlign: 'center' }}>
        <Chip
          label={car.stock > 0 ? `${car.stock} In Stock` : 'Out of Stock'}
          size="small"
          color={car.stock > 3 ? 'success' : car.stock > 0 ? 'warning' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      </Box>
    )},
    { label: 'Action', key: 'action', render: (car) => (
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            onClose();
            if (onSelectCar) onSelectCar(car);
          }}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          View Details
        </Button>
      </Box>
    )}
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'linear-gradient(135deg, #071321 0%, #1565C0 100%)', 
        color: 'white',
        py: 2,
        px: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CompareArrows />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Vehicle Comparison ({compareCars.length}/3)
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                <TableCell sx={{ width: 180, fontWeight: 700, color: '#4B5563' }}>Feature</TableCell>
                {compareCars.map((car) => (
                  <TableCell key={car.id} sx={{ minWidth: 220, position: 'relative', textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 8, right: 8 }}>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => onRemoveCar(car.id)}
                        title="Remove from comparison"
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {specs.map((spec) => (
                <TableRow key={spec.key} hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
                    {spec.label}
                  </TableCell>
                  {compareCars.map((car) => (
                    <TableCell key={car.id} sx={{ verticalAlign: 'middle' }}>
                      {spec.render(car)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close Comparison
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarCompareModal;
