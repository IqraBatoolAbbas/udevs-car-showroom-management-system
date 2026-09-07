const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('Setting', {
  key: { type: DataTypes.STRING, primaryKey: true }, value: { type: DataTypes.JSONB, allowNull: false }
}, { tableName: 'settings', timestamps: true });
