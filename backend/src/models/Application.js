const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Application', {
  id: { type: DataTypes.STRING, primaryKey: true }, fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } }, cnic: DataTypes.STRING,
  cellNumber: DataTypes.STRING, address: DataTypes.STRING, city: DataTypes.STRING, selectedCar: DataTypes.STRING,
  selectedCarId: DataTypes.STRING, selectedColor: DataTypes.STRING,
  status: { type: DataTypes.ENUM('pending', 'approved', 'reserved', 'completed', 'rejected'), defaultValue: 'pending' },
  notes: DataTypes.TEXT, statusHistory: { type: DataTypes.JSONB, defaultValue: [] }, customerId: DataTypes.STRING
}, { tableName: 'applications' });
