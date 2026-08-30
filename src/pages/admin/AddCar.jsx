import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack, Save, DirectionsCar, AttachMoney, TrendingUp, Warning } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService from '../../services/localStorageService';
import { validateCarForm } from '../../utils/validators';
import { calculateProfit, calculateProfitMargin } from '../../utils/calculations';
import { CAR_STATUS, FUEL_TYPES, TRANSMISSION_TYPES, CAR_COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { selectSuppliers } from '../../redux/suppliers/suppliersSlice';
import { selectCars, addCar, updateCar } from '../../redux/cars/carsSlice';

const AddCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = !!id;
  const basePath = location.pathname.startsWith('/inventory/') ? '/inventory' : '/admin';
  const dispatch = useDispatch();
  const suppliers = useSelector(selectSuppliers);
  const cars = useSelector(selectCars);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    variant: '',
    purchaseRate: '',
    sellingPrice: '',
    availableColors: ['White', 'Black', 'Silver'],
    stock: 1,
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: 0,
    engine: '1800cc',
    images: ['https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800'],
    description: '',
    status: CAR_STATUS.AVAILABLE,
    supplierId: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (suppliers.length > 0 && !formData.supplierId && !isEdit) {
      setFormData(prev => ({ ...prev, supplierId: suppliers[0].id }));
    }
    if (isEdit) {
      const car = cars.find(item => item.id === id);
      if (car) setFormData({ ...car, images: car.images?.length > 0 ? car.images : [''] });
    }
  }, [id, isEdit, suppliers, cars]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: name === 'stock' || name === 'year' ? (parseInt(value, 10) || 0) : value
  }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  const handleColorToggle = (color) => {
    setFormData(prev => {
      const colors = prev.availableColors.includes(color)
        ? prev.availableColors.filter(c => c !== color)
        : [...prev.availableColors, color];
      return { ...prev, availableColors: colors };
    });
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: images.length > 0 ? images : [''] };
    });
  };

  // Dynamic live financial calculations
  const numPurchase = parseFloat(formData.purchaseRate) || 0;
  const numSelling = parseFloat(formData.sellingPrice) || 0;
  const liveProfit = calculateProfit(numSelling, numPurchase);
  const liveMargin = calculateProfitMargin(liveProfit, numSelling);
  const isLoss = numSelling > 0 && numPurchase > 0 && numSelling < numPurchase;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

  const validationErrors = validateCarForm({
  ...formData,
  stock: parseInt(formData.stock, 10) || 0,
  stockQuantity: parseInt(formData.stock, 10) || 0
});

    setLoading(true);

    try {
      const profit = calculateProfit(parseFloat(formData.sellingPrice), parseFloat(formData.purchaseRate));
      const margin = parseFloat(calculateProfitMargin(profit, parseFloat(formData.sellingPrice)));

      const carData = {
  ...formData,
  stock: parseInt(formData.stock, 10) || 0,
  stockQuantity: parseInt(formData.stock, 10) || 0, // Validator and API key alignment
  purchaseRate: parseFloat(formData.purchaseRate) || 0,
  sellingPrice: parseFloat(formData.sellingPrice) || 0,
  year: parseInt(formData.year, 10) || new Date().getFullYear(),
  mileage: parseFloat(formData.mileage) || 0,
  images: formData.images.filter(img => img.trim() !== ''),
  profit,
  profitMargin: margin
};

      if (isEdit) {
        if (cars.some(c => c.id === id)) {
          dispatch(updateCar({ id, ...carData, updatedAt: new Date().toISOString() }));
          localStorageService.logActivity({
            type: 'update',
            entity: 'car',
            entityId: id,
            description: `Updated vehicle record: ${carData.make} ${carData.model} (${id})`
          });
        }
      } else {
        carData.id = localStorageService.generateId('CAR');
        carData.createdAt = new Date().toISOString();
        dispatch(addCar(carData));
        localStorageService.logActivity({
          type: 'create',
          entity: 'car',
          entityId: carData.id,
          description: `Created new vehicle record: ${carData.make} ${carData.model} (${carData.id})`
        });
      }

      navigate(`${basePath}/cars`);
    } catch (error) {
      console.error('Error saving car:', error);
      setErrors({ submit: 'An error occurred while saving vehicle data.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? `Edit Vehicle (${id})` : 'Register New Vehicle'}
        subtitle={isEdit ? 'Update vehicle specs, stock quantity, and pricing' : 'Add a new vehicle to the showroom inventory with supplier linking'}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(`${basePath}/cars`)}
            sx={{ borderRadius: 2 }}
          >
            Back to Inventory
          </Button>
        }
      />

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      {isLoss && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Pricing Warning:</strong> Selling price (PKR {numSelling.toLocaleString()}) is lower than Purchase Rate (PKR {numPurchase.toLocaleString()}), resulting in a negative profit margin ({liveMargin}%).
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Form Details */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
              {/* Section 1: Basic Specs */}
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCar color="primary" />
                Vehicle Specifications
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    error={!!errors.make}
                    helperText={errors.make}
                    placeholder="e.g. Toyota, Honda"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    error={!!errors.model}
                    helperText={errors.model}
                    placeholder="e.g. Corolla, Civic"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Model Year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    error={!!errors.year}
                    helperText={errors.year}
                    inputProps={{ min: 2000, max: new Date().getFullYear() + 2 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Variant"
                    name="variant"
                    value={formData.variant}
                    onChange={handleChange}
                    error={!!errors.variant}
                    helperText={errors.variant}
                    placeholder="e.g. Grande, Turbo, VTi"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel>Fuel Type</InputLabel>
                    <Select
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleChange}
                      label="Fuel Type"
                      error={!!errors.fuel}
                    >
                      {FUEL_TYPES.map(fuel => (
                        <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel>Transmission</InputLabel>
                    <Select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      label="Transmission"
                      error={!!errors.transmission}
                    >
                      {TRANSMISSION_TYPES.map(trans => (
                        <MenuItem key={trans} value={trans}>{trans}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Engine Capacity"
                    name="engine"
                    value={formData.engine}
                    onChange={handleChange}
                    placeholder="e.g. 1800cc, 1.5L Turbo"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Mileage (km)"
                    name="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>

              {/* Section 2: Pricing & Inventory */}
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney color="primary" />
                Pricing, Inventory & Supplier
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Purchase Rate (PKR)"
                    name="purchaseRate"
                    type="number"
                    value={formData.purchaseRate}
                    onChange={handleChange}
                    error={!!errors.purchaseRate}
                    helperText={errors.purchaseRate || "The acquisition cost from supplier"}
                    InputProps={{ startAdornment: 'PKR ' }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Selling Price (PKR)"
                    name="sellingPrice"
                    type="number"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    error={!!errors.sellingPrice}
                    helperText={errors.sellingPrice || "The customer showroom price"}
                    InputProps={{ startAdornment: 'PKR ' }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    error={!!errors.stock}
                    helperText={errors.stock}
                    inputProps={{ min: 0 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                      error={!!errors.status}
                    >
                      {Object.values(CAR_STATUS).map(status => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Linked Supplier</InputLabel>
                    <Select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      label="Linked Supplier"
                      error={!!errors.supplierId}
                    >
                      {suppliers.map(supplier => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.companyName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Section 3: Available Colors */}
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1, color: '#071321' }}>
                Available Colors
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {CAR_COLORS.map(color => {
                  const isSelected = formData.availableColors.includes(color);
                  return (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => handleColorToggle(color)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer', fontWeight: isSelected ? 700 : 500 }}
                    />
                  );
                })}
              </Box>
              {errors.availableColors && (
                <Typography variant="caption" color="error">
                  {errors.availableColors}
                </Typography>
              )}

              {/* Section 4: Image URLs */}
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1, color: '#071321' }}>
                Vehicle Gallery Images
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {formData.images.map((image, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Image URL #${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.images.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ minWidth: 90 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddImage}
                sx={{ mt: 0.5, borderRadius: 2 }}
              >
                + Add Another Image URL
              </Button>

              {/* Section 5: Description */}
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1, color: '#071321' }}>
                Vehicle Description & Feature Highlights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={3.5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description of vehicle highlights, warranty, luxury packages..."
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`${basePath}/cars`)}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ borderRadius: 2, px: 4, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
                >
                  {loading ? 'Saving...' : (isEdit ? 'Update Vehicle Record' : 'Save Vehicle to Inventory')}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Side Card: Real-time Profit Preview */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', mb: 3, bgcolor: '#ffffff' }} elevation={0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#071321', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                Live Business Calculations
              </Typography>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F8F9FA', mb: 2 }}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Selling Price
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0' }}>
                  {formatCurrency(numSelling)}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F8F9FA', mb: 2 }}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Purchase Rate
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4B5563' }}>
                  {formatCurrency(numPurchase)}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: isLoss ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', mb: 2 }}>
                <Typography variant="caption" color="textSecondary" display="block">
                  Gross Profit per Unit
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: isLoss ? '#DC2626' : '#059669' }}>
                  {formatCurrency(liveProfit)}
                </Typography>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F8F9FA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Profit Margin:
                </Typography>
                <Chip
                  label={`${liveMargin}%`}
                  color={liveMargin >= 15 ? 'success' : liveMargin >= 10 ? 'warning' : 'default'}
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Paper>

            {/* Live Image Preview Card */}
            {formData.images?.[0] && (
              <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Main Image Preview
                </Typography>
                <Box
                  component="img"
                  src={formData.images[0]}
                  alt="Vehicle Preview"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Invalid+Image+URL'; }}
                  sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2 }}
                />
              </Paper>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddCar;
