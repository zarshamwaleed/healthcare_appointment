    import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    mode: 'standard', // 'standard', 'elderly', 'voice', 'icon', 'visual-impairment'
    fontSize: 'medium', // 'small', 'medium', 'large', 'xlarge'
    simpleMode: false,
    voiceAssistance: false,
    reducedMotion: false,
    visuallyImpaired: false,
  });

  const [userType, setUserType] = useState(null); // 'elderly', 'low-literacy', 'disabled', 'standard'

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply dark theme for visually impaired mode
    if (settings.visuallyImpaired) {
      document.body.classList.add('visually-impaired-theme');
    } else {
      document.body.classList.remove('visually-impaired-theme');
    }
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
      case 'sign-language':
        updateSettings({
          mode: 'sign-language',
          fontSize: 'large'
        });
        setUserType('disabled');
        break;
      case 'visual-impairment':
        updateSettings({
          mode: 'visual-impairment',
          fontSize: 'xlarge',
          visuallyImpaired: true,
          voiceAssistance: true,
          reducedMotion: true
        });
        setUserType('visually-impaired');
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