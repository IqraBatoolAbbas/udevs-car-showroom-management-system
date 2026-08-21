import { STORAGE_KEYS } from '../services/localStorageService';

const seedCars = () => {
  const cars = [
    {
      id: 'CAR_TOYOTA001',
      make: 'Toyota',
      model: 'Corolla',
      year: 2025,
      variant: 'Grande',
      purchaseRate: 6500000,
      sellingPrice: 7250000,
      profit: 750000,
      profitMargin: 10.34,
      availableColors: ['White', 'Black', 'Silver', 'Red'],
      stock: 5,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1800cc',
      images: [
        'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
      ],
      description: 'Toyota Corolla Grande - Premium sedan with advanced features and luxurious interior.',
      status: 'available',
      supplierId: 'SUP_TOYOTA001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_TOYOTA002',
      make: 'Toyota',
      model: 'Corolla',
      year: 2025,
      variant: 'VTi',
      purchaseRate: 5200000,
      sellingPrice: 5800000,
      profit: 600000,
      profitMargin: 10.34,
      availableColors: ['White', 'Silver', 'Blue'],
      stock: 8,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1600cc',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        'https://images.unsplash.com/photo-1619362280259-6e1e60e19c5e?w=800'
      ],
      description: 'Toyota Corolla VTi - Efficient and reliable sedan for daily commuting.',
      status: 'available',
      supplierId: 'SUP_TOYOTA001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_HONDA001',
      make: 'Honda',
      model: 'Civic',
      year: 2025,
      variant: 'Turbo',
      purchaseRate: 8500000,
      sellingPrice: 9500000,
      profit: 1000000,
      profitMargin: 10.53,
      availableColors: ['White', 'Black', 'Red'],
      stock: 3,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1500cc Turbo',
      images: [
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85'
      ],
      description: 'Honda Civic Turbo - Sporty sedan with turbocharged engine and advanced technology.',
      status: 'available',
      supplierId: 'SUP_HONDA001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_HONDA002',
      make: 'Honda',
      model: 'City',
      year: 2025,
      variant: 'Aspire',
      purchaseRate: 4200000,
      sellingPrice: 4700000,
      profit: 500000,
      profitMargin: 10.64,
      availableColors: ['White', 'Silver', 'Gray'],
      stock: 6,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1500cc',
      images: [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800'
      ],
      description: 'Honda City Aspire - Compact sedan with excellent fuel economy and comfort.',
      status: 'available',
      supplierId: 'SUP_HONDA001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_SUZUKI001',
      make: 'Suzuki',
      model: 'Cultus',
      year: 2025,
      variant: 'VXR',
      purchaseRate: 2800000,
      sellingPrice: 3200000,
      profit: 400000,
      profitMargin: 12.5,
      availableColors: ['White', 'Silver', 'Blue', 'Red'],
      stock: 10,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1200cc',
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
      ],
      description: 'Suzuki Cultus VXR - Popular hatchback with excellent value for money.',
      status: 'available',
      supplierId: 'SUP_SUZUKI001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_HYUNDAI001',
      make: 'Hyundai',
      model: 'Elantra',
      year: 2025,
      variant: 'GLS',
      purchaseRate: 5500000,
      sellingPrice: 6200000,
      profit: 700000,
      profitMargin: 11.29,
      availableColors: ['White', 'Black', 'Silver'],
      stock: 4,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1600cc',
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'
      ],
      description: 'Hyundai Elantra GLS - Stylish sedan with modern features and comfortable ride.',
      status: 'available',
      supplierId: 'SUP_HYUNDAI001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_TOYOTA003',
      make: 'Toyota',
      model: 'Yaris',
      year: 2025,
      variant: 'Ativ',
      purchaseRate: 3800000,
      sellingPrice: 4300000,
      profit: 500000,
      profitMargin: 11.63,
      availableColors: ['White', 'Red', 'Blue'],
      stock: 7,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '1300cc',
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'
      ],
      description: 'Toyota Yaris Ativ - Compact sedan with Toyota reliability and efficiency.',
      status: 'available',
      supplierId: 'SUP_TOYOTA001',
      createdAt: new Date().toISOString()
    },
    {
      id: 'CAR_HYUNDAI002',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2025,
      variant: 'FWD',
      purchaseRate: 7500000,
      sellingPrice: 8500000,
      profit: 1000000,
      profitMargin: 11.76,
      availableColors: ['White', 'Black', 'Gray'],
      stock: 2,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: 0,
      engine: '2000cc',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
        'https://images.unsplash.com/photo-1619362280259-6e1e60e19c5e?w=800'
      ],
      description: 'Hyundai Tucson FWD - Compact SUV with spacious interior and advanced safety features.',
      status: 'available',
      supplierId: 'SUP_HYUNDAI001',
      createdAt: new Date().toISOString()
    }
  ];

  return cars;
};

export default seedCars;
