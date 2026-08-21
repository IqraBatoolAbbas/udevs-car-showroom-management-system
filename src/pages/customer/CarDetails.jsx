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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
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
  CheckCircle,
  Assignment,
  AttachMoney,
  TrendingUp,
  Share,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatCarName } from '../../utils/formatters';
import { validateApplicationForm } from '../../utils/validators';
import { PAKISTAN_CITIES, ROLES } from '../../utils/constants';
import './CarDetails.css';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Application Modal Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cellNumber: '',
    cnic: '',
    address: '',
    city: 'Lahore',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCar();
    checkFavorite();
  }, [id]);

  const loadCar = () => {
    const cars = localStorageService.getData(STORAGE_KEYS.CARS, []);
    const foundCar = cars.find(c => c.id === id);
    if (foundCar) {
      const availableColors = Array.isArray(foundCar.availableColors) ? foundCar.availableColors : [];
      const activeColor = availableColors.includes(foundCar.availableColors?.[0]) ? foundCar.availableColors[0] : (availableColors[0] || 'White');
      setCar(foundCar);
      setSelectedImage(foundCar.images?.[0] || '');
      setSelectedColor(activeColor);
    }
  };

  const checkFavorite = () => {
    const favs = localStorageService.getData(STORAGE_KEYS.WISHLIST, []);
    setIsFavorite(favs.includes(id));
  };

  const handleToggleFavorite = () => {
    const favs = localStorageService.getData(STORAGE_KEYS.WISHLIST, []);
    let updated;
    if (favs.includes(id)) {
      updated = favs.filter(favId => favId !== id);
      setIsFavorite(false);
    } else {
      updated = [...favs, id];
      setIsFavorite(true);
    }
    localStorageService.setData(STORAGE_KEYS.WISHLIST, updated);
  };

  const isCarAvailableForCustomer = Boolean(car && car.status === 'available' && (car.stock ?? 0) > 0 && Array.isArray(car.availableColors) && car.availableColors.length > 0);

  // This must be declared before any conditional return so hook order stays stable
  // while the car record is loading.
  useEffect(() => {
    if (user?.role === ROLES.CUSTOMER && car && !isCarAvailableForCustomer) {
      navigate('/customer/showroom', { replace: true });
    }
  }, [car, isCarAvailableForCustomer, navigate, user?.role]);

  const handleOpenApplyModal = () => {
    if (!isCarAvailableForCustomer) {
      setFormErrors({ submit: 'This vehicle is no longer available for booking.' });
      return;
    }

    if (!car.availableColors.includes(selectedColor)) {
      setSelectedColor(car.availableColors[0] || 'White');
    }

    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      cellNumber: user?.phone || '+92-300-1234567',
      cnic: user?.cnic || '12345-6789012-3',
      address: user?.address || '123 Main Boulevard, Gulberg',
      city: user?.city || 'Lahore',
      notes: ''
    });
    setFormErrors({});
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!isCarAvailableForCustomer) {
      setFormErrors({ submit: 'This vehicle is no longer available for booking.' });
      return;
    }

    if (!car.availableColors.includes(selectedColor)) {
      setFormErrors({ selectedColor: 'Please select a currently available color for this vehicle.' });
      return;
    }

    const appDataToValidate = {
      ...formData,
      selectedCar: formatCarName(car),
      selectedColor
    };

    const errors = validateApplicationForm(appDataToValidate);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const applications = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
      const newAppId = localStorageService.generateId('APP');

      const newApplication = {
        id: newAppId,
        customerUserId: user?.id,
        ...formData,
        selectedCar: formatCarName(car),
        selectedCarId: car.id,
        selectedColor,
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            notes: 'Application submitted via customer online showroom'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      applications.unshift(newApplication);
      localStorageService.setData(STORAGE_KEYS.APPLICATIONS, applications);

      // Keep the customer master in sync with applications created in the portal.
      const customers = localStorageService.getData(STORAGE_KEYS.CUSTOMERS, []);
      const customerRecord = {
        id: localStorageService.generateId('CUST'),
        userId: user?.id,
        name: formData.fullName,
        email: formData.email.toLowerCase(),
        phone: formData.cellNumber,
        cnic: formData.cnic,
        address: formData.address,
        city: formData.city,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const customerIndex = customers.findIndex(customer => customer.userId === user?.id || customer.email?.toLowerCase() === customerRecord.email);
      if (customerIndex >= 0) customers[customerIndex] = { ...customers[customerIndex], ...customerRecord, id: customers[customerIndex].id };
      else customers.push(customerRecord);
      localStorageService.setData(STORAGE_KEYS.CUSTOMERS, customers);

      // Log activity
      localStorageService.logActivity({
        type: 'create',
        entity: 'application',
        entityId: newAppId,
        description: `New booking application submitted for ${formatCarName(car)} (${newAppId})`,
        userId: user?.id,
        userEmail: user?.email
      });

      // Add in-app notification
      localStorageService.addNotification({
        title: 'New Car Application Received',
        message: `${formData.fullName} applied for ${formatCarName(car)} (${selectedColor}).`,
        type: 'info',
        targetRole: ['admin', 'sales']
      });

      setApplyModalOpen(false);
      setSuccessMessage(`Application successfully submitted! Your Tracking ID is ${newAppId}.`);
    } catch (err) {
      console.error('Error submitting application:', err);
      setFormErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!car) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Vehicle record not found or has been removed.
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2, borderRadius: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.SALES || user?.role === ROLES.INVENTORY;

  return (
    <div className="car-details-page">
      <PageHeader
        title={formatCarName(car)}
        subtitle={`${car.year} • ${car.fuel} • ${car.transmission} • ID: ${car.id}`}
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 2 }}
            >
              Back
            </Button>
            <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              <IconButton 
                onClick={handleToggleFavorite}
                sx={{ 
                  color: isFavorite ? '#EF4444' : '#6B7280',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: 2
                }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      {successMessage && (
        <Alert 
          severity="success" 
          onClose={() => setSuccessMessage('')}
          sx={{ mb: 3, borderRadius: 2.5, fontWeight: 600 }}
        >
          {successMessage}
          <Button 
            size="small" 
            onClick={() => navigate('/customer/applications')} 
            sx={{ ml: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Track in My Applications &rarr;
          </Button>
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Image Gallery */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', mb: 3 }} elevation={0}>
            {/* Main Featured Image */}
            <Box sx={{ position: 'relative', mb: 2, borderRadius: 2.5, overflow: 'hidden' }}>
              <Box
                component="img"
                src={selectedImage || 'https://via.placeholder.com/800x500?text=No+Image'}
                alt={formatCarName(car)}
                sx={{ width: '100%', height: { xs: 260, sm: 400 }, objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <StatusChip status={car.status} />
              </Box>
            </Box>

            {/* Thumbnail Strip */}
            {car.images?.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                {car.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setSelectedImage(img)}
                    sx={{
                      width: 90,
                      height: 65,
                      objectFit: 'cover',
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: selectedImage === img ? '2.5px solid #1565C0' : '1px solid rgba(0,0,0,0.1)',
                      opacity: selectedImage === img ? 1 : 0.7,
                      transition: 'all 0.2s',
                      '&:hover': { opacity: 1 }
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* Detailed Specifications Matrix */}
          <Paper sx={{ p: 3.5, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#071321' }}>
              Vehicle Specifications & Features
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Model Year</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.year}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Engine Capacity</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.engine || 'Standard'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Fuel Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.fuel}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Transmission</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{car.transmission}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Mileage</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {car.mileage ? `${car.mileage.toLocaleString()} km` : 'Brand New (0 km)'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography variant="caption" color="textSecondary" display="block">Available Stock</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: car.stock <= 3 ? '#DC2626' : '#059669' }}>
                    {car.stock} Units
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {car.description && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#071321' }}>
                  Overview & Warranty Notes
                </Typography>
                <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.8 }}>
                  {car.description}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Pricing & Booking Application */}
        <Grid item xs={12} lg={5}>
          {/* Price & Application Action Card */}
          <Paper sx={{ p: 4, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', mb: 3, bgcolor: '#ffffff' }} elevation={0}>
            <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              Official Showroom Price
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1565C0', my: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {formatCurrency(car.sellingPrice)}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Available Colors Selection */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#071321' }}>
              Select Vehicle Color:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {car.availableColors?.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  onClick={() => setSelectedColor(color)}
                  color={selectedColor === color ? 'primary' : 'default'}
                  variant={selectedColor === color ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer', fontWeight: selectedColor === color ? 700 : 500, px: 0.5 }}
                />
              ))}
            </Box>

            {/* Apply Button */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!isCarAvailableForCustomer}
              onClick={handleOpenApplyModal}
              startIcon={<Assignment />}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.05rem',
                background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
                boxShadow: '0 8px 20px rgba(21, 101, 192, 0.35)',
                textTransform: 'none'
              }}
            >
              {isCarAvailableForCustomer ? 'Apply for this Vehicle' : 'Currently Unavailable'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
              <CheckCircle sx={{ color: isCarAvailableForCustomer ? '#10B981' : '#F59E0B', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 500 }}>
                {isCarAvailableForCustomer ? 'Instant booking confirmation & staff document verification' : 'This vehicle is currently unavailable for customer applications.'}
              </Typography>
            </Box>
          </Paper>

          {/* Staff Financial Insights (Visible only to authorized staff) */}
          {isStaff && (
            <Paper sx={{ p: 3.5, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', bgcolor: '#071321', color: 'white' }} elevation={0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#00ACC1', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                Staff Margin & Cost Insights
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Purchase Rate (Cost):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(car.purchaseRate)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Selling Price (Retail):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(car.sellingPrice)}</Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700 }}>Gross Profit / Unit:</Typography>
                <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 800 }}>
                  +{formatCurrency(car.profit || (car.sellingPrice - car.purchaseRate))}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Profit Margin %:</Typography>
                <Chip
                  label={`${car.profitMargin || 0}%`}
                  size="small"
                  sx={{
                    bgcolor: car.profitMargin >= 15 ? '#10B981' : '#F59E0B',
                    color: 'white',
                    fontWeight: 800
                  }}
                />
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Customer Booking Application Modal */}
      <Dialog
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #071321 0%, #1565C0 100%)', 
          color: 'white',
          py: 2,
          px: 3,
          fontWeight: 700
        }}>
          Vehicle Purchase Application
        </DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
              Applying for: <strong>{formatCarName(car)}</strong> (Color: <strong>{selectedColor}</strong>)
            </Alert>

            {formErrors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>{formErrors.submit}</Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cell Number (+92-XXX-XXXXXXX)"
                  value={formData.cellNumber}
                  onChange={(e) => setFormData({ ...formData, cellNumber: e.target.value })}
                  error={!!formErrors.cellNumber}
                  helperText={formErrors.cellNumber}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="CNIC (XXXXX-XXXXXXX-X)"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  error={!!formErrors.cnic}
                  helperText={formErrors.cnic}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                >
                  {PAKISTAN_CITIES.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Residential / Delivery Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={!!formErrors.address}
                  helperText={formErrors.address}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2.5}
                  size="small"
                  label="Special Notes or Delivery Instructions (Optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
            <Button onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ px: 3, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              {loading ? 'Submitting...' : 'Confirm Application'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CarDetails;
