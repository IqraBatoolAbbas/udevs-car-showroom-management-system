import { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  TrendingUp,
  DirectionsCar,
  People,
  Assignment,
  Download,
  Assessment,
  Print,
  Business,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { formatCurrency, formatCarName, formatRelativeTime } from '../../utils/formatters';
import { calculateInventoryStats, calculateApplicationStats, calculateTotalProfit } from '../../utils/calculations';
import './Reports.css';

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    inventory: null,
    applications: null,
    profit: 0,
    customers: 0
  });
  const [cars, setCars] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    const carsData = localStorageService.getData(STORAGE_KEYS.CARS, []);
    const appsData = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
    const custData = localStorageService.getData(STORAGE_KEYS.CUSTOMERS, []);
    const logsData = localStorageService.getData(STORAGE_KEYS.ACTIVITY_LOGS, []);
    const supData = localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []);

    const inventoryStats = calculateInventoryStats(carsData);
    const applicationStats = calculateApplicationStats(appsData);
    const totalProfit = calculateTotalProfit(carsData);

    setCars(carsData);
    setApplications(appsData);
    setActivityLogs(logsData);
    setSuppliers(supData);

    setStats({
      inventory: inventoryStats,
      applications: applicationStats,
      profit: totalProfit,
      customers: custData.length
    });
  };

  const handleExportCSV = () => {
    const headers = ['Vehicle', 'Year', 'Purchase Rate (PKR)', 'Selling Price (PKR)', 'Gross Profit (PKR)', 'Profit Margin %', 'Stock Quantity', 'Status'];
    const rows = cars.map(car => [
      formatCarName(car),
      car.year,
      car.purchaseRate,
      car.sellingPrice,
      car.profit || (car.sellingPrice - car.purchaseRate),
      car.profitMargin || 0,
      car.stock,
      car.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `management-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const topMarginCars = [...cars].sort((a, b) => (b.profitMargin || 0) - (a.profitMargin || 0));

  const totalInventoryValue = cars.reduce((acc, c) => acc + ((c.purchaseRate || 0) * (c.stock || 0)), 0);
  const totalShowroomValue = cars.reduce((acc, c) => acc + ((c.sellingPrice || 0) * (c.stock || 0)), 0);

  return (
    <div className="reports-page" style={{ width: '100%' }}>
      <PageHeader
        title="Business Analytics & Management Reports"
        subtitle="Executive KPI summaries, profit margin analysis, and inventory valuations"
        action={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5 }}
            >
              Print View
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportCSV}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Export CSV
            </Button>
          </Box>
        }
      />

      {/* Executive Summary Widgets */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(21, 101, 192, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(21, 101, 192, 0.1)', p: 1.8, borderRadius: 2.5 }}>
                  <DirectionsCar sx={{ fontSize: 32, color: '#1565C0' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0' }}>
                    {stats.inventory?.total || 0} Models
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {stats.inventory?.totalStock || 0} Total Units in Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', p: 1.8, borderRadius: 2.5 }}>
                  <TrendingUp sx={{ fontSize: 32, color: '#059669' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#059669' }}>
                    {formatCurrency(stats.profit)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Estimated Gross Profit
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', p: 1.8, borderRadius: 2.5 }}>
                  <Assignment sx={{ fontSize: 32, color: '#D97706' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706' }}>
                    {stats.applications?.total || 0} Orders
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {stats.applications?.pending || 0} Pending Approvals
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(0, 172, 193, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'rgba(0, 172, 193, 0.1)', p: 1.8, borderRadius: 2.5 }}>
                  <Business sx={{ fontSize: 32, color: '#00ACC1' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#00ACC1' }}>
                    {suppliers.length} Suppliers
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {stats.customers} Active Clients
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Valuation Summary Banner */}
      <Paper sx={{ p: 4, mb: 3.5, borderRadius: 3.5, bgcolor: '#071321', color: 'white', boxShadow: '0 10px 30px rgba(7, 19, 33, 0.25)' }} elevation={0}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 700, letterSpacing: 1 }}>
              TOTAL PURCHASE VALUATION (COST)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5 }}>
              {formatCurrency(totalInventoryValue)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 700, letterSpacing: 1 }}>
              TOTAL SHOWROOM VALUE (RETAIL)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5 }}>
              {formatCurrency(totalShowroomValue)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, letterSpacing: 1 }}>
              PROJECTED GROSS MARGIN
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
              {totalShowroomValue > 0 ? `${(((totalShowroomValue - totalInventoryValue) / totalShowroomValue) * 100).toFixed(1)}%` : '0%'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Tabs */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', mb: 3.5, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2.5, bgcolor: '#ffffff' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Profit & Margin Analysis" sx={{ fontWeight: 700, textTransform: 'none', py: 2 }} />
            <Tab label="Inventory & Stock Breakdown" sx={{ fontWeight: 700, textTransform: 'none', py: 2 }} />
            <Tab label="Applications Workflow Breakdown" sx={{ fontWeight: 700, textTransform: 'none', py: 2 }} />
            <Tab label="Supplier Vehicle Distribution" sx={{ fontWeight: 700, textTransform: 'none', py: 2 }} />
          </Tabs>
        </Box>

        {/* Tab 0: Profit & Margin */}
        {activeTab === 0 && (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Vehicle Model</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Purchase Rate</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Selling Price</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Gross Profit</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Profit Margin</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Stock Units</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topMarginCars.map((car) => (
                  <TableRow 
                    key={car.id} 
                    hover
                    sx={{ 
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: '#071321', py: 2, px: 2.5, fontSize: '0.92rem' }}>
                      {formatCarName(car)}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>{car.year}</TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, color: '#4B5563', fontWeight: 600 }}>{formatCurrency(car.purchaseRate)}</TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, fontWeight: 800, color: '#1565C0' }}>{formatCurrency(car.sellingPrice)}</TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, color: '#059669', fontWeight: 800 }}>
                      +{formatCurrency(car.profit || (car.sellingPrice - car.purchaseRate))}
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5 }}>
                      <Chip
                        label={`${car.profitMargin || 0}%`}
                        size="small"
                        sx={{
                          bgcolor: car.profitMargin >= 15 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: car.profitMargin >= 15 ? '#059669' : '#D97706',
                          fontWeight: 800
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2.5, fontWeight: 600 }}>{car.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tab 1: Inventory Status */}
        {activeTab === 1 && (
          <Box sx={{ p: 3.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'rgba(16, 185, 129, 0.08)', borderRadius: 3, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#059669', mb: 0.5 }}>
                      {stats.inventory?.available || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                      Available for Sale
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'rgba(139, 92, 246, 0.08)', borderRadius: 3, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#7C3AED', mb: 0.5 }}>
                      {stats.inventory?.reserved || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                      Reserved by Customers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'rgba(59, 130, 246, 0.08)', borderRadius: 3, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mb: 0.5 }}>
                      {stats.inventory?.sold || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2563EB' }}>
                      Sold & Delivered
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#DC2626', mb: 0.5 }}>
                      {stats.inventory?.lowStock || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#DC2626' }}>
                      Low Stock Threshold (≤ 3)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 2: Applications Status */}
        {activeTab === 2 && (
          <Box sx={{ p: 3.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#D97706', mb: 0.5 }}>
                      {stats.applications?.pending || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#B45309' }}>
                      Pending Review
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mb: 0.5 }}>
                      {stats.applications?.approved || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1D4ED8' }}>
                      Approved
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#7C3AED', mb: 0.5 }}>
                      {stats.applications?.reserved || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#6D28D9' }}>
                      Reserved
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#059669', mb: 0.5 }}>
                      {stats.applications?.completed || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#047857' }}>
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={2.4}>
                <Card sx={{ bgcolor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#DC2626', mb: 0.5 }}>
                      {stats.applications?.rejected || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#B91C1C' }}>
                      Rejected
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Suppliers */}
        {activeTab === 3 && (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Supplier Name</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Linked Vehicle Models</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((s) => {
                  const linkedCars = cars.filter(c => c.supplierId === s.id);
                  return (
                    <TableRow 
                      key={s.id} 
                      hover
                      sx={{ 
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, py: 2, px: 2.5, fontSize: '0.92rem' }}>{s.companyName}</TableCell>
                      <TableCell sx={{ py: 2, px: 2.5 }}>{s.contactPerson}</TableCell>
                      <TableCell sx={{ py: 2, px: 2.5 }}>{s.city}</TableCell>
                      <TableCell sx={{ py: 2, px: 2.5 }}>
                        <Chip label={`${linkedCars.length} Models`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ py: 2, px: 2.5 }}>
                        <Chip label={s.status} size="small" color={s.status === 'active' ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );
};

export default Reports;