import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';

import Footer from '../common/Footer';

import { TopNavigation } from '../common/Navigation';
import ModeToggle from '../mode-selection/ModeToggle';
import PersonaSelector from '../user-profile/PersonaSelector'; // Quick settings component

// Accessibility Toolbar
const AccessibilityToolbar = () => {
  const { settings, updateSettings } = useAccessibility();
  
  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-sm">
      <div className="container mx-auto flex items-center justify-between">
        <span>Accessibility: {settings.mode} mode</span>
        <div className="flex gap-2">
          <button 
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            {settings.highContrast ? 'Normal Contrast' : 'High Contrast'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const { settings } = useAccessibility();
  const location = useLocation();
  const [showPreferences, setShowPreferences] = useState(false);

  const isHomePage = location.pathname === '/';

  const getLayoutClasses = () => {
    let classes = 'min-h-screen flex flex-col ';

    if (settings.highContrast) classes += 'bg-white text-black ';
    else classes += 'bg-gray-50 ';

    if (settings.mode === 'elderly') classes += 'text-lg ';

    return classes;
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Top navigation and toolbar */}
      <TopNavigation />
      <AccessibilityToolbar />

      <div className="relative flex flex-1">
       

        {/* Main Content */}
        <div className="flex-1">
       

          {/* Floating Mode Toggle */}
          <ModeToggle 
            compact={true}
            position="top-right"
            floating={true}
            autoClose={true}
          />

          <main className={`${settings.mode === 'elderly' ? 'p-6' : 'p-4'} container mx-auto`}>
            {!isHomePage && (
              <nav className="mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                      Home
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-600">
                    {location.pathname.split('/')[1].replace('-', ' ')}
                  </li>
                </ol>
              </nav>
            )}

            <div className={settings.mode === 'elderly' ? 'space-y-8' : 'space-y-6'}>
              {children}
            </div>
          </main>
        </div>

        {/* Quick Settings Panel */}
        {showPreferences && (
          <div className="w-80 bg-gray-50 border-l p-4">
            <h3 className="font-bold mb-4">Quick Settings</h3>
            <PersonaSelector compact={true} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
