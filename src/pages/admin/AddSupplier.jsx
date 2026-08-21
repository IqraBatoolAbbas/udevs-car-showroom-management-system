import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import { ArrowBack, Save, Business, ContactPhone } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { validateSupplierForm } from '../../utils/validators';
import { SUPPLIER_STATUS, PAKISTAN_CITIES, ROLES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const AddSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    cnic: '',
    ntn: '',
    status: SUPPLIER_STATUS.ACTIVE,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadSupplierData();
    }
  }, [id, isEdit]);

  const loadSupplierData = () => {
    const suppliers = localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []);
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
      setFormData(supplier);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateSupplierForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const suppliers = localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []);

      const supplierData = {
        ...formData,
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase()
      };

      if (isEdit) {
        const index = suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          suppliers[index] = { ...suppliers[index], ...supplierData, updatedAt: new Date().toISOString() };
          localStorageService.logActivity({
            type: 'update',
            entity: 'supplier',
            entityId: id,
            description: `Updated supplier details: ${supplierData.companyName} (${id})`
          });
        }
      } else {
        supplierData.id = localStorageService.generateId('SUP');
        supplierData.createdAt = new Date().toISOString();
        suppliers.push(supplierData);
        localStorageService.logActivity({
          type: 'create',
          entity: 'supplier',
          entityId: supplierData.id,
          description: `Registered new supplier: ${supplierData.companyName} (${supplierData.id})`
        });
      }

      localStorageService.setData(STORAGE_KEYS.SUPPLIERS, suppliers);
      const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
      navigate(`${basePath}/suppliers`);
    } catch (error) {
      console.error('Error saving supplier:', error);
      setErrors({ submit: 'An error occurred while saving supplier data.' });
    } finally {
      setLoading(false);
    }
  };

  const getBackPath = () => {
    return user?.role === ROLES.INVENTORY ? '/inventory/suppliers' : '/admin/suppliers';
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? `Edit Supplier (${id})` : 'Register New Supplier'}
        subtitle={isEdit ? 'Update distributor contact and legal information' : 'Add an automotive supplier/distributor into the management master'}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(getBackPath())}
            sx={{ borderRadius: 2 }}
          >
            Back to Suppliers
          </Button>
        }
      />

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.submit}
        </Alert>
      )}

      <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company & Contact Master */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" />
                Company Master Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company / Supplier Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                placeholder="e.g. Toyota Indus Motor Company"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Primary Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                error={!!errors.contactPerson}
                helperText={errors.contactPerson}
                placeholder="e.g. Ahmed Khan (Account Manager)"
                required
              />
            </Grid>

            {/* Contact Channels */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactPhone color="primary" />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Official Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="sales@toyota-indus.com"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Official Phone / Cell"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || "e.g. +92-42-111-46632 or 0300-1234567"}
                placeholder="+92-XXX-XXXXXXX"
                required
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Office / Facility Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                placeholder="Plot 7, Sector 23, Industrial Area"
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  label="City"
                  error={!!errors.city}
                >
                  {PAKISTAN_CITIES.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Legal & Tax Master */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1, color: '#071321' }}>
                Legal & Tax Verification (Optional)
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Representative CNIC"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
                helperText="National Identity Card number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="National Tax Number (NTN)"
                name="ntn"
                value={formData.ntn}
                onChange={handleChange}
                placeholder="XXXXXXX-X"
                helperText="FBR Business NTN"
              />
            </Grid>

            {/* Status & Business Notes */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1, color: '#071321' }}>
                Operational Status & Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Supplier Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Supplier Status"
                >
                  {Object.values(SUPPLIER_STATUS).map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Supplier Contract & Operations Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Authorized dealership terms, delivery schedule SLAs, credit arrangements..."
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(getBackPath())}
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
                  {loading ? 'Saving...' : (isEdit ? 'Update Supplier Record' : 'Register Supplier')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddSupplier;
