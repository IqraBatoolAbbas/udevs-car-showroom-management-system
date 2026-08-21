import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  Divider,
  Alert,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { Person, Security, Save, Assignment, CheckCircle } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { useAuth } from '../../context/AuthContext';
import { PAKISTAN_CITIES } from '../../utils/constants';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    city: 'Lahore'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = () => {
    if (user) {
      // Load full user data from localStorage since session only has basic info
      const users = localStorageService.getData(STORAGE_KEYS.USERS, []);
      const fullUser = users.find(u => u.id === user.id || u.email === user.email);
      
      const userData = fullUser || user;
      
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '+92-300-1234567',
        cnic: userData.cnic || '12345-6789012-3',
        address: userData.address || '123 Main Street, Gulberg III',
        city: userData.city || 'Lahore'
      });

      const apps = localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []);
      const userApps = apps.filter(a => a.email === user.email);
      setApplicationsCount(userApps.length);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const users = localStorageService.getData(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map(u => {
      if (u.id === user.id || u.email === user.email) {
        return { ...u, ...profileData };
      }
      return u;
    });

    localStorageService.setData(STORAGE_KEYS.USERS, updatedUsers);
    localStorageService.setData(STORAGE_KEYS.SESSION, { ...user, ...profileData });

    const customers = localStorageService.getData(STORAGE_KEYS.CUSTOMERS, []);
    const customerIndex = customers.findIndex(customer => customer.userId === user.id || customer.email?.toLowerCase() === user.email?.toLowerCase());
    const customerData = {
      userId: user.id,
      name: profileData.name,
      email: profileData.email.toLowerCase(),
      phone: profileData.phone,
      cnic: profileData.cnic,
      address: profileData.address,
      city: profileData.city,
      status: 'active',
      updatedAt: new Date().toISOString()
    };
    if (customerIndex >= 0) customers[customerIndex] = { ...customers[customerIndex], ...customerData };
    else customers.push({ id: localStorageService.generateId('CUST'), ...customerData, createdAt: new Date().toISOString() });
    localStorageService.setData(STORAGE_KEYS.CUSTOMERS, customers);

    setSuccessMessage('Profile information updated successfully in LocalStorage.');
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    const users = localStorageService.getData(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (userIndex !== -1) {
      if (users[userIndex].password !== passwordData.currentPassword) {
        setPasswordError('Current password is incorrect.');
        return;
      }

      users[userIndex].password = passwordData.newPassword;
      localStorageService.setData(STORAGE_KEYS.USERS, users);
      setSuccessMessage('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };

  return (
    <div className="profile-page">
      <PageHeader
        title="My Profile & Security"
        subtitle="Manage your personal details, verified delivery address, and login credentials"
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper className="profile-card" elevation={0}>
            <div className="profile-card-content">
              <Avatar
                className="profile-avatar"
              >
                {profileData.name?.charAt(0) || 'C'}
              </Avatar>
              <Typography variant="h6" className="profile-name">
                {profileData.name}
              </Typography>
              <Typography variant="body2" className="profile-email">
                {profileData.email}
              </Typography>
              <Chip label="Verified Customer" size="small" className="profile-role" sx={{ mb: 3 }} />

              <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

              <Box sx={{ textAlign: 'left', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Applications Submitted:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{applicationsCount} Orders</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Registered City:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{profileData.city}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>CNIC Verified:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{profileData.cnic}</Typography>
                </Box>
              </Box>
            </div>
          </Paper>
        </Grid>

        {/* Right Column: Edit Profile and Password */}
        <Grid item xs={12} md={8}>
          <Paper className="profile-form" elevation={0}>
            <div className="form-header">
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Personal Information
              </Typography>
            </div>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleProfileSave}>
              <div className="form-content">
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={profileData.email}
                    disabled
                    helperText="Email cannot be modified"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CNIC (National Identity)"
                    value={profileData.cnic}
                    onChange={(e) => setProfileData({ ...profileData, cnic: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Residential Address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="City"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    required
                  >
                    {PAKISTAN_CITIES.map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-footer">
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      sx={{ borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
                    >
                      Update Profile
                    </Button>
                  </div>
                </Grid>
              </Grid>
              </div>
            </form>
          </Paper>

          {/* Change Password Card */}
          <Paper className="profile-form" elevation={0}>
            <div className="form-header">
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#071321', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Change Password
              </Typography>
            </div>
            <Divider sx={{ mb: 3 }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>{passwordError}</Alert>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-content">
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="form-footer">
                    <Button
                      type="submit"
                      variant="outlined"
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Update Password
                    </Button>
                  </div>
                </Grid>
              </Grid>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
