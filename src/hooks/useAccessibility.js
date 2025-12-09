// src/hooks/useAccessibility.js
import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';

export const useAccessibility = () => {
  const [settings, setSettings] = useState({
    textSize: 'medium',
    reducedMotion: false,
    voiceAssistant: true,
    screenReader: false,
    colorBlindMode: 'none',
    simplifiedLayout: false,
    dyslexiaFriendly: false,
    keyboardNavigation: true,
    focusOutline: true
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    const savedSettings = storageService.getAccessibilitySettings();
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
      applySettings(savedSettings);
    }
  }, []);

  // Apply settings to DOM
  const applySettings = useCallback((newSettings) => {
    const root = document.documentElement;
    
    // Text size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-xlarge');
    root.classList.add(`text-${newSettings.textSize}`);
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (newSettings.colorBlindMode !== 'none') {
      root.classList.add(newSettings.colorBlindMode);
    }
    
    // Simplified layout
    if (newSettings.simplifiedLayout) {
      root.classList.add('simplified-layout');
    } else {
      root.classList.remove('simplified-layout');
    }
    
    // Dyslexia friendly
    if (newSettings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
    
    // Focus outline
    if (!newSettings.focusOutline) {
      root.classList.add('hide-focus-outline');
    } else {
      root.classList.remove('hide-focus-outline');
    }
    
    // Save to storage
    storageService.saveAccessibilitySettings(newSettings);
  }, []);

  // Update specific setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      applySettings(newSettings);
      return newSettings;
    });
  }, [applySettings]);

  // Update multiple settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      applySettings(updated);
      return updated;
    });
  }, [applySettings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    const defaults = {
      textSize: 'medium',
      reducedMotion: false,
      voiceAssistant: true,
      screenReader: false,
      colorBlindMode: 'none',
      simplifiedLayout: false,
      dyslexiaFriendly: false,
      keyboardNavigation: true,
      focusOutline: true
    };
    
    setSettings(defaults);
    applySettings(defaults);
  }, [applySettings]);

  // Voice assistant functions
  const speak = useCallback(async (text, options = {}) => {
    if (!settings.voiceAssistant || !text) return;
    
    try {
      setIsSpeaking(true);
      await voiceService.speak(text, options);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, [settings.voiceAssistant]);

  const startListening = useCallback((onResult, onError, onEnd) => {
    if (!settings.voiceAssistant) return false;
    
    setIsListening(true);
    return voiceService.startListening(
      (result) => {
        if (onResult) onResult(result);
      },
      (error) => {
        setIsListening(false);
        if (onError) onError(error);
      },
      () => {
        setIsListening(false);
        if (onEnd) onEnd();
      }
    );
  }, [settings.voiceAssistant]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Screen reader announcements
  const announce = useCallback((message, priority = 'polite') => {
    const ariaLive = document.getElementById('aria-live-region');
    if (!ariaLive) return;
    
    ariaLive.setAttribute('aria-live', priority);
    ariaLive.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      ariaLive.textContent = '';
    }, 1000);
  }, []);

  // Keyboard navigation helper
  const handleKeyNavigation = useCallback((event, handlers) => {
    if (!settings.keyboardNavigation) return;
    
    const { onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight } = handlers;
    
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) onArrowUp(event);
        break;
      case 'ArrowDown':
        if (onArrowDown) onArrowDown(event);
        break;
      case 'ArrowLeft':
        if (onArrowLeft) onArrowLeft(event);
        break;
      case 'ArrowRight':
        if (onArrowRight) onArrowRight(event);
        break;
    }
  }, [settings.keyboardNavigation]);

  // Focus trap for modals
  const useFocusTrap = useCallback((elementRef) => {
    useEffect(() => {
      if (!elementRef.current || !settings.keyboardNavigation) return;
      
      const focusableElements = elementRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }, [elementRef, settings.keyboardNavigation]);
  }, [settings.keyboardNavigation]);

  // Get appropriate color scheme based on settings
  const getAccessibleColors = useCallback(() => {
    const baseColors = {
      primary: '#2563eb',
      secondary: '#059669',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb'
    };
    
    return baseColors;
  }, []);

  return {
    // State
    settings,
    isSpeaking,
    isListening,
    
    // Actions
    updateSetting,
    updateSettings,
    resetSettings,
    speak,
    startListening,
    stopListening,
    stopSpeaking,
    announce,
    handleKeyNavigation,
    useFocusTrap,
    getAccessibleColors
  };
};

export default useAccessibility;