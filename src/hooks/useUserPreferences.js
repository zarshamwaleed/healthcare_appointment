// src/hooks/useUserPreferences.js
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useAccessibility } from './useAccessibility';

export const useUserPreferences = (userId) => {
  const [preferences, setPreferences] = useState({
    // UI Preferences
    theme: 'light',
    language: 'en',
    persona: 'default',
    colorScheme: 'blue',
    
    // Notification Preferences
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointmentReminders: true,
      healthTips: false,
      promotional: false,
      emergencyAlerts: true
    },
    
    // Appointment Preferences
    appointment: {
      defaultDuration: 30,
      bufferTime: 15,
      preferredTimeSlots: ['09:00', '14:00'],
      autoConfirm: false,
      allowRescheduling: true,
      allowCancellation: true
    },
    
    // Privacy Preferences
    privacy: {
      shareMedicalData: false,
      shareForResearch: false,
      showInDirectory: false,
      dataRetention: '1year',
      autoLogout: 30
    },
    
    // Communication Preferences
    communication: {
      preferredContact: 'email',
      contactHours: '9-5',
      allowWeekendContact: false,
      emergencyContactMethod: 'sms'
    },
    
    // Health Preferences
    health: {
      bloodGroup: '',
      organDonor: false,
      advanceDirective: false,
      emergencyAccess: false
    }
  });

  const [loading, setLoading] = useState(true);
  const { updateSettings: updateAccessibility } = useAccessibility();

  // Load preferences on mount
  useEffect(() => {
    if (userId) {
      loadPreferences();
    }
  }, [userId]);

  const loadPreferences = useCallback(async () => {
    setLoading(true);
    
    try {
      // Load from storage
      const savedSettings = storageService.getSettings();
      const savedPreferences = storageService.get(`user_preferences_${userId}`);
      
      if (savedPreferences) {
        setPreferences(prev => ({ ...prev, ...savedPreferences }));
      } else if (savedSettings) {
        setPreferences(prev => ({ ...prev, ...savedSettings }));
      }
      
      // Apply theme
      applyTheme(savedPreferences?.theme || savedSettings?.theme || 'light');
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Apply theme to document
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
    }
  }, []);

  // Save preferences to storage
  const savePreferences = useCallback(async (newPreferences) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      
      // Save to storage
      storageService.saveSettings(updated);
      if (userId) {
        storageService.set(`user_preferences_${userId}`, updated);
      }
      
      // Apply theme if changed
      if (newPreferences.theme && newPreferences.theme !== preferences.theme) {
        applyTheme(newPreferences.theme);
      }
      
      // Apply persona settings to accessibility
      if (newPreferences.persona && newPreferences.persona !== preferences.persona) {
        const personaSettings = getPersonaSettings(newPreferences.persona);
        updateAccessibility(personaSettings);
      }
      
      return updated;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }, [preferences, userId, applyTheme, updateAccessibility]);

  // Update specific preference
  const updatePreference = useCallback(async (category, key, value) => {
    if (category.includes('.')) {
      // Handle nested keys (e.g., 'notifications.email')
      const [parent, child] = category.split('.');
      return savePreferences({
        [parent]: {
          ...preferences[parent],
          [child]: value
        }
      });
    } else {
      return savePreferences({
        [category]: value
      });
    }
  }, [preferences, savePreferences]);

  // Get persona-specific settings
  const getPersonaSettings = useCallback((persona) => {
    const personaMap = {
      'default': {
        textSize: 'medium',
        simplifiedLayout: false,
        reducedMotion: false
      },
      'elderly': {
        textSize: 'large',
        simplifiedLayout: true,
        reducedMotion: true,
        voiceAssistant: true
      },
      'low-literacy': {
        textSize: 'large',
        simplifiedLayout: true,
        reducedMotion: true,
        voiceAssistant: true,
        dyslexiaFriendly: true
      },
      'visually-impaired': {
        textSize: 'xlarge',
        simplifiedLayout: true,
        reducedMotion: true,
        voiceAssistant: true
      }
    };
    
    return personaMap[persona] || personaMap.default;
  }, []);

  // Change persona and apply settings
  const changePersona = useCallback(async (persona) => {
    const personaSettings = getPersonaSettings(persona);
    
    // Update preferences
    await savePreferences({ persona });
    
    // Apply accessibility settings
    updateAccessibility(personaSettings);
    
    return personaSettings;
  }, [getPersonaSettings, savePreferences, updateAccessibility]);

  // Toggle notification preference
  const toggleNotification = useCallback(async (type) => {
    return updatePreference('notifications', type, !preferences.notifications[type]);
  }, [preferences.notifications, updatePreference]);

  // Set theme
  const setTheme = useCallback(async (theme) => {
    return savePreferences({ theme });
  }, [savePreferences]);

  // Set language
  const setLanguage = useCallback(async (language) => {
    return savePreferences({ language });
  }, [savePreferences]);

  // Set default appointment duration
  const setDefaultDuration = useCallback(async (minutes) => {
    return savePreferences({
      appointment: {
        ...preferences.appointment,
        defaultDuration: minutes
      }
    });
  }, [preferences.appointment, savePreferences]);

  // Update privacy settings
  const updatePrivacy = useCallback(async (privacyUpdates) => {
    return savePreferences({
      privacy: {
        ...preferences.privacy,
        ...privacyUpdates
      }
    });
  }, [preferences.privacy, savePreferences]);

  // Reset to default preferences
  const resetToDefaults = useCallback(async () => {
    const defaults = {
      theme: 'light',
      language: 'en',
      persona: 'default',
      colorScheme: 'blue',
      notifications: {
        email: true,
        sms: false,
        push: true,
        appointmentReminders: true,
        healthTips: false,
        promotional: false,
        emergencyAlerts: true
      },
      appointment: {
        defaultDuration: 30,
        bufferTime: 15,
        preferredTimeSlots: ['09:00', '14:00'],
        autoConfirm: false,
        allowRescheduling: true,
        allowCancellation: true
      },
      privacy: {
        shareMedicalData: false,
        shareForResearch: false,
        showInDirectory: false,
        dataRetention: '1year',
        autoLogout: 30
      }
    };
    
    await savePreferences(defaults);
    applyTheme('light');
  }, [savePreferences, applyTheme]);

  // Export preferences for backup
  const exportPreferences = useCallback(() => {
    const data = {
      preferences,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-preferences-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  }, [preferences]);

  // Import preferences from file
  const importPreferences = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate imported data
          if (!data.preferences || !data.exportedAt) {
            throw new Error('Invalid preferences file');
          }
          
          await savePreferences(data.preferences);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [savePreferences]);

  return {
    // State
    preferences,
    loading,
    
    // Actions
    savePreferences,
    updatePreference,
    changePersona,
    toggleNotification,
    setTheme,
    setLanguage,
    setDefaultDuration,
    updatePrivacy,
    resetToDefaults,
    exportPreferences,
    importPreferences,
    
    // Getters
    getPersonaSettings
  };
};

export default useUserPreferences;