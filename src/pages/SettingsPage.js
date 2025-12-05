// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import UserPreferences from '../components/user-profile/UserPreferences';
import PersonaSelector from '../components/user-profile/PersonaSelector';
import HistoryView from '../components/user-profile/HistoryView';
import { 
  User, 
  Palette, 
  History, 
  Save,
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Moon,
  Volume2,
  Eye
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveAll = () => {
    // Trigger save in all components
    setSaveMessage('All settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} />, component: <UserPreferences /> },
    { id: 'interface', label: 'Interface', icon: <Palette size={20} />, component: <PersonaSelector /> },
    { id: 'history', label: 'History', icon: <History size={20} />, component: <HistoryView /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Eye size={20} /> },
  ];

  return (

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Go back"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
                </div>
              </div>
              <button
                onClick={handleSaveAll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
              >
                <Save size={20} />
                <span>Save All Changes</span>
              </button>
            </div>
            
            {saveMessage && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-1 bg-white rounded-lg shadow p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md
                      ${activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                      transition-colors duration-200
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
                
                {/* Additional Settings Links */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    More Settings
                  </h3>
                  <a 
                    href="#language" 
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Globe size={18} />
                    <span>Language & Region</span>
                  </a>
                  <a 
                    href="#theme" 
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Moon size={18} />
                    <span>Dark Mode</span>
                  </a>
                  <a 
                    href="#sound" 
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Volume2 size={18} />
                    <span>Sound & Haptics</span>
                  </a>
                </div>
              </nav>
              
              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-medium text-blue-600">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <User size={24} />
                        <span>Profile Information</span>
                      </h2>
                      <p className="text-gray-600 mt-1">Update your personal details and contact information</p>
                    </div>
                    <div className="p-6">
                      <UserPreferences />
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600">Add emergency contacts for quick access during appointments.</p>
                      <button className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        + Add Emergency Contact
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Interface Settings */}
              {activeTab === 'interface' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <Palette size={24} />
                        <span>Interface Preferences</span>
                      </h2>
                      <p className="text-gray-600 mt-1">Choose the interface style that works best for your needs</p>
                    </div>
                    <div className="p-6">
                      <PersonaSelector />
                    </div>
                  </div>

                  {/* Theme Customization */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Advanced Theme Settings</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size
                          </label>
                          <input 
                            type="range" 
                            min="12" 
                            max="24" 
                            defaultValue="16"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Animation Speed
                          </label>
                          <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option>Normal</option>
                            <option>Reduced</option>
                            <option>Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment History */}
              {activeTab === 'history' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <History size={24} />
                      <span>Appointment History</span>
                    </h2>
                    <p className="text-gray-600 mt-1">View and manage your past and upcoming appointments</p>
                  </div>
                  <div className="p-6">
                    <HistoryView />
                  </div>
                </div>
              )}

              {/* Other Settings Tabs */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  <p className="text-gray-600">Configure how you receive notifications for appointments.</p>
                  {/* Add notification settings components here */}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h2>
                  <p className="text-gray-600">Manage your data and privacy preferences.</p>
                  {/* Add privacy settings components here */}
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility Settings</h2>
                  <p className="text-gray-600">Customize accessibility features for a better experience.</p>
                  {/* Add accessibility settings components here */}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              <p>Need help? <a href="#support" className="text-blue-600 hover:underline">Contact Support</a></p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default SettingsPage;