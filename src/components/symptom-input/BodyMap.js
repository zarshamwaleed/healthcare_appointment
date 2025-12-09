import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAppointment } from '../../context/AppointmentContext';
import { Mic, Plus, X } from 'lucide-react';

const BodyMap = ({ onPartSelect }) => {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const { addSymptoms, updateAppointment } = useAppointment();
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const bodyParts = [
    { id: 'head', label: 'Head/Headache', top: '8%', left: '50%', dept: 'Neurology' },
    { id: 'eyes', label: 'Eyes/Vision', top: '12%', left: '50%', dept: 'Ophthalmology' },
    { id: 'neck', label: 'Neck/Throat', top: '18%', left: '50%', dept: 'ENT' },
    { id: 'left-shoulder', label: 'Left Shoulder', top: '24%', left: '35%', dept: 'Orthopedics' },
    { id: 'right-shoulder', label: 'Right Shoulder', top: '24%', left: '65%', dept: 'Orthopedics' },
    { id: 'chest', label: 'Chest/Heart', top: '32%', left: '50%', dept: 'Cardiology' },
    { id: 'left-arm', label: 'Left Arm', top: '38%', left: '28%', dept: 'Orthopedics' },
    { id: 'right-arm', label: 'Right Arm', top: '38%', left: '72%', dept: 'Orthopedics' },
    { id: 'stomach', label: 'Abdomen/Stomach', top: '48%', left: '50%', dept: 'Gastroenterology' },
    { id: 'left-hand', label: 'Left Hand', top: '52%', left: '22%', dept: 'Orthopedics' },
    { id: 'right-hand', label: 'Right Hand', top: '52%', left: '78%', dept: 'Orthopedics' },
    { id: 'pelvis', label: 'Lower Abdomen', top: '58%', left: '50%', dept: 'General Medicine' },
    { id: 'left-thigh', label: 'Left Thigh', top: '68%', left: '42%', dept: 'Orthopedics' },
    { id: 'right-thigh', label: 'Right Thigh', top: '68%', left: '58%', dept: 'Orthopedics' },
    { id: 'left-knee', label: 'Left Knee', top: '78%', left: '42%', dept: 'Orthopedics' },
    { id: 'right-knee', label: 'Right Knee', top: '78%', left: '58%', dept: 'Orthopedics' },
    { id: 'left-leg', label: 'Left Leg', top: '88%', left: '42%', dept: 'Orthopedics' },
    { id: 'right-leg', label: 'Right Leg', top: '88%', left: '58%', dept: 'Orthopedics' },
  ];

  const handlePartClick = (part) => {
    setSelectedPart(part);
    setSelectedSymptoms([]); // Reset selected symptoms when changing body part
    // FIX: Check if onPartSelect exists before calling it
    if (onPartSelect && typeof onPartSelect === 'function') {
      onPartSelect(part);
    }
  };

  const getSymptomsList = (partId) => {
    const symptomsMap = {
      'head': ['Headache', 'Migraine', 'Dizziness'],
      'eyes': ['Vision Problems', 'Eye Pain', 'Redness'],
      'neck': ['Neck Pain', 'Sore Throat', 'Stiffness'],
      'chest': ['Chest Pain', 'Breathing Issues', 'Palpitations'],
      'stomach': ['Stomach Pain', 'Nausea', 'Bloating'],
      'left-shoulder': ['Shoulder Pain', 'Stiffness', 'Limited Movement'],
      'right-shoulder': ['Shoulder Pain', 'Stiffness', 'Limited Movement'],
      'left-arm': ['Arm Pain', 'Numbness', 'Weakness'],
      'right-arm': ['Arm Pain', 'Numbness', 'Weakness'],
      'left-hand': ['Hand Pain', 'Swelling', 'Tingling'],
      'right-hand': ['Hand Pain', 'Swelling', 'Tingling'],
      'left-knee': ['Knee Pain', 'Swelling', 'Difficulty Walking'],
      'right-knee': ['Knee Pain', 'Swelling', 'Difficulty Walking'],
      'left-leg': ['Leg Pain', 'Cramps', 'Swelling'],
      'right-leg': ['Leg Pain', 'Cramps', 'Swelling'],
    };
    return symptomsMap[partId] || ['Pain', 'Swelling', 'Discomfort'];
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim() && !selectedSymptoms.includes(transcript.trim())) {
        setSelectedSymptoms(prev => [...prev, transcript.trim()]);
      }
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const handleFindDoctors = () => {
    // Add symptoms and body part to appointment context
    addSymptoms(selectedSymptoms, [selectedPart.label]);
    updateAppointment({ 
      bodyLocations: [selectedPart.label],
      department: selectedPart.dept 
    });
    
    // Navigate to doctors page with department filter
    navigate('/doctors', { 
      state: { 
        department: selectedPart.dept,
        symptoms: selectedSymptoms,
        bodyPart: selectedPart.label
      } 
    });
  };

  const getButtonSize = () => {
    return settings.mode === 'elderly' ? 'w-14 h-14' : 'w-10 h-10';
  };

  return (
    <div className="relative">
      {/* Body Outline */}
      <div className="relative w-full max-w-md mx-auto h-[600px] bg-gradient-to-b from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8 shadow-lg">
        {/* Interactive SVG Body with Clickable Parts */}
        <svg viewBox="0 0 200 500" className="w-full h-full">
          {/* Head */}
          <ellipse 
            cx="100" cy="40" rx="25" ry="30" 
            fill={selectedPart?.id === 'head' ? '#3b82f6' : '#e0e7ff'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'head'))}
          />
          
          {/* Eyes */}
          <ellipse 
            cx="100" cy="35" rx="18" ry="8" 
            fill={selectedPart?.id === 'eyes' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'eyes'))}
          />
          
          {/* Neck */}
          <rect 
            x="90" y="65" width="20" height="15" rx="5" 
            fill={selectedPart?.id === 'neck' ? '#3b82f6' : '#e0e7ff'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'neck'))}
          />
          
          {/* Left Shoulder */}
          <ellipse 
            cx="70" cy="90" rx="20" ry="12" 
            fill={selectedPart?.id === 'left-shoulder' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-shoulder'))}
          />
          
          {/* Right Shoulder */}
          <ellipse 
            cx="130" cy="90" rx="20" ry="12" 
            fill={selectedPart?.id === 'right-shoulder' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-shoulder'))}
          />
          
          {/* Chest/Heart area */}
          <ellipse 
            cx="100" cy="115" rx="28" ry="20" 
            fill={selectedPart?.id === 'chest' ? '#3b82f6' : '#c7d2fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'chest'))}
          />
          
          {/* Torso Background */}
          <path 
            d="M 75 95 Q 100 100 125 95 L 120 180 Q 100 185 80 180 Z" 
            fill="#e0e7ff" 
            stroke="#6366f1" 
            strokeWidth="2"
            className="pointer-events-none"
          />
          
          {/* Abdomen/Stomach */}
          <ellipse 
            cx="100" cy="152" rx="25" ry="22" 
            fill={selectedPart?.id === 'stomach' ? '#3b82f6' : '#c7d2fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'stomach'))}
          />
          
          {/* Left Arm */}
          <path 
            d="M 55 95 L 35 140" 
            fill="none" 
            stroke={selectedPart?.id === 'left-arm' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-arm'))}
          />
          
          {/* Right Arm */}
          <path 
            d="M 145 95 L 165 140" 
            fill="none" 
            stroke={selectedPart?.id === 'right-arm' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-arm'))}
          />
          
          {/* Left Hand */}
          <circle 
            cx="30" cy="150" r="10" 
            fill={selectedPart?.id === 'left-hand' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-hand'))}
          />
          
          {/* Right Hand */}
          <circle 
            cx="170" cy="150" r="10" 
            fill={selectedPart?.id === 'right-hand' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-hand'))}
          />
          
          {/* Pelvis/Lower Abdomen */}
          <ellipse 
            cx="100" cy="190" rx="28" ry="16" 
            fill={selectedPart?.id === 'pelvis' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'pelvis'))}
          />
          
          {/* Left Thigh */}
          <path 
            d="M 85 200 L 80 270" 
            fill="none" 
            stroke={selectedPart?.id === 'left-thigh' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="14" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-thigh'))}
          />
          
          {/* Right Thigh */}
          <path 
            d="M 115 200 L 120 270" 
            fill="none" 
            stroke={selectedPart?.id === 'right-thigh' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="14" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-thigh'))}
          />
          
          {/* Left Knee */}
          <circle 
            cx="80" cy="285" r="12" 
            fill={selectedPart?.id === 'left-knee' ? '#3b82f6' : '#c7d2fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-knee'))}
          />
          
          {/* Right Knee */}
          <circle 
            cx="120" cy="285" r="12" 
            fill={selectedPart?.id === 'right-knee' ? '#3b82f6' : '#c7d2fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="cursor-pointer hover:fill-blue-300 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-knee'))}
          />
          
          {/* Left Lower Leg */}
          <path 
            d="M 80 295 L 78 360" 
            fill="none" 
            stroke={selectedPart?.id === 'left-leg' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'left-leg'))}
          />
          
          {/* Right Lower Leg */}
          <path 
            d="M 120 295 L 122 360" 
            fill="none" 
            stroke={selectedPart?.id === 'right-leg' ? '#3b82f6' : '#6366f1'} 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-blue-400 transition-all duration-200"
            onClick={() => handlePartClick(bodyParts.find(p => p.id === 'right-leg'))}
          />
          
          {/* Left Foot */}
          <ellipse 
            cx="75" cy="380" rx="14" ry="10" 
            fill={selectedPart?.id === 'left-leg' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="pointer-events-none"
          />
          
          {/* Right Foot */}
          <ellipse 
            cx="125" cy="380" rx="14" ry="10" 
            fill={selectedPart?.id === 'right-leg' ? '#3b82f6' : '#ddd6fe'} 
            stroke="#6366f1" 
            strokeWidth="2"
            className="pointer-events-none"
          />
        </svg>
      </div>

      {/* Selected Part Details */}
      {selectedPart && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl animate-fade-in border border-blue-200 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ✓
            </div>
            <div>
              <h3 className={`font-bold text-blue-900 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
                {selectedPart.label}
              </h3>
              <p className="text-blue-700 font-medium">Recommended: {selectedPart.dept}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-semibold mb-3 text-gray-800">Common Symptoms (Select All That Apply)</h4>
              <div className="space-y-2 mb-4">
                {getSymptomsList(selectedPart.id).map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-blue-500 text-white font-medium shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-white border-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedSymptoms.includes(symptom) && (
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {symptom}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add More Symptoms */}
              <div className="border-t pt-4 mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Add More Symptoms</h5>
                
                {/* Text Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                    placeholder="Type additional symptom..."
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      settings.mode === 'elderly' ? 'text-lg' : 'text-sm'
                    }`}
                  />
                  <button
                    onClick={addCustomSymptom}
                    disabled={!customSymptom.trim()}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-all"
                    title="Add symptom"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Voice Input Button */}
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  <Mic size={18} />
                  {isListening ? 'Listening...' : 'Add by Voice'}
                </button>
              </div>

              {/* Display Additional Custom Symptoms */}
              {selectedSymptoms.filter(s => !getSymptomsList(selectedPart.id).includes(s)).length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <h5 className="text-xs font-semibold text-gray-600 mb-2">Additional Symptoms:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.filter(s => !getSymptomsList(selectedPart.id).includes(s)).map((symptom) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="hover:bg-green-200 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <h4 className="font-semibold mb-2 text-gray-800">What to Do Next</h4>
              <p className="text-sm text-gray-600 mb-4">
                Find specialists in {selectedPart.dept} who can help diagnose and treat your symptoms.
              </p>
              
              {selectedSymptoms.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected: {selectedSymptoms.length} symptom{selectedSymptoms.length > 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={handleFindDoctors}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg ${
                      settings.mode === 'elderly' ? 'py-4 text-lg' : 'py-3'
                    }`}
                  >
                    Find Doctors for {selectedPart.dept} →
                  </button>
                </div>
              )}
              
              {selectedSymptoms.length === 0 && (
                <p className="text-sm text-gray-500 italic mt-4">
                  Select at least one symptom to continue
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-gray-500">
          {settings.mode === 'icon' ? 'Tap on any body part that hurts' : 'Click on any body part where you feel discomfort'}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          The system will suggest the appropriate medical department
        </p>
      </div>
    </div>
  );
};

// Add default props to prevent errors when onPartSelect is not provided
BodyMap.defaultProps = {
  onPartSelect: () => console.log('Body part selected') // Optional: provide a default function
};

export default BodyMap;