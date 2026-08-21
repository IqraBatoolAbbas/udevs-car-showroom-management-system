const seedNotifications = () => {
  const now = new Date();
  const minutesAgo = (mins) => new Date(now.getTime() - mins * 60 * 1000).toISOString();
  const hoursAgo = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

  const notifications = [
    {
      id: 'NOTIF_001',
      title: 'Low Stock Warning',
      message: 'Hyundai Tucson FWD has only 2 units left in inventory.',
      type: 'warning',
      read: false,
      timestamp: minutesAgo(25),
      targetRole: ['admin', 'inventory']
    },
    {
      id: 'NOTIF_002',
      title: 'New Car Application Received',
      message: 'John Doe submitted a new application for 2025 Toyota Corolla Grande.',
      type: 'info',
      read: false,
      timestamp: hoursAgo(2),
      targetRole: ['admin', 'sales']
    },
    {
      id: 'NOTIF_003',
      title: 'Application Approved',
      message: 'Application APP_2025_002 for Honda Civic Turbo has been approved.',
      type: 'success',
      read: true,
      timestamp: hoursAgo(5),
      targetRole: ['admin', 'sales', 'customer']
    },
    {
      id: 'NOTIF_004',
      title: 'Supplier Catalog Updated',
      message: 'Toyota Indus Motor Company updated their 2025 vehicle price sheet.',
      type: 'info',
      read: true,
      timestamp: hoursAgo(24),
      targetRole: ['admin', 'inventory']
    },
    {
      id: 'NOTIF_005',
      title: 'Order Completed',
      message: 'Order APP_2025_004 for Ali Khan marked as Delivered & Completed.',
      type: 'success',
      read: true,
      timestamp: hoursAgo(48),
      targetRole: ['admin', 'sales']
    }
  ];

  return notifications;
};

export default seedNotifications;
