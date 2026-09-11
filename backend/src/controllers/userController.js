const bcrypt = require('bcrypt');
const { User } = require('../models');
const safeUser = require('../utils/safeUser');

const getUsers = async (req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ success: true, message: 'Users fetched', data: users.map(safeUser), errors: [] });
};
const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: safeUser(user) });
};
const createUser = async (req, res) => {
  const { password, ...data } = req.body;
  const user = await User.create({ id: data.id || `USR_${Date.now()}`, ...data, email: data.email.toLowerCase(), password: await bcrypt.hash(password, 12) });
  res.status(201).json({ success: true, message: 'User created', data: safeUser(user) });
};
const updateUser = async (req, res) => {
  const requestedUserId = req.body.id;

  if (
    req.user.role === 'customer' &&
    requestedUserId !== req.userId
  ) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile'
    });
  }
  const user = await User.findByPk(req.body.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const {
    name,
    email,
    password,
    role,
    status,
    phone,
    cnic,
    address,
    city,
    joiningDate
  } = req.body;

  const updates = {
    name,
    email: email?.trim().toLowerCase(),
    role,
    status,
    phone: phone?.trim() || null,
    cnic: cnic?.trim() || null,
    address: address?.trim() || null,
    city: city?.trim() || null,
    joiningDate: joiningDate || null
  };

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  if (password) {
    updates.password = await bcrypt.hash(password, 12);
  }

  await user.update(updates);

  res.json({
    success: true,
    message: 'User updated',
    data: safeUser(user)
  });
};
const deleteUser = async (req, res) => {
  if (req.params.id === req.userId) return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(204).send();
};
module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
