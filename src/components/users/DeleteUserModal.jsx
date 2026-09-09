import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const DeleteUserModal = ({ open, user, loading, onClose, onConfirm }) => (
  <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Delete user?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This will permanently remove {user?.name || 'this account'} from the system. This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>{loading ? 'Deleting...' : 'Delete user'}</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteUserModal;
