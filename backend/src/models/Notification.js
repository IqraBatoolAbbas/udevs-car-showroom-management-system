const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Notification', {
  id: { type: DataTypes.STRING, primaryKey: true }, userId: DataTypes.STRING, type: DataTypes.STRING,
  title: DataTypes.STRING, message: { type: DataTypes.TEXT, allowNull: false }, read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'notifications' });
