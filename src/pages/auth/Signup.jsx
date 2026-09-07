import { useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await dispatch(register(payload)).unwrap();
      navigate(user?.role === 'customer' ? '/customer/dashboard' : '/login', { replace: true });
    } catch (reason) {
      setError(typeof reason === 'string' ? reason : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, bgcolor: '#071321' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ width: 'min(520px, 100%)', p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#071321', mb: 1 }}>Create Customer Account</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Sign up to browse vehicles and track applications.</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <TextField label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <TextField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required inputProps={{ minLength: 8 }} />
          <TextField label="Confirm password" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
          <Button type="submit" variant="contained" disabled={loading} size="large">{loading ? 'Creating account...' : 'Create account'}</Button>
          <Typography textAlign="center" variant="body2">Already registered? <Link to="/login">Sign in</Link></Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
