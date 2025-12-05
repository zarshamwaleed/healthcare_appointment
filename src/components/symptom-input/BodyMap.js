import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

const BodyMap = ({ onPartSelect }) => {
  const { settings } = useAccessibility();
  const [selectedPart, setSelectedPart] = useState(null);

  const bodyParts = [
    { id: 'head', label: 'Head/Headache', icon: '🧠', top: '15%', left: '50%', dept: 'Neurology' },
    { id: 'eyes', label: 'Eyes/Vision', icon: '👁️', top: '20%', left: '40%', dept: 'Ophthalmology' },
    { id: 'ears', label: 'Ears/Hearing', icon: '👂', top: '20%', left: '60%', dept: 'ENT' },
    { id: 'throat', label: 'Throat/Cough', icon: '👄', top: '30%', left: '50%', dept: 'ENT' },
    { id: 'chest', label: 'Chest/Heart', icon: '❤️', top: '40%', left: '50%', dept: 'Cardiology' },
    { id: 'stomach', label: 'Stomach/Pain', icon: '🤢', top: '55%', left: '50%', dept: 'Gastroenterology' },
    { id: 'arms', label: 'Arms/Joints', icon: '💪', top: '45%', left: '30%', dept: 'Orthopedics' },
    { id: 'legs', label: 'Legs/Pain', icon: '🦵', top: '70%', left: '50%', dept: 'Orthopedics' },
    { id: 'skin', label: 'Skin/Rash', icon: '🦠', top: '50%', left: '70%', dept: 'Dermatology' },
    { id: 'back', label: 'Back/Pain', icon: '🦴', top: '50%', left: '50%', dept: 'Orthopedics' },
  ];

  const handlePartClick = (part) => {
    setSelectedPart(part);
    // FIX: Check if onPartSelect exists before calling it
    if (onPartSelect && typeof onPartSelect === 'function') {
      onPartSelect(part);
    }
  };

  const getButtonSize = () => {
    return settings.mode === 'elderly' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-xl';
  };

  return (
    <div className="relative">
      {/* Body Outline */}
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-white rounded-2xl border-2 border-gray-200">
        {/* Simple Body Shape */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Head */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-100 rounded-full border-2 border-gray-300"></div>
            
            {/* Body */}
            <div className="w-32 h-48 bg-gray-100 rounded-3xl border-2 border-gray-300"></div>
            
            {/* Arms */}
            <div className="absolute top-8 -left-20 w-20 h-4 bg-gray-100 rounded-full border-2 border-gray-300"></div>
            <div className="absolute top-8 -right-20 w-20 h-4 bg-gray-100 rounded-full border-2 border-gray-300"></div>
            
            {/* Legs */}
            <div className="absolute bottom-0 left-4 w-8 h-24 bg-gray-100 rounded-b-full border-2 border-gray-300"></div>
            <div className="absolute bottom-0 right-4 w-8 h-24 bg-gray-100 rounded-b-full border-2 border-gray-300"></div>
          </div>
        </div>

        {/* Body Part Buttons */}
        {bodyParts.map((part) => (
          <button
            key={part.id}
            onClick={() => handlePartClick(part)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 
              ${getButtonSize()} rounded-full flex items-center justify-center
              ${selectedPart?.id === part.id 
                ? 'bg-primary-600 text-white shadow-lg scale-110' 
                : 'bg-white text-gray-700 hover:bg-primary-100 hover:shadow-md'
              } 
              border-2 ${selectedPart?.id === part.id ? 'border-primary-700' : 'border-gray-300'}
              transition-all duration-200 cursor-pointer`}
            style={{ top: part.top, left: part.left }}
            aria-label={`Select ${part.label}`}
          >
            <span className="text-xl">{part.icon}</span>
          </button>
        ))}
      </div>

      {/* Selected Part Details */}
      {selectedPart && (
        <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">{selectedPart.icon}</div>
            <div>
              <h3 className="text-xl font-bold">{selectedPart.label}</h3>
              <p className="text-gray-600">Recommended department: {selectedPart.dept}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">Common Symptoms</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedPart.id === 'head' && ['Headache', 'Migraine', 'Dizziness', 'Memory Issues']}
                {selectedPart.id === 'stomach' && ['Stomach Pain', 'Nausea', 'Diarrhea', 'Bloating']}
                {selectedPart.id === 'skin' && ['Rash', 'Itching', 'Redness', 'Dryness']}
                {selectedPart.id === 'chest' && ['Chest Pain', 'Shortness of Breath', 'Palpitations']}
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">What to Do Next</h4>
              <p className="text-sm text-gray-600">
                Click "Find Doctors" to see {selectedPart.dept} specialists available for appointment.
              </p>
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