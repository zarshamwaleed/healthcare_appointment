import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Eye, 
  EyeOff, 
  Type, 
  Volume2, 
  Zap,
  Moon,
  Sun,
  Shield,
  User,
  Brain,
  Accessibility,
  Heart,
  ChevronDown,
  ChevronUp,
  Check,
  Settings,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModeToggle = ({ 
  compact = false,
  showLabels = true,
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  floating = false,
  autoClose = true
}) => {
  const { 
    settings, 
    updateSettings,
    resetSettings 
  } = useAccessibility();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState('standard');
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  const modes = [
    {
      id: 'standard',
      label: 'Standard',
      description: 'Default settings for most users',
      icon: <Zap size={compact ? 16 : 20} />,
      color: 'bg-gray-100 text-gray-800',
      activeColor: 'bg-blue-600 text-white',
      settings: {
        baseFontSize: 16,
        reducedMotion: false,
        voiceGuidance: false,
        largeCursor: false,
        screenReader: false,
        keyboardNavigation: false,
        visuallyImpaired: false
      }
    },
    {
      id: 'elderly',
      label: 'Elderly Friendly',
      description: 'Larger text, simplified interface',
      icon: <Shield size={compact ? 16 : 20} />,
      color: 'bg-gray-100 text-gray-800',
      activeColor: 'bg-blue-600 text-white',
      settings: {
        baseFontSize: 20,
        reducedMotion: true,
        voiceGuidance: true,
        largeCursor: true,
        screenReader: true,
        keyboardNavigation: true,
        visuallyImpaired: false
      }
    },
    {
      id: 'visual-impairment',
      label: 'Visual Impairment',
      description: 'Screen reader optimized, keyboard navigation',
      icon: <Eye size={compact ? 16 : 20} />,
      color: 'bg-purple-100 text-purple-800',
      activeColor: 'bg-purple-600 text-white',
      settings: {
        baseFontSize: 18,
        reducedMotion: true,
        voiceGuidance: true,
        largeCursor: true,
        screenReader: true,
        keyboardNavigation: true,
        visuallyImpaired: true
      }
    }
  ];

  const quickSettings = [];

  useEffect(() => {
    // Determine which preset is currently active
    const currentPreset = modes.find(mode => 
      Object.entries(mode.settings).every(([key, value]) => 
        settings[key] === value
      )
    )?.id || 'custom';
    
    setActivePreset(currentPreset);

    // Show recently changed indicator
    if (recentlyChanged) {
      const timer = setTimeout(() => {
        setRecentlyChanged(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose]);

  const handleModeChange = (mode) => {
    updateSettings({ 
      mode: mode.id,
      ...mode.settings 
    });
    setRecentlyChanged(true);
    
    if (autoClose) {
      setTimeout(() => setIsOpen(false), 1000);
    }
  };

  const handleReset = () => {
    resetSettings();
    setRecentlyChanged(true);
  };

  const getCurrentMode = () => {
    return modes.find(mode => mode.id === settings.mode) || modes[0];
  };

  const getPositionClasses = () => {
    if (position === 'inline') {
      return ''; // No positioning classes for inline mode
    }
    
    const baseClasses = floating ? 'fixed z-50' : 'absolute';
    
    switch(position) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const currentMode = getCurrentMode();

  const renderCompactView = () => (
    <div className={getPositionClasses()}>
      <motion.button
        whileHover={{ scale: position === 'inline' ? 1 : 1.05 }}
        whileTap={{ scale: position === 'inline' ? 1 : 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          position === 'inline' ? '' : 'shadow-lg'
        } ${
          settings.mode === 'standard' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : currentMode.activeColor.replace('bg-', 'bg-')
        } text-white transition-all duration-200`}
        aria-label={`Accessibility settings. Current mode: ${currentMode.label}`}
      >
        <Accessibility size={20} />
        <span className="font-medium">{currentMode.label}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility size={20} className="text-gray-700" />
                  <span className="font-bold text-gray-800">Accessibility</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Choose your preferred mode</p>
            </div>

            {/* Mode Selector */}
            <div className="p-2">
              {modes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-all border-2 ${
                    settings.mode === mode.id
                      ? `${mode.activeColor} border-yellow-400`
                      : `${mode.color} hover:border-yellow-400 border-transparent`
                  }`}
                >
                  <div className="flex-shrink-0">
                    {mode.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold">{mode.label}</div>
                    <div className="text-xs opacity-80">{mode.description}</div>
                  </div>
                  {settings.mode === mode.id && (
                    <Check size={16} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderFullView = () => (
    <div className={`${getPositionClasses()} w-80`}>
      <motion.div
        animate={{ y: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Accessibility size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Accessibility</h3>
                <p className="text-sm opacity-90">Choose your preferred experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-white/20 rounded-lg"
            >
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Current Mode */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Mode</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`p-2 rounded-lg ${currentMode.color}`}>
                  {currentMode.icon}
                </div>
                <div>
                  <h4 className="font-bold">{currentMode.label}</h4>
                  <p className="text-sm text-gray-600">{currentMode.description}</p>
                </div>
              </div>
            </div>
            {recentlyChanged && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-2 bg-green-100 text-green-800 rounded-full"
              >
                <Sparkles size={16} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-4">
          <h4 className="font-bold mb-3">Select Mode</h4>
          <div className="space-y-2">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                  settings.mode === mode.id
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`p-3 rounded-lg ${mode.color}`}>
                  {mode.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-sm text-gray-600">{mode.description}</div>
                </div>
                {settings.mode === mode.id && (
                  <div className="p-1 bg-primary-600 rounded-full">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="p-4 border-t">
          <h4 className="font-bold mb-3">Quick Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            {quickSettings.map(setting => (
              <button
                key={setting.id}
                onClick={setting.action}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  setting.active
                    ? 'bg-primary-100 border-2 border-primary-300'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                {setting.icon}
                <span className="text-sm font-medium mt-2">{setting.label}</span>
                <span className="text-xs text-gray-600 mt-1">
                  {setting.active ? 'On' : 'Off'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t"
            >
              <div className="p-4">
                <h4 className="font-bold mb-3">Advanced Settings</h4>
                <div className="space-y-3">
                  {/* Text Size Slider */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Text Size: {settings.baseFontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      step="1"
                      value={settings.baseFontSize}
                      onChange={(e) => updateSettings({ 
                        baseFontSize: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                      <span>X-Large</span>
                    </div>
                  </div>

                  {/* Additional Toggles */}
                  <div className="space-y-2">
                    <button
                      onClick={() => updateSettings({ 
                        largeCursor: !settings.largeCursor 
                      })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        settings.largeCursor
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Large Cursor</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-all ${
                        settings.largeCursor ? 'bg-blue-600' : 'bg-gray-400'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          settings.largeCursor ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>

                    <button
                      onClick={() => updateSettings({ 
                        keyboardNavigation: !settings.keyboardNavigation 
                      })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        settings.keyboardNavigation
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Settings size={16} />
                        <span>Keyboard Navigation</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-all ${
                        settings.keyboardNavigation ? 'bg-green-600' : 'bg-gray-400'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          settings.keyboardNavigation ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <RotateCcw size={16} />
              Reset All
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-800"
            >
              <Settings size={16} />
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Render trigger button when closed (full view)
  if (!isOpen && !compact) {
    return (
      <div className={getPositionClasses()}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-lg ${
            currentMode.activeColor
          } text-white`}
          aria-label="Open accessibility settings"
        >
          <Accessibility size={24} />
          <div className="text-left">
            <div className="font-bold">Accessibility</div>
            <div className="text-sm opacity-90">{currentMode.label} Mode</div>
          </div>
          <ChevronUp size={20} />
        </motion.button>
      </div>
    );
  }

  return compact ? renderCompactView() : renderFullView();
};

export default ModeToggle;