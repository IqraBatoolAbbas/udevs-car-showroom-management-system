import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';
import seedUsers from './seedUsers';
import seedSuppliers from './seedSuppliers';
import seedCars from './seedCars';
import seedCustomers from './seedCustomers';
import seedApplications from './seedApplications';
import seedNotifications from './seedNotifications';
import seedActivityLogs from './seedActivityLogs';

const seedInitialData = () => {
  // Seed initial mock data on first launch or if key is missing/empty
  if (!localStorageService.hasKey(STORAGE_KEYS.USERS) || localStorageService.getData(STORAGE_KEYS.USERS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.USERS, seedUsers());
  } else {
    // Keep the four documented demo accounts mapped to their documented roles.
    // This also repairs data left behind by an earlier demo run where a role was edited.
    const seededUsers = seedUsers();
    const savedUsers = localStorageService.getData(STORAGE_KEYS.USERS, []);
    const repairedUsers = seededUsers.reduce((users, demoUser) => {
      const index = users.findIndex(user => user.email?.toLowerCase() === demoUser.email.toLowerCase());
      if (index >= 0) {
        users[index] = {
          ...users[index],
          id: demoUser.id,
          email: demoUser.email,
          password: demoUser.password,
          name: demoUser.name,
          role: demoUser.role,
          status: 'active'
        };
      } else {
        users.push(demoUser);
      }
      return users;
    }, [...savedUsers]);
    localStorageService.setData(STORAGE_KEYS.USERS, repairedUsers);
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.SUPPLIERS) || localStorageService.getData(STORAGE_KEYS.SUPPLIERS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.SUPPLIERS, seedSuppliers());
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.CARS) || localStorageService.getData(STORAGE_KEYS.CARS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.CARS, seedCars());
  } else {
    // Replace only the previously broken seeded Honda image URLs; preserve all user-created cars and edits.
    const cars = localStorageService.getData(STORAGE_KEYS.CARS, []);
    const oldHondaImages = [
      'https://images.unsplash.com/photo-1619362280259-6e1e60e19c5e?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
    ];
    const replacementHondaImages = [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85'
    ];
    const repairedCars = cars.map(car => car.id === 'CAR_HONDA001' &&
      car.images?.every((image, index) => image === oldHondaImages[index])
      ? { ...car, images: replacementHondaImages }
      : car
    );
    localStorageService.setData(STORAGE_KEYS.CARS, repairedCars);
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.CUSTOMERS) || localStorageService.getData(STORAGE_KEYS.CUSTOMERS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.CUSTOMERS, seedCustomers());
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.APPLICATIONS) || localStorageService.getData(STORAGE_KEYS.APPLICATIONS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.APPLICATIONS, seedApplications());
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.NOTIFICATIONS) || localStorageService.getData(STORAGE_KEYS.NOTIFICATIONS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.NOTIFICATIONS, seedNotifications());
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.ACTIVITY_LOGS) || localStorageService.getData(STORAGE_KEYS.ACTIVITY_LOGS, []).length === 0) {
    localStorageService.setData(STORAGE_KEYS.ACTIVITY_LOGS, seedActivityLogs());
  }

  if (!localStorageService.hasKey(STORAGE_KEYS.SETTINGS)) {
    localStorageService.setData(STORAGE_KEYS.SETTINGS, {
      showroomName: 'U Devs Car Showroom',
      currency: 'PKR',
      dateFormat: 'DD/MM/YYYY',
      lowStockThreshold: 3,
      enableNotifications: true,
      enableEmailAlerts: false,
      companyAddress: '123 Business Avenue, Gulberg III, Lahore',
      companyPhone: '+92-42-111-UDEVS',
      companyEmail: 'info@udevs-showroom.com'
    });
  }
};

export default seedInitialData;
