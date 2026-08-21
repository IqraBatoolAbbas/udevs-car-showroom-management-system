import { STORAGE_KEYS } from '../services/localStorageService';

const seedUsers = () => {
  const users = [
    {
      id: 'USR_ADMIN001',
      email: 'admin@udevs.com',
      password: 'Admin@123',
      name: 'System Administrator',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR_SALES001',
      email: 'sales@udevs.com',
      password: 'Sales@123',
      name: 'Sales Manager',
      role: 'sales',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR_INV001',
      email: 'inventory@udevs.com',
      password: 'Inventory@123',
      name: 'Inventory Manager',
      role: 'inventory',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR_CUST001',
      email: 'customer@udevs.com',
      password: 'Customer@123',
      name: 'John Doe',
      role: 'customer',
      status: 'active',
      phone: '+92-300-1234567',
      cnic: '12345-6789012-3',
      address: '123 Main Street, Lahore',
      city: 'Lahore',
      createdAt: new Date().toISOString()
    }
  ];

  return users;
};

export default seedUsers;
