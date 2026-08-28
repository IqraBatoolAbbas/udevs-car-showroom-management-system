import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import UserForm from './UserForm';

const UserModal = ({ open, user, users, loading, onClose, onSubmit }) => (
  <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
    <DialogTitle>{user ? 'Edit user account' : 'Add new user'}</DialogTitle>
    <DialogContent>
      <UserForm user={user} users={users} loading={loading} onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default UserModal;
