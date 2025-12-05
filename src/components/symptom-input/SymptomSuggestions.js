import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Check,
  X,
  Sparkles,
  Filter,
  Star
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';

const SymptomSuggestions = ({ 
  symptoms = [],
  onSymptomSelect,
  userAge = 30,
  userConditions = []
}) => {
  const { settings } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const symptomCategories = {
    general: {
      name: 'General',
      color: 'bg-blue-100 text-blue-800',
      symptoms: ['Fever', 'Fatigue', 'Weakness', 'Weight Loss', 'Weight Gain']
    },
    respiratory: {
      name: 'Respiratory',
      color: 'bg-green-100 text-green-800',
      symptoms: ['Cough', 'Shortness of Breath', 'Chest Pain', 'Sore Throat', 'Runny Nose']
    },
    digestive: {
      name: 'Digestive',
      color: 'bg-amber-100 text-amber-800',
      symptoms: ['Stomach Pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating']
    },
    neurological: {
      name: 'Neurological',
      color: 'bg-purple-100 text-purple-800',
      symptoms: ['Headache', 'Dizziness', 'Memory Loss', 'Tremors', 'Numbness', 'Seizures']
    },
    musculoskeletal: {
      name: 'Musculoskeletal',
      color: 'bg-red-100 text-red-800',
      symptoms: ['Back Pain', 'Joint Pain', 'Muscle Pain', 'Swelling', 'Stiffness']
    },
    dermatological: {
      name: 'Skin',
      color: 'bg-pink-100 text-pink-800',
      symptoms: ['Skin Rash', 'Itching', 'Dry Skin', 'Discoloration', 'Blisters']
    }
  };

  const emergencySymptoms = [
    'Chest Pain',
    'Difficulty Breathing',
    'Severe Bleeding',
    'Sudden Paralysis',
    'Loss of Consciousness',
    'Severe Head Injury'
  ];

  const ageBasedSuggestions = {
    child: ['Fever', 'Cough', 'Ear Pain', 'Rash', 'Vomiting'],
    adult: ['Headache', 'Back Pain', 'Stress', 'Anxiety', 'Insomnia'],
    elderly: ['Joint Pain', 'Memory Issues', 'Balance Problems', 'Vision Changes', 'Urinary Issues']
  };

  const getAgeGroup = () => {
    if (userAge < 18) return 'child';
    if (userAge > 60) return 'elderly';
    return 'adult';
  };

  const getPrioritySymptoms = () => {
    const ageGroup = getAgeGroup();
    return ageBasedSuggestions[ageGroup] || [];
  };

  const handleSymptomClick = (symptom) => {
    if (onSymptomSelect) {
      onSymptomSelect(symptom);
    }
  };

  const isEmergency = (symptom) => {
    return emergencySymptoms.includes(symptom);
  };

  const isAlreadySelected = (symptom) => {
    return symptoms.includes(symptom);
  };

  const isPriorityForAge = (symptom) => {
    return getPrioritySymptoms().includes(symptom);
  };

  const getFilteredSymptoms = () => {
    if (selectedCategory === 'all') {
      return Object.values(symptomCategories).flatMap(cat => cat.symptoms);
    }
    
    const uniqueSymptoms = new Set();
    Object.entries(symptomCategories).forEach(([key, category]) => {
      if (selectedCategory === 'all' || selectedCategory === key) {
        category.symptoms.forEach(symptom => uniqueSymptoms.add(symptom));
      }
    });
    
    return Array.from(uniqueSymptoms);
  };

  const renderSymptomButton = (symptom) => {
    const emergency = isEmergency(symptom);
    const selected = isAlreadySelected(symptom);
    const priority = isPriorityForAge(symptom);
    
    let buttonClass = 'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ';
    
    if (emergency) {
      buttonClass += selected 
        ? 'bg-red-600 text-white border-red-700' 
        : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200';
    } else if (selected) {
      buttonClass += 'bg-primary-600 text-white border-primary-700';
    } else if (priority) {
      buttonClass += 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
    } else {
      buttonClass += 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
    }

    return (
      <button
        key={symptom}
        onClick={() => handleSymptomClick(symptom)}
        className={buttonClass}
        disabled={selected}
      >
        {emergency && <AlertTriangle size={14} />}
        {priority && <Sparkles size={14} />}
        {!emergency && !priority && <Star size={14} />}
        
        <span>{symptom}</span>
        
        {selected && <Check size={14} className="ml-auto" />}
      </button>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`font-bold mb-2 ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
              <TrendingUp className="inline mr-2 text-primary-600" />
              Symptom Suggestions
            </h3>
            <p className="text-gray-600 text-sm">
              Click to add symptoms. Based on your age: {getAgeGroup()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(symptomCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Emergency Warning */}
        {emergencySymptoms.some(symptom => symptoms.includes(symptom)) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-800 mb-1">⚠️ Emergency Symptoms Detected</h4>
                <p className="text-red-700 text-sm">
                  You have selected emergency symptoms. Please seek immediate medical attention or call emergency services.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(symptomCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === key
                  ? `${category.color} border-2 border-current`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {getFilteredSymptoms().map(symptom => renderSymptomButton(symptom))}
        </div>

        {/* Age-Based Recommendations */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h4 className="font-bold mb-3 text-blue-800 flex items-center gap-2">
            <Clock size={18} />
            Common for {getAgeGroup()} patients
          </h4>
          <div className="flex flex-wrap gap-2">
            {getPrioritySymptoms().map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomClick(symptom)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  isAlreadySelected(symptom)
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Conditions Suggestions */}
        {userConditions.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <h4 className="font-bold mb-3 text-green-800">Based on Your Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {userConditions.map(condition => {
                let relatedSymptoms = [];
                
                if (condition.toLowerCase().includes('diabetes')) {
                  relatedSymptoms = ['Increased Thirst', 'Frequent Urination', 'Blurred Vision'];
                } else if (condition.toLowerCase().includes('hypertension')) {
                  relatedSymptoms = ['Headache', 'Dizziness', 'Chest Pain'];
                } else if (condition.toLowerCase().includes('arthritis')) {
                  relatedSymptoms = ['Joint Pain', 'Swelling', 'Stiffness'];
                }
                
                return relatedSymptoms.map(symptom => (
                  <button
                    key={`${condition}-${symptom}`}
                    onClick={() => handleSymptomClick(symptom)}
                    className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
                  >
                    {symptom}
                  </button>
                ));
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">{symptoms.length}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {symptoms.filter(s => isPriorityForAge(s)).length}
              </div>
              <div className="text-sm text-gray-600">Age Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {symptoms.filter(s => isEmergency(s)).length}
              </div>
              <div className="text-sm text-gray-600">Emergency</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SymptomSuggestions;