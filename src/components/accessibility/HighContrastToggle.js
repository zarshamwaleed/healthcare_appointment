import React, { useState, useEffect } from 'react';
import { Contrast, Sun, Moon } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const HighContrastToggle = () => {
  const { settings, updateSettings } = useAccessibility();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleHighContrast = () => {
    const newHighContrast = !settings.highContrast;
    updateSettings({ highContrast: newHighContrast });
    
    // Apply high contrast styles to entire document
    if (newHighContrast) {
      document.documentElement.classList.add('high-contrast-mode');
      document.body.classList.add('high-contrast-bg');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
      document.body.classList.remove('high-contrast-bg');
    }
  };

  const contrastModes = [
    {
      id: 'normal',
      name: 'Normal',
      icon: <Sun size={20} />,
      description: 'Standard color scheme',
      className: 'bg-gradient-to-r from-blue-100 to-white text-blue-800'
    },
    {
      id: 'high',
      name: 'High Contrast',
      icon: <Contrast size={20} />,
      description: 'Enhanced visibility for low vision',
      className: 'bg-gradient-to-r from-gray-900 to-black text-white'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: <Moon size={20} />,
      description: 'Reduced eye strain in low light',
      className: 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100'
    }
  ];

  const getCurrentMode = () => {
    if (settings.highContrast) return 'high';
    // You can add dark mode detection here if implemented
    return 'normal';
  };

  const currentMode = getCurrentMode();

  // Don't render during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-6 h-6 bg-gray-300 rounded"></div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Toggle Button */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${settings.highContrast ? 'bg-black text-white' : 'bg-blue-100 text-blue-600'}`}>
            <Contrast size={24} />
          </div>
          <div>
            <h3 className="font-semibold">High Contrast Mode</h3>
            <p className="text-sm text-gray-600">
              {settings.highContrast 
                ? 'Enhanced visibility for low vision users' 
                : 'Standard color scheme'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={toggleHighContrast}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            settings.highContrast ? 'bg-black' : 'bg-gray-300'
          }`}
          aria-label={settings.highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
          role="switch"
          aria-checked={settings.highContrast}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.highContrast ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {contrastModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              if (mode.id === 'high') {
                updateSettings({ highContrast: true });
              } else {
                updateSettings({ highContrast: false });
              }
            }}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              currentMode === mode.id 
                ? 'border-blue-500 shadow-lg scale-[1.02]' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            } ${mode.className}`}
            aria-pressed={currentMode === mode.id}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${
                currentMode === mode.id 
                  ? 'bg-white/20' 
                  : 'bg-white/10'
              }`}>
                {mode.icon}
              </div>
              <h4 className="font-bold">{mode.name}</h4>
            </div>
            <p className="text-sm opacity-90">{mode.description}</p>
            
            {currentMode === mode.id && (
              <div className="mt-3 flex items-center gap-1 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Active</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Accessibility Information */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Contrast size={16} />
          Why High Contrast?
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-start gap-2">
            <span className="mt-1">👁️</span>
            <span>Improves readability for users with low vision</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">👵</span>
            <span>Helps elderly users with reduced contrast sensitivity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">☀️</span>
            <span>Better visibility in bright lighting conditions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">🎨</span>
            <span>WCAG AAA compliant contrast ratios</span>
          </li>
        </ul>
      </div>

      {/* Preview Section */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <h4 className="font-semibold mb-3">Preview</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded ${
            settings.highContrast 
              ? 'bg-black text-white border-2 border-white' 
              : 'bg-white text-gray-800 border border-gray-300'
          }`}>
            <p className="text-sm font-medium">Text Example</p>
            <p className="text-xs">This is how text will appear</p>
          </div>
          <div className={`p-3 rounded ${
            settings.highContrast 
              ? 'bg-white text-black border-2 border-black' 
              : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            <p className="text-sm font-medium">Button Example</p>
            <p className="text-xs">Interactive elements</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          💡 <strong>Tip:</strong> High contrast mode works best with reduced motion and larger text size. 
          Consider adjusting these settings for optimal experience.
        </p>
      </div>
    </div>
  );
};

// Add global styles for high contrast mode
const addHighContrastStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .high-contrast-mode {
      --text-color: #000000;
      --bg-color: #FFFFFF;
      --primary-color: #0056b3;
      --border-color: #000000;
    }
    
    .high-contrast-mode * {
      color: var(--text-color) !important;
      background-color: var(--bg-color) !important;
      border-color: var(--border-color) !important;
    }
    
    .high-contrast-mode button,
    .high-contrast-mode [role="button"] {
      border: 2px solid var(--border-color) !important;
    }
    
    .high-contrast-mode a {
      text-decoration: underline !important;
    }
    
    .high-contrast-bg {
      background-color: white !important;
      color: black !important;
    }
    
    /* Ensure focus indicators are visible */
    .high-contrast-mode :focus {
      outline: 3px solid #FF0000 !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
};

// Initialize styles on first import
if (typeof window !== 'undefined') {
  addHighContrastStyles();
}

export default HighContrastToggle;