import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import { PersonAdd, Email, Phone, LocationOn, Close, Download, Search, Assignment, Person } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService from '../../services/localStorageService';
import { selectCustomers, addCustomer } from '../../redux/customers/customersSlice';
import { selectApplications } from '../../redux/applications/applicationsSlice';
import { validateCustomerForm } from '../../utils/validators';
import { PAKISTAN_CITIES } from '../../utils/constants';
import './Customers.css';

const Customers = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const applications = useSelector(selectApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    city: 'Lahore',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const filteredCustomers = (customers || []).filter(customer => {
    if (!customer) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(term)) ||
      (customer.email && customer.email.toLowerCase().includes(term)) ||
      (customer.phone && customer.phone.toLowerCase().includes(term)) ||
      (customer.city && customer.city.toLowerCase().includes(term)) ||
      (customer.id && customer.id.toLowerCase().includes(term))
    );
  });

  const handleViewDetails = (customer) => {
    if (!customer) return;
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateCustomerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newCustomer = {
      id: localStorageService.generateId('CUST'),
      ...formData,
      createdAt: new Date().toISOString()
    };

    dispatch(addCustomer(newCustomer));
    localStorageService.logActivity({
      type: 'create',
      entity: 'customer',
      entityId: newCustomer.id,
      description: `Registered new customer: ${newCustomer.name} (${newCustomer.id})`
    });

    setAddDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      cnic: '',
      address: '',
      city: 'Lahore',
      status: 'active'
    });
  };

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Full Name', 'Email', 'Phone', 'CNIC', 'City', 'Address', 'Status', 'Registered Date'];
    const rows = filteredCustomers.map(c => [
      c.id || '',
      c.name || '',
      c.email || '',
      c.phone || '',
      c.cnic || '',
      c.city || '',
      c.address || '',
      c.status || 'active',
      c.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getCustomerApplications = (email) => {
    if (!email) return [];
    return (applications || []).filter(app => app && app.email && app.email.toLowerCase() === email.toLowerCase());
  };

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="customers-page">
      <PageHeader
        title="Customer Directory & CRM"
        subtitle="Manage customer profiles, purchase history, and application tracking"
        action={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportCSV}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5 }}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setAddDialogOpen(true)}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add Customer
            </Button>
          </Box>
        }
      />

      {/* Customer KPIs */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(21, 101, 192, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565C0', mb: 0.5 }}>
                {customers.length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Total Registered Clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mb: 0.5 }}>
                {customers.filter(c => c && c.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Active Accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mb: 0.5 }}>
                {customers.filter(c => c && c.city === 'Lahore').length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Lahore Region
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(0, 172, 193, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#00ACC1', mb: 0.5 }}>
                {customers.filter(c => c && (c.city === 'Karachi' || c.city === 'Islamabad')).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Karachi & Islamabad
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search customers by name, email, phone, city, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1.5, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      {/* Customers Table */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        <TableContainer>
          <Table size="medium">
            <TableHead sx={{ bgcolor: '#F3F4F6' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Customer ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Client Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>City & Location</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Orders Count</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const customerOrders = getCustomerApplications(customer?.email);
                return (
                  <TableRow 
                    key={customer.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0' }}>
                        {customer.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321' }}>
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        CNIC: {customer.cnic || 'Unverified'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Email sx={{ fontSize: 15, color: '#1565C0' }} />
                          <Typography variant="caption" sx={{ color: '#374151', fontWeight: 500 }}>{customer.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Phone sx={{ fontSize: 15, color: '#10B981' }} />
                          <Typography variant="caption" sx={{ color: '#374151', fontWeight: 500 }}>{customer.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#F59E0B' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {customer.city}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        icon={<Assignment fontSize="small" />}
                        label={`${customerOrders.length} Applications`}
                        size="small"
                        sx={{
                          bgcolor: customerOrders.length > 0 ? 'rgba(0, 172, 193, 0.12)' : 'rgba(0,0,0,0.05)',
                          color: customerOrders.length > 0 ? '#00ACC1' : '#6B7280',
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        label={customer.status === 'active' ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: customer.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: customer.status === 'active' ? '#059669' : '#DC2626',
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleViewDetails(customer)}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          fontWeight: 700, 
                          px: 2,
                          background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' 
                        }}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Customer Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #071321 0%, #1565C0 100%)',
          color: 'white',
          py: 2.5,
          px: 3.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Person />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Customer CRM Profile — {selectedCustomer?.name || 'Client Details'}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetails} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3.5 }}>
          {selectedCustomer ? (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Customer ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0' }}>
                    {selectedCustomer.id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Account Status</Typography>
                  <Chip
                    label={selectedCustomer.status === 'active' ? 'Active Account' : 'Inactive'}
                    size="small"
                    color={selectedCustomer.status === 'active' ? 'success' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Email Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedCustomer.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Phone / Cell</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedCustomer.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">National Identity (CNIC)</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedCustomer.cnic || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">City & Region</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedCustomer.city || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary" display="block">Residential Address</Typography>
                  <Typography variant="body1">{selectedCustomer.address || 'Address not registered'}</Typography>
                </Grid>
              </Grid>

              {/* Linked Applications History */}
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 4, mb: 1.5, color: '#071321' }}>
                Application & Booking History ({getCustomerApplications(selectedCustomer.email).length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {getCustomerApplications(selectedCustomer.email).length > 0 ? (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2.5 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, py: 1.5 }}>App ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Vehicle</TableCell>
                        <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Color</TableCell>
                        <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, py: 1.5 }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCustomerApplications(selectedCustomer.email).map((app, index) => (
                        <TableRow key={app.id || `${selectedCustomer.id}-application-${index}`}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#1565C0', py: 1.5 }}>{app.id || 'N/A'}</TableCell>
                          <TableCell sx={{ fontWeight: 600, py: 1.5 }}>{app.selectedCar || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 1.5 }}>{app.selectedColor || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Chip label={app.status || 'pending'} size="small" sx={{ textTransform: 'capitalize', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>{safeFormatDate(app.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ py: 3, textAlign: 'center' }}>
                  No vehicle applications submitted by this customer yet.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">No customer selected.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
          <Button onClick={handleCloseDetails} variant="contained" sx={{ px: 3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Modal */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, py: 2.5, px: 3 }}>
          Add New Customer Record
        </DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={!!errors.phone}
                  helperText={errors.phone || "+92-XXX-XXXXXXX"}
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
                  error={!!errors.cnic}
                  helperText={errors.cnic}
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
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={!!errors.address}
                  helperText={errors.address}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ px: 3 }}>Create Customer</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Customers;
