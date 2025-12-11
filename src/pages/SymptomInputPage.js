import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAppointment } from '../context/AppointmentContext';
import { useUI } from '../context/UIContext';
import useAIGuidePage from '../hooks/useAIGuidePage';

import SymptomInput from '../components/symptom-input/SymptomInput';
import BodyMap from '../components/symptom-input/BodyMap';
import VoiceInput from '../components/symptom-input/VoiceInput';
import SignLanguageInput from '../components/symptom-input/SignLanguageInput';
import { Mic, Keyboard, Map, ArrowRight, Hand } from 'lucide-react';

const SymptomInputPage = () => {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const { addSymptoms, updateAppointment } = useAppointment();
  const { startLoading, stopLoading, addNotification } = useUI();
  
  // Notify AI Guide that user is on symptom input page
  useAIGuidePage('symptomInput');
  
  // Set initial tab based on accessibility mode
  const getInitialTab = () => {
    if (settings.mode === 'voice' || settings.voiceGuidance) {
      return 'voice';
    }
    if (settings.mode === 'standard') {
      return 'text';
    }
    if (settings.mode === 'sign-language') {
      return 'sign';
    }
    return 'body';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleSymptomsSubmit = (symptoms, bodyLocations) => {
    startLoading('Processing your symptoms...');
    
    // Update appointment context
    addSymptoms(symptoms, bodyLocations);
    updateAppointment({ bodyLocations });

    addNotification({
      type: 'success',
      message: `Added ${symptoms.length} symptom(s)`,
      important: false
    });

    setTimeout(() => {
      stopLoading();
      navigate('/doctors');
    }, 1000);
  };

  const tabs = [
    { id: 'body', label: 'Body Map', icon: <Map size={20} /> },
    { id: 'voice', label: 'Voice Input', icon: <Mic size={20} /> },
    { id: 'sign', label: 'Sign Language', icon: <Hand size={20} /> },
    { id: 'text', label: 'Type Symptoms', icon: <Keyboard size={20} /> },
  ];

  return (
   
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <div className="mb-8">
          <h1 className={`font-bold mb-4 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
            How are you feeling today?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Describe your symptoms using any method below. The system will recommend the right doctor.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {activeTab === 'body' && (
              <BodyMap
                onSelectLocation={(locations) => {
                  handleSymptomsSubmit(selectedSymptoms, locations);
                }}
              />
            )}
            {activeTab === 'voice' && (
              <VoiceInput
                onTranscript={(text) => handleSymptomsSubmit([text], [])}
              />
            )}
            {activeTab === 'sign' && (
              <SignLanguageInput
                onSubmit={(symptoms) => handleSymptomsSubmit(symptoms, [])}
              />
            )}
            {activeTab === 'text' && (
              <SymptomInput onSubmit={(symptoms) => handleSymptomsSubmit(symptoms, [])} />
            )}
          </div>
        </div>

        {/* Symptom Suggestions */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Common Symptoms</h3>
          <div className="flex flex-wrap gap-3">
            {['Headache', 'Fever', 'Cough', 'Stomach Pain', 'Skin Rash', 'Back Pain', 'Fatigue', 'Dizziness'].map(
              (symptom) => (
                <button
                  key={symptom}
                  onClick={() => setSelectedSymptoms([...selectedSymptoms, symptom])}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                >
                  {symptom}
                </button>
              )
            )}
          </div>
        </div>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Selected Symptoms</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {selectedSymptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-full flex items-center gap-2 text-gray-900 dark:text-white"
                >
                  {symptom}
                  <button
                    onClick={() =>
                      setSelectedSymptoms(selectedSymptoms.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSymptomsSubmit(selectedSymptoms, [])}
              className="btn-primary flex items-center gap-2"
            >
              Find Suitable Doctors
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
  
  );
};

export default SymptomInputPage;
