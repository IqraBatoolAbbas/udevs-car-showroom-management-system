import { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Storage,
  Info,
  Delete,
  Save,
  RestartAlt
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import seedInitialData from '../../data/seedData';
import './Settings.css';

const defaultSettings = {
  showroomName: 'U Devs Car Showroom',
  currency: 'PKR',
  dateFormat: 'DD/MM/YYYY',
  lowStockThreshold: 3,
  enableNotifications: true,
  enableEmailAlerts: false,
  companyAddress: '123 Business Avenue, Gulberg III, Lahore',
  companyPhone: '+92-42-111-UDEVS',
  companyEmail: 'info@udevs-showroom.com'
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [clearDataDialog, setClearDataDialog] = useState(false);
  const [reseedDialog, setReseedDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorageService.getData(STORAGE_KEYS.SETTINGS, defaultSettings);
    // Safe merger with default object to prevent undefined keys
    setSettings({
      ...defaultSettings,
      ...(savedSettings || {})
    });
  };

  const handleSaveSettings = () => {
    localStorageService.setData(STORAGE_KEYS.SETTINGS, settings);
    localStorageService.logActivity({
      type: 'update',
      entity: 'settings',
      entityId: 'SYSTEM',
      description: 'Updated system preferences and threshold configuration'
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setClearDataDialog(false);
    window.location.href = '/login';
  };

  const handleReseedData = () => {
    localStorage.clear();
    seedInitialData();
    setReseedDialog(false);
    window.location.reload();
  };

  const getStorageInfo = () => {
    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) totalSize += data.length;
    });
    return (totalSize / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="Showroom & System Preferences"
        subtitle="Manage business settings, low stock thresholds, and local storage data"
        action={
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            sx={{ borderRadius: 2.5, px: 3, fontWeight: 700, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
          >
            Save Changes
          </Button>
        }
      />

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3.5, borderRadius: 2.5, fontWeight: 600 }}>
          System settings saved and applied successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: General Business Settings */}
        <Grid item xs={12} md={6}>
          <Paper className="settings-section" elevation={0}>
            <div className="section-header">
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <SettingsIcon />
                Showroom Branding & Localization
              </Typography>
            </div>
            <CardContent className="settings-content" sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Showroom Display Name"
                    value={settings.showroomName || ''}
                    onChange={(e) => setSettings({ ...settings, showroomName: e.target.value })}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="System Currency"
                    value={settings.currency || 'PKR'}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    size="small"
                    select
                    SelectProps={{ native: true }}
                    InputLabelProps={{ shrink: true }}
                  >
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date Format"
                    value={settings.dateFormat || 'DD/MM/YYYY'}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    size="small"
                    select
                    SelectProps={{ native: true }}
                    InputLabelProps={{ shrink: true }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Low Stock Warning Threshold (Units)"
                    type="number"
                    value={settings.lowStockThreshold ?? 1}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 1 })}
                    size="small"
                    helperText="Vehicles with stock at or below this count will trigger KPI warning badges"
                    inputProps={{ min: 1, max: 20 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Showroom Address"
                    value={settings.companyAddress || ''}
                    onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Helpdesk Phone"
                    value={settings.companyPhone || ''}
                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    value={settings.companyEmail || ''}
                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>

        {/* Right Column: Notifications & LocalStorage Architecture */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Paper className="settings-section" elevation={0}>
              <div className="section-header">
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2, fontSize: '1.05rem' }}>
                  <Info />
                  Notification Preferences
                </Typography>
              </div>
              <CardContent className="settings-content" sx={{ p: 3.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(settings.enableNotifications)}
                          onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                          color="primary"
                        />
                      }
                      label="Enable in-app Notification Center popovers"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(settings.enableEmailAlerts)}
                          onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                          color="primary"
                        />
                      }
                      label="Simulated email notifications on order status updates"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>

            {/* LocalStorage Data Architecture & Health */}
            <Paper className="settings-section" elevation={0}>
              <div className="section-header">
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1.2, fontSize: '1.05rem' }}>
                  <Storage />
                  LocalStorage Architecture Status
                </Typography>
              </div>
              <CardContent className="settings-content" sx={{ p: 3.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Total LocalStorage Payload</Typography>
                      <Chip label={getStorageInfo()} size="small" color="primary" sx={{ fontWeight: 800 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Vehicles in Storage</Typography>
                      <Chip label={`${localStorageService.getData(STORAGE_KEYS.CARS, []).length} Records`} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Applications in Storage</Typography>
                      <Chip label={`${localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []).length} Orders`} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#4B5563' }}>Audit Activity Logs</Typography>
                      <Chip label={`${localStorageService.getData(STORAGE_KEYS.ACTIVITY_LOGS, []).length} Entries`} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={() => setReseedDialog(true)}
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 2.5 }}
                      >
                        Reseed Demo Data
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setClearDataDialog(true)}
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 2.5 }}
                      >
                        Clear Storage
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Reseed Dialog */}
      <Dialog open={reseedDialog} onClose={() => setReseedDialog(false)} PaperProps={{ sx: { borderRadius: 3.5 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Reseed All Showroom Demo Data?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will reset your LocalStorage and repopulate all vehicles, suppliers, demo customers, applications, and logs to the original realistic seed data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setReseedDialog(false)}>Cancel</Button>
          <Button onClick={handleReseedData} variant="contained" sx={{ px: 3, borderRadius: 2 }}>
            Confirm Reseed
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={clearDataDialog} onClose={() => setClearDataDialog(false)} PaperProps={{ sx: { borderRadius: 3.5 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>Clear Entire LocalStorage?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Warning: This action will completely erase all stored vehicles, orders, and sessions. You will be redirected to the login screen.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setClearDataDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAllData} color="error" variant="contained" sx={{ px: 3, borderRadius: 2 }}>
            Erase All Data
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Settings;