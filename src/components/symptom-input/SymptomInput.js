import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  AlertCircle,
  Clock,
  Thermometer,
  Heart,
  Brain,
  Bone,
  Eye,
  User,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import Button from '../common/Button';

const SymptomInput = ({ 
  onSubmit, 
  initialSymptoms = [],
  placeholder = "Describe your symptoms...",
  showSuggestions = true,
  maxSymptoms = 10
}) => {
  const { settings } = useAccessibility();
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('');

  const commonSymptoms = [
    { name: 'Headache', icon: <Brain size={16} />, category: 'Neurological' },
    { name: 'Fever', icon: <Thermometer size={16} />, category: 'General' },
    { name: 'Cough', icon: <User size={16} />, category: 'Respiratory' },
    { name: 'Stomach Pain', icon: <AlertCircle size={16} />, category: 'Digestive' },
    { name: 'Chest Pain', icon: <Heart size={16} />, category: 'Cardiac' },
    { name: 'Back Pain', icon: <Bone size={16} />, category: 'Musculoskeletal' },
    { name: 'Skin Rash', icon: <Eye size={16} />, category: 'Dermatological' },
    { name: 'Fatigue', icon: <Clock size={16} />, category: 'General' },
    { name: 'Dizziness', icon: <AlertCircle size={16} />, category: 'Neurological' },
    { name: 'Shortness of Breath', icon: <User size={16} />, category: 'Respiratory' },
    { name: 'Joint Pain', icon: <Bone size={16} />, category: 'Musculoskeletal' },
    { name: 'Nausea', icon: <AlertCircle size={16} />, category: 'Digestive' }
  ];

  const severityOptions = [
    { 
      id: 'mild', 
      label: 'Mild', 
      color: 'bg-green-100 text-green-800 border-green-200',
      darkColor: 'dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      icon: '🟢'
    },
    { 
      id: 'moderate', 
      label: 'Moderate', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
      icon: '🟡'
    },
    { 
      id: 'severe', 
      label: 'Severe', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      darkColor: 'dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      icon: '🟠'
    },
    { 
      id: 'emergency', 
      label: 'Emergency', 
      color: 'bg-red-100 text-red-800 border-red-200',
      darkColor: 'dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      icon: '🔴'
    }
  ];

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = commonSymptoms.filter(symptom =>
        symptom.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  const handleAddSymptom = (symptomName) => {
    if (symptomName.trim() && symptoms.length < maxSymptoms) {
      const symptomWithDetails = {
        name: symptomName.trim(),
        severity,
        duration,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      setSymptoms([...symptoms, symptomWithDetails]);
      setInputValue('');
      setSeverity('moderate');
      setDuration('');
      setShowDropdown(false);
    }
  };

  const handleRemoveSymptom = (index) => {
    const newSymptoms = [...symptoms];
    newSymptoms.splice(index, 1);
    setSymptoms(newSymptoms);
  };

  const handleSubmit = () => {
    if (symptoms.length > 0 && onSubmit) {
      onSubmit(symptoms.map(s => s.name));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleAddSymptom(inputValue);
    }
  };

  const getSeverityInfo = (severityLevel) => {
    return severityOptions.find(option => option.id === severityLevel) || severityOptions[1];
  };

  return (
    <div className={`space-y-6 ${settings.mode === 'elderly' ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
          <Stethoscope size={32} className="text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className={`font-bold mb-2 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'} text-gray-900 dark:text-white`}>
            Describe Your Symptoms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Add your symptoms below. The more specific you are, the better our recommendations.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Search size={20} className="text-gray-500 dark:text-gray-400" />
              <label className="font-medium text-gray-900 dark:text-white">Symptom</label>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className={`w-full pl-4 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 dark:border-slate-700 ${
                  settings.mode === 'elderly' ? 'text-lg py-4' : ''
                }`}
                aria-label="Enter symptom"
              />
              
              {inputValue && (
                <button
                  onClick={() => handleAddSymptom(inputValue)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
                  aria-label="Add symptom"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((symptom, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddSymptom(symptom.name)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-left border-b dark:border-slate-700 last:border-b-0 transition-colors"
                  >
                    <div className="text-gray-500 dark:text-gray-300">
                      {symptom.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium dark:text-white">{symptom.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{symptom.category}</div>
                    </div>
                    <Plus size={16} className="text-primary-600 dark:text-primary-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Severity Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-gray-500 dark:text-gray-400" />
              <label className="font-medium text-gray-900 dark:text-white">Severity</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {severityOptions.map(option => {
                const isSelected = severity === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSeverity(option.id)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      isSelected
                        ? `${option.color} ${option.darkColor} font-medium border-2`
                        : 'border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Input */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={20} className="text-gray-500 dark:text-gray-400" />
              <label className="font-medium text-gray-900 dark:text-white">Duration</label>
            </div>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2 days, 1 week, 3 hours"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 dark:border-slate-700 ${
                settings.mode === 'elderly' ? 'text-lg py-4' : ''
              }`}
            />
          </div>
        </div>
      </Card>

      {/* Selected Symptoms */}
      {symptoms.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Selected Symptoms ({symptoms.length})</h3>
            <button
              onClick={() => setSymptoms([])}
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {symptoms.map((symptom, index) => {
              const severityInfo = getSeverityInfo(symptom.severity);
              return (
                <div
                  key={symptom.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium dark:text-white">{symptom.name}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${severityInfo.color} ${severityInfo.darkColor}`}>
                        {severityInfo.icon} {severityInfo.label}
                      </span>
                    </div>
                    {symptom.duration && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Clock size={14} />
                        Duration: {symptom.duration}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label={`Remove ${symptom.name}`}
                  >
                    <X size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              onClick={handleSubmit}
              fullWidth
              size={settings.mode === 'elderly' ? 'large' : 'medium'}
              icon={<ChevronRight />}
              iconPosition="right"
              disabled={symptoms.length === 0}
            >
              Find Suitable Doctors ({symptoms.length})
            </Button>
          </div>
        </Card>
      )}

      {/* Common Symptoms */}
      {showSuggestions && (
        <Card>
          <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Quick Select Common Symptoms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonSymptoms.map((symptom, index) => (
              <button
                key={index}
                onClick={() => handleAddSymptom(symptom.name)}
                disabled={symptoms.length >= maxSymptoms}
                className="group flex flex-col items-center p-4 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {symptom.icon}
                </div>
                <span className="font-medium text-sm text-center text-gray-900 dark:text-white">{symptom.name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            {symptoms.length >= maxSymptoms 
              ? `Maximum ${maxSymptoms} symptoms reached`
              : `${maxSymptoms - symptoms.length} more symptoms can be added`}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SymptomInput;