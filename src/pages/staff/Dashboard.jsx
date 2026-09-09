import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Button,
  Chip
} from '@mui/material';
import { 
  DirectionsCar, 
  People, 
  Assignment, 
  TrendingUp, 
  Warning, 
  Business, 
  CheckCircle,
  Add,
  ArrowForward 
} from '@mui/icons-material';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import { calculateInventoryStats, calculateApplicationStats, calculateTotalProfit } from '../../utils/calculations';
import { formatCurrency, formatRelativeTime, formatCarName } from '../../utils/formatters';
import { selectAuthUser } from '../../redux/auth/authSlice';
import { selectCars } from '../../redux/cars/carsSlice';
import { selectApplications } from '../../redux/applications/applicationsSlice';
import { selectCustomers } from '../../redux/customers/customersSlice';
import { selectSuppliers } from '../../redux/suppliers/suppliersSlice';
import { ROLES } from '../../utils/constants';
import './Dashboard.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const carsData = useSelector(selectCars);
  const applicationsData = useSelector(selectApplications);
  const customersData = useSelector(selectCustomers);
  const suppliersData = useSelector(selectSuppliers);
  const isSales = user?.role === ROLES.SALES;
  const isInventory = user?.role === ROLES.INVENTORY;

  const [stats, setStats] = useState({
    inventory: null,
    applications: null,
    profit: 0,
    customers: 0
  });
  const [cars, setCars] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockCars, setLowStockCars] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [carsData, applicationsData, customersData, suppliersData]);

  const loadDashboardData = () => {
    const applications = applicationsData;
    const customers = customersData;

    const inventoryStats = calculateInventoryStats(carsData);
    const applicationStats = calculateApplicationStats(applications);
    const totalProfit = calculateTotalProfit(carsData);

    setCars(carsData);
    setSuppliers(suppliersData);
    setStats({
      inventory: inventoryStats,
      applications: applicationStats,
      profit: totalProfit,
      customers: customers.length
    });

    setRecentOrders(applications.slice(0, 5));
    setLowStockCars(carsData.filter(car => car.stock <= 3));
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563EB' };
      case 'reserved': return { bg: 'rgba(139, 92, 246, 0.15)', color: '#7C3AED' };
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#DC2626' };
      default: return { bg: 'rgba(245, 158, 11, 0.15)', color: '#D97706' };
    }
  };

  return (
    <div className="staff-dashboard">
      <PageHeader
        title={isSales ? "Sales Management Workspace" : "Inventory & Supply Workspace"}
        subtitle={`Welcome back, ${user?.name} (${user?.role?.toUpperCase()})`}
        action={
          isSales ? (
            <Button
              variant="contained"
              startIcon={<DirectionsCar />}
              onClick={() => navigate('/sales/showroom')}
              sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Browse Showroom
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/inventory/cars/add')}
              sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add New Stock
            </Button>
          )
        }
      />

      {/* Role-tailored KPI Grid */}
      {isSales ? (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Applications"
              value={stats.applications?.pending || 0}
              icon={Assignment}
              color="#F59E0B"
              trend="up"
              trendValue="Needs sales review"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Approved Bookings"
              value={stats.applications?.approved || 0}
              icon={CheckCircle}
              color="#3B82F6"
              trend="up"
              trendValue="In progress"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Vehicles"
              value={stats.inventory?.available || 0}
              icon={DirectionsCar}
              color="#10B981"
              trend="up"
              trendValue="In showroom"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Client Contacts"
              value={stats.customers}
              icon={People}
              color="#00ACC1"
              trend="up"
              trendValue="CRM Directory"
            />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Vehicle Records"
              value={stats.inventory?.total || 0}
              icon={DirectionsCar}
              color="#1565C0"
              trend="up"
              trendValue={`${stats.inventory?.totalStock || 0} total units`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Low Stock Alerts"
              value={lowStockCars.length}
              icon={Warning}
              color="#EF4444"
              trend={lowStockCars.length > 0 ? "down" : "up"}
              trendValue="Threshold ≤ 3 units"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Suppliers"
              value={suppliers.length}
              icon={Business}
              color="#00ACC1"
              trend="up"
              trendValue="Verified distributors"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Estimated Inventory Margin"
              value={formatCurrency(stats.profit)}
              icon={TrendingUp}
              color="#10B981"
              trend="up"
              trendValue="Gross profit value"
            />
          </Grid>
        </Grid>
      )}

      {/* Main Content Area based on role */}
      {isSales ? (
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="primary" />
              Latest Customer Applications & Orders
            </Typography>
            <Button 
              size="small" 
              onClick={() => navigate('/sales/applications')}
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 600 }}
            >
              View All Applications
            </Button>
          </Box>
          {recentOrders.length > 0 ? (
            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Requested Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Color</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Applied</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => {
                    const style = getStatusStyle(order.status);
                    return (
                      <TableRow key={order.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#1565C0' }}>
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{order.fullName}</Typography>
                          <Typography variant="caption" color="textSecondary">{order.email}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{order.selectedCar}</TableCell>
                        <TableCell>
                          <Chip label={order.selectedColor} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor: style.bg,
                              color: style.color,
                              fontWeight: 700,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="textSecondary">
                            {formatRelativeTime(order.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
              No orders submitted yet.
            </Typography>
          )}
        </Paper>
      ) : (
        /* Inventory Manager Focus Table */
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }} elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning color="error" />
              Low Stock Replenishment Tracker
            </Typography>
            <Button 
              size="small" 
              onClick={() => navigate('/inventory/cars')}
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 600 }}
            >
              All Inventory
            </Button>
          </Box>
          {lowStockCars.length > 0 ? (
            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: '#F8F9FA' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Vehicle Model</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Current Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Purchase Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockCars.map((car) => (
                    <TableRow key={car.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{formatCarName(car)}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${car.stock} Units Left`}
                          color={car.stock <= 2 ? 'error' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(car.purchaseRate)}</TableCell>
                      <TableCell>
                        <Chip label={car.status} size="small" sx={{ textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/inventory/cars/edit/${car.id}`)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                          Restock / Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
              All inventory items are currently well-stocked.
            </Typography>
          )}
        </Paper>
      )}
    </div>
  );
};

export default StaffDashboard;
