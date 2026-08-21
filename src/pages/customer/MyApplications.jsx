import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Divider,
  IconButton
} from '@mui/material';
import {
  Assignment,
  DirectionsCar,
  Visibility,
  Print,
  Close,
  CheckCircle,
  Schedule,
  Cancel
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ApplicationStatus from '../../components/applications/ApplicationStatus';
import EmptyState from '../../components/common/EmptyState';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/formatters';
import './MyApplications.css';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadUserApplications();
  }, [user]);

  const loadUserApplications = () => {
    const allApps = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
    // Prefer the immutable account ID; email keeps older seeded applications compatible.
    const userApps = (allApps || []).filter(app => app && (
      app.customerUserId === user?.id ||
      (!app.customerUserId && app.email && app.email.toLowerCase() === user?.email?.toLowerCase())
    ));
    setApplications(userApps);
  };

  const handleViewDetails = (app) => {
    if (!app) return;
    setSelectedApp(app);
    setDetailsOpen(true);
  };

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 0;
      case 'approved': return 1;
      case 'reserved': return 2;
      case 'completed': return 3;
      case 'rejected': return 1;
      default: return 0;
    }
  };

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  const steps = ['Application Submitted', 'Staff Verification & Approval', 'Deposit & Holding Bay Reservation', 'Delivered & Completed'];

  return (
    <div className="my-applications-page" style={{ width: '100%' }}>
      <PageHeader
        title="My Vehicle Applications & Orders"
        subtitle="Track real-time approval status, holding reservations, and delivery milestones"
        action={
          <Button
            variant="contained"
            startIcon={<DirectionsCar />}
            onClick={() => navigate('/customer/showroom')}
            sx={{ borderRadius: 2.5, fontWeight: 700, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
          >
            Explore Showroom
          </Button>
        }
      />

      {/* Applications List */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        {applications.length > 0 ? (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Requested Vehicle</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Chosen Color</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Delivery City</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Current Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app) => (
                  <TableRow 
                    key={app.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0', py: 2, px: 2.5, fontSize: '0.9rem' }}>
                      {app.id}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321', fontSize: '0.92rem' }}>
                        {app.selectedCar}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip label={app.selectedColor} size="small" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, fontWeight: 600 }}>{app.city}</TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                        {formatRelativeTime(app.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <ApplicationStatus status={app.status} />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(app)}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          fontWeight: 700, 
                          px: 2,
                          background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' 
                        }}
                      >
                        Track Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6 }}>
            <EmptyState
              message="You haven't submitted any car purchase applications yet."
              action={() => navigate('/customer/showroom')}
              actionLabel="Browse Available Cars"
            />
          </Box>
        )}
      </Paper>

      {/* Application Details & Stepper Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #071321 0%, #1565C0 100%)',
          color: 'white',
          py: 2.5,
          px: 3.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Assignment />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Order Tracking — {selectedApp?.id}
            </Typography>
          </Box>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3.5 }}>
          {selectedApp && (
            <Box>
              {/* Stepper Visualizer */}
              <Box sx={{ py: 3, mb: 3.5, bgcolor: '#F8F9FA', borderRadius: 3, px: 2 }}>
                <Stepper activeStep={getStepIndex(selectedApp.status)} alternativeLabel>
                  {steps.map((label, index) => {
                    const isRejected = selectedApp.status === 'rejected' && index === 1;
                    return (
                      <Step key={label} completed={getStepIndex(selectedApp.status) > index}>
                        <StepLabel error={isRejected}>
                          {isRejected ? 'Application Rejected' : label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>

              {/* Order Info Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Vehicle Model</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedApp.selectedCar}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Selected Color</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedApp.selectedColor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Applicant Name</Typography>
                  <Typography variant="body1">{selectedApp.fullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Cell Number</Typography>
                  <Typography variant="body1">{selectedApp.cellNumber}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Registered CNIC</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{selectedApp.cnic}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" display="block">Delivery City & Address</Typography>
                  <Typography variant="body1">{selectedApp.address}, {selectedApp.city}</Typography>
                </Grid>
                {selectedApp.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary" display="block">Special Instructions</Typography>
                    <Typography variant="body2" sx={{ bgcolor: '#F8F9FA', p: 2, borderRadius: 2 }}>{selectedApp.notes}</Typography>
                  </Grid>
                )}
              </Grid>

              {/* Status History Audit */}
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 4, mb: 1.5, color: '#071321' }}>
                Status Progression Log
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {selectedApp.statusHistory?.map((hist, idx) => (
                  <Box key={idx} sx={{ p: 2, borderRadius: 2.5, bgcolor: '#F8F9FA', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <ApplicationStatus status={hist.status} />
                      <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                        {safeFormatDate(hist.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: '#374151', fontWeight: 500 }}>
                      {hist.notes}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: '#F8F9FA' }}>
          <Button onClick={() => window.print()} startIcon={<Print />}>
            Print Receipt
          </Button>
          <Button onClick={() => setDetailsOpen(false)} variant="contained" sx={{ px: 3 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyApplications;
