import { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { ROLES } from '../../utils/constants';
import { validateUserForm } from '../../utils/validators';

const emptyForm = { name: '', email: '', password: '', role: ROLES.SALES, status: 'active' };

const UserForm = ({ user, users, loading, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(user ? { name: user.name || '', email: user.email || '', password: '', role: user.role || ROLES.SALES, status: user.status || 'active' } : emptyForm);
    setErrors({});
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateUserForm(form, users, user?.id);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const payload = { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() };
    if (user && !payload.password) delete payload.password;
    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Full name" name="name" value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required autoFocus />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email address" name="email" type="email" value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label={user ? 'New password (optional)' : 'Password'} name="password" type="password" value={form.password} onChange={handleChange} error={!!errors.password} helperText={errors.password || (user ? 'Leave blank to keep the current password' : 'Use at least 8 characters')} required={!user} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Role" name="role" value={form.role} onChange={handleChange} error={!!errors.role} helperText={errors.role} required>
            <MenuItem value={ROLES.ADMIN}>Administrator</MenuItem>
            <MenuItem value={ROLES.SALES}>Sales</MenuItem>
            <MenuItem value={ROLES.INVENTORY}>Inventory</MenuItem>
            <MenuItem value={ROLES.CUSTOMER}>Customer</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Status" name="status" value={form.status} onChange={handleChange} error={!!errors.status} helperText={errors.status} required>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : user ? 'Update user' : 'Create user'}</Button>
      </Box>
    </Box>
  );
};

export { emptyForm };
export default UserForm;
