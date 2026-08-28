import { Delete, Edit } from '@mui/icons-material';
import { IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading && !users.length) return <LoadingSpinner message="Loading users..." />;
  if (!users.length) return <EmptyState message="No users found. Create a user account to get started." />;

  return (
    <TableContainer>
      <Table sx={{ minWidth: 700 }}>
        <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell>Created</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell><Typography fontWeight={700}>{user.name}</Typography><Typography variant="caption" color="text.secondary">{user.id}</Typography></TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><Chip label={user.role} size="small" variant="outlined" /></TableCell>
              <TableCell><Chip label={user.status} size="small" color={user.status === 'active' ? 'success' : 'default'} /></TableCell>
              <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit user"><IconButton color="primary" onClick={() => onEdit(user)}><Edit /></IconButton></Tooltip>
                <Tooltip title="Delete user"><IconButton color="error" onClick={() => onDelete(user)}><Delete /></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
