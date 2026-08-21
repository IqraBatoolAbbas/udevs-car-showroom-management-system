import { STORAGE_KEYS } from '../services/localStorageService';

const seedCustomers = () => {
  const customers = [
    {
      id: 'CUST_001',
      name: 'John Doe',
      email: 'customer@udevs.com',
      phone: '+92-300-1234567',
      cnic: '12345-6789012-3',
      address: '123 Main Street, Lahore',
      city: 'Lahore',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CUST_002',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      phone: '+92-301-2345678',
      cnic: '23456-7890123-4',
      address: '456 Garden Road, Islamabad',
      city: 'Islamabad',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CUST_003',
      name: 'Ali Khan',
      email: 'ali.khan@email.com',
      phone: '+92-302-3456789',
      cnic: '34567-8901234-5',
      address: '789 Mall Road, Karachi',
      city: 'Karachi',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  return customers;
};

export default seedCustomers;
