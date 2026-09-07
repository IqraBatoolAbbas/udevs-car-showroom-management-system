require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

const accounts = [
  ['USR_ADMIN001', 'admin@udevs.com', 'Admin@123', 'System Administrator', 'admin'],
  ['USR_SALES001', 'sales@udevs.com', 'Sales@123', 'Sales Manager', 'sales'],
  ['USR_INV001', 'inventory@udevs.com', 'Inventory@123', 'Inventory Manager', 'inventory'],
  ['USR_CUST001', 'customer@udevs.com', 'Customer@123', 'John Doe', 'customer']
];

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  for (const [id, email, password, name, role] of accounts) {
    await User.findOrCreate({
      where: { email },
      defaults: { id, email, password: await bcrypt.hash(password, 12), name, role, status: 'active' }
    });
  }
  console.log('Demo accounts seeded');
  await sequelize.close();
})().catch(error => { console.error(error); process.exit(1); });
