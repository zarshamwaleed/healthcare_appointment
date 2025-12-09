// src/context/UIContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserContext';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  const { user } = useUser();
  const [theme, setTheme] = useState('light');
  const [persona, setPersona] = useState('default');
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modals, setModals] = useState({
    confirmation: false,
    settings: false,
    help: false,
    emergency: false
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Apply persona from user context
  useEffect(() => {
    if (user?.persona) {
      setPersona(user.persona);
    }
  }, [user?.persona]);

  // Apply theme based on persona and time
  useEffect(() => {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour <= 6;
    
    if (isNight && theme !== 'dark') {
      setTheme('dark');
    }
    
    // Apply persona-specific styles
    applyPersonaStyles(persona);
  }, [persona, theme]);

  // Apply CSS classes based on persona
  const applyPersonaStyles = (selectedPersona) => {
    // Remove existing persona classes
    document.body.classList.remove(
      'persona-elderly',
      'persona-low-literacy',
      'persona-default'
    );
    
    // Add new persona class
    document.body.classList.add(`persona-${selectedPersona}`);
    
    // Apply text size
    const textSize = user?.accessibility?.textSize || 'medium';
    document.body.classList.remove('text-small', 'text-medium', 'text-large', 'text-xlarge');
    document.body.classList.add(`text-${textSize}`);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Change persona
  const changePersona = (newPersona) => {
    setPersona(newPersona);
    applyPersonaStyles(newPersona);
  };

  // Navigation
  const navigateTo = (page) => {
    setActivePage(page);
    
    // Update breadcrumbs
    const newCrumb = {
      id: Date.now(),
      label: page.charAt(0).toUpperCase() + page.slice(1),
      path: `/${page}`
    };
    
    setBreadcrumbs(prev => {
      // Remove duplicates
      const filtered = prev.filter(crumb => crumb.label !== newCrumb.label);
      return [...filtered, newCrumb].slice(-5); // Keep last 5 breadcrumbs
    });
  };

  // Modal controls
  const openModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: true
    }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: false
    }));
  };

  const closeAllModals = () => {
    setModals({
      confirmation: false,
      settings: false,
      help: false,
      emergency: false
    });
  };

  // Notifications
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 5 seconds if not important
    if (!notification.important) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Loading states
  const startLoading = (message = 'Loading...') => {
    setLoading(true);
    setProgress(0);
    addNotification({
      type: 'info',
      message,
      important: false
    });
  };

  const updateProgress = (value) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const stopLoading = () => {
    setLoading(false);
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  // Error handling
  const addError = (error) => {
    const errorObj = {
      id: Date.now(),
      message: error.message || 'An error occurred',
      type: 'error',
      timestamp: new Date().toISOString()
    };
    
    setErrors(prev => [errorObj, ...prev].slice(0, 10)); // Keep last 10 errors
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      removeError(errorObj.id);
    }, 10000);
  };

  const removeError = (id) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  // Sidebar controls
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Accessibility features
  const speakMessage = (message) => {
    if (user?.accessibility?.voiceAssistant && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get UI configuration based on persona
  const getUIConfig = () => {
    const configs = {
      'default': {
        fontSize: '16px',
        buttonSize: 'medium',
        iconSize: '24px',
        spacing: 'normal',
        animations: true,
        complexity: 'normal'
      },
      'elderly': {
        fontSize: '18px',
        buttonSize: 'large',
        iconSize: '28px',
        spacing: 'large',
        animations: false,
        complexity: 'simple'
      },
      'low-literacy': {
        fontSize: '18px',
        buttonSize: 'large',
        iconSize: '28px',
        spacing: 'large',
        animations: false,
        complexity: 'minimal',
        useIcons: true,
        useImages: true
      }
    };
    
    return configs[persona] || configs.default;
  };

  // Get color scheme based on theme and persona
  const getColors = () => {
    const baseColors = theme === 'dark' 
      ? {
          primary: '#3b82f6',
          secondary: '#10b981',
          background: '#1f2937',
          surface: '#374151',
          text: '#f9fafb',
          textSecondary: '#d1d5db'
        }
      : {
          primary: '#2563eb',
          secondary: '#059669',
          background: '#f9fafb',
          surface: '#ffffff',
          text: '#111827',
          textSecondary: '#6b7280'
        };
    
    // Adjust colors for personas
    if (persona === 'elderly') {
      return {
        ...baseColors,
        primary: '#4f46e5', // Higher contrast purple
        secondary: '#0d9488'
      };
    }
    
    if (persona === 'low-literacy') {
      return {
        ...baseColors,
        primary: '#dc2626', // Red for better visibility
        secondary: '#ea580c'
      };
    }
    
    return baseColors;
  };

  const value = {
    // State
    theme,
    persona,
    activePage,
    sidebarOpen,
    modals,
    notifications,
    loading,
    progress,
    errors,
    breadcrumbs,
    
    // Actions
    toggleTheme,
    changePersona,
    navigateTo,
    openModal,
    closeModal,
    closeAllModals,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
    startLoading,
    updateProgress,
    stopLoading,
    addError,
    removeError,
    clearAllErrors,
    toggleSidebar,
    closeSidebar,
    speakMessage,
    
    // Getters
    getUIConfig,
    getColors
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;