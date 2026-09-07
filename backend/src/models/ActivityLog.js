const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define('ActivityLog', {
  id: { type: DataTypes.STRING, primaryKey: true }, userId: DataTypes.STRING, type: DataTypes.STRING,
  entity: DataTypes.STRING, entityId: DataTypes.STRING, description: DataTypes.TEXT, metadata: DataTypes.JSONB
}, { tableName: 'activity_logs' });
