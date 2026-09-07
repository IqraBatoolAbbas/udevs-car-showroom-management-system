require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Car, Customer } = require('./models');

const accounts = [
  ['USR_ADMIN001', 'admin@udevs.com', 'Admin@123', 'System Administrator', 'admin'],
  ['USR_SALES001', 'sales@udevs.com', 'Sales@123', 'Sales Manager', 'sales'],
  ['USR_INV001', 'inventory@udevs.com', 'Inventory@123', 'Inventory Manager', 'inventory'],
  ['USR_CUST001', 'customer@udevs.com', 'Customer@123', 'John Doe', 'customer']
];

const vehicles = [
  ['CAR_SUZUKI001', 'Suzuki', 'Cultus', 'VXR', 3200000, 2880000, '1200cc', 10, ['White', 'Black', 'Silver', 'Red']],
  ['CAR_TOYOTA001', 'Toyota', 'Yaris', 'Ativ', 4300000, 3870000, '1300cc', 7, ['White', 'Black', 'Silver']],
  ['CAR_HONDA001', 'Honda', 'City', 'Aspire', 4700000, 4230000, '1500cc', 6, ['White', 'Black', 'Blue']],
  ['CAR_HYUNDAI001', 'Hyundai', 'Elantra', 'GLS', 6200000, 5580000, '1600cc', 4, ['White', 'Gray', 'Black']],
  ['CAR_TOYOTA002', 'Toyota', 'Corolla', 'Grande', 7250000, 6525000, '1800cc', 5, ['White', 'Black', 'Silver']],
  ['CAR_HONDA002', 'Honda', 'Civic', 'Turbo', 9500000, 8550000, '1500cc Turbo', 3, ['White', 'Black', 'Red']],
  ['CAR_KIA001', 'KIA', 'Sportage', 'AWD', 10500000, 9450000, '2000cc', 4, ['White', 'Black', 'Gray']]
];

const seedDatabase = async () => {
  for (const [id, email, password, name, role] of accounts) {
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { id, email, password: await bcrypt.hash(password, 12), name, role, status: 'active' }
    });
    if (user.status !== 'active') await user.update({ status: 'active' });
    if (role === 'customer') {
      await Customer.findOrCreate({
        where: { userId: user.id },
        defaults: {
          id: 'CUST_DEMO001',
          userId: user.id,
          name,
          email,
          phone: '+92-300-1234567',
          city: 'Lahore',
          address: 'Lahore, Pakistan',
          status: 'active'
        }
      });
    }
  }

  for (let index = 0; index < vehicles.length; index += 1) {
    const [id, make, model, variant, sellingPrice, purchaseRate, engine, stock, availableColors] = vehicles[index];
    const images = [`/images/car${(index % 7) + 1}.jpg`, `/images/car${((index + 1) % 7) + 1}.jpg`];
    const values = {
      id, make, model, variant, year: 2025, purchaseRate, sellingPrice,
      profit: sellingPrice - purchaseRate,
      profitMargin: ((sellingPrice - purchaseRate) / purchaseRate) * 100,
      availableColors, stock, fuel: 'Petrol', transmission: 'Automatic',
      mileage: 0, engine, images, status: 'available',
      description: `${make} ${model} ${variant} - showroom vehicle with verified specifications.`
    };
    const [car, created] = await Car.findOrCreate({ where: { id }, defaults: values });
    if (!created) await car.update({ ...values, status: 'available' });
  }
};

if (require.main === module) {
  (async () => {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedDatabase();
    console.log('Demo accounts and vehicles seeded');
    await sequelize.close();
  })().catch(error => { console.error(error); process.exit(1); });
}

module.exports = seedDatabase;
