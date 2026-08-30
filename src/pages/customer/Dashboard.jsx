import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Assignment,
  TrendingUp,
  ArrowForward,
  CheckCircle,
  CompareArrows,
  Favorite
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import CarCard from '../../components/cars/CarCard';
import CarCompareModal from '../../components/cars/CarCompareModal';
import { selectAuthUser } from '../../redux/auth/authSlice';
import { selectCars, selectWishlist, toggleWishlist } from '../../redux/cars/carsSlice';
import { selectApplications } from '../../redux/applications/applicationsSlice';
import { formatRelativeTime } from '../../utils/formatters';
import './Dashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const cars = useSelector(selectCars);
  const applications = useSelector(selectApplications);
  const favorites = useSelector(selectWishlist);
  const [stats, setStats] = useState({
    availableCars: 0,
    myApplications: 0,
    pendingApplications: 0
  });
  const [recentCars, setRecentCars] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [cars, applications, user]);

  const loadDashboardData = () => {
    const availableCars = cars.filter(car => car.status === 'available');
    setRecentCars(availableCars.slice(0, 3));

    // Get user's applications
    const userApplications = applications.filter(app => app.email === user?.email);
    setRecentApplications(userApplications.slice(0, 3));

    setStats({
      availableCars: availableCars.length,
      myApplications: userApplications.length,
      pendingApplications: userApplications.filter(app => app.status === 'pending').length
    });
  };

  const handleToggleFavorite = (car) => {
    dispatch(toggleWishlist(car.id));
  };

  const handleToggleCompare = (car) => {
    const exists = compareList.some(c => c.id === car.id);
    if (exists) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 vehicles simultaneously.');
        return;
      }
      setCompareList([...compareList, car]);
    }
  };

  const handleViewCarDetails = (car) => {
    navigate(`/customer/cars/${car.id}`);
  };

  const handleViewApplications = () => {
    navigate('/customer/applications');
  };

  const handleBrowseShowroom = () => {
    navigate('/customer/showroom');
  };

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563EB' };
      case 'reserved': return { bg: 'rgba(139, 92, 246, 0.15)', color: '#7C3AED' };
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#DC2626' };
      default: return { bg: 'rgba(245, 158, 11, 0.15)', color: '#D97706' };
    }
  };

  return (
    <Box className="customer-dashboard">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Valued Customer'}`}
        subtitle="Explore verified vehicles, submit booking applications, and track deliveries"
      />

      {/* Hero Welcome Banner */}
      <Paper 
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #071321 0%, #0d2745 50%, #1565C0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(7, 19, 33, 0.25)'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Chip 
              label="UDEVS OFFICIAL AUTOMOTIVE PORTAL" 
              size="small" 
              sx={{ bgcolor: 'rgba(0, 172, 193, 0.25)', color: '#5DDFE8', fontWeight: 700, mb: 2, letterSpacing: 1 }} 
            />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.8rem', md: '2.4rem' }, letterSpacing: -0.5 }}>
              Find & Reserve Your Next Dream Car
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, mb: 3, lineHeight: 1.7 }}>
              Browse our verified multi-brand vehicle inventory. Select your preferred color, submit your car purchase application online, and track status transitions in real-time.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBrowseShowroom}
                sx={{
                  bgcolor: '#00ACC1',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3.5,
                  '&:hover': { bgcolor: '#00838F' }
                }}
                endIcon={<ArrowForward />}
              >
                Browse Showroom ({stats.availableCars} Available)
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleViewApplications}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  px: 3,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' }
                }}
              >
                My Orders ({stats.myApplications})
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' }, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 172, 193, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(0, 172, 193, 0.3)'
            }}>
              <CarIcon sx={{ fontSize: 80, color: '#5DDFE8' }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(21, 101, 192, 0.1)', borderRadius: 2.5, p: 1.5 }}>
                  <CarIcon sx={{ fontSize: 32, color: '#1565C0' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565C0' }}>
                    {stats.availableCars}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Available Vehicles in Showroom
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: 2.5, p: 1.5 }}>
                  <Assignment sx={{ fontSize: 32, color: '#D97706' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706' }}>
                    {stats.myApplications}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    My Total Applications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 2.5, p: 1.5 }}>
                  <CheckCircle sx={{ fontSize: 32, color: '#059669' }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>
                    {stats.pendingApplications}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    In Progress / Pending Review
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Featured Vehicles Grid */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#071321' }}>
              Featured Vehicles
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Top curated picks available for immediate delivery
            </Typography>
          </div>
          <Button 
            onClick={handleBrowseShowroom} 
            endIcon={<ArrowForward />}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Explore All Vehicles
          </Button>
        </Box>
        
        {recentCars.length > 0 ? (
          <Grid container spacing={3}>
            {recentCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <CarCard
                  car={car}
                  onViewDetails={handleViewCarDetails}
                  isFavorite={favorites.includes(car.id)}
                  onToggleFavorite={handleToggleFavorite}
                  isComparing={compareList.some(c => c.id === car.id)}
                  onToggleCompare={handleToggleCompare}
                  showActions={true}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
            No vehicles currently featured.
          </Typography>
        )}
      </Box>

      {/* Recent Applications Feed */}
      <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', mb: 4 }} elevation={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321' }}>
              My Recent Applications
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Track the progress of your vehicle purchase requests
            </Typography>
          </div>
          <Button 
            onClick={handleViewApplications} 
            endIcon={<ArrowForward />}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            View All Applications
          </Button>
        </Box>

        {recentApplications.length > 0 ? (
          <Grid container spacing={2}>
            {recentApplications.map((app) => {
              const chipStyle = getStatusChipColor(app.status);
              return (
                <Grid item xs={12} key={app.id}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: '#F8F9FA',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#071321' }}>
                        {app.selectedCar}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Order ID: {app.id} • Color: <strong>{app.selectedColor}</strong> • Applied: {formatRelativeTime(app.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip
                        label={app.status}
                        sx={{
                          bgcolor: chipStyle.bg,
                          color: chipStyle.color,
                          fontWeight: 800,
                          textTransform: 'capitalize',
                          px: 1
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleViewApplications}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      >
                        Track Status
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              You haven't submitted any car applications yet.
            </Typography>
            <Button variant="contained" onClick={handleBrowseShowroom} sx={{ borderRadius: 2 }}>
              Browse Showroom to Apply
            </Button>
          </Box>
        )}
      </Paper>

      {/* Floating Comparison Drawer if vehicles are selected */}
      {compareList.length > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#071321',
          color: 'white',
          p: 2,
          borderRadius: 3.5,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          zIndex: 1000,
          border: '1px solid rgba(0, 172, 193, 0.4)'
        }}>
          <CompareArrows sx={{ color: '#00ACC1' }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {compareList.length}/3 Vehicles selected
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setCompareModalOpen(true)}
            sx={{ bgcolor: '#00ACC1', color: 'white', fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
          >
            Compare Now
          </Button>
          <Button
            size="small"
            onClick={() => setCompareList([])}
            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
          >
            Clear
          </Button>
        </Box>
      )}

      {/* Car Compare Modal */}
      <CarCompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        compareCars={compareList}
        onRemoveCar={(carId) => setCompareList(compareList.filter(c => c.id !== carId))}
        onSelectCar={handleViewCarDetails}
      />
    </Box>
  );
};

export default CustomerDashboard;
