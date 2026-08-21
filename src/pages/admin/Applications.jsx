import { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Assignment, Download, Search, Edit, History, Close } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ApplicationStatus from '../../components/applications/ApplicationStatus';
import EmptyState from '../../components/common/EmptyState';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { formatRelativeTime, formatCarName, formatCurrency } from '../../utils/formatters';
import { APPLICATION_STATUS } from '../../utils/constants';
import './Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [cars, setCars] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusDialog, setStatusDialog] = useState({ open: false, application: null, newStatus: '' });
  const [historyDialog, setHistoryDialog] = useState({ open: false, application: null });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const applicationsData = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
    const carsData = localStorageService.getData(STORAGE_KEYS.CARS, []);
    setApplications(applicationsData);
    setCars(carsData);
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      app.id?.toLowerCase().includes(term) ||
      app.fullName?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.selectedCar?.toLowerCase().includes(term) ||
      app.city?.toLowerCase().includes(term)
    );
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = (application) => {
    setStatusDialog({ open: true, application, newStatus: application.status });
    setNotes('');
  };

  const handleStatusConfirm = () => {
    if (statusDialog.application) {
      const updatedApplications = applications.map(app => {
        if (app.id === statusDialog.application.id) {
          return {
            ...app,
            status: statusDialog.newStatus,
            statusHistory: [
              ...(app.statusHistory || []),
              {
                status: statusDialog.newStatus,
                timestamp: new Date().toISOString(),
                notes: notes || `Status changed to ${statusDialog.newStatus}`
              }
            ],
            updatedAt: new Date().toISOString()
          };
        }
        return app;
      });

      localStorageService.setData(STORAGE_KEYS.APPLICATIONS, updatedApplications);
      
      // Log activity
      localStorageService.logActivity({
        type: 'status_change',
        entity: 'application',
        entityId: statusDialog.application.id,
        description: `Updated application ${statusDialog.application.id} status to ${statusDialog.newStatus.toUpperCase()}`
      });

      // Add Notification
      localStorageService.addNotification({
        title: `Order Status Updated: ${statusDialog.newStatus.toUpperCase()}`,
        message: `Application ${statusDialog.application.id} for ${statusDialog.application.fullName} is now ${statusDialog.newStatus}.`,
        type: statusDialog.newStatus === 'completed' || statusDialog.newStatus === 'approved' ? 'success' : statusDialog.newStatus === 'rejected' ? 'error' : 'info',
        targetRole: ['customer'],
        targetUserId: statusDialog.application.customerUserId || null
      });

      setApplications(updatedApplications);
      setStatusDialog({ open: false, application: null, newStatus: '' });
      setNotes('');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Application ID', 'Customer Name', 'Email', 'Phone', 'CNIC', 'City', 'Car Selected', 'Color', 'Status', 'Date Applied'];
    const rows = filteredApplications.map(a => [
      a.id,
      a.fullName,
      a.email,
      a.cellNumber,
      a.cnic,
      a.city,
      a.selectedCar,
      a.selectedColor,
      a.status,
      a.createdAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusCount = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  return (
    <div className="applications-page">
      <PageHeader
        title="Customer Applications & Orders"
        subtitle="Review, approve, reserve, and manage customer booking applications"
        action={
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5 }}
          >
            Export CSV
          </Button>
        }
      />

      {/* Status Overview Cards */}
      <Grid container spacing={2.5} className="status-overview" sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter(APPLICATION_STATUS.PENDING)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count warning">
              {getStatusCount(APPLICATION_STATUS.PENDING)}
            </Typography>
            <Typography variant="caption" className="status-label">
              Pending
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter(APPLICATION_STATUS.APPROVED)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count info">
              {getStatusCount(APPLICATION_STATUS.APPROVED)}
            </Typography>
            <Typography variant="caption" className="status-label">
              Approved
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter(APPLICATION_STATUS.RESERVED)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count secondary">
              {getStatusCount(APPLICATION_STATUS.RESERVED)}
            </Typography>
            <Typography variant="caption" className="status-label">
              Reserved
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter(APPLICATION_STATUS.COMPLETED)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count success">
              {getStatusCount(APPLICATION_STATUS.COMPLETED)}
            </Typography>
            <Typography variant="caption" className="status-label">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter(APPLICATION_STATUS.REJECTED)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count error">
              {getStatusCount(APPLICATION_STATUS.REJECTED)}
            </Typography>
            <Typography variant="caption" className="status-label">
              Rejected
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper className="status-card" elevation={0} onClick={() => setStatusFilter('')} sx={{ cursor: 'pointer' }}>
            <Typography variant="h4" className="status-count primary">
              {applications.length}
            </Typography>
            <Typography variant="caption" className="status-label">
              All Orders
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Paper sx={{ p: 2.5, mb: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer name, email, phone, car, city, or application ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1.5, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses ({applications.length})</MenuItem>
                {Object.values(APPLICATION_STATUS).map(status => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({getStatusCount(status)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Applications Table */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        {filteredApplications.length > 0 ? (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Application ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Customer Name & Contact</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Selected Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Applied</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow 
                    key={application.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0' }}>
                        {application.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321', fontSize: '0.92rem' }}>
                        {application.fullName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ fontWeight: 500 }}>
                        {application.email} • {application.cellNumber}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        CNIC: {application.cnic} • {application.city}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                        {application.selectedCar}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        label={application.selectedColor}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>
                        {formatRelativeTime(application.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <ApplicationStatus status={application.status} />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleStatusUpdate(application)}
                          sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontWeight: 700, 
                            fontSize: '0.78rem',
                            px: 1.8,
                            background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)'
                          }}
                        >
                          Update Status
                        </Button>
                        <Tooltip title="View Status History">
                          <IconButton
                            size="small"
                            onClick={() => setHistoryDialog({ open: true, application })}
                            color="info"
                            sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.12)' } }}
                          >
                            <History fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6 }}>
            <EmptyState
              message={applications.length === 0 ? "No car applications submitted yet." : "No applications match your search & filter criteria."}
              action={() => { setStatusFilter(''); setSearchTerm(''); }}
              actionLabel="Clear Filters"
            />
          </Box>
        )}
      </Paper>

      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialog.open} 
        onClose={() => setStatusDialog({ open: false, application: null, newStatus: '' })} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, py: 2.5, px: 3 }}>Update Application Workflow Status</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {statusDialog.application && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Application:</strong> {statusDialog.application.id}<br />
                  <strong>Customer:</strong> {statusDialog.application.fullName} ({statusDialog.application.email})<br />
                  <strong>Vehicle:</strong> {statusDialog.application.selectedCar} ({statusDialog.application.selectedColor})
                </Typography>
              </Alert>

              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputLabel>Workflow Status</InputLabel>
                <Select
                  value={statusDialog.newStatus}
                  label="Workflow Status"
                  onChange={(e) => setStatusDialog(prev => ({ ...prev, newStatus: e.target.value }))}
                >
                  {Object.values(APPLICATION_STATUS).map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Staff Internal Notes / Update Remarks"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for status transition, deposit received details, delivery notes..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
          <Button onClick={() => setStatusDialog({ open: false, application: null, newStatus: '' })}>
            Cancel
          </Button>
          <Button onClick={handleStatusConfirm} variant="contained" sx={{ px: 3, borderRadius: 2 }}>
            Save Status Transition
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status History Dialog */}
      <Dialog 
        open={historyDialog.open} 
        onClose={() => setHistoryDialog({ open: false, application: null })} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2.5, px: 3 }}>
          <span>Workflow History — {historyDialog.application?.id}</span>
          <IconButton onClick={() => setHistoryDialog({ open: false, application: null })}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 1 }}>
            {historyDialog.application?.statusHistory?.map((hist, idx) => (
              <Box key={idx} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, bgcolor: '#F8F9FA', border: '1px solid rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ApplicationStatus status={hist.status} />
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {new Date(hist.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#374151', mt: 1, fontWeight: 500 }}>
                  {hist.notes}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
          <Button onClick={() => setHistoryDialog({ open: false, application: null })} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Applications;
