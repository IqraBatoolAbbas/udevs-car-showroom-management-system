import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Person,
  DirectionsCar,
  Assignment,
  Dashboard as DashboardIcon,
  Notifications,
  Phone,
  LocationOn,
  Email,
  ChevronRight,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser, logout } from '../redux/auth/authSlice';
import { MENU_ITEMS } from '../utils/constants';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { selectThemeMode, toggleTheme } from '../redux/theme/themeSlice';
import { selectNotifications } from '../redux/notifications/notificationsSlice';

const CustomerLayout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const mode = useSelector(selectThemeMode);
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    loadNotificationsCount();
  }, [location.pathname, notifOpen, notifications]);

  const loadNotificationsCount = () => {
    const notifs = notifications;
    const unread = notifs.filter(n =>
      (!n.targetUserId || n.targetUserId === user?.id) &&
      (!n.targetRole || n.targetRole.includes('customer') || n.targetRole.includes('all')) && !n.read
    ).length;
    setUnreadCount(unread);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    dispatch(logout());
  };

  const menuItems = MENU_ITEMS[user?.role] || [];

  const getMenuIcon = (path) => {
    if (path.includes('showroom')) return <DirectionsCar fontSize="small" />;
    if (path.includes('applications')) return <Assignment fontSize="small" />;
    if (path.includes('profile')) return <Person fontSize="small" />;
    return <DashboardIcon fontSize="small" />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      {/* Top Bar Navigation */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #071321 0%, #0c2138 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 1 }, py: 1 }}>
            {/* Logo */}
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
              onClick={() => navigate('/customer/dashboard')}
            >
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,172,193,0.4)'
              }}>
                <DirectionsCar sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: 1.5, lineHeight: 1.1 }}>
                  UDEVS
                </Typography>
                <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 1.5 }}>
                  CAR SHOWROOM
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={getMenuIcon(item.path)}
                    sx={{
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                      bgcolor: isActive ? 'rgba(0, 172, 193, 0.2)' : 'transparent',
                      border: isActive ? '1px solid rgba(0, 172, 193, 0.4)' : '1px solid transparent',
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 2.5,
                      px: 2,
                      py: 0.9,
                      textTransform: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#ffffff'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Actions & Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title={mode === 'light' ? 'Enable dark mode' : 'Enable light mode'}>
                <IconButton onClick={() => dispatch(toggleTheme())} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={() => setNotifOpen(true)} 
                  sx={{ 
                    color: 'rgba(255,255,255,0.85)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <Notifications fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, ml: 1 }}>
                <Chip
                  label={user?.name || 'Customer'}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                />
              </Box>

              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar sx={{ 
                  bgcolor: '#1565C0', 
                  width: 38, 
                  height: 38,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '2px solid #00ACC1'
                }}>
                  {user?.name?.charAt(0) || 'C'}
                </Avatar>
              </IconButton>

              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
              >
                <MenuIcon />
              </IconButton>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    mt: 1.5,
                    minWidth: 220,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    p: 1
                  }
                }}
              >
                <MenuItem disabled sx={{ opacity: 1, py: 1.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321' }}>{user?.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{user?.email}</Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/profile'); }} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <Person fontSize="small" color="primary" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/customer/applications'); }} sx={{ borderRadius: 2 }}>
                  <ListItemIcon>
                    <Assignment fontSize="small" color="primary" />
                  </ListItemIcon>
                  My Applications
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', borderRadius: 2, fontWeight: 600 }}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#071321', color: 'white', p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 1 }}>
          <DirectionsCar sx={{ color: '#00ACC1', fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
            UDEVS SHOWROOM
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? '#1565C0' : 'transparent',
                    color: 'white'
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                    {getMenuIcon(item.path)}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  <ChevronRight fontSize="small" sx={{ opacity: 0.5 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Page Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: 'calc(100vh - 70px - 220px)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          <Outlet />
        </Container>
      </Box>

      {/* Showroom Footer */}
      <Box component="footer" sx={{ bgcolor: '#071321', color: 'white', pt: 6, pb: 4, mt: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4, mb: 5 }}>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <DirectionsCar sx={{ color: '#00ACC1', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                  UDEVS CAR SHOWROOM
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#9CA3AF', maxWidth: 400, lineHeight: 1.7, mb: 2 }}>
                Pakistan's premier digital automobile showroom. Verified inventory, instant car booking applications, and complete transparency.
              </Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#00ACC1' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: 'white' } }} onClick={() => navigate('/customer/showroom')}>
                  Explore Showroom
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: 'white' } }} onClick={() => navigate('/customer/applications')}>
                  Track Applications
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: 'white' } }} onClick={() => navigate('/customer/profile')}>
                  Customer Profile
                </Typography>
              </Box>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#00ACC1' }}>
                Showroom Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, color: '#9CA3AF', fontSize: '0.875rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: '#00ACC1' }} />
                  <span>123 Business Avenue, Gulberg III, Lahore</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" sx={{ color: '#00ACC1' }} />
                  <span>+92-42-111-UDEVS (83387)</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" sx={{ color: '#00ACC1' }} />
                  <span>showroom@udevs.com</span>
                </Box>
              </Box>
            </div>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#6B7280' }}>
              &copy; {new Date().getFullYear()} U Devs Automotive Systems. All rights reserved. Persistent Frontend Architecture.
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7280' }}>
              Designed & Engineered with React.js & Material UI
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        userRole="customer"
      />
    </Box>
  );
};

export default CustomerLayout;
