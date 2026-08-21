// LocalStorage Service for Car Showroom Management System
// Provides a clean interface for LocalStorage operations with safe JSON parsing

const STORAGE_KEYS = {
  USERS: 'udevs_users',
  SESSION: 'udevs_session',
  CARS: 'udevs_cars',
  SUPPLIERS: 'udevs_suppliers',
  CUSTOMERS: 'udevs_customers',
  APPLICATIONS: 'udevs_applications',
  NOTIFICATIONS: 'udevs_notifications',
  ACTIVITY_LOGS: 'udevs_activity_logs',
  SETTINGS: 'udevs_settings',
  WISHLIST: 'udevs_wishlist'
};

class LocalStorageService {
  /**
   * Get data from LocalStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {any} Parsed data or default value
   */
  getData(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set data in LocalStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   */
  setData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }

  /**
   * Remove data from LocalStorage
   * @param {string} key - Storage key to remove
   */
  removeData(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  /**
   * Clear all data from LocalStorage
   */
  clearAll() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Clear specific storage keys
   * @param {string[]} keys - Array of keys to clear
   */
  clearData(keys) {
    keys.forEach(key => this.removeData(key));
  }

  /**
   * Generate unique ID with prefix
   * @param {string} prefix - ID prefix (e.g., 'CAR', 'SUP')
   * @returns {string} Unique ID
   */
  generateId(prefix) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}_${timestamp}${random}`.toUpperCase();
  }

  /**
   * Check if a key exists in LocalStorage
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  hasKey(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Add a notification
   * @param {Object} notification
   */
  addNotification({ title, message, type = 'info', targetRole = ['admin', 'sales', 'inventory', 'customer'], targetUserId = null }) {
    const notifications = this.getData(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif = {
      id: this.generateId('NOTIF'),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      targetRole: Array.isArray(targetRole) ? targetRole : [targetRole],
      targetUserId
    };
    notifications.unshift(newNotif);
    if (notifications.length > 50) notifications.pop();
    this.setData(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  }

  /**
   * Log an activity
   * @param {Object} log
   */
  logActivity({ type, entity, entityId, description, userId = null, userEmail = null }) {
    const logs = this.getData(STORAGE_KEYS.ACTIVITY_LOGS, []);
    const newLog = {
      id: this.generateId('LOG'),
      type,
      entity,
      entityId,
      description,
      userId,
      userEmail,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 100) logs.pop();
    this.setData(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    return newLog;
  }
}

// Export singleton instance
const localStorageService = new LocalStorageService();

export default localStorageService;
export { STORAGE_KEYS };
