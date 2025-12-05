import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  Shield, 
  Lock, 
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Users,
  Zap,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import Button from '../common/Button';

const UserPreferences = ({ 
  userId,
  onSave,
  onCancel,
  showHeader = true
}) => {
  const { settings, updateSettings } = useAccessibility();
  const [preferences, setPreferences] = useState({
    notifications: {
      appointmentReminders: true,
      medicationReminders: true,
      healthTips: true,
      emergencyAlerts: true,
      promotional: false
    },
    privacy: {
      shareHealthData: false,
      anonymousUsage: true,
      dataRetention: '1-year',
      autoDeleteOldData: false
    },
    communication: {
      preferredLanguage: 'English',
      contactMethod: 'app',
      contactFrequency: 'weekly',
      emergencyContacts: []
    },
    display: {
      theme: settings.mode === 'elderly' ? 'light' : 'system',
      fontSize: settings.baseFontSize,
      density: 'comfortable',
      animations: !settings.reducedMotion
    },
    accessibility: {
      voiceGuidance: settings.voiceGuidance,
      screenReader: settings.screenReader,
      keyboardNavigation: settings.keyboardNavigation,
      largeCursor: settings.largeCursor,
      highContrast: settings.highContrast
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'pdf',
      cloudSync: true
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={18} /> },
    { id: 'display', label: 'Display', icon: <Eye size={18} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Zap size={18} /> },
    { id: 'data', label: 'Data', icon: <Download size={18} /> }
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Spanish', 'French'];
  const contactMethods = ['app', 'email', 'sms', 'phone', 'whatsapp'];
  const frequencies = ['daily', 'weekly', 'monthly', 'never'];
  const themes = ['light', 'dark', 'system'];
  const densities = ['compact', 'comfortable', 'spacious'];
  const dataRetentionOptions = ['3-months', '6-months', '1-year', '2-years', 'forever'];
  const exportFormats = ['pdf', 'csv', 'json', 'xml'];

  useEffect(() => {
    // Check for changes
    const initialPrefs = JSON.stringify(preferences);
    // We'll compare later when needed
  }, [preferences]);

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Update accessibility settings
    updateSettings({
      baseFontSize: preferences.display.fontSize,
      reducedMotion: !preferences.display.animations,
      voiceGuidance: preferences.accessibility.voiceGuidance,
      screenReader: preferences.accessibility.screenReader,
      keyboardNavigation: preferences.accessibility.keyboardNavigation,
      largeCursor: preferences.accessibility.largeCursor,
      highContrast: preferences.accessibility.highContrast,
      mode: preferences.display.theme === 'dark' ? 'standard' : settings.mode // Keep mode, adjust theme
    });

    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave(preferences);
      }
      setSaving(false);
      setHasChanges(false);
      alert('Preferences saved successfully!');
    }, 1000);
  };

  const handleReset = (category = null) => {
    if (category) {
      setPreferences(prev => ({
        ...prev,
        [category]: getDefaultPreferences()[category]
      }));
    } else {
      setPreferences(getDefaultPreferences());
    }
    setHasChanges(true);
  };

  const getDefaultPreferences = () => ({
    notifications: {
      appointmentReminders: true,
      medicationReminders: true,
      healthTips: true,
      emergencyAlerts: true,
      promotional: false
    },
    privacy: {
      shareHealthData: false,
      anonymousUsage: true,
      dataRetention: '1-year',
      autoDeleteOldData: false
    },
    communication: {
      preferredLanguage: 'English',
      contactMethod: 'app',
      contactFrequency: 'weekly',
      emergencyContacts: []
    },
    display: {
      theme: 'system',
      fontSize: 16,
      density: 'comfortable',
      animations: true
    },
    accessibility: {
      voiceGuidance: false,
      screenReader: false,
      keyboardNavigation: false,
      largeCursor: false,
      highContrast: false
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'pdf',
      cloudSync: true
    }
  });

  const handleExportData = () => {
    alert(`Exporting data in ${preferences.data.exportFormat.toUpperCase()} format...`);
  };

  const handleDeleteData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      alert('Data deletion scheduled. You will receive a confirmation email.');
    }
  };

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4">Push Notifications</h3>
        <div className="space-y-3">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-600">
                  {key.includes('Reminders') ? 'Receive reminders before appointments' :
                   key.includes('Tips') ? 'Get daily health tips and advice' :
                   key.includes('Alerts') ? 'Emergency and important alerts' :
                   'Promotional offers and updates'}
                </p>
              </div>
              <button
                onClick={() => handlePreferenceChange('notifications', key, !value)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  value ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Notification Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded-lg">
            <p className="font-medium mb-2">Quiet Hours</p>
            <p className="text-sm text-gray-600">10:00 PM - 7:00 AM</p>
            <button className="text-primary-600 text-sm mt-2">Change</button>
          </div>
          <div className="p-4 bg-white border rounded-lg">
            <p className="font-medium mb-2">Sound & Vibration</p>
            <p className="text-sm text-gray-600">Custom sounds for different alerts</p>
            <button className="text-primary-600 text-sm mt-2">Configure</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4">Data Sharing</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="font-medium">Share Health Data for Research</span>
              </div>
              <button
                onClick={() => handlePreferenceChange('privacy', 'shareHealthData', !preferences.privacy.shareHealthData)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.privacy.shareHealthData ? 'bg-green-600' : 'bg-gray-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  preferences.privacy.shareHealthData ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Share anonymized health data to help medical research. No personal information is shared.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <EyeOff size={20} />
                <span className="font-medium">Anonymous Usage Analytics</span>
              </div>
              <button
                onClick={() => handlePreferenceChange('privacy', 'anonymousUsage', !preferences.privacy.anonymousUsage)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.privacy.anonymousUsage ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  preferences.privacy.anonymousUsage ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Help us improve the app by sharing anonymous usage data.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4">Data Retention</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Keep My Data For</label>
            <select
              value={preferences.privacy.dataRetention}
              onChange={(e) => handlePreferenceChange('privacy', 'dataRetention', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {dataRetentionOptions.map(option => (
                <option key={option} value={option}>
                  {option.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Auto-delete Old Data</p>
              <p className="text-sm text-gray-600">Automatically delete data older than retention period</p>
            </div>
            <button
              onClick={() => handlePreferenceChange('privacy', 'autoDeleteOldData', !preferences.privacy.autoDeleteOldData)}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.privacy.autoDeleteOldData ? 'bg-red-600' : 'bg-gray-400'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                preferences.privacy.autoDeleteOldData ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Your Privacy is Protected</h4>
            <p className="text-sm text-blue-700">
              All health data is encrypted and stored securely. We comply with HIPAA and GDPR regulations.
              Your data is never sold to third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Language</label>
          <select
            value={preferences.communication.preferredLanguage}
            onChange={(e) => handlePreferenceChange('communication', 'preferredLanguage', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Method</label>
          <div className="flex flex-wrap gap-2">
            {contactMethods.map(method => (
              <button
                key={method}
                onClick={() => handlePreferenceChange('communication', 'contactMethod', method)}
                className={`px-4 py-2 rounded-lg border ${
                  preferences.communication.contactMethod === method
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contact Frequency</label>
          <select
            value={preferences.communication.contactFrequency}
            onChange={(e) => handlePreferenceChange('communication', 'contactFrequency', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {frequencies.map(freq => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Emergency Contacts</label>
          <div className="space-y-2">
            {preferences.communication.emergencyContacts.length === 0 ? (
              <p className="text-gray-500">No emergency contacts added</p>
            ) : (
              preferences.communication.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newContacts = [...preferences.communication.emergencyContacts];
                      newContacts.splice(idx, 1);
                      handlePreferenceChange('communication', 'emergencyContacts', newContacts);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => {
                const name = prompt("Enter contact name:");
                const phone = prompt("Enter phone number:");
                if (name && phone) {
                  const newContacts = [...preferences.communication.emergencyContacts, { name, phone }];
                  handlePreferenceChange('communication', 'emergencyContacts', newContacts);
                }
              }}
              className="text-primary-600 hover:text-primary-800"
            >
              + Add Emergency Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex gap-2">
            {themes.map(theme => (
              <button
                key={theme}
                onClick={() => handlePreferenceChange('display', 'theme', theme)}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center ${
                  preferences.display.theme === theme
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {theme === 'light' ? <Sun size={24} /> : theme === 'dark' ? <Moon size={24} /> : <Globe size={24} />}
                <span className="mt-2 font-medium">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Text Size: {preferences.display.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={preferences.display.fontSize}
            onChange={(e) => handlePreferenceChange('display', 'fontSize', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
            <span>X-Large</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Interface Density</label>
          <div className="flex gap-2">
            {densities.map(density => (
              <button
                key={density}
                onClick={() => handlePreferenceChange('display', 'density', density)}
                className={`flex-1 p-3 rounded-lg border ${
                  preferences.display.density === density
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">
                  {density.charAt(0).toUpperCase() + density.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Animations</p>
            <p className="text-sm text-gray-600">Enable interface animations and transitions</p>
          </div>
          <button
            onClick={() => handlePreferenceChange('display', 'animations', !preferences.display.animations)}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.display.animations ? 'bg-primary-600' : 'bg-gray-400'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              preferences.display.animations ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold">Accessibility Features</h3>
        {Object.entries(preferences.accessibility).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-sm text-gray-600">
                {key === 'voiceGuidance' ? 'Audio guidance for all actions' :
                 key === 'screenReader' ? 'Optimize for screen readers' :
                 key === 'keyboardNavigation' ? 'Full keyboard navigation support' :
                 key === 'largeCursor' ? 'Large cursor for better visibility' :
                 'High contrast colors for better readability'}
              </p>
            </div>
            <button
              onClick={() => handlePreferenceChange('accessibility', key, !value)}
              className={`w-12 h-6 rounded-full transition-colors ${
                value ? 'bg-primary-600' : 'bg-gray-400'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                value ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Quick Accessibility Mode</h4>
            <p className="text-sm text-blue-700 mb-3">
              For quick accessibility adjustments, use the mode selector in the top-right corner.
            </p>
            <Button
              variant="primary"
              size="small"
              onClick={() => window.location.href = '/accessibility'}
            >
              Open Accessibility Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Auto Backup</p>
            <p className="text-sm text-gray-600">Automatically backup your health data</p>
          </div>
          <button
            onClick={() => handlePreferenceChange('data', 'autoBackup', !preferences.data.autoBackup)}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.data.autoBackup ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              preferences.data.autoBackup ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Backup Frequency</label>
          <select
            value={preferences.data.backupFrequency}
            onChange={(e) => handlePreferenceChange('data', 'backupFrequency', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={!preferences.data.autoBackup}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Cloud Sync</p>
            <p className="text-sm text-gray-600">Sync data across all your devices</p>
          </div>
          <button
            onClick={() => handlePreferenceChange('data', 'cloudSync', !preferences.data.cloudSync)}
            className={`w-12 h-6 rounded-full transition-colors ${
              preferences.data.cloudSync ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              preferences.data.cloudSync ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold">Data Management</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <div className="flex flex-wrap gap-2">
            {exportFormats.map(format => (
              <button
                key={format}
                onClick={() => handlePreferenceChange('data', 'exportFormat', format)}
                className={`px-4 py-2 rounded-lg border ${
                  preferences.data.exportFormat === format
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExportData}
            fullWidth
          >
            Export All Data
          </Button>
          
          <Button
            variant="danger"
            icon={<Trash2 size={18} />}
            onClick={handleDeleteData}
            fullWidth
          >
            Delete All Data
          </Button>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 mb-1">Warning</h4>
              <p className="text-sm text-red-700">
                Deleting your data is permanent and cannot be undone. 
                Make sure to export your data before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'communication':
        return renderCommunicationSettings();
      case 'display':
        return renderDisplaySettings();
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderNotificationSettings();
    }
  };

  return (
    <div className={`${settings.mode === 'elderly' ? 'p-4' : ''}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-8">
          <h1 className={`font-bold mb-4 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
            <Settings className="inline mr-2 text-primary-600" />
            User Preferences
          </h1>
          <p className="text-gray-600">
            Customize your healthcare experience with these settings
          </p>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                variant="outline"
                icon={<RotateCcw size={18} />}
                onClick={() => handleReset(activeTab)}
                disabled={saving}
              >
                Reset {tabs.find(t => t.id === activeTab)?.label}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={saving}
              >
                Reset All
              </Button>
            </div>
            
            <div className="flex gap-3">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}
              
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                loading={saving}
                icon={<Check size={18} />}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Help */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={20} className="text-gray-600" />
            <h4 className="font-medium">Need Help?</h4>
          </div>
          <p className="text-sm text-gray-600">
            Visit our help center for detailed explanations of all settings.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-gray-600" />
            <h4 className="font-medium">Privacy First</h4>
          </div>
          <p className="text-sm text-gray-600">
            Your data is encrypted and protected. We never share without permission.
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-gray-600" />
            <h4 className="font-medium">Quick Changes</h4>
          </div>
          <p className="text-sm text-gray-600">
            Use the accessibility toggle for quick mode changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;