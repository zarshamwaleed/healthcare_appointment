import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Volume2, Type, Eye, Contrast, Settings } from 'lucide-react';
import HighContrastToggle from './HighContrastToggle';
import TextSizeControl from './TextSizeControl';

// Optional: create a small wrapper component for all accessibility controls
const AccessibilitySettings = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <TextSizeControl />
      <HighContrastToggle />
      {/* You can add other accessibility components here */}
    </div>
  );
};

const AccessibilityToolbar = () => {
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className={`${settings.highContrast ? 'bg-black text-white' : 'bg-gray-800 text-white'} py-2 px-4`}>
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings size={16} />
          <span className="text-sm font-medium">Accessibility Settings</span>
        </div>

        {/* Render all accessibility controls */}
        <AccessibilitySettings />

        {/* Voice Assistance Toggle */}
        <button
          onClick={() => updateSettings({ voiceAssistance: !settings.voiceAssistance })}
          className={`flex items-center gap-2 px-3 py-1 rounded ${settings.voiceAssistance ? 'bg-primary-600' : 'bg-gray-700'}`}
        >
          <Volume2 size={16} />
          <span>Voice Assistance</span>
        </button>

        {/* Simple Mode Toggle */}
        <button
          onClick={() => updateSettings({ simpleMode: !settings.simpleMode })}
          className={`flex items-center gap-2 px-3 py-1 rounded ${settings.simpleMode ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          <Eye size={16} />
          <span>Simple Mode</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
