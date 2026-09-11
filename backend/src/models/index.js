const sequelize = require('../config/db');
const User = require('./User');
const Car = require('./Car');
const Supplier = require('./Supplier');
const Customer = require('./Customer');
const Application = require('./Application');
const Notification = require('./Notification');
const ActivityLog = require('./ActivityLog');
const Setting = require('./Setting');

Supplier.hasMany(Car, { foreignKey: 'supplierId', sourceKey: 'id' });
Car.belongsTo(Supplier, { foreignKey: 'supplierId', targetKey: 'id' });
User.hasMany(Customer, { foreignKey: 'userId', sourceKey: 'id' });
User.hasMany(ActivityLog, { foreignKey: 'userId', sourceKey: 'id' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
Customer.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
Customer.hasMany(Application, { foreignKey: 'customerId', sourceKey: 'id' });
Application.belongsTo(Customer, { foreignKey: 'customerId', targetKey: 'id' });

module.exports = { sequelize, User, Car, Supplier, Customer, Application, Notification, ActivityLog, Setting };
