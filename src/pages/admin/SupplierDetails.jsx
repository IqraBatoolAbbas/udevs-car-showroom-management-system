import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Business,
  Email,
  Phone,
  LocationOn,
  Badge,
  DirectionsCar
} from '@mui/icons-material';

import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import { suppliersApi } from '../../services/showroomApi';
import { selectAuthUser } from '../../redux/auth/authSlice';
import { useSelector } from 'react-redux';
import { ROLES } from '../../utils/constants';

const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await suppliersApi.get(id);
        setSupplier(data);
      } catch (err) {
        console.error('Error loading supplier:', err);

        setError(
          err.response?.data?.message ||
          'Unable to load supplier profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSupplier();
  }, [id]);

  const getBackPath = () => {
    return user?.role === ROLES.INVENTORY
      ? '/inventory/suppliers'
      : '/admin/suppliers';
  };

  const getEditPath = () => {
    return user?.role === ROLES.INVENTORY
      ? `/inventory/suppliers/edit/${id}`
      : `/admin/suppliers/edit/${id}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading supplier profile...</Typography>
      </Box>
    );
  }

  if (error || !supplier) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Supplier not found.'}
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(getBackPath())}
        >
          Back to Suppliers
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Supplier Profile"
        subtitle={`Complete supplier information — ${supplier.companyName}`}
        action={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(getBackPath())}
              sx={{ borderRadius: 2 }}
            >
              Back to Suppliers
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate(getEditPath())}
              sx={{
                borderRadius: 2,
                background:
                  'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)'
              }}
            >
              Edit Supplier
            </Button>
          </Box>
        }
      />

      <Paper
        sx={{
          p: 3.5,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.06)'
        }}
        elevation={0}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Business color="primary" sx={{ fontSize: 42 }} />

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {supplier.companyName}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#1565C0',
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              >
                {supplier.id}
              </Typography>
            </Box>
          </Box>

          <StatusChip status={supplier.status || 'active'} />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Company Information */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Company Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Company / Supplier Name"
              value={supplier.companyName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Supplier ID"
              value={supplier.id}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Contact Person"
              value={supplier.contactPerson}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              label="Status"
              value={supplier.status || 'Active'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Contact Information */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Contact Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<Email />}
              label="Email"
              value={supplier.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<Phone />}
              label="Phone"
              value={supplier.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<LocationOn />}
              label="City"
              value={supplier.city}
            />
          </Grid>

          <Grid item xs={12}>
            <InfoItem
              icon={<LocationOn />}
              label="Office / Facility Address"
              value={supplier.address}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Legal Information */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Legal & Tax Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<Badge />}
              label="CNIC"
              value={supplier.cnic || 'Not provided'}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoItem
              icon={<Badge />}
              label="NTN"
              value={supplier.ntn || 'Not provided'}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Notes */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Contract & Operations Notes
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#FAFAFA'
          }}
        >
          <Typography color={supplier.notes ? 'text.primary' : 'text.secondary'}>
            {supplier.notes || 'No notes available.'}
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* Linked Cars */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DirectionsCar color="primary" />
          Linked Cars
        </Typography>

        <Chip
          icon={<DirectionsCar />}
          label="View linked vehicles from Cars module"
          variant="outlined"
        />
      </Paper>
    </Box>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 0.7,
        mb: 0.5
      }}
    >
      {icon}
      {label}
    </Typography>

    <Typography
      variant="body1"
      sx={{ fontWeight: 600 }}
    >
      {value || 'Not provided'}
    </Typography>
  </Box>
);

export default SupplierDetails;