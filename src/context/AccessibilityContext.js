    import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    mode: 'standard', // 'standard', 'elderly', 'voice', 'icon'
    fontSize: 'medium', // 'small', 'medium', 'large', 'xlarge'
    highContrast: false,
    simpleMode: false,
    voiceAssistance: false,
    reducedMotion: false,
  });

  const [userType, setUserType] = useState(null); // 'elderly', 'low-literacy', 'disabled', 'standard'

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const setUserMode = (mode) => {
    switch(mode) {
      case 'elderly':
        updateSettings({
          mode: 'elderly',
          fontSize: 'xlarge',
          simpleMode: true,
          voiceAssistance: true
        });
        setUserType('elderly');
        break;
      case 'low-literacy':
        updateSettings({
          mode: 'icon',
          fontSize: 'large',
          simpleMode: true
        });
        setUserType('low-literacy');
        break;
      case 'voice':
        updateSettings({
          mode: 'voice',
          voiceAssistance: true
        });
        setUserType('disabled');
        break;
      default:
        updateSettings({
          mode: 'standard',
          fontSize: 'medium',
          simpleMode: false,
          voiceAssistance: false
        });
        setUserType('standard');
    }
  };

  const getTextSizeClass = () => {
    switch(settings.fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      case 'xlarge': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getButtonSizeClass = () => {
    if (settings.mode === 'elderly') return 'btn-elderly';
    return settings.fontSize === 'xlarge' ? 'px-6 py-4 text-lg' : '';
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      userType,
      updateSettings,
      setUserMode,
      getTextSizeClass,
      getButtonSizeClass
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};