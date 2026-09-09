import { useEffect, useMemo, useState } from 'react';
import { Download, PersonAdd, Search } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Grid, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import UserTable from '../../components/users/UserTable';
import UserModal from '../../components/users/UserModal';
import DeleteUserModal from '../../components/users/DeleteUserModal';
import { createUser, deleteUser, fetchUsers, updateUser } from '../../redux/users/userActions';
import { clearUserError, clearUserSuccess } from '../../redux/users/userSlice';
import { selectUsers, selectUsersError, selectUsersLoading, selectUsersSuccess } from '../../redux/users/userSelectors';
import { ROLES } from '../../utils/constants';
import './Users.css';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const success = useSelector(selectUsersSuccess);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBlocked, setDeleteBlocked] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => [user.name, user.email, user.role, user.id].some((value) => value?.toLowerCase().includes(term)));
  }, [searchTerm, users]);

  const closeFeedback = () => {
    if (error) dispatch(clearUserError());
    if (success) dispatch(clearUserSuccess());
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    const action = editingUser
      ? updateUser({ id: editingUser.id, payload })
      : createUser(payload);
    const result = await dispatch(action);
    if (!result.error) setModalOpen(false);
  };

  const handleDelete = (user) => {
    if (user.role === ROLES.ADMIN && users.filter((item) => item.role === ROLES.ADMIN).length === 1) {
      setDeleteBlocked(true);
      return;
    }
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteUser(deleteTarget.id));
    if (!result.error) setDeleteTarget(null);
  };

  const exportCsv = () => {
    const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Status', 'Created Date'];
    const rows = filteredUsers.map((user) => [user.id, user.name, user.email, user.role, user.status, user.createdAt]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value || '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const roleCount = (role) => users.filter((user) => user.role === role).length;

  return (
    <Box className="users-page">
      <PageHeader
        title="User Access & Security Control"
        subtitle="Manage system roles, staff permissions, and authenticated accounts"
        action={<Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<Download />} onClick={exportCsv}>Export CSV</Button>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={openCreate}>Add New User</Button>
        </Box>}
      />

      {(error || success) && (
        <Snackbar open autoHideDuration={5000} onClose={closeFeedback}>
          <Alert severity={error ? 'error' : 'success'} onClose={closeFeedback}>{error || 'User operation completed successfully.'}</Alert>
        </Snackbar>
      )}
      <Snackbar open={deleteBlocked} autoHideDuration={5000} onClose={() => setDeleteBlocked(false)}>
        <Alert severity="warning" onClose={() => setDeleteBlocked(false)}>The last administrator account cannot be deleted.</Alert>
      </Snackbar>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          ['Total users', users.length, '#1565C0'],
          ['Administrators', roleCount(ROLES.ADMIN), '#7C3AED'],
          ['Sales & inventory', roleCount(ROLES.SALES) + roleCount(ROLES.INVENTORY), '#00ACC1'],
          ['Active accounts', users.filter((user) => user.status === 'active').length, '#10B981']
        ].map(([label, count, color]) => (
          <Grid item xs={6} md={3} key={label}>
            <Card className="stat-card"><CardContent><Typography variant="h4" sx={{ color, fontWeight: 800 }}>{count}</Typography><Typography color="text.secondary" fontWeight={600}>{label}</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Card className="users-table">
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, role, or ID"
            sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          />
          {error && !users.length ? <ErrorState message={error} onRetry={() => dispatch(fetchUsers())} /> : <UserTable users={filteredUsers} loading={loading} onEdit={openEdit} onDelete={handleDelete} />}
        </CardContent>
      </Card>

      <UserModal open={modalOpen} user={editingUser} users={users} loading={loading} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <DeleteUserModal open={!!deleteTarget} user={deleteTarget} loading={loading} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </Box>
  );
};

export default Users;
