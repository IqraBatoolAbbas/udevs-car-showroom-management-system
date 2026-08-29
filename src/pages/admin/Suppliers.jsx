import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Business,
  Email,
  Phone,
  LocationOn,
  Download,
  DirectionsCar,
  Search
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { maskSensitive } from '../../utils/formatters';
import { selectAuthUser } from '../../redux/auth/authSlice';
import { selectSuppliers, removeSupplier } from '../../redux/suppliers/suppliersSlice';
import { selectCars } from '../../redux/cars/carsSlice';
import localStorageService from '../../services/localStorageService';
import { ROLES } from '../../utils/constants';

const Suppliers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const suppliers = useSelector(selectSuppliers);
  const cars = useSelector(selectCars);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, supplier: null });
  const [errorMessage, setErrorMessage] = useState('');

  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      supplier.companyName?.toLowerCase().includes(term) ||
      supplier.contactPerson?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term) ||
      supplier.city?.toLowerCase().includes(term) ||
      supplier.id?.toLowerCase().includes(term)
    );
  });

  const handleAddSupplier = () => {
    const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
    navigate(`${basePath}/suppliers/add`);
  };

  const handleEditSupplier = (supplier) => {
    const basePath = user?.role === ROLES.INVENTORY ? '/inventory' : '/admin';
    navigate(`${basePath}/suppliers/edit/${supplier.id}`);
  };

  const handleDeleteClick = (supplier) => {
    setErrorMessage('');
    const linkedCars = cars.filter(car => car.supplierId === supplier.id);
    if (linkedCars.length > 0) {
      setErrorMessage(`Cannot delete "${supplier.companyName}". There are currently ${linkedCars.length} car record(s) linked to this supplier. Please reassign or delete the vehicles first.`);
      return;
    }
    setDeleteDialog({ open: true, supplier });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.supplier) {
      dispatch(removeSupplier(deleteDialog.supplier.id));
      localStorageService.logActivity({
        type: 'delete',
        entity: 'supplier',
        entityId: deleteDialog.supplier.id,
        description: `Deleted supplier record: ${deleteDialog.supplier.companyName} (${deleteDialog.supplier.id})`
      });
      setDeleteDialog({ open: false, supplier: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, supplier: null });
  };

  const getCarCount = (supplierId) => {
    return cars.filter(car => car.supplierId === supplierId).length;
  };

  const handleExportCSV = () => {
    const headers = ['Supplier ID', 'Company Name', 'Contact Person', 'Email', 'Phone', 'City', 'CNIC', 'NTN', 'Linked Cars', 'Status'];
    const rows = filteredSuppliers.map(s => [
      s.id,
      s.companyName,
      s.contactPerson,
      s.email,
      s.phone,
      s.city,
      s.cnic || 'N/A',
      s.ntn || 'N/A',
      getCarCount(s.id),
      s.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suppliers-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader
        title="Suppliers & Cost Partners"
        subtitle="Manage automobile distribution partners, purchase costs, and contact master"
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
              onClick={handleAddSupplier}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add Supplier
            </Button>
          </Box>
        }
      />

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 3, borderRadius: 2.5 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search suppliers by company name, contact person, email, city, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1.5, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      {/* Suppliers Table */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        {filteredSuppliers.length > 0 ? (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Company & Supplier ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Contact Channels</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>City & Location</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>CNIC / NTN (Masked)</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Linked Cars</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow 
                    key={supplier.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321', fontSize: '0.92rem' }}>
                          {supplier.companyName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#1565C0', fontFamily: 'monospace', fontWeight: 700 }}>
                          {supplier.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {supplier.contactPerson}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Email sx={{ fontSize: 15, color: '#1565C0' }} />
                          <Typography variant="caption" sx={{ color: '#374151', fontWeight: 500 }}>{supplier.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Phone sx={{ fontSize: 15, color: '#10B981' }} />
                          <Typography variant="caption" sx={{ color: '#374151', fontWeight: 500 }}>{supplier.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#F59E0B' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {supplier.city}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        CNIC: {supplier.cnic ? maskSensitive(supplier.cnic, 3) : 'N/A'}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        NTN: {supplier.ntn ? maskSensitive(supplier.ntn, 2) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        icon={<DirectionsCar fontSize="small" />}
                        label={`${getCarCount(supplier.id)} Models`}
                        size="small"
                        sx={{
                          bgcolor: getCarCount(supplier.id) > 0 ? 'rgba(21, 101, 192, 0.12)' : 'rgba(0,0,0,0.06)',
                          color: getCarCount(supplier.id) > 0 ? '#1565C0' : '#6B7280',
                          fontWeight: 700
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <StatusChip status={supplier.status || 'active'} />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                      <Tooltip title="Edit Supplier">
                        <IconButton
                          size="small"
                          onClick={() => handleEditSupplier(supplier)}
                          color="primary"
                          sx={{ '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.12)' } }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Supplier">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(supplier)}
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
              message={suppliers.length === 0 ? "No suppliers registered yet." : "No suppliers match your search query."}
              action={suppliers.length === 0 ? handleAddSupplier : () => setSearchTerm('')}
              actionLabel={suppliers.length === 0 ? "Add First Supplier" : "Clear Search"}
            />
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier Partner"
        message={`Are you sure you want to remove ${deleteDialog.supplier?.companyName} (${deleteDialog.supplier?.id}) from suppliers?`}
      />
    </Box>
  );
};

export default Suppliers;
