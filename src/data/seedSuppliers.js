import { STORAGE_KEYS } from '../services/localStorageService';

const seedSuppliers = () => {
  const suppliers = [
    {
      id: 'SUP_TOYOTA001',
      companyName: 'Toyota Indus Motor Company',
      contactPerson: 'Ahmed Khan',
      email: 'ahmed.khan@toyota-indus.com',
      phone: '+92-21-111-TOYOTA',
      address: 'Plot 7, Sector 23, Korangi Industrial Area',
      city: 'Karachi',
      cnic: '12345-6789012-1',
      ntn: '1234567-8',
      status: 'active',
      notes: 'Official Toyota distributor for Pakistan',
      createdAt: new Date().toISOString()
    },
    {
      id: 'SUP_HONDA001',
      companyName: 'Honda Atlas Cars Pakistan',
      contactPerson: 'Fatima Ali',
      email: 'fatima.ali@honda-atlas.com',
      phone: '+92-42-111-HONDA',
      address: '14/1, Sahibzada Abdul Qayyum Road',
      city: 'Lahore',
      cnic: '23456-7890123-4',
      ntn: '2345678-9',
      status: 'active',
      notes: 'Premium Honda vehicles dealership',
      createdAt: new Date().toISOString()
    },
    {
      id: 'SUP_SUZUKI001',
      companyName: 'Pak Suzuki Motor Company',
      contactPerson: 'Imran Shah',
      email: 'imran.shah@paksuzuki.com',
      phone: '+92-21-111-SUZUKI',
      address: 'National Highway, Industrial Estate',
      city: 'Karachi',
      cnic: '34567-8901234-5',
      ntn: '3456789-0',
      status: 'active',
      notes: 'Largest automobile manufacturer in Pakistan',
      createdAt: new Date().toISOString()
    },
    {
      id: 'SUP_HYUNDAI001',
      companyName: 'Hyundai Nishat Motors',
      contactPerson: 'Sara Ahmed',
      email: 'sara.ahmed@hyundai-nishat.com',
      phone: '+92-42-111-HYUNDAI',
      address: 'M2 Motorway, Near Faizabad Interchange',
      city: 'Lahore',
      cnic: '45678-9012345-6',
      ntn: '4567890-1',
      status: 'active',
      notes: 'Hyundai authorized dealer for Punjab',
      createdAt: new Date().toISOString()
    }
  ];

  return suppliers;
};

export default seedSuppliers;
