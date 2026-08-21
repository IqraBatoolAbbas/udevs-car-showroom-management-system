// Form validation utilities

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Valid or not
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Pakistani phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Valid or not
 */
export const isValidPhone = (phone) => {
  // Accept formats: +92-XXX-XXXXXXX, 03XX-XXXXXXX, 03XXXXXXXXX
  const phoneRegex = /^(\+92-?|0)?[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

/**
 * Validate Pakistani CNIC format
 * @param {string} cnic - CNIC to validate
 * @returns {boolean} Valid or not
 */
export const isValidCNIC = (cnic) => {
  // Format: XXXXX-XXXXXXX-X
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
  return cnicRegex.test(cnic);
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean} Valid or not
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate non-negative number
 * @param {number} value - Number to validate
 * @returns {boolean} Valid or not
 */
export const isNonNegative = (value) => {
  return typeof value === 'number' && value >= 0;
};

/**
 * Validate positive number
 * @param {number} value - Number to validate
 * @returns {boolean} Valid or not
 */
export const isPositive = (value) => {
  return typeof value === 'number' && value > 0;
};

/**
 * Validate year is reasonable
 * @param {number} year - Year to validate
 * @returns {boolean} Valid or not
 */
export const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 2000 && year <= currentYear + 2;
};

/**
 * Validate car form data
 * @param {Object} carData - Car data to validate
 * @returns {Object} Validation errors
 */
export const validateCarForm = (carData) => {
  const errors = {};

  if (!isRequired(carData.make)) errors.make = 'Make is required';
  if (!isRequired(carData.model)) errors.model = 'Model is required';
  if (!isRequired(carData.variant)) errors.variant = 'Variant is required';
  
  if (!isRequired(carData.year)) {
    errors.year = 'Year is required';
  } else if (!isValidYear(carData.year)) {
    errors.year = 'Year must be between 2000 and current year + 2';
  }

  if (!isRequired(carData.purchaseRate)) {
    errors.purchaseRate = 'Purchase rate is required';
  } else if (!isNonNegative(carData.purchaseRate)) {
    errors.purchaseRate = 'Purchase rate must be non-negative';
  }

  if (!isRequired(carData.sellingPrice)) {
    errors.sellingPrice = 'Selling price is required';
  } else if (!isPositive(carData.sellingPrice)) {
    errors.sellingPrice = 'Selling price must be positive';
  } else if (carData.sellingPrice < carData.purchaseRate) {
    errors.sellingPrice = 'Selling price should not be lower than purchase rate';
  }

  if (!isRequired(carData.availableColors) || carData.availableColors.length === 0) {
    errors.availableColors = 'At least one color is required';
  }

  if (!isRequired(carData.stock)) {
    errors.stock = 'Stock is required';
  } else if (!isNonNegative(carData.stock) || !Number.isInteger(carData.stock)) {
    errors.stock = 'Stock must be a non-negative integer';
  }

  if (!isRequired(carData.fuel)) errors.fuel = 'Fuel type is required';
  if (!isRequired(carData.transmission)) errors.transmission = 'Transmission is required';
  if (!isRequired(carData.status)) errors.status = 'Status is required';
  if (!isRequired(carData.supplierId)) errors.supplierId = 'Supplier is required';

  return errors;
};

/**
 * Validate supplier form data
 * @param {Object} supplierData - Supplier data to validate
 * @returns {Object} Validation errors
 */
export const validateSupplierForm = (supplierData) => {
  const errors = {};

  if (!isRequired(supplierData.companyName)) {
    errors.companyName = 'Company name is required';
  }

  if (!isRequired(supplierData.contactPerson)) {
    errors.contactPerson = 'Contact person is required';
  }

  if (!isRequired(supplierData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(supplierData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(supplierData.phone)) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(supplierData.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  if (!isRequired(supplierData.address)) {
    errors.address = 'Address is required';
  }

  if (!isRequired(supplierData.city)) {
    errors.city = 'City is required';
  }

  return errors;
};

/**
 * Validate customer form data
 * @param {Object} customerData - Customer data to validate
 * @returns {Object} Validation errors
 */
export const validateCustomerForm = (customerData) => {
  const errors = {};

  if (!isRequired(customerData.name)) {
    errors.name = 'Name is required';
  }

  if (!isRequired(customerData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(customerData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(customerData.phone)) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(customerData.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  if (!isRequired(customerData.cnic)) {
    errors.cnic = 'CNIC is required';
  } else if (!isValidCNIC(customerData.cnic)) {
    errors.cnic = 'Invalid CNIC format (XXXXX-XXXXXXX-X)';
  }

  if (!isRequired(customerData.address)) {
    errors.address = 'Address is required';
  }

  if (!isRequired(customerData.city)) {
    errors.city = 'City is required';
  }

  return errors;
};

/**
 * Validate application form data
 * @param {Object} applicationData - Application data to validate
 * @returns {Object} Validation errors
 */
export const validateApplicationForm = (applicationData) => {
  const errors = {};

  if (!isRequired(applicationData.fullName)) {
    errors.fullName = 'Full name is required';
  }

  if (!isRequired(applicationData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(applicationData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(applicationData.cnic)) {
    errors.cnic = 'CNIC is required';
  } else if (!isValidCNIC(applicationData.cnic)) {
    errors.cnic = 'Invalid CNIC format (XXXXX-XXXXXXX-X)';
  }

  if (!isRequired(applicationData.cellNumber)) {
    errors.cellNumber = 'Cell number is required';
  } else if (!isValidPhone(applicationData.cellNumber)) {
    errors.cellNumber = 'Invalid cell number format';
  }

  if (!isRequired(applicationData.address)) {
    errors.address = 'Address is required';
  }

  if (!isRequired(applicationData.city)) {
    errors.city = 'City is required';
  }

  if (!isRequired(applicationData.selectedCar)) {
    errors.selectedCar = 'Car selection is required';
  }

  if (!isRequired(applicationData.selectedColor)) {
    errors.selectedColor = 'Color selection is required';
  }

  return errors;
};
