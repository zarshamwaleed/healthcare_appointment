// src/services/storageService.js

/**
 * Local Storage Service
 * Provides utility functions for storing and retrieving data from localStorage
 */

// Constants for storage keys
const STORAGE_KEYS = {
  USER: 'smart_health_user',
  APPOINTMENTS: 'smart_health_appointments',
  SETTINGS: 'smart_health_settings',
  ACCESSIBILITY: 'smart_health_accessibility',
  NOTIFICATIONS: 'smart_health_notifications',
  HISTORY: 'smart_health_history',
  FAVORITES: 'smart_health_favorites',
  TEMP_DATA: 'smart_health_temp'
};

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('LocalStorage is not available:', e);
    return false;
  }
};

// Main storage service
export const storageService = {
  
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @param {boolean} encrypt - Whether to encrypt the data
   * @returns {boolean} Success status
   */
  set: (key, data, encrypt = false) => {
    if (!isLocalStorageAvailable()) {
      console.warn('LocalStorage not available, data not saved');
      return false;
    }
    
    try {
      let dataToStore = data;
      
      if (encrypt) {
        // Simple encryption for demo (in production, use proper encryption)
        dataToStore = btoa(JSON.stringify(data));
      } else {
        dataToStore = JSON.stringify(data);
      }
      
      localStorage.setItem(key, dataToStore);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  /**
   * Retrieve data from localStorage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @param {boolean} encrypted - Whether the data is encrypted
   * @returns {any} Retrieved data or defaultValue
   */
  get: (key, defaultValue = null, encrypted = false) => {
    if (!isLocalStorageAvailable()) {
      return defaultValue;
    }
    
    try {
      const storedData = localStorage.getItem(key);
      
      if (!storedData) {
        return defaultValue;
      }
      
      if (encrypted) {
        // Simple decryption for demo
        try {
          return JSON.parse(atob(storedData));
        } catch {
          return defaultValue;
        }
      } else {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return defaultValue;
    }
  },
  
  /**
   * Remove data from localStorage
   * @param {string} key - Storage key to remove
   * @returns {boolean} Success status
   */
  remove: (key) => {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  /**
   * Clear all app data from localStorage
   * @param {boolean} preserveUser - Whether to preserve user data
   * @returns {boolean} Success status
   */
  clearAll: (preserveUser = false) => {
    if (!isLocalStorageAvailable()) {
      return false;
    }
    
    try {
      if (preserveUser) {
        const userData = this.get(STORAGE_KEYS.USER);
        localStorage.clear();
        if (userData) {
          this.set(STORAGE_KEYS.USER, userData);
        }
      } else {
        localStorage.clear();
      }
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
  
  /**
   * Save user data
   * @param {object} user - User object
   * @returns {boolean} Success status
   */
  saveUser: (user) => {
    return this.set(STORAGE_KEYS.USER, user, true); // Encrypt user data
  },
  
  /**
   * Get user data
   * @returns {object|null} User object or null
   */
  getUser: () => {
    return this.get(STORAGE_KEYS.USER, null, true); // Decrypt user data
  },
  
  /**
   * Clear user data
   * @returns {boolean} Success status
   */
  clearUser: () => {
    return this.remove(STORAGE_KEYS.USER);
  },
  
  /**
   * Save appointments
   * @param {Array} appointments - Array of appointments
   * @returns {boolean} Success status
   */
  saveAppointments: (appointments) => {
    return this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
  },
  
  /**
   * Get appointments
   * @returns {Array} Array of appointments
   */
  getAppointments: () => {
    return this.get(STORAGE_KEYS.APPOINTMENTS, []);
  },
  
  /**
   * Add or update an appointment
   * @param {object} appointment - Appointment object
   * @returns {boolean} Success status
   */
  saveAppointment: (appointment) => {
    const appointments = this.getAppointments();
    const existingIndex = appointments.findIndex(a => a.id === appointment.id);
    
    if (existingIndex >= 0) {
      appointments[existingIndex] = appointment;
    } else {
      appointments.push(appointment);
    }
    
    return this.saveAppointments(appointments);
  },
  
  /**
   * Remove an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {boolean} Success status
   */
  removeAppointment: (appointmentId) => {
    const appointments = this.getAppointments();
    const filteredAppointments = appointments.filter(a => a.id !== appointmentId);
    return this.saveAppointments(filteredAppointments);
  },
  
  /**
   * Save accessibility settings
   * @param {object} settings - Accessibility settings
   * @returns {boolean} Success status
   */
  saveAccessibilitySettings: (settings) => {
    return this.set(STORAGE_KEYS.ACCESSIBILITY, settings);
  },
  
  /**
   * Get accessibility settings
   * @returns {object} Accessibility settings
   */
  getAccessibilitySettings: () => {
    const defaultSettings = {
      textSize: 'medium',
      reducedMotion: false,
      voiceAssistant: true,
      screenReader: false,
      colorBlindMode: false
    };
    
    return this.get(STORAGE_KEYS.ACCESSIBILITY, defaultSettings);
  },
  
  /**
   * Save user preferences/settings
   * @param {object} settings - User settings
   * @returns {boolean} Success status
   */
  saveSettings: (settings) => {
    return this.set(STORAGE_KEYS.SETTINGS, settings);
  },
  
  /**
   * Get user preferences/settings
   * @returns {object} User settings
   */
  getSettings: () => {
    const defaultSettings = {
      language: 'en',
      theme: 'light',
      persona: 'default',
      notifications: {
        email: true,
        sms: true,
        push: true,
        reminders: true,
        appointmentAlerts: true
      },
      privacy: {
        shareData: false,
        analytics: true
      }
    };
    
    return this.get(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
  
  /**
   * Save notifications
   * @param {Array} notifications - Array of notifications
   * @returns {boolean} Success status
   */
  saveNotifications: (notifications) => {
    return this.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },
  
  /**
   * Get notifications
   * @returns {Array} Array of notifications
   */
  getNotifications: () => {
    return this.get(STORAGE_KEYS.NOTIFICATIONS, []);
  },
  
  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {boolean} Success status
   */
  markNotificationAsRead: (notificationId) => {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      return this.saveNotifications(notifications);
    }
    
    return false;
  },
  
  /**
   * Clear all notifications
   * @returns {boolean} Success status
   */
  clearNotifications: () => {
    return this.set(STORAGE_KEYS.NOTIFICATIONS, []);
  },
  
  /**
   * Save search/browsing history
   * @param {Array} history - History items
   * @returns {boolean} Success status
   */
  saveHistory: (history) => {
    // Keep only last 50 items
    const trimmedHistory = history.slice(-50);
    return this.set(STORAGE_KEYS.HISTORY, trimmedHistory);
  },
  
  /**
   * Get search/browsing history
   * @returns {Array} History items
   */
  getHistory: () => {
    return this.get(STORAGE_KEYS.HISTORY, []);
  },
  
  /**
   * Add item to history
   * @param {object} item - History item
   * @returns {boolean} Success status
   */
  addToHistory: (item) => {
    const history = this.getHistory();
    const newItem = {
      ...item,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    history.push(newItem);
    return this.saveHistory(history);
  },
  
  /**
   * Clear history
   * @returns {boolean} Success status
   */
  clearHistory: () => {
    return this.set(STORAGE_KEYS.HISTORY, []);
  },
  
  /**
   * Save favorite doctors/departments
   * @param {Array} favorites - Favorite items
   * @returns {boolean} Success status
   */
  saveFavorites: (favorites) => {
    return this.set(STORAGE_KEYS.FAVORITES, favorites);
  },
  
  /**
   * Get favorites
   * @returns {Array} Favorite items
   */
  getFavorites: () => {
    return this.get(STORAGE_KEYS.FAVORITES, []);
  },
  
  /**
   * Add to favorites
   * @param {object} item - Item to favorite
   * @returns {boolean} Success status
   */
  addFavorite: (item) => {
    const favorites = this.getFavorites();
    
    // Check if already favorited
    if (!favorites.some(fav => fav.id === item.id)) {
      favorites.push(item);
      return this.saveFavorites(favorites);
    }
    
    return false;
  },
  
  /**
   * Remove from favorites
   * @param {string} itemId - Item ID to remove
   * @returns {boolean} Success status
   */
  removeFavorite: (itemId) => {
    const favorites = this.getFavorites();
    const filteredFavorites = favorites.filter(fav => fav.id !== itemId);
    return this.saveFavorites(filteredFavorites);
  },
  
  /**
   * Check if item is favorited
   * @param {string} itemId - Item ID to check
   * @returns {boolean} Whether item is favorited
   */
  isFavorited: (itemId) => {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === itemId);
  },
  
  /**
   * Save temporary data (session-like storage)
   * @param {string} key - Temp key
   * @param {any} data - Data to store
   * @param {number} ttl - Time to live in milliseconds
   * @returns {boolean} Success status
   */
  saveTemp: (key, data, ttl = 3600000) => { // Default 1 hour
    const tempData = {
      data,
      expires: Date.now() + ttl
    };
    
    const allTemp = this.get(STORAGE_KEYS.TEMP_DATA, {});
    allTemp[key] = tempData;
    
    return this.set(STORAGE_KEYS.TEMP_DATA, allTemp);
  },
  
  /**
   * Get temporary data
   * @param {string} key - Temp key
   * @returns {any|null} Retrieved data or null
   */
  getTemp: (key) => {
    const allTemp = this.get(STORAGE_KEYS.TEMP_DATA, {});
    const tempItem = allTemp[key];
    
    if (tempItem && tempItem.expires > Date.now()) {
      return tempItem.data;
    }
    
    // Clean up expired item
    if (tempItem) {
      delete allTemp[key];
      this.set(STORAGE_KEYS.TEMP_DATA, allTemp);
    }
    
    return null;
  },
  
  /**
   * Clear temporary data
   * @param {string} key - Specific key to clear, or all if not specified
   * @returns {boolean} Success status
   */
  clearTemp: (key = null) => {
    if (key) {
      const allTemp = this.get(STORAGE_KEYS.TEMP_DATA, {});
      delete allTemp[key];
      return this.set(STORAGE_KEYS.TEMP_DATA, allTemp);
    } else {
      return this.set(STORAGE_KEYS.TEMP_DATA, {});
    }
  },
  
  /**
   * Get storage statistics
   * @returns {object} Storage statistics
   */
  getStats: () => {
    if (!isLocalStorageAvailable()) {
      return { totalSize: 0, items: 0 };
    }
    
    let totalSize = 0;
    let items = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      if (key && value) {
        totalSize += key.length + value.length;
        items++;
      }
    }
    
    return {
      totalSize, // in characters
      items,
      readableSize: `${(totalSize / 1024).toFixed(2)} KB`
    };
  },
  
  /**
   * Backup all app data
   * @returns {object} Backup data
   */
  backup: () => {
    const backup = {};
    
    Object.values(STORAGE_KEYS).forEach(key => {
      backup[key] = localStorage.getItem(key);
    });
    
    return {
      data: backup,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  },
  
  /**
   * Restore from backup
   * @param {object} backup - Backup data
   * @returns {boolean} Success status
   */
  restore: (backup) => {
    if (!backup || !backup.data) {
      return false;
    }
    
    try {
      Object.entries(backup.data).forEach(([key, value]) => {
        if (value) {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
};

export default storageService;