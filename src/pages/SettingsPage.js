import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Bell,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Save,
  LogOut,
  Type,
  ZoomIn
} from 'lucide-react';

const SettingsPage = () => {
  // Local state for settings
  const [localSettings, setLocalSettings] = useState({
    theme: 'light',
    mode: 'normal',
    notifications: true,
    emailUpdates: false,
    sound: true,
    highContrast: false
  });

  // Initialize from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setLocalSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...localSettings,
      [key]: value
    };
    setLocalSettings(newSettings);
  };

  const handleAccessibilityChange = (mode) => {
    const newSettings = {
      ...localSettings,
      mode: mode,
      // Apply mode-specific defaults
      ...(mode === 'visual-impairment' && { highContrast: true })
    };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(localSettings));
    
    // Apply theme to document
    if (localSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply high contrast if needed
    if (localSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('Logging out...');
      // Add your logout logic here
    }
  };

  // Get background and text colors based on mode
  const getModeStyles = () => {
    if (localSettings.mode === 'visual-impairment') {
      return {
        background: localSettings.highContrast 
          ? 'bg-white dark:bg-black' 
          : 'bg-gray-100 dark:bg-gray-900',
        card: localSettings.highContrast 
          ? 'bg-yellow-50 dark:bg-yellow-900/30 border-2 border-black dark:border-white' 
          : 'bg-white dark:bg-gray-800 border-2 border-yellow-300',
        text: localSettings.highContrast 
          ? 'text-black dark:text-white' 
          : 'text-gray-900 dark:text-white',
        textSecondary: localSettings.highContrast 
          ? 'text-gray-800 dark:text-gray-200' 
          : 'text-gray-600 dark:text-gray-400'
      };
    }
    
    return {
      background: 'bg-gray-50 dark:bg-gray-900',
      card: 'bg-white dark:bg-gray-800',
      text: 'text-gray-900 dark:text-white',
      textSecondary: 'text-gray-600 dark:text-gray-400'
    };
  };

  const styles = getModeStyles();

  return (
    <div className={`min-h-screen p-4 md:p-8 ${styles.background}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className={`text-2xl font-bold ${styles.text} ${
              localSettings.mode === 'visual-impairment' ? 'text-3xl' : ''
            }`}>
              Settings
            </h1>
          </div>
          <p className={`${styles.textSecondary} ${
            localSettings.mode === 'visual-impairment' ? 'text-lg' : ''
          }`}>
            Manage your preferences and accessibility settings
          </p>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
         
         
          
            {/* Visual Impairment Options */}
            {localSettings.mode === 'visual-impairment' && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className={`font-medium ${styles.text} text-lg`}>Visual Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ZoomIn size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <h4 className={`font-medium ${styles.text}`}>Text Size</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Increase text size for better readability
                        </p>
                      </div>
                    </div>
                    <select 
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      defaultValue="large"
                    >
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <h4 className={`font-medium ${styles.text}`}>High Contrast</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Maximum contrast for better visibility
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange('highContrast', !localSettings.highContrast)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        localSettings.highContrast ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                          localSettings.highContrast ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
       

      

          {/* Notification Settings */}
          <div className={`rounded-lg shadow p-6 ${styles.card}`}>
            <h2 className={`font-semibold mb-4 ${styles.text} ${
              localSettings.mode === 'visual-impairment' ? 'text-xl' : 'text-lg'
            }`}>
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${styles.text} ${
                    localSettings.mode === 'visual-impairment' ? 'text-lg' : ''
                  }`}>
                    Push Notifications
                  </h3>
                  <p className={`${styles.textSecondary} ${
                    localSettings.mode === 'visual-impairment' ? 'text-base' : 'text-sm'
                  }`}>
                    Receive app notifications
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', !localSettings.notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localSettings.notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                      localSettings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${styles.text} ${
                    localSettings.mode === 'visual-impairment' ? 'text-lg' : ''
                  }`}>
                    Sound
                  </h3>
                  <p className={`${styles.textSecondary} ${
                    localSettings.mode === 'visual-impairment' ? 'text-base' : 'text-sm'
                  }`}>
                    Play sound for notifications
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('sound', !localSettings.sound)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localSettings.sound ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                      localSettings.sound ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className={`rounded-lg shadow p-6 ${styles.card}`}>
            <h2 className={`font-semibold mb-4 ${styles.text} ${
              localSettings.mode === 'visual-impairment' ? 'text-xl' : 'text-lg'
            }`}>
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block font-medium mb-1 ${styles.text} ${
                  localSettings.mode === 'visual-impairment' ? 'text-lg' : ''
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    localSettings.mode === 'visual-impairment' 
                      ? 'text-lg border-2 border-gray-300 dark:border-gray-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } ${styles.text}`}
                  style={{ backgroundColor: localSettings.mode === 'visual-impairment' && localSettings.highContrast 
                    ? (localSettings.theme === 'dark' ? 'black' : 'white')
                    : ''
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
                localSettings.mode === 'visual-impairment' ? 'text-lg py-4' : ''
              }`}
            >
              <Save size={20} />
              Save Settings
            </button>
            <button
              onClick={handleLogout}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border ${styles.textSecondary} font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                localSettings.mode === 'visual-impairment' 
                  ? 'text-lg py-4 border-2' 
                  : ''
              } border-gray-300 dark:border-gray-600`}
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;