const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Supplier', {
  id: { type: DataTypes.STRING, primaryKey: true }, companyName: { type: DataTypes.STRING, allowNull: false },
  contactPerson: DataTypes.STRING, email: { type: DataTypes.STRING, validate: { isEmail: true } }, phone: DataTypes.STRING,
  address: DataTypes.STRING, city: DataTypes.STRING, cnic: DataTypes.STRING, ntn: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }, notes: DataTypes.TEXT
}, { tableName: 'suppliers' });
