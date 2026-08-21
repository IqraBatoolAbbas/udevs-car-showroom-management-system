// Data formatting utilities

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date and time to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Mask sensitive information (e.g., CNIC, phone)
 * @param {string} value - Value to mask
 * @param {number} visibleChars - Number of characters to show at start and end
 * @returns {string} Masked value
 */
export const maskSensitive = (value, visibleChars = 3) => {
  if (!value || value.length <= visibleChars * 2) return value;
  
  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(value.length - visibleChars * 2);
  
  return `${start}${middle}${end}`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format status for display
 * @param {string} status - Status to format
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return toTitleCase(status);
};

/**
 * Get status color for UI
 * @param {string} status - Status to get color for
 * @returns {string} Color code
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: '#FFA726',
    approved: '#42A5F5',
    reserved: '#AB47BC',
    completed: '#66BB6A',
    rejected: '#EF5350',
    available: '#66BB6A',
    sold: '#EF5350',
    inactive: '#9E9E9E',
    active: '#66BB6A'
  };
  
  return colors[status?.toLowerCase()] || '#9E9E9E';
};

/**
 * Format car name for display
 * @param {Object} car - Car object
 * @returns {string} Formatted car name
 */
export const formatCarName = (car) => {
  if (!car) return 'Unknown Car';
  return `${car.year} ${car.make} ${car.model} ${car.variant || ''}`.trim();
};

/**
 * Format address for display
 * @param {Object} addressData - Address data object
 * @returns {string} Formatted address
 */
export const formatAddress = (addressData) => {
  if (!addressData) return 'N/A';
  const parts = [
    addressData.address,
    addressData.city
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
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
