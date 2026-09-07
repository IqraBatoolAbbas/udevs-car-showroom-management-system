const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
  id: { type: DataTypes.STRING, primaryKey: true },
  make: { type: DataTypes.STRING, allowNull: false }, model: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false }, variant: DataTypes.STRING,
  purchaseRate: { type: DataTypes.DECIMAL(14, 2), allowNull: false }, sellingPrice: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  profit: DataTypes.DECIMAL(14, 2), profitMargin: DataTypes.DECIMAL(7, 2),
  availableColors: { type: DataTypes.JSONB, defaultValue: [] }, stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  fuel: DataTypes.STRING, transmission: DataTypes.STRING, mileage: DataTypes.INTEGER, engine: DataTypes.STRING,
  images: { type: DataTypes.JSONB, defaultValue: [] }, description: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('available', 'reserved', 'sold', 'inactive'), defaultValue: 'available' },
  supplierId: DataTypes.STRING
}, { tableName: 'cars' });

module.exports = Car;
