const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const safeUser = require('../utils/safeUser');

const issueToken = (user) => jwt.sign(
  { userId: user.id, role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);
const authCookie = token => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000
});

const register = async (req, res) => {
  const { name, email, password, role = 'customer', ...profile } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const exists = await User.findOne({ where: { email: normalizedEmail } });
  if (exists) return res.status(409).json({ success: false, message: 'Email is already registered' });
  const user = await User.create({
    id: `USR_${Date.now()}`, name: name.trim(), email: normalizedEmail,
    password: await bcrypt.hash(password, 12), role: role === 'customer' ? 'customer' : 'customer', ...profile
  });
  const token = issueToken(user);
  res.cookie('access_token', token, authCookie(token));
  res.status(201).json({ success: true, message: 'Registration successful', data: { user: safeUser(user) } });
};

const login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email.trim().toLowerCase() } });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  if (user.status !== 'active') return res.status(403).json({ success: false, message: 'This account is inactive' });
  const token = issueToken(user);
  res.cookie('access_token', token, authCookie(token));
  res.json({ success: true, message: 'Login successful', data: { user: safeUser(user) } });
};

const me = async (req, res) => {
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: safeUser(user) });
};

module.exports = { register, login, me };
