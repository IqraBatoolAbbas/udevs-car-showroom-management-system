const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Customer', {
  id: { type: DataTypes.STRING, primaryKey: true }, name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } }, phone: DataTypes.STRING,
  cnic: DataTypes.STRING, address: DataTypes.STRING, city: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }, userId: DataTypes.STRING
}, { tableName: 'customers' });
