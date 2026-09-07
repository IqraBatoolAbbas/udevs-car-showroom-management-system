require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Supplier, Car, Customer, Application, Setting } = require('./models');

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
  const [supplier] = await Supplier.findOrCreate({
    where: { id: 'SUP_TOYOTA001' },
    defaults: { companyName: 'Toyota Indus Motor Company', contactPerson: 'Ahmed Khan', city: 'Karachi', status: 'active' }
  });
  await Car.findOrCreate({
    where: { id: 'CAR_TOYOTA001' },
    defaults: {
      make: 'Toyota', model: 'Corolla', year: 2025, variant: 'Grande', purchaseRate: 6500000,
      sellingPrice: 7250000, profit: 750000, profitMargin: 10.34, availableColors: ['White', 'Black', 'Silver'],
      stock: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: 0, engine: '1800cc',
      images: [], description: 'Premium sedan with advanced features.', status: 'available', supplierId: supplier.id
    }
  });
  const [customer] = await Customer.findOrCreate({
    where: { id: 'CUST_001' },
    defaults: { name: 'John Doe', email: 'customer@udevs.com', phone: '+92-300-1234567', city: 'Lahore', status: 'active', userId: 'USR_CUST001' }
  });
  await Application.findOrCreate({
    where: { id: 'APP_2025_001' },
    defaults: {
      fullName: customer.name, email: customer.email, cellNumber: customer.phone, city: customer.city,
      selectedCar: '2025 Toyota Corolla Grande', selectedCarId: 'CAR_TOYOTA001', selectedColor: 'White',
      status: 'pending', statusHistory: [{ status: 'pending', timestamp: new Date().toISOString() }], customerId: customer.id
    }
  });
  await Setting.findOrCreate({
    where: { key: 'system' },
    defaults: { value: { showroomName: 'U Devs Car Showroom', currency: 'PKR', lowStockThreshold: 3, enableNotifications: true } }
  });
  console.log('Demo accounts seeded');
  await sequelize.close();
})().catch(error => { console.error(error); process.exit(1); });
