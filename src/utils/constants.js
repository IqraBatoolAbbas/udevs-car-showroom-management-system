// Application constants

export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  INVENTORY: 'inventory',
  CUSTOMER: 'customer'
};

export const CAR_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD: 'sold',
  INACTIVE: 'inactive'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  RESERVED: 'reserved',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Hybrid',
  'Electric',
  'CNG'
];

export const TRANSMISSION_TYPES = [
  'Automatic',
  'Manual',
  'CVT'
];

export const CAR_COLORS = [
  'White',
  'Black',
  'Silver',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Brown',
  'Beige',
  'Gold',
  'Orange',
  'Yellow'
];

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Sargodha',
  'Hyderabad',
  'Abbottabad',
  'Sahiwal',
  'Jhang'
];

export const ACTIVITY_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  STATUS_CHANGE: 'status_change',
  LOGIN: 'login',
  LOGOUT: 'logout'
};

export const ACTIVITY_ENTITIES = {
  CAR: 'car',
  SUPPLIER: 'supplier',
  CUSTOMER: 'customer',
  APPLICATION: 'application',
  USER: 'user'
};

export const DASHBOARD_REFRESH_INTERVAL = 30000; // 30 seconds

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

export const PROFIT_MARGIN_THRESHOLDS = {
  HIGH: 15,
  MEDIUM: 10,
  LOW: 0
};

export const LOW_STOCK_THRESHOLD = 3;

export const ITEMS_PER_PAGE = 10;

export const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  YEAR_ASC: 'year_asc',
  YEAR_DESC: 'year_desc',
  STOCK_ASC: 'stock_asc',
  STOCK_DESC: 'stock_desc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc'
};

export const ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CARS: '/admin/cars',
  ADMIN_ADD_CAR: '/admin/cars/add',
  ADMIN_EDIT_CAR: '/admin/cars/edit/:id',
  ADMIN_CAR_DETAILS: '/admin/cars/:id',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_ADD_SUPPLIER: '/admin/suppliers/add',
  ADMIN_EDIT_SUPPLIER: '/admin/suppliers/edit/:id',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_USERS: '/admin/users',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  
  SALES_DASHBOARD: '/sales/dashboard',
  SALES_SHOWROOM: '/sales/showroom',
  SALES_CAR_DETAILS: '/sales/cars/:id',
  SALES_CUSTOMERS: '/sales/customers',
  SALES_APPLICATIONS: '/sales/applications',
  
  INVENTORY_DASHBOARD: '/inventory/dashboard',
  INVENTORY_CARS: '/inventory/cars',
  INVENTORY_ADD_CAR: '/inventory/cars/add',
  INVENTORY_EDIT_CAR: '/inventory/cars/edit/:id',
  INVENTORY_CAR_DETAILS: '/inventory/cars/:id',
  INVENTORY_SUPPLIERS: '/inventory/suppliers',
  INVENTORY_ADD_SUPPLIER: '/inventory/suppliers/add',
  INVENTORY_EDIT_SUPPLIER: '/inventory/suppliers/edit/:id',
  INVENTORY_REPORTS: '/inventory/reports',
  
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_SHOWROOM: '/customer/showroom',
  CUSTOMER_CAR_DETAILS: '/customer/cars/:id',
  CUSTOMER_APPLY_CAR: '/customer/apply/:id',
  CUSTOMER_APPLICATIONS: '/customer/applications',
  CUSTOMER_PROFILE: '/customer/profile',
  
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403'
};

export const MENU_ITEMS = {
  [ROLES.ADMIN]: [
    { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { path: ROUTES.ADMIN_CARS, label: 'Cars & Inventory', icon: 'DirectionsCar' },
    { path: ROUTES.ADMIN_SUPPLIERS, label: 'Suppliers', icon: 'Business' },
    { path: ROUTES.ADMIN_CUSTOMERS, label: 'Customers', icon: 'People' },
    { path: ROUTES.ADMIN_APPLICATIONS, label: 'Applications', icon: 'Assignment' },
    { path: ROUTES.ADMIN_USERS, label: 'User Control', icon: 'AdminPanelSettings' },
    { path: ROUTES.ADMIN_REPORTS, label: 'Analytics & Reports', icon: 'Assessment' },
    { path: ROUTES.ADMIN_SETTINGS, label: 'System Settings', icon: 'Settings' }
  ],
  [ROLES.SALES]: [
    { path: ROUTES.SALES_DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { path: ROUTES.SALES_SHOWROOM, label: 'Vehicle Showroom', icon: 'DirectionsCar' },
    { path: ROUTES.SALES_CUSTOMERS, label: 'Customer Directory', icon: 'People' },
    { path: ROUTES.SALES_APPLICATIONS, label: 'Car Applications', icon: 'Assignment' }
  ],
  [ROLES.INVENTORY]: [
    { path: ROUTES.INVENTORY_DASHBOARD, label: 'Dashboard', icon: 'Dashboard' },
    { path: ROUTES.INVENTORY_CARS, label: 'Cars Management', icon: 'DirectionsCar' },
    { path: ROUTES.INVENTORY_SUPPLIERS, label: 'Suppliers & Costs', icon: 'Business' },
    { path: ROUTES.INVENTORY_REPORTS, label: 'Stock Reports', icon: 'Assessment' }
  ],
  [ROLES.CUSTOMER]: [
    { path: ROUTES.CUSTOMER_DASHBOARD, label: 'Home', icon: 'Dashboard' },
    { path: ROUTES.CUSTOMER_SHOWROOM, label: 'Showroom', icon: 'DirectionsCar' },
    { path: ROUTES.CUSTOMER_APPLICATIONS, label: 'My Applications', icon: 'Assignment' },
    { path: ROUTES.CUSTOMER_PROFILE, label: 'My Profile', icon: 'Person' }
  ]
};
