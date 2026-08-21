import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  DirectionsCar,
  Business,
  People,
  Assignment,
  AdminPanelSettings,
  Assessment,
  Settings,
  Logout,
  ChevronLeft,
  Person,
  Notifications,
  HomeWork,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS, ROLES } from '../utils/constants';
import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { useThemeMode } from '../context/ThemeModeContext';

const DRAWER_WIDTH = 270;

const iconMap = {
  Dashboard,
  DirectionsCar,
  Business,
  People,
  Assignment,
  AdminPanelSettings,
  Assessment,
  Settings,
  Person,
  HomeWork
};

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingAppsCount, setPendingAppsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { mode, toggleThemeMode } = useThemeMode();

  useEffect(() => {
    loadBadgeCounts();
  }, [location.pathname, notifOpen]);

  const loadBadgeCounts = () => {
    const notifs = localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS, []);
    const userRole = user?.role || 'admin';
    const unread = notifs.filter(n =>
      (!n.targetUserId || n.targetUserId === user?.id) &&
      (!n.targetRole || n.targetRole.includes(userRole) || n.targetRole.includes('all')) && !n.read
    ).length;
    setUnreadCount(unread);

    const apps = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
    const pending = apps.filter(a => a.status === 'pending').length;
    setPendingAppsCount(pending);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const menuItems = MENU_ITEMS[user?.role] || [];

  const getRoleLabel = (role) => {
    switch (role) {
      case ROLES.ADMIN: return 'Administrator';
      case ROLES.SALES: return 'Sales Manager';
      case ROLES.INVENTORY: return 'Inventory Manager';
      default: return 'Staff Member';
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#071321', color: '#ffffff' }}>
      {/* Brand Header */}
      <Toolbar sx={{ justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,172,193,0.3)'
          }}>
            <DirectionsCar sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: 1.5, lineHeight: 1.1 }}>
              UDEVS
            </Typography>
            <Typography variant="caption" sx={{ color: '#00ACC1', fontWeight: 600, fontSize: '0.68rem', letterSpacing: 1 }}>
              AUTOMOTIVE
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ display: { sm: 'none' }, color: 'rgba(255,255,255,0.7)' }}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>

      {/* Navigation List */}
      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ px: 1.5, mb: 1.5, display: 'block', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 1.2 }}>
          MAIN NAVIGATION
        </Typography>

        {menuItems.map((item) => {
          const Icon = iconMap[item.icon] || Dashboard;
          const isActive = location.pathname === item.path;
          const isApplications = item.path.includes('applications');
          
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (mobileOpen) setMobileOpen(false);
                }}
                selected={isActive}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(21, 101, 192, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0D47A1 0%, #00838F 100%)',
                    },
                  },
                  '&:hover': {
                    bgcolor: isActive ? undefined : 'rgba(255,255,255,0.06)',
                    color: '#ffffff',
                    transform: 'translateX(3px)'
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  minWidth: 38
                }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem'
                    }
                  }}
                />
                {isApplications && pendingAppsCount > 0 && (
                  <Chip
                    label={pendingAppsCount}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: '#F59E0B',
                      color: 'white'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Info Bottom Card */}
      <Box sx={{ 
        p: 2, 
        mt: 'auto', 
        borderTop: '1px solid rgba(255,255,255,0.08)',
        bgcolor: '#071321'
      }}>
        <Box sx={{ 
          p: 1.8, 
          borderRadius: 2.5, 
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          <Avatar sx={{ 
            bgcolor: '#1565C0',
            width: 38,
            height: 38,
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>
              {user?.name || 'Authorized User'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#00ACC1', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
              {getRoleLabel(user?.role)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: '#ffffff',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#071321', fontSize: '1.2rem' }}>
              {menuItems.find(item => location.pathname === item.path)?.label || 'Showroom Portal'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={mode === 'light' ? 'Enable dark mode' : 'Enable light mode'}>
              <IconButton onClick={toggleThemeMode} sx={{ color: '#4B5563' }}>
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton onClick={() => setNotifOpen(true)} sx={{ color: '#4B5563' }}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Chip
              label={getRoleLabel(user?.role)}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: 2,
                px: 0.5
              }}
            />
            
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ 
                bgcolor: '#071321',
                width: 38,
                height: 38,
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '2px solid #1565C0'
              }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            
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
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
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
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', borderRadius: 2, fontWeight: 600 }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(255,255,255,0.08)'
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(255,255,255,0.08)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      {/* Notification Drawer Component */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        userRole={user?.role || 'admin'}
      />
    </Box>
  );
};

export default AdminLayout;
