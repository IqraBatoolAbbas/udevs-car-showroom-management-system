import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Chip,
  Badge
} from '@mui/material';
import {
  Close,
  Notifications,
  Warning,
  Info,
  CheckCircle,
  ErrorOutline,
  DoneAll,
  DeleteOutline
} from '@mui/icons-material';
import { formatRelativeTime } from '../../utils/formatters';
import { selectAuthUser } from '../../redux/auth/authSlice';
import { selectNotifications, markNotificationRead, removeNotification } from '../../redux/notifications/notificationsSlice';

const NotificationDrawer = ({ open, onClose, userRole }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const allNotifs = useSelector(selectNotifications);
  const notifications = allNotifs.filter(n => {
    if (n.targetUserId && n.targetUserId !== user?.id) return false;
    return !n.targetRole || n.targetRole.includes(userRole) || n.targetRole.includes('all');
  });

  const handleMarkAllRead = () => {
    notifications.filter(notification => !notification.read)
      .forEach(notification => dispatch(markNotificationRead(notification.id)));
  };

  const handleClearAll = () => {
    notifications.forEach(notification => dispatch(removeNotification(notification.id)));
  };

  const handleNotificationClick = (id) => {
    dispatch(markNotificationRead(id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <Warning sx={{ color: '#F59E0B' }} />;
      case 'success':
        return <CheckCircle sx={{ color: '#10B981' }} />;
      case 'error':
        return <ErrorOutline sx={{ color: '#EF4444' }} />;
      default:
        return <Info sx={{ color: '#3B82F6' }} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          p: 0,
          background: '#ffffff'
        }
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'linear-gradient(135deg, #071321 0%, #1565C0 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Notifications />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} New`} 
              size="small" 
              sx={{ bgcolor: '#00ACC1', color: 'white', fontWeight: 700, height: 22 }} 
            />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {notifications.length > 0 && (
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', bgcolor: '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            size="small" 
            startIcon={<DoneAll />} 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            sx={{ fontSize: '0.78rem' }}
          >
            Mark all read
          </Button>
          <Button 
            size="small" 
            color="error" 
            startIcon={<DeleteOutline />} 
            onClick={handleClearAll}
            sx={{ fontSize: '0.78rem' }}
          >
            Clear all
          </Button>
        </Box>
      )}

      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <ListItem
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                bgcolor: notif.read ? 'transparent' : 'rgba(21, 101, 192, 0.04)',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.08)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                {getIcon(notif.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: notif.read ? 600 : 700, color: '#071321' }}>
                      {notif.title}
                    </Typography>
                    {!notif.read && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1565C0' }} />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" sx={{ color: '#4B5563', display: 'block', mb: 0.5 }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.7rem' }}>
                      {formatRelativeTime(notif.timestamp)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 6, textAlign: 'center', color: '#9CA3AF' }}>
            <Notifications sx={{ fontSize: 48, opacity: 0.4, mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              No notifications yet
            </Typography>
            <Typography variant="caption">
              You will be alerted here for stock updates & applications.
            </Typography>
          </Box>
        )}
      </List>
    </Drawer>
  );
};

export default NotificationDrawer;
