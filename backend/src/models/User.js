const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING(500), allowNull: false },
  email: { type: DataTypes.STRING(500), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'sales', 'inventory', 'customer'), allowNull: false, defaultValue: 'customer' },
  status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
  phone: DataTypes.STRING, cnic: { type: DataTypes.STRING, unique: true, allowNull: true }, address: DataTypes.STRING, city: DataTypes.STRING,
  avatar: DataTypes.TEXT
}, { tableName: 'users' });

module.exports = User;
