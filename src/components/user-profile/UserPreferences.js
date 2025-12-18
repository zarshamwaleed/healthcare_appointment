import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Download,
  Trash2,
  Eye,
  Database,
  ShieldCheck,
  MessageCircle,
  MessageSquare,
  Smartphone,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Zap,
  Mail,
  Phone,
  Users
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
      promotional: false,
      doctorMessages: true,
      labResults: true
    },
    privacy: {
      shareHealthData: false,
      anonymousUsage: true,
      dataRetention: '1-year',
      autoDeleteOldData: false,
      twoFactorAuth: false,
      hidePersonalInfo: true
    },
    communication: {
      preferredLanguage: 'English',
      contactMethod: 'app',
      contactFrequency: 'weekly',
      emergencyContacts: []
    },
    display: {
      theme: settings.mode === 'elderly' ? 'light' : 'system',
      fontSize: settings.baseFontSize || 16,
      density: 'comfortable',
      animations: !settings.reducedMotion,
      highContrast: settings.highContrast || false,
      reduceTransparency: false
    },
    accessibility: {
      voiceGuidance: settings.voiceGuidance || false,
      screenReader: settings.screenReader || false,
      keyboardNavigation: settings.keyboardNavigation || false,
      largeCursor: settings.largeCursor || false,
      colorBlindMode: false,
      monoAudio: false
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'pdf',
      cloudSync: true,
      localBackup: false,
      backupEncryption: true
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} />, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={18} />, color: 'text-green-600 dark:text-green-400' },
    { id: 'display', label: 'Display', icon: <Eye size={18} />, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'accessibility', label: 'Accessibility', icon: <Zap size={18} />, color: 'text-red-600 dark:text-red-400' },
    { id: 'data', label: 'Data & Backup', icon: <Database size={18} />, color: 'text-indigo-600 dark:text-indigo-400' }
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Spanish', 'French'];
  const contactMethods = [
    { id: 'app', label: 'App', icon: <Smartphone size={16} /> },
    { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'sms', label: 'SMS', icon: <MessageCircle size={16} /> },
    { id: 'phone', label: 'Phone', icon: <Phone size={16} /> }
  ];
  const frequencies = ['daily', 'weekly', 'monthly', 'never'];
  const themes = [
    { id: 'light', label: 'Light', icon: <Sun size={20} />, color: 'from-amber-400 to-orange-400' },
    { id: 'dark', label: 'Dark', icon: <Moon size={20} />, color: 'from-slate-700 to-slate-900' },
    { id: 'system', label: 'System', icon: <Globe size={20} />, color: 'from-blue-400 to-indigo-400' }
  ];
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
      promotional: false,
      doctorMessages: true,
      labResults: true
    },
    privacy: {
      shareHealthData: false,
      anonymousUsage: true,
      dataRetention: '1-year',
      autoDeleteOldData: false,
      twoFactorAuth: false,
      hidePersonalInfo: true
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
      animations: true,
      highContrast: false,
      reduceTransparency: false
    },
    accessibility: {
      voiceGuidance: false,
      screenReader: false,
      keyboardNavigation: false,
      largeCursor: false,
      colorBlindMode: false,
      monoAudio: false
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'pdf',
      cloudSync: true,
      localBackup: false,
      backupEncryption: true
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

  const SwitchToggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked 
            ? 'bg-gradient-to-r from-primary-500 to-blue-500 dark:from-primary-400 dark:to-blue-400' 
            : 'bg-gray-300 dark:bg-slate-600'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(preferences.notifications).map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const descriptions = {
            appointmentReminders: 'Reminders 24h and 1h before appointments',
            medicationReminders: 'Daily medication schedule reminders',
            healthTips: 'Weekly health tips and wellness advice',
            emergencyAlerts: 'Critical health alerts and emergency notifications',
            promotional: 'Promotional offers and healthcare news',
            doctorMessages: 'Messages from your healthcare providers',
            labResults: 'Alerts when new lab results are available'
          };
          
          return (
            <SwitchToggle
              key={key}
              checked={value}
              onChange={() => handlePreferenceChange('notifications', key, !value)}
              label={label}
              description={descriptions[key]}
            />
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Bell size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">Notification Preferences</h4>
            <p className="text-amber-700 dark:text-amber-400 text-sm">
              You can adjust notification sounds, vibration patterns, and quiet hours in the mobile app settings.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwitchToggle
          checked={preferences.privacy.shareHealthData}
          onChange={() => handlePreferenceChange('privacy', 'shareHealthData', !preferences.privacy.shareHealthData)}
          label="Share Health Data for Research"
          description="Anonymized data helps medical research (GDPR compliant)"
        />
        
        <SwitchToggle
          checked={preferences.privacy.anonymousUsage}
          onChange={() => handlePreferenceChange('privacy', 'anonymousUsage', !preferences.privacy.anonymousUsage)}
          label="Anonymous Usage Analytics"
          description="Help us improve the app with anonymous data"
        />
        
        <SwitchToggle
          checked={preferences.privacy.twoFactorAuth}
          onChange={() => handlePreferenceChange('privacy', 'twoFactorAuth', !preferences.privacy.twoFactorAuth)}
          label="Two-Factor Authentication"
          description="Extra security layer for your account"
        />
        
        <SwitchToggle
          checked={preferences.privacy.hidePersonalInfo}
          onChange={() => handlePreferenceChange('privacy', 'hidePersonalInfo', !preferences.privacy.hidePersonalInfo)}
          label="Hide Personal Information"
          description="Mask personal details in shared screens"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Data Retention Period
          </label>
          <select
            value={preferences.privacy.dataRetention}
            onChange={(e) => handlePreferenceChange('privacy', 'dataRetention', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          >
            {dataRetentionOptions.map(option => (
              <option key={option} value={option}>
                {option.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <SwitchToggle
          checked={preferences.privacy.autoDeleteOldData}
          onChange={() => handlePreferenceChange('privacy', 'autoDeleteOldData', !preferences.privacy.autoDeleteOldData)}
          label="Auto-delete Old Data"
          description="Automatically delete data older than retention period"
        />
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/10 dark:to-primary-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">Your Privacy is Protected</h4>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              All health data is encrypted with AES-256. We comply with HIPAA, GDPR, and local regulations.
              Your data is never sold to third parties. <a href="#" className="underline">Learn more</a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            <Globe className="inline mr-2" size={16} />
            Preferred Language
          </label>
          <select
            value={preferences.communication.preferredLanguage}
            onChange={(e) => handlePreferenceChange('communication', 'preferredLanguage', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            <MessageSquare className="inline mr-2" size={16} />
            Contact Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {contactMethods.map(method => (
              <button
                key={method.id}
                onClick={() => handlePreferenceChange('communication', 'contactMethod', method.id)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  preferences.communication.contactMethod === method.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className={`${preferences.communication.contactMethod === method.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  {method.icon}
                </div>
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            <Bell className="inline mr-2" size={16} />
            Contact Frequency
          </label>
          <select
            value={preferences.communication.contactFrequency}
            onChange={(e) => handlePreferenceChange('communication', 'contactFrequency', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          >
            {frequencies.map(freq => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
          <Users className="inline mr-2" size={16} />
          Emergency Contacts
        </label>
        <div className="space-y-3">
          {preferences.communication.emergencyContacts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl">
              <Users size={32} className="text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No emergency contacts added</p>
            </div>
          ) : (
            preferences.communication.emergencyContacts.map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center">
                    <Users size={18} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newContacts = [...preferences.communication.emergencyContacts];
                    newContacts.splice(idx, 1);
                    handlePreferenceChange('communication', 'emergencyContacts', newContacts);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-primary-600 dark:text-primary-400 font-medium"
          >
            + Add Emergency Contact
          </button>
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-4 text-gray-900 dark:text-white">
          Theme Preference
        </label>
        <div className="grid grid-cols-3 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => handlePreferenceChange('display', 'theme', theme.id)}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                preferences.display.theme === theme.id
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20'
                  : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${theme.color}`}>
                <div className="text-white">
                  {theme.icon}
                </div>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Text Size: <span className="text-primary-600 dark:text-primary-400">{preferences.display.fontSize}px</span>
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="12"
              max="24"
              step="1"
              value={preferences.display.fontSize}
              onChange={(e) => handlePreferenceChange('display', 'fontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 dark:[&::-webkit-slider-thumb]:bg-primary-400"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Small (12px)</span>
              <span>Medium (16px)</span>
              <span>Large (20px)</span>
              <span>X-Large (24px)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Interface Density
          </label>
          <div className="grid grid-cols-3 gap-2">
            {densities.map(density => (
              <button
                key={density}
                onClick={() => handlePreferenceChange('display', 'density', density)}
                className={`p-3 rounded-xl border text-center ${
                  preferences.display.density === density
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="font-medium">
                  {density.charAt(0).toUpperCase() + density.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwitchToggle
          checked={preferences.display.animations}
          onChange={() => handlePreferenceChange('display', 'animations', !preferences.display.animations)}
          label="Interface Animations"
          description="Smooth transitions and animations"
        />
        
        <SwitchToggle
          checked={preferences.display.highContrast}
          onChange={() => handlePreferenceChange('display', 'highContrast', !preferences.display.highContrast)}
          label="High Contrast Mode"
          description="Better visibility with higher contrast"
        />
        
        <SwitchToggle
          checked={preferences.display.reduceTransparency}
          onChange={() => handlePreferenceChange('display', 'reduceTransparency', !preferences.display.reduceTransparency)}
          label="Reduce Transparency"
          description="Minimize transparent effects"
        />
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwitchToggle
          checked={preferences.accessibility.voiceGuidance}
          onChange={() => handlePreferenceChange('accessibility', 'voiceGuidance', !preferences.accessibility.voiceGuidance)}
          label="Voice Guidance"
          description="Audio guidance for all actions"
        />
        
        <SwitchToggle
          checked={preferences.accessibility.screenReader}
          onChange={() => handlePreferenceChange('accessibility', 'screenReader', !preferences.accessibility.screenReader)}
          label="Screen Reader Optimized"
          description="Enhanced compatibility with screen readers"
        />
        
        <SwitchToggle
          checked={preferences.accessibility.keyboardNavigation}
          onChange={() => handlePreferenceChange('accessibility', 'keyboardNavigation', !preferences.accessibility.keyboardNavigation)}
          label="Keyboard Navigation"
          description="Full keyboard navigation support"
        />
        
        <SwitchToggle
          checked={preferences.accessibility.largeCursor}
          onChange={() => handlePreferenceChange('accessibility', 'largeCursor', !preferences.accessibility.largeCursor)}
          label="Large Cursor"
          description="Larger cursor for better visibility"
        />
        
        <SwitchToggle
          checked={preferences.accessibility.colorBlindMode}
          onChange={() => handlePreferenceChange('accessibility', 'colorBlindMode', !preferences.accessibility.colorBlindMode)}
          label="Color Blind Mode"
          description="Color adjustments for different vision types"
        />
        
        <SwitchToggle
          checked={preferences.accessibility.monoAudio}
          onChange={() => handlePreferenceChange('accessibility', 'monoAudio', !preferences.accessibility.monoAudio)}
          label="Mono Audio"
          description="Combine stereo audio to mono"
        />
      </div>

      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-primary-800 dark:text-primary-300 mb-1">Quick Accessibility Mode</h4>
            <p className="text-primary-700 dark:text-primary-400 text-sm mb-3">
              For quick accessibility adjustments, use the accessibility toggle in the navigation bar.
            </p>
            <button
              onClick={() => window.location.href = '/accessibility'}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors text-sm"
            >
              Open Accessibility Panel
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwitchToggle
          checked={preferences.data.autoBackup}
          onChange={() => handlePreferenceChange('data', 'autoBackup', !preferences.data.autoBackup)}
          label="Automatic Backup"
          description="Automatically backup your health data"
        />
        
        <SwitchToggle
          checked={preferences.data.cloudSync}
          onChange={() => handlePreferenceChange('data', 'cloudSync', !preferences.data.cloudSync)}
          label="Cloud Sync"
          description="Sync data across all your devices"
        />
        
        <SwitchToggle
          checked={preferences.data.localBackup}
          onChange={() => handlePreferenceChange('data', 'localBackup', !preferences.data.localBackup)}
          label="Local Backup"
          description="Create local backups on your device"
        />
        
        <SwitchToggle
          checked={preferences.data.backupEncryption}
          onChange={() => handlePreferenceChange('data', 'backupEncryption', !preferences.data.backupEncryption)}
          label="Encrypt Backups"
          description="Add encryption to all backup files"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Backup Frequency
          </label>
          <select
            value={preferences.data.backupFrequency}
            onChange={(e) => handlePreferenceChange('data', 'backupFrequency', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            disabled={!preferences.data.autoBackup}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Export Format
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {exportFormats.map(format => (
              <button
                key={format}
                onClick={() => handlePreferenceChange('data', 'exportFormat', format)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                  preferences.data.exportFormat === format
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg font-bold">{format.toUpperCase()}</span>
                <span className="text-xs">Format</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportData}
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <Download size={24} className="text-primary-600 dark:text-primary-400" />
            <span className="font-medium text-gray-900 dark:text-white">Export All Data</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Download your complete health history</span>
          </button>
          
          <button
            onClick={handleDeleteData}
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            <span className="font-medium text-red-700 dark:text-red-300">Delete All Data</span>
            <span className="text-sm text-red-600 dark:text-red-400">Permanent deletion (irreversible)</span>
          </button>
        </div>

        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Warning: Irreversible Action</h4>
              <p className="text-red-700 dark:text-red-400 text-sm">
                Deleting your data is permanent and cannot be undone. 
                Make sure to export your data before proceeding. This action will remove all your health records, appointments, and personal information.
              </p>
            </div>
          </div>
        </Card>
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
   


     
    </div>
  );
};

export default UserPreferences;