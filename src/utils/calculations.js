// Business calculation utilities

/**
 * Calculate gross profit
 * @param {number} sellingPrice - Selling price of the car
 * @param {number} purchaseRate - Purchase rate of the car
 * @returns {number} Gross profit
 */
export const calculateProfit = (sellingPrice, purchaseRate) => {
  return sellingPrice - purchaseRate;
};

/**
 * Calculate profit margin percentage
 * @param {number} profit - Gross profit
 * @param {number} sellingPrice - Selling price
 * @returns {number} Profit margin percentage
 */
export const calculateProfitMargin = (profit, sellingPrice) => {
  if (sellingPrice === 0) return 0;
  return ((profit / sellingPrice) * 100).toFixed(2);
};

/**
 * Get profit margin category
 * @param {number} margin - Profit margin percentage
 * @returns {string} Category (High, Medium, Low)
 */
export const getProfitMarginCategory = (margin) => {
  if (margin >= 15) return 'High';
  if (margin >= 10) return 'Medium';
  return 'Low';
};

/**
 * Calculate total estimated profit from car inventory
 * @param {Array} cars - Array of car objects
 * @returns {number} Total estimated profit
 */
export const calculateTotalProfit = (cars) => {
  return cars.reduce((total, car) => total + (car.profit || 0), 0);
};

/**
 * Calculate inventory statistics
 * @param {Array} cars - Array of car objects
 * @returns {Object} Inventory statistics
 */
export const calculateInventoryStats = (cars) => {
  const stats = {
    total: cars.length,
    available: cars.filter(car => car.status === 'available').length,
    reserved: cars.filter(car => car.status === 'reserved').length,
    sold: cars.filter(car => car.status === 'sold').length,
    inactive: cars.filter(car => car.status === 'inactive').length,
    totalStock: cars.reduce((sum, car) => sum + (car.stock || 0), 0),
    lowStock: cars.filter(car => car.stock <= 3).length
  };

  return stats;
};

/**
 * Calculate application statistics
 * @param {Array} applications - Array of application objects
 * @returns {Object} Application statistics
 */
export const calculateApplicationStats = (applications) => {
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    reserved: applications.filter(app => app.status === 'reserved').length,
    completed: applications.filter(app => app.status === 'completed').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return stats;
};

/**
 * Calculate supplier statistics
 * @param {Array} suppliers - Array of supplier objects
 * @param {Array} cars - Array of car objects
 * @returns {Object} Supplier statistics
 */
export const calculateSupplierStats = (suppliers, cars) => {
  return suppliers.map(supplier => {
    const supplierCars = cars.filter(car => car.supplierId === supplier.id);
    const totalStock = supplierCars.reduce((sum, car) => sum + (car.stock || 0), 0);
    const totalValue = supplierCars.reduce((sum, car) => sum + (car.purchaseRate || 0), 0);

    return {
      ...supplier,
      carCount: supplierCars.length,
      totalStock,
      totalValue
    };
  });
};

/**
 * Format currency in PKR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-PK').format(number);
};
