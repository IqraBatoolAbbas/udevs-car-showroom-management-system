import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  DirectionsCar,
  Speed,
  LocalGasStation,
  Settings,
  CalendarMonth,
  Palette,
  AttachMoney,
  TrendingUp,
  Edit
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { formatCurrency, formatCarName } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import './CarDetailsAdmin.css';

const CarDetailsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const canEditVehicle = user?.role === ROLES.ADMIN || user?.role === ROLES.INVENTORY;

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = () => {
    const cars = localStorageService.getData(STORAGE_KEYS.CARS, []);
    const foundCar = cars.find(c => c.id === id);
    if (foundCar) {
      setCar(foundCar);
      setSelectedImage(foundCar.images?.[0] || '');
    }
  };

  if (!car) {
    return (
      <div className="car-details-admin-page">
        <PageHeader
          title="Vehicle Not Found"
          subtitle="The requested vehicle record does not exist in the database"
        />
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ borderRadius: 2 }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="car-details-admin-page">
      <PageHeader
        title={formatCarName(car)}
        subtitle={`Vehicle ID: ${car.id} • Admin/Inventory Management View`}
        action={canEditVehicle ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/${user.role === ROLES.ADMIN ? 'admin' : 'inventory'}/cars/edit/${car.id}`)}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
          >
            Edit Vehicle
          </Button>
        ) : null}
      />

      <Grid container spacing={3}>
        {/* Left Column: Images */}
        <Grid item xs={12} md={6}>
          <Paper className="details-card" elevation={0}>
            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={selectedImage}
                alt={formatCarName(car)}
                sx={{ height: 400, objectFit: 'cover' }}
              />
            </Card>
            {car.images && car.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
                {car.images.map((img, idx) => (
                  <Card
                    key={idx}
                    sx={{ 
                      minWidth: 80, 
                      cursor: 'pointer',
                      border: selectedImage === img ? '3px solid #1565C0' : '2px solid transparent',
                      borderRadius: 1
                    }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`${formatCarName(car)} ${idx + 1}`}
                      sx={{ height: 60, width: 80, objectFit: 'cover' }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Details */}
        <Grid item xs={12} md={6}>
          <Paper className="details-card" elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', mb: 2 }}>
              Vehicle Specifications
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Make & Model</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.make} {car.model}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Year</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.year}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Variant</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{car.variant || 'Standard'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
                  <StatusChip status={car.status} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Purchase Rate</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1565C0' }}>{formatCurrency(car.purchaseRate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Selling Rate</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#10B981' }}>{formatCurrency(car.sellingRate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Current Stock</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.stock} Units</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Supplier</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{car.supplierName || 'Direct Purchase'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper className="details-card" elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', mb: 2 }}>
              Technical Specifications
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Speed color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Engine</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{car.engine || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocalGasStation color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Fuel Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{car.fuelType || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Settings color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Transmission</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{car.transmission || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarMonth color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Mileage</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{car.mileage || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {car.availableColors && car.availableColors.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Palette color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Available Colors</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {car.availableColors.map((color, idx) => (
                        <Chip key={idx} label={color} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Bottom Row: Description & Features */}
        <Grid item xs={12}>
          <Paper className="details-card" elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', mb: 2 }}>
              Vehicle Description
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#4B5563' }}>
              {car.description || 'No description available for this vehicle.'}
            </Typography>

            {car.features && car.features.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', mb: 2 }}>
                  Key Features
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {car.features.map((feature, idx) => (
                    <Chip key={idx} label={feature} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default CarDetailsAdmin;
