import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';

import Footer from '../common/Footer';

import { TopNavigation } from '../common/Navigation';
import PersonaSelector from '../user-profile/PersonaSelector'; // Quick settings component

// Accessibility Toolbar
const AccessibilityToolbar = () => {
  const { settings, updateSettings } = useAccessibility();
  
  return (
    <div className="bg-gray-800 dark:bg-slate-900 text-white py-2 px-4 text-sm">
      <div className="container mx-auto flex items-center justify-between">
        <span>Accessibility: {settings.mode} mode</span>
        <div className="flex gap-2">
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const { settings } = useAccessibility();
  const { theme } = useTheme();
  const location = useLocation();
  const [showPreferences, setShowPreferences] = useState(false);

  const isHomePage = location.pathname === '/';

  const getLayoutClasses = () => {
    let classes = 'min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200 ';

    // Don't add background classes - let high contrast CSS handle it
    if (settings.mode === 'elderly') classes += 'text-lg ';

    return classes;
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Top navigation and toolbar */}
      <TopNavigation />

      <div className="relative flex flex-1">
       

        {/* Main Content */}
        <div className="flex-1">
       
          <main className={isHomePage ? '' : `${settings.mode === 'elderly' ? 'p-6' : 'p-4'} container mx-auto`}>
            <div className={isHomePage ? '' : (settings.mode === 'elderly' ? 'space-y-8' : 'space-y-6')}>
              {children}
            </div>
          </main>
        </div>

        {/* Quick Settings Panel */}
        {showPreferences && (
          <div className="w-80 bg-gray-50 dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 p-4">
            <h3 className="font-bold mb-4 dark:text-white">Quick Settings</h3>
            <PersonaSelector compact={true} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
