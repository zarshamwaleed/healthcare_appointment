import React, { useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Volume2, 
  Zap,
  Moon,
  Sun,
  AlertCircle,
  Headphones,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Shield
} from 'lucide-react';

const AccessibilityLayout = ({ children }) => {
  const { 
    settings, 
    updateSettings,
    toggleReducedMotion,
    increaseTextSize,
    decreaseTextSize,
    resetSettings
  } = useAccessibility();

  // Apply accessibility settings to the document
  useEffect(() => {
    // Apply text size
    document.documentElement.style.fontSize = `${settings.baseFontSize}px`;
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Apply theme based on mode
    document.body.setAttribute('data-mode', settings.mode);
    
    // Apply cursor size
    document.documentElement.style.setProperty('--cursor-size', settings.largeCursor ? '32px' : '16px');

  }, [settings]);

  // Apply keyboard navigation styles
  useEffect(() => {
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);

  // Announce changes to screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('accessibility-announcement');
    if (announcement) {
      announcement.textContent = message;
      
      // Clear after a moment
      setTimeout(() => {
        announcement.textContent = '';
      }, 3000);
    }
  };

  const handleModeChange = (mode) => {
    updateSettings({ mode });
    announceToScreenReader(`Switched to ${mode} mode`);
  };

  const handleTextSizeChange = (increase) => {
    if (increase) {
      increaseTextSize();
      announceToScreenReader(`Text size increased to ${settings.baseFontSize} pixels`);
    } else {
      decreaseTextSize();
      announceToScreenReader(`Text size decreased to ${settings.baseFontSize} pixels`);
    }
  };

  const toggleScreenReader = () => {
    updateSettings({ screenReader: !settings.screenReader });
    announceToScreenReader(
      settings.screenReader ? 'Screen reader disabled' : 'Screen reader enabled'
    );
  };

  const toggleKeyboardNavigation = () => {
    updateSettings({ keyboardNavigation: !settings.keyboardNavigation });
    announceToScreenReader(
      settings.keyboardNavigation ? 'Keyboard navigation disabled' : 'Keyboard navigation enabled'
    );
  };

  const toggleVoiceGuidance = () => {
    updateSettings({ voiceGuidance: !settings.voiceGuidance });
    announceToScreenReader(
      settings.voiceGuidance ? 'Voice guidance disabled' : 'Voice guidance enabled'
    );
  };

  const toggleLargeCursor = () => {
    updateSettings({ largeCursor: !settings.largeCursor });
    announceToScreenReader(
      settings.largeCursor ? 'Large cursor disabled' : 'Large cursor enabled'
    );
  };

  const getModeDescription = (mode) => {
    switch(mode) {
      case 'elderly':
        return 'Large text, high contrast, simplified navigation';
      case 'low-literacy':
        return 'Simple language, visual cues, step-by-step guidance';
      case 'standard':
        return 'Default settings for general users';
      case 'visual-impairment':
        return 'High contrast, screen reader optimized, keyboard navigation';
      default:
        return 'Custom accessibility settings';
    }
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'elderly':
        return <Shield size={20} />;
      case 'low-literacy':
        return <Type size={20} />;
      case 'visual-impairment':
        return <Eye size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  // Quick access buttons for common accessibility features
  const quickAccessFeatures = [
    {
      id: 'text-plus',
      label: 'Increase Text',
      icon: <ZoomIn size={16} />,
      action: () => handleTextSizeChange(true),
      active: false,
      description: 'Increase text size'
    },
    {
      id: 'text-minus',
      label: 'Decrease Text',
      icon: <ZoomOut size={16} />,
      action: () => handleTextSizeChange(false),
      active: false,
      description: 'Decrease text size'
    },
    {
      id: 'cursor',
      label: 'Large Cursor',
      icon: <MousePointer size={16} />,
      action: () => toggleLargeCursor(),
      active: settings.largeCursor,
      description: 'Toggle large cursor'
    },
    {
      id: 'voice',
      label: 'Voice Guide',
      icon: <Volume2 size={16} />,
      action: () => toggleVoiceGuidance(),
      active: settings.voiceGuidance,
      description: 'Toggle voice guidance'
    },
    {
      id: 'reset',
      label: 'Reset',
      icon: <AlertCircle size={16} />,
      action: () => resetSettings(),
      active: false,
      description: 'Reset to default settings'
    }
  ];

  return (
    <div className={`accessibility-layout ${settings.mode}`}>
      {/* Hidden element for screen reader announcements */}
      <div
        id="accessibility-announcement"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      
      {/* Accessibility Toolbar - Fixed position for quick access */}
      <div className="accessibility-toolbar">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            {/* Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mode:</span>
              <div className="flex flex-wrap gap-1">
                {['standard', 'elderly', 'low-literacy', 'visual-impairment'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                      settings.mode === mode
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label={`Switch to ${mode} mode`}
                    aria-pressed={settings.mode === mode}
                  >
                    {getModeIcon(mode)}
                    {mode.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access Features */}
            <div className="flex flex-wrap gap-2">
              {quickAccessFeatures.map(feature => (
                <button
                  key={feature.id}
                  onClick={feature.action}
                  className={`p-2 rounded-lg flex items-center gap-2 transition-all ${
                    feature.active
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'
                  }`}
                  aria-label={feature.description}
                  title={feature.description}
                >
                  {feature.icon}
                  <span className="text-sm hidden sm:inline">{feature.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen ${
        settings.mode === 'elderly' 
          ? 'bg-gradient-to-br from-blue-50 to-white' 
          : settings.mode === 'visual-impairment'
          ? 'bg-white'
          : 'bg-gray-50'
      }`}>
        {/* Accessibility Indicator */}
        <div className="accessibility-indicator">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getModeIcon(settings.mode)}
                  <span className="font-medium">
                    {settings.mode.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} Mode
                  </span>
                </div>
                <span className="text-gray-600">
                  {getModeDescription(settings.mode)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {settings.largeCursor && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <MousePointer size={14} />
                    Large Cursor
                  </span>
                )}
                {settings.voiceGuidance && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Volume2 size={14} />
                    Voice On
                  </span>
                )}
                <span className="text-gray-500">
                  Text: {settings.baseFontSize}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className={`container mx-auto px-4 py-8 ${
          settings.mode === 'elderly' ? 'max-w-5xl' : 'max-w-7xl'
        }`}>
          {children}
        </main>

        {/* Accessibility Help Floating Button */}
        <button
          onClick={() => window.open('/accessibility-help', '_blank')}
          className="fixed bottom-6 right-6 z-50 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
          aria-label="Accessibility help"
          title="Accessibility help and settings"
        >
          <Zap size={24} />
        </button>

        {/* Screen Reader Helper (only visible to screen readers) */}
        <div className="sr-only" role="region" aria-label="Accessibility Information">
          <h2>Accessibility Features Active</h2>
          <ul>
            <li>Mode: {settings.mode}</li>
            <li>Text size: {settings.baseFontSize} pixels</li>
            <li>Reduced motion: {settings.reducedMotion ? 'On' : 'Off'}</li>
            <li>Voice guidance: {settings.voiceGuidance ? 'On' : 'Off'}</li>
            <li>Large cursor: {settings.largeCursor ? 'On' : 'Off'}</li>
          </ul>
          <p>Use Tab key to navigate, Enter to activate buttons, and Escape to close modals.</p>
        </div>
      </div>

      {/* Styles for accessibility features */}
      <style jsx>{`
        .accessibility-layout {
          --cursor-size: ${settings.largeCursor ? '32px' : '16px'};
        }

        .accessibility-toolbar {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 2px solid #cbd5e0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .accessibility-indicator {
          background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
          border-bottom: 1px solid #cbd5e0;
        }

        /* Focus styles for keyboard navigation */
        :global(*) {
          cursor: ${settings.largeCursor ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${settings.largeCursor ? '32' : '16'}' height='${settings.largeCursor ? '32' : '16'}' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7' fill='%230ea5e9' opacity='0.7'/%3E%3C/svg%3E") 8 8, auto` : 'auto'};
        }

        :global(.user-is-tabbing *:focus) {
          outline: 3px solid #0ea5e9 !important;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3);
        }

        /* Reduced motion styles */
        :global(.reduced-motion *) {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }

        :global(.low-contrast) {
          --text-color: #1a202c;
          --bg-color: #ffffff;
          --primary-color: #0ea5e9;
          --secondary-color: #6366f1;
        }

        /* Mode-specific font sizes */
        :global(.elderly *) {
          line-height: 1.8;
        }

        :global(.low-literacy *) {
          letter-spacing: 0.5px;
        }

        /* Print styles */
        @media print {
          .accessibility-toolbar,
          .accessibility-indicator,
          .sr-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AccessibilityLayout;