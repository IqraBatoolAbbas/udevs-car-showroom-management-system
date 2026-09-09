const seedActivityLogs = () => {
  const now = new Date();
  const minutesAgo = (mins) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
  const hoursAgo = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

  const logs = [
    {
      id: 'LOG_001',
      type: 'login',
      entity: 'user',
      entityId: 'USR_ADMIN001',
      description: 'Admin logged into system console',
      userId: 'USR_ADMIN001',
      userEmail: 'admin@udevs.com',
      timestamp: minutesAgo(10)
    },
    {
      id: 'LOG_002',
      type: 'status_change',
      entity: 'application',
      entityId: 'APP_2025_002',
      description: 'Application APP_2025_002 status updated to Approved',
      userId: 'USR_SALES001',
      userEmail: 'sales@udevs.com',
      timestamp: hoursAgo(3)
    },
    {
      id: 'LOG_003',
      type: 'create',
      entity: 'application',
      entityId: 'APP_2025_001',
      description: 'New application submitted by John Doe for Toyota Corolla Grande',
      userId: 'USR_CUST001',
      userEmail: 'customer@udevs.com',
      timestamp: hoursAgo(5)
    },
    {
      id: 'LOG_004',
      type: 'update',
      entity: 'car',
      entityId: 'CAR_TOYOTA001',
      description: 'Updated inventory pricing and stock quantity for Toyota Corolla Grande',
      userId: 'USR_INV001',
      userEmail: 'inventory@udevs.com',
      timestamp: hoursAgo(12)
    },
    {
      id: 'LOG_005',
      type: 'create',
      entity: 'supplier',
      entityId: 'SUP_HYUNDAI001',
      description: 'Registered new supplier Hyundai Nishat Motors',
      userId: 'USR_ADMIN001',
      userEmail: 'admin@udevs.com',
      timestamp: hoursAgo(24)
    },
    {
      id: 'LOG_006',
      type: 'status_change',
      entity: 'application',
      entityId: 'APP_2025_004',
      description: 'Order APP_2025_004 marked as Completed / Delivered',
      userId: 'USR_SALES001',
      userEmail: 'sales@udevs.com',
      timestamp: hoursAgo(48)
    }
  ];

  return logs;
};

export default seedActivityLogs;
