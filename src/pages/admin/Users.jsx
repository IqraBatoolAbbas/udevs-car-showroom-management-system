import { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box
} from '@mui/material';
import { PersonAdd, Edit, Delete, Close, Download, AdminPanelSettings, Search } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import localStorageService, { STORAGE_KEYS } from '../../services/localStorageService';
import { ROLES } from '../../utils/constants';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.SALES,
    status: 'active'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const usersData = localStorageService.getData(STORAGE_KEYS.USERS, []);
    setUsers(Array.isArray(usersData) ? usersData : []);
  };

  const filteredUsers = (users || []).filter(user => {
    if (!user) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term)) ||
      (user.id && user.id.toLowerCase().includes(term))
    );
  });

  const handleAddUser = () => {
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: ROLES.SALES,
      status: 'active'
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || ROLES.SALES,
      status: user.status || 'active'
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    if (user.role === ROLES.ADMIN && users.filter(u => u.role === ROLES.ADMIN).length <= 1) {
      alert('Cannot delete the last System Administrator.');
      return;
    }
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.user) {
      const updatedUsers = users.filter(u => u.id !== deleteDialog.user.id);
      localStorageService.setData(STORAGE_KEYS.USERS, updatedUsers);
      localStorageService.logActivity({
        type: 'delete',
        entity: 'user',
        entityId: deleteDialog.user.id,
        description: `Deleted system user: ${deleteDialog.user.email} (${deleteDialog.user.role})`
      });
      setUsers(updatedUsers);
      setDeleteDialog({ open: false, user: null });
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editMode && !formData.password)) {
      alert('Please fill in all required fields');
      return;
    }

    if (editMode) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData, password: formData.password || user.password, updatedAt: new Date().toISOString() }
          : user
      );
      localStorageService.setData(STORAGE_KEYS.USERS, updatedUsers);
      localStorageService.logActivity({
        type: 'update',
        entity: 'user',
        entityId: selectedUser.id,
        description: `Updated user account: ${formData.email} (${formData.role})`
      });
      setUsers(updatedUsers);
    } else {
      const newUser = {
        id: localStorageService.generateId('USR'),
        ...formData,
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      localStorageService.setData(STORAGE_KEYS.USERS, updatedUsers);
      localStorageService.logActivity({
        type: 'create',
        entity: 'user',
        entityId: newUser.id,
        description: `Created new user account: ${newUser.email} (${newUser.role})`
      });
      setUsers(updatedUsers);
    }

    setDialogOpen(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN: return '#1565C0';
      case ROLES.SALES: return '#00ACC1';
      case ROLES.INVENTORY: return '#10B981';
      default: return '#F59E0B';
    }
  };

  const handleExportCSV = () => {
    const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Status', 'Created Date'];
    const rows = filteredUsers.map(u => [
      u.id || '',
      u.name || '',
      u.email || '',
      u.role || '',
      u.status || 'active',
      u.createdAt || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-users-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="users-page">
      <PageHeader
        title="User Access & Security Control"
        subtitle="Manage system roles, staff permissions, and authenticated accounts"
        action={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportCSV}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5 }}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleAddUser}
              sx={{ borderRadius: 2.5, fontWeight: 600, px: 2.5, background: 'linear-gradient(135deg, #1565C0 0%, #00ACC1 100%)' }}
            >
              Add New User
            </Button>
          </Box>
        }
      />

      {/* Role Counts */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(21, 101, 192, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565C0', mb: 0.5 }}>
                {users.filter(u => u && u.role === ROLES.ADMIN).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Administrators
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(0, 172, 193, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#00ACC1', mb: 0.5 }}>
                {users.filter(u => u && u.role === ROLES.SALES).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Sales Managers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mb: 0.5 }}>
                {users.filter(u => u && u.role === ROLES.INVENTORY).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Inventory Managers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.08)' }} />
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mb: 0.5 }}>
                {users.filter(u => u && u.role === ROLES.CUSTOMER).length}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Customer Accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by user name, email address, role, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1.5, color: 'text.secondary' }} />
          }}
        />
      </Paper>

      {/* Users Table */}
      <Paper sx={{ borderRadius: 3.5, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} elevation={0}>
        <TableContainer>
          <Table size="medium">
            <TableHead sx={{ bgcolor: '#F3F4F6' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>User ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Assigned Role</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#1F2937', py: 2, px: 2.5, fontSize: '0.88rem', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover
                  sx={{ 
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.04)' } 
                  }}
                >
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#1565C0' }}>
                      {user.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#071321', fontSize: '0.92rem' }}>
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2.5, color: '#374151', fontWeight: 500 }}>{user.email}</TableCell>
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Chip
                      label={user.role?.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: `${getRoleColor(user.role)}20`,
                        color: getRoleColor(user.role),
                        fontWeight: 800,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Chip
                      label={user.status === 'active' ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        bgcolor: user.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: user.status === 'active' ? '#059669' : '#DC2626',
                        fontWeight: 800
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2, px: 2.5, textAlign: 'center' }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<Edit />}
                      onClick={() => handleEditUser(user)}
                      sx={{ mr: 1, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(user)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, py: 2.5, px: 3 }}>
          {editMode ? `Edit User Account (${selectedUser?.id})` : 'Create New System User'}
        </DialogTitle>
        <form onSubmit={handleSaveUser}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={editMode}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editMode ? 'Leave blank to keep existing password' : 'Enter account password'}
                  required={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Role Access"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value={ROLES.ADMIN}>Admin (Full Access)</MenuItem>
                  <MenuItem value={ROLES.SALES}>Sales Manager</MenuItem>
                  <MenuItem value={ROLES.INVENTORY}>Inventory Manager</MenuItem>
                  <MenuItem value={ROLES.CUSTOMER}>Customer</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Account Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ px: 3, borderRadius: 2 }}>
              {editMode ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to delete user ${deleteDialog.user?.name} (${deleteDialog.user?.email})?`}
      />
    </div>
  );
};

export default Users;