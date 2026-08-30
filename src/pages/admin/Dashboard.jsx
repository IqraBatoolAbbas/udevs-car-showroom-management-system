import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Button,
} from '@mui/material';
import { 
  DirectionsCar, 
  People, 
  Assignment, 
  TrendingUp, 
  Warning, 
  CheckCircle,
  Add,
  ArrowForward,
  Business,
  History,
} from '@mui/icons-material';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { selectCars } from '../../redux/cars/carsSlice';
import { selectApplications } from '../../redux/applications/applicationsSlice';
import { selectCustomers } from '../../redux/customers/customersSlice';
import { calculateInventoryStats, calculateApplicationStats, calculateTotalProfit } from '../../utils/calculations';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const cars = useSelector(selectCars);
  const applications = useSelector(selectApplications);
  const customers = useSelector(selectCustomers);
  const [stats, setStats] = useState({
    inventory: null,
    applications: null,
    profit: 0,
    customers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [lowStockCars, setLowStockCars] = useState([]);

  

  const loadDashboardData = () => {
    const activityLogs = localStorageService.getData(STORAGE_KEYS.ACTIVITY_LOGS, []);

    // Calculate statistics dynamically
    const inventoryStats = calculateInventoryStats(cars);
    const applicationStats = calculateApplicationStats(applications);
    const totalProfit = calculateTotalProfit(cars);

    setStats({
      inventory: inventoryStats,
      applications: applicationStats,
      profit: totalProfit,
      customers: customers.length
    });

    // Get recent orders (last 6)
    setRecentOrders(applications.slice(0, 6));

    // Get recent activity (last 8)
    setRecentActivity(activityLogs.slice(0, 8));

    // Get low stock cars (stock <= 3)
    setLowStockCars(cars.filter(car => car.stock <= 3));
  };
    useEffect(() => {
        loadDashboardData();
      }, [cars, applications, customers]);
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
    <Box className="admin-dashboard">
      <PageHeader
        title="Admin Control Center"
        subtitle="Real-time automobile inventory, sales tracking, and operational KPIs"
        action={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Business />}
              onClick={() => navigate('/admin/suppliers')}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5 }}
            >
              Suppliers
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/admin/cars/add')}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add New Car
            </Button>
          </Box>
        }
      />

      {/* Primary KPI Row */}
      <Grid container spacing={3} className="kpi-grid" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vehicle Records"
            value={stats.inventory?.total || 0}
            icon={DirectionsCar}
            color="#1565C0"
            trend="up"
            trendValue={`${stats.inventory?.totalStock || 0} Total Units`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available in Showroom"
            value={stats.inventory?.available || 0}
            icon={CheckCircle}
            color="#10B981"
            trend="up"
            trendValue="Ready for booking"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Applications"
            value={stats.applications?.pending || 0}
            icon={Assignment}
            color="#F59E0B"
            trend={stats.applications?.pending > 0 ? "down" : "up"}
            trendValue="Awaiting staff review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Registered Customers"
            value={stats.customers}
            icon={People}
            color="#00ACC1"
            trend="up"
            trendValue="Verified profiles"
          />
        </Grid>
      </Grid>

      {/* Secondary Financial & Inventory KPIs */}
      <Grid container spacing={3} className="kpi-grid" sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estimated Gross Profit"
            value={formatCurrency(stats.profit)}
            icon={TrendingUp}
            color="#10B981"
            trend="up"
            trendValue="Calculated from inventory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Alert"
            value={lowStockCars.length}
            icon={Warning}
            color="#EF4444"
            trend={lowStockCars.length > 0 ? "down" : "up"}
            trendValue="Stock ≤ 3 units"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reserved Vehicles"
            value={stats.inventory?.reserved || 0}
            icon={DirectionsCar}
            color="#8B5CF6"
            trend="up"
            trendValue="Booking token paid"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sold / Delivered"
            value={stats.inventory?.sold || 0}
            icon={CheckCircle}
            color="#3B82F6"
            trend="up"
            trendValue="Completed sales"
          />
        </Grid>
      </Grid>

      {/* FULL WIDTH: Recent Car Applications & Orders */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper className="dashboard-paper full-width-paper" elevation={0}>
            <Box className="paper-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2, fontSize: '1.05rem' }}>
                <Assignment fontSize="small" />
                Recent Car Applications & Orders
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/applications')}
                sx={{ 
                  color: '#ffffff', 
                  bgcolor: 'rgba(255,255,255,0.18)', 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, 
                  textTransform: 'none', 
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2
                }}
                endIcon={<ArrowForward fontSize="small" />}
              >
                View All Applications
              </Button>
            </Box>

            <div className="paper-content">
              {recentOrders.length > 0 ? (
                <TableContainer sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Table className="dashboard-table" size="medium">
                    <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Order ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Vehicle Model</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Applied</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => {
                        const chipStyle = getStatusChipColor(order.status);
                        return (
                          <TableRow 
                            key={order.id} 
                            hover 
                            sx={{ 
                              transition: 'background-color 0.2s',
                              '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                            }}
                          >
                            <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0', py: 2, px: 2.5, fontSize: '0.9rem' }}>
                              {order.id}
                            </TableCell>
                            <TableCell sx={{ py: 2, px: 2.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321' }}>{order.fullName}</Typography>
                              <Typography variant="caption" color="textSecondary">{order.email} • {order.city}</Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2, px: 2.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937' }}>{order.selectedCar}</Typography>
                              <Typography variant="caption" color="textSecondary">Selected Color: <strong>{order.selectedColor}</strong></Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2, px: 2.5 }}>
                              <Chip
                                label={order.status}
                                size="small"
                                sx={{
                                  bgcolor: chipStyle.bg,
                                  color: chipStyle.color,
                                  fontWeight: 800,
                                  textTransform: 'capitalize',
                                  fontSize: '0.75rem',
                                  px: 0.8
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2, px: 2.5 }}>
                              <Typography variant="body2" sx={{ color: '#4B5563', fontSize: '0.85rem' }}>
                                {formatRelativeTime(order.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate('/admin/applications')}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div className="empty-state">
                  <Typography variant="body2" className="empty-state-text">
                    No recent applications recorded.
                  </Typography>
                </div>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* BOTTOM SECTION: Audit & Activity Log + Low Stock Alerts */}
      <Grid container spacing={3}>
        {/* Audit & Activity Log */}
        <Grid item xs={12} lg={7}>
          <Paper className="dashboard-paper" elevation={0}>
            <Box className="paper-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2, fontSize: '1.05rem' }}>
                <History fontSize="small" />
                Audit & Activity Log
              </Typography>
              <Chip label="Live Feed" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: 'white', fontWeight: 700, height: 24 }} />
            </Box>
            <div className="paper-content">
              {recentActivity.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  {recentActivity.map((activity) => (
                    <Box 
                      key={activity.id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 1.8,
                        p: 1.8,
                        borderRadius: 2.5,
                        bgcolor: '#F9FAFB',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { bgcolor: '#F0F4F8', transform: 'translateX(3px)' }
                      }}
                    >
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        boxShadow: '0 2px 8px rgba(21, 101, 192, 0.25)'
                      }}>
                        {activity.type?.charAt(0).toUpperCase()}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '0.88rem' }}>
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.6 }}>
                          <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 700 }}>
                            {activity.userEmail || 'System Console'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                            {formatRelativeTime(activity.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <div className="empty-state">
                  <Typography variant="body2" className="empty-state-text">
                    No recent activities recorded.
                  </Typography>
                </div>
              )}
            </div>
          </Paper>
        </Grid>

        {/* Low Stock Vehicles Panel */}
        <Grid item xs={12} lg={5}>
          <Paper className="dashboard-paper" elevation={0}>
            <Box className="paper-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, sm: 2.5 }, background: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2, fontSize: '1.05rem' }}>
                <Warning fontSize="small" />
                Low Stock Alerts ({lowStockCars.length})
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/cars')}
                sx={{ color: '#ffffff', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
              >
                Inventory
              </Button>
            </Box>
            <div className="paper-content">
              {lowStockCars.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {lowStockCars.map((car) => (
                    <Box
                      key={car.id}
                      onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                      sx={{
                        p: 1.8,
                        borderRadius: 2.5,
                        bgcolor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#78350F' }}>
                          {car.year} {car.make} {car.model}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#92400E' }}>
                          {car.variant} • {car.fuel}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${car.stock} Left`}
                        size="small"
                        sx={{
                          bgcolor: '#EF4444',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', color: '#6B7280' }}>
                  <CheckCircle sx={{ fontSize: 42, color: '#10B981', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>All vehicles adequately stocked</Typography>
                </Box>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
