require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Supplier, Car, Customer, Application, Setting } = require('./models');

const accounts = [
  ['USR_ADMIN001', 'admin@udevs.com', 'Admin@123', 'System Administrator', 'admin'],
  ['USR_SALES001', 'sales@udevs.com', 'Sales@123', 'Sales Manager', 'sales'],
  ['USR_INV001', 'inventory@udevs.com', 'Inventory@123', 'Inventory Manager', 'inventory'],
  ['USR_CUST001', 'customer@udevs.com', 'Customer@123', 'John Doe', 'customer']
];

const seedDemoData = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  for (const [id, email, password, name, role] of accounts) {
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { id, email, password: await bcrypt.hash(password, 12), name, role, status: 'active' }
    });
    await user.update({ status: 'active', role, name });
  }
  const [supplier] = await Supplier.findOrCreate({
    where: { id: 'SUP_TOYOTA001' },
    defaults: { companyName: 'Toyota Indus Motor Company', contactPerson: 'Ahmed Khan', city: 'Karachi', status: 'active' }
  });
  const [primaryCar] = await Car.findOrCreate({
    where: { id: 'CAR_TOYOTA001' },
    defaults: {
      make: 'Toyota', model: 'Corolla', year: 2025, variant: 'Grande', purchaseRate: 6500000,
      sellingPrice: 7250000, profit: 750000, profitMargin: 10.34, availableColors: ['White', 'Black', 'Silver'],
      stock: 5, fuel: 'Petrol', transmission: 'Automatic', mileage: 0, engine: '1800cc',
      images: ['/images/pic1.png', '/images/pic2.png'], description: 'Premium sedan with advanced features.', status: 'available', supplierId: supplier.id
    }
  });
  await primaryCar.update({ status: 'available', stock: 5, images: ['/images/pic1.png', '/images/pic2.png'] });
  const showroomCars = [
    ['CAR_TOYOTA002', 'Toyota', 'Yaris', 'Ativ', 4300000, 7, '1300cc', 'Petrol'],
    ['CAR_HONDA001', 'Honda', 'Civic', 'Turbo', 9500000, 3, '1500cc Turbo', 'Petrol'],
    ['CAR_HONDA002', 'Honda', 'City', 'Aspire', 4700000, 6, '1500cc', 'Petrol'],
    ['CAR_SUZUKI001', 'Suzuki', 'Cultus', 'VXR', 3200000, 10, '1200cc', 'Petrol'],
    ['CAR_HYUNDAI001', 'Hyundai', 'Elantra', 'GLS', 6200000, 4, '1600cc', 'Petrol'],
    ['CAR_HYUNDAI002', 'Hyundai', 'Tucson', 'FWD', 8500000, 2, '2000cc', 'Petrol']
  ];
  for (const [index, [id, make, model, variant, sellingPrice, stock, engine, fuel]] of showroomCars.entries()) {
    const [car] = await Car.findOrCreate({
      where: { id },
      defaults: {
        make, model, variant, year: 2025, purchaseRate: Math.round(sellingPrice * 0.9),
        sellingPrice, profit: Math.round(sellingPrice * 0.1), profitMargin: 10,
        availableColors: ['White', 'Black', 'Silver', 'Red'], stock, fuel, transmission: 'Automatic',
        mileage: 0, engine, images: [`/images/pic${index + 1}.png`, `/images/pic${(index + 2) % 7 + 1}.png`], description: `${make} ${model} ${variant} - showroom vehicle with verified specifications.`,
        status: 'available', supplierId: supplier.id
      }
    });
    await car.update({ status: 'available', stock, images: [`/images/pic${index + 1}.png`, `/images/pic${(index + 2) % 7 + 1}.png`] });
  }
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
  console.log('Demo accounts and showroom inventory seeded');
};

if (require.main === module) {
  seedDemoData()
    .then(() => sequelize.close())
    .catch(error => { console.error(error); process.exit(1); });
}

module.exports = seedDemoData;
