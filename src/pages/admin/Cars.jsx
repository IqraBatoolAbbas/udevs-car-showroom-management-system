import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Download,
  Visibility
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { formatCurrency, formatCarName } from '../../utils/formatters';
import { CAR_STATUS, FUEL_TYPES, TRANSMISSION_TYPES, CAR_COLORS, ROLES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const Cars = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, car: null });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, searchTerm, statusFilter, fuelFilter, supplierFilter, colorFilter, sortBy]);

  const loadData = () => {
    const carsData = localStorageService.getData(STORAGE_KEYS.CARS, []);
    const suppliersData = localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []);
    setCars(carsData);
    setSuppliers(suppliersData);
  };

  const applyFilters = () => {
    let filtered = [...cars];

    // Search by Make, Model, Variant, ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.variant?.toLowerCase().includes(term) ||
        car.id?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(car => car.status === statusFilter);
    }

    // Fuel filter
    if (fuelFilter) {
      filtered = filtered.filter(car => car.fuel === fuelFilter);
    }

    // Supplier filter
    if (supplierFilter) {
      filtered = filtered.filter(car => car.supplierId === supplierFilter);
    }

    // Color filter
    if (colorFilter) {
      filtered = filtered.filter(car => car.availableColors?.includes(colorFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.sellingPrice - b.sellingPrice;
        case 'price_desc':
          return b.sellingPrice - a.sellingPrice;
        case 'profit_desc':
          return (b.profit || 0) - (a.profit || 0);
        case 'margin_desc':
          return (b.profitMargin || 0) - (a.profitMargin || 0);
        case 'year_asc':
          return a.year - b.year;
        case 'year_desc':
          return b.year - a.year;
        case 'stock_asc':
          return a.stock - b.stock;
        case 'stock_desc':
          return b.stock - a.stock;
        case 'name':
        default:
          return formatCarName(a).localeCompare(formatCarName(b));
      }
    });

    setFilteredCars(filtered);
  };

  const handleAddCar = () => {
    if (user?.role === ROLES.SALES) {
      navigate('/sales/showroom');
    } else {
      const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
      navigate(`${basePath}/cars/add`);
    }
  };

  const handleEditCar = (car) => {
    const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
    navigate(`${basePath}/cars/edit/${car.id}`);
  };

  const handleViewCar = (car) => {
    const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
    navigate(`${basePath}/cars/${car.id}`);
  };

  const handleDeleteClick = (car) => {
    setDeleteDialog({ open: true, car });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.car) {
      const updatedCars = cars.filter(car => car.id !== deleteDialog.car.id);
      localStorageService.setData(STORAGE_KEYS.CARS, updatedCars);
      localStorageService.logActivity({
        type: 'delete',
        entity: 'car',
        entityId: deleteDialog.car.id,
        description: `Deleted vehicle ${formatCarName(deleteDialog.car)} (${deleteDialog.car.id})`
      });
      setCars(updatedCars);
      setDeleteDialog({ open: false, car: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, car: null });
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.companyName || 'Unlinked Supplier';
  };

  const handleExportCSV = () => {
    const headers = ['Car ID', 'Make', 'Model', 'Year', 'Variant', 'Supplier', 'Purchase Rate (PKR)', 'Selling Price (PKR)', 'Profit (PKR)', 'Margin %', 'Stock', 'Fuel', 'Transmission', 'Status'];
    const rows = filteredCars.map(c => [
      c.id,
      c.make,
      c.model,
      c.year,
      c.variant,
      getSupplierName(c.supplierId),
      c.purchaseRate,
      c.sellingPrice,
      c.profit,
      c.profitMargin,
      c.stock,
      c.fuel,
      c.transmission,
      c.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getMarginBadge = (margin) => {
    if (margin >= 15) {
      return <Chip label={`${margin}% (High)`} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#059669', fontWeight: 800, fontSize: '0.72rem' }} />;
    }
    if (margin >= 10) {
      return <Chip label={`${margin}% (Med)`} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#D97706', fontWeight: 800, fontSize: '0.72rem' }} />;
    }
    return <Chip label={`${margin}% (Low)`} size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#DC2626', fontWeight: 800, fontSize: '0.72rem' }} />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader
        title="Vehicle Inventory & Cars CRUD"
        subtitle="Manage showroom inventory, purchase costs, selling prices, and suppliers"
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
              startIcon={<Add />}
              onClick={handleAddCar}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add New Car
            </Button>
          </Box>
        }
      />

      {/* Advanced Filter Toolbar */}
      <Paper sx={{ p: 3, mb: 3.5, borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }} elevation={0}>
        <Grid container spacing={2.5} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by make, model, variant, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(CAR_STATUS).map(status => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Supplier</InputLabel>
              <Select
                value={supplierFilter}
                label="Supplier"
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <MenuItem value="">All Suppliers</MenuItem>
                {suppliers.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.companyName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Fuel</InputLabel>
              <Select
                value={fuelFilter}
                label="Fuel"
                onChange={(e) => setFuelFilter(e.target.value)}
              >
                <MenuItem value="">All Fuels</MenuItem>
                {FUEL_TYPES.map(fuel => (
                  <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Color</InputLabel>
              <Select
                value={colorFilter}
                label="Color"
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <MenuItem value="">All Colors</MenuItem>
                {CAR_COLORS.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="profit_desc">Profit: Highest First</MenuItem>
                <MenuItem value="margin_desc">Margin %: Highest First</MenuItem>
                <MenuItem value="year_desc">Year: Newest First</MenuItem>
                <MenuItem value="stock_asc">Stock: Low to High</MenuItem>
                <MenuItem value="stock_desc">Stock: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cars Master Table */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        {filteredCars.length > 0 ? (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Vehicle Information</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Purchase Rate</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Selling Price</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Gross Profit & Margin</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow 
                    key={car.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={car.images?.[0] || 'https://via.placeholder.com/100x70?text=No+Image'}
                          alt={formatCarName(car)}
                          sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321', fontSize: '0.92rem' }}>
                            {formatCarName(car)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                            {car.fuel} • {car.transmission} • ID: {car.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getSupplierName(car.supplierId)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#4B5563', fontWeight: 600 }}>
                        {formatCurrency(car.purchaseRate)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1565C0', fontSize: '0.95rem' }}>
                        {formatCurrency(car.sellingPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669', mb: 0.5 }}>
                        +{formatCurrency(car.profit || (car.sellingPrice - car.purchaseRate))}
                      </Typography>
                      {getMarginBadge(car.profitMargin || 0)}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        label={`${car.stock} Units`}
                        size="small"
                        sx={{
                          bgcolor: car.stock <= 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: car.stock <= 3 ? '#DC2626' : '#059669',
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <StatusChip status={car.status} />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewCar(car)}
                          color="info"
                          sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.12)' } }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Vehicle">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCar(car)}
                          color="primary"
                          sx={{ '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.12)' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Vehicle">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(car)}
                          color="error"
                          sx={{ '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.12)' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6 }}>
            <EmptyState
              message={cars.length === 0 ? "No cars recorded in the inventory." : "No vehicles match the selected search & filter criteria."}
              action={cars.length === 0 ? handleAddCar : () => {
                setSearchTerm('');
                setStatusFilter('');
                setFuelFilter('');
                setSupplierFilter('');
                setColorFilter('');
                setSortBy('name');
              }}
              actionLabel={cars.length === 0 ? "Add First Car" : "Clear All Filters"}
            />
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Vehicle Deletion"
        message={`Are you sure you want to permanently delete "${deleteDialog.car ? formatCarName(deleteDialog.car) : ''}" (${deleteDialog.car?.id})? This will update LocalStorage instantly.`}
      />
    </Box>
  );
};

export default Cars;
