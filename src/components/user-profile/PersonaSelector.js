import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Type, 
  Eye, 
  Brain,
  Heart,
  Baby,
  GraduationCap,
  Smartphone,
  Globe,
  Check,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import Button from '../common/Button';

const PersonaSelector = ({ 
  onPersonaSelect,
  initialPersona = null,
  showDetails = true,
  multiSelect = false
}) => {
  const { settings } = useAccessibility();
  const [selectedPersonas, setSelectedPersonas] = useState(initialPersona ? [initialPersona] : []);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const personas = [
    {
      id: 'elderly',
      title: 'Elderly Patient',
      icon: <Shield size={24} />,
      color: 'bg-blue-100 text-blue-800',
      description: 'Age 60+ with accessibility needs',
      features: [
        'Large text & buttons',
        'High contrast mode',
        'Voice guidance',
        'Simplified navigation',
        'Emergency SOS button'
      ],
      demographics: 'Age: 60-80+',
      commonNeeds: ['Chronic conditions', 'Multiple medications', 'Mobility assistance'],
      digitalLiteracy: 'Low to Medium',
      preferredCommunication: 'Voice, Simple text, Family assistance'
    },
    {
      id: 'low-literacy',
      title: 'Low Literacy User',
      icon: <Type size={24} />,
      color: 'bg-green-100 text-green-800',
      description: 'Basic reading skills, visual learner',
      features: [
        'Visual icons & symbols',
        'Audio explanations',
        'Step-by-step guidance',
        'Video tutorials',
        'Minimal text'
      ],
      demographics: 'All ages, education: primary level',
      commonNeeds: ['Simple instructions', 'Visual aids', 'Reassurance'],
      digitalLiteracy: 'Very Low',
      preferredCommunication: 'Pictures, Videos, Spoken instructions'
    },
    {
      id: 'visual-impairment',
      title: 'Visually Impaired',
      icon: <Eye size={24} />,
      color: 'bg-purple-100 text-purple-800',
      description: 'Partial or complete vision loss',
      features: [
        'Screen reader optimized',
        'High contrast themes',
        'Keyboard navigation',
        'Audio descriptions',
        'Voice commands'
      ],
      demographics: 'All ages, varying vision levels',
      commonNeeds: ['Audio feedback', 'Braille options', 'Magnification'],
      digitalLiteracy: 'Medium to High',
      preferredCommunication: 'Audio, Braille, High contrast'
    },
    {
      id: 'young-adult',
      title: 'Young Adult',
      icon: <Zap size={24} />,
      color: 'bg-amber-100 text-amber-800',
      description: 'Tech-savvy, quick decisions',
      features: [
        'Fast interface',
        'Modern design',
        'Quick booking',
        'Digital payments',
        'App integration'
      ],
      demographics: 'Age: 18-30',
      commonNeeds: ['Quick access', 'Digital records', 'Telemedicine'],
      digitalLiteracy: 'High',
      preferredCommunication: 'App, Chat, Email'
    },
    {
      id: 'parent',
      title: 'Parent/Caregiver',
      icon: <Baby size={24} />,
      color: 'bg-pink-100 text-pink-800',
      description: 'Managing family health',
      features: [
        'Multiple profiles',
        'Family scheduling',
        'Child-friendly content',
        'Vaccination tracker',
        'Growth charts'
      ],
      demographics: 'Age: 25-45, managing 1-3 dependents',
      commonNeeds: ['Child health', 'Family scheduling', 'Pediatric care'],
      digitalLiteracy: 'Medium to High',
      preferredCommunication: 'App notifications, Email, SMS'
    },
    {
      id: 'chronic-condition',
      title: 'Chronic Condition',
      icon: <Heart size={24} />,
      color: 'bg-red-100 text-red-800',
      description: 'Long-term health management',
      features: [
        'Medication tracker',
        'Symptom diary',
        'Appointment reminders',
        'Emergency contacts',
        'Progress charts'
      ],
      demographics: 'All ages with chronic illnesses',
      commonNeeds: ['Regular monitoring', 'Specialist care', 'Medication management'],
      digitalLiteracy: 'Varies',
      preferredCommunication: 'Regular reminders, Detailed reports'
    },
    {
      id: 'tech-savvy-senior',
      title: 'Tech-Savvy Senior',
      icon: <Smartphone size={24} />,
      color: 'bg-indigo-100 text-indigo-800',
      description: 'Comfortable with technology',
      features: [
        'Advanced features',
        'Data export',
        'Health analytics',
        'Device integration',
        'Customization'
      ],
      demographics: 'Age: 60+ with tech experience',
      commonNeeds: ['Detailed data', 'Health trends', 'Preventive care'],
      digitalLiteracy: 'High',
      preferredCommunication: 'App, Email, Video calls'
    },
    {
      id: 'rural-remote',
      title: 'Rural/Remote User',
      icon: <Globe size={24} />,
      color: 'bg-teal-100 text-teal-800',
      description: 'Limited connectivity access',
      features: [
        'Offline mode',
        'Low bandwidth',
        'SMS/Text support',
        'Local language',
        'Basic phone support'
      ],
      demographics: 'Remote areas, limited internet',
      commonNeeds: ['Telemedicine', 'Medicine delivery', 'Local doctor finder'],
      digitalLiteracy: 'Low to Medium',
      preferredCommunication: 'SMS, Phone calls, Basic app'
    }
  ];

  const handlePersonaSelect = (persona) => {
    if (multiSelect) {
      if (selectedPersonas.find(p => p.id === persona.id)) {
        setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id));
      } else {
        setSelectedPersonas([...selectedPersonas, persona]);
      }
    } else {
      setSelectedPersonas([persona]);
      if (onPersonaSelect) {
        onPersonaSelect(persona);
      }
    }
  };

  const isPersonaSelected = (personaId) => {
    return selectedPersonas.some(p => p.id === personaId);
  };

  const handleContinue = () => {
    if (onPersonaSelect && selectedPersonas.length > 0) {
      if (multiSelect) {
        onPersonaSelect(selectedPersonas);
      } else {
        onPersonaSelect(selectedPersonas[0]);
      }
    }
  };

  const renderPersonaCard = (persona) => {
    const isSelected = isPersonaSelected(persona.id);
    
    return (
      <Card
        key={persona.id}
        interactive
        selected={isSelected}
        onClick={() => handlePersonaSelect(persona)}
        className={`transition-all hover:scale-[1.02] ${
          isSelected ? 'ring-2 ring-primary-500' : ''
        }`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${persona.color}`}>
                {persona.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{persona.title}</h3>
                <p className="text-gray-600 text-sm">{persona.description}</p>
              </div>
            </div>
            
            {isSelected && (
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium mb-2 text-sm text-gray-700">Key Features:</h4>
            <ul className="space-y-1">
              {persona.features.slice(0, showAllDetails ? undefined : 3).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Sparkles size={12} className="text-primary-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {!showAllDetails && persona.features.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllDetails(true);
                }}
                className="text-primary-600 text-sm hover:text-primary-800 mt-2"
              >
                +{persona.features.length - 3} more features
              </button>
            )}
          </div>

          {/* Detailed Info (only when selected and showDetails is true) */}
          {isSelected && showDetails && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Demographics</p>
                  <p className="text-sm font-medium">{persona.demographics}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Digital Literacy</p>
                  <p className="text-sm font-medium">{persona.digitalLiteracy}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Common Needs</p>
                <div className="flex flex-wrap gap-1">
                  {persona.commonNeeds.map((need, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {need}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Preferred Communication</p>
                <p className="text-sm font-medium">{persona.preferredCommunication}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const getRecommendation = () => {
    if (selectedPersonas.length === 0) return null;
    
    if (multiSelect) {
      return `Selected ${selectedPersonas.length} personas for customized experience`;
    }
    
    const persona = selectedPersonas[0];
    return `Best for: ${persona.demographics}. Features include ${persona.features.slice(0, 2).join(', ')}`;
  };

  return (
    <div className={`space-y-6 ${settings.mode === 'elderly' ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className={`font-bold mb-4 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
          <Target className="inline mr-2 text-primary-600" />
          Select Your Profile Type
        </h1>
        <p className="text-gray-600">
          Choose the profile that best describes you for a personalized healthcare experience.
          {multiSelect && ' You can select multiple if they apply.'}
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map(renderPersonaCard)}
      </div>

      {/* Recommendation & Actions */}
      {selectedPersonas.length > 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-primary-800 mb-2 flex items-center gap-2">
                <Sparkles size={20} />
                Personalized Experience Ready
              </h3>
              <p className="text-primary-700">
                {getRecommendation()}
              </p>
              
              {/* Selected Personas Tags */}
              {multiSelect && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedPersonas.map(persona => (
                    <span key={persona.id} className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm">
                      {persona.title}
                      <button
                        onClick={() => handlePersonaSelect(persona)}
                        className="ml-2 hover:opacity-80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedPersonas([])}
              >
                Clear Selection
              </Button>
              <Button
                variant="primary"
                onClick={handleContinue}
                icon={<ChevronRight size={18} />}
                iconPosition="right"
              >
                Continue with Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex items-start gap-3">
            <HelpCircle size={24} className="text-primary-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Need Help Choosing?</h3>
              <p className="text-gray-600 mb-4">
                Select the profile that most closely matches your situation. 
                The system will adapt to provide the best experience for you.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-1">👵 For Elderly Users</h4>
              <p className="text-sm text-gray-600">
                Choose "Elderly Patient" for larger text, voice guidance, and simplified navigation.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-1">📱 For Tech Users</h4>
              <p className="text-sm text-gray-600">
                Choose "Young Adult" or "Tech-Savvy Senior" for advanced features and digital tools.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      {settings.mode === 'elderly' && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-bold mb-3 text-blue-800 flex items-center gap-2">
            <Shield size={20} />
            Tips for Elderly Users
          </h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Select "Elderly Patient" for the most suitable interface</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Consider "Chronic Condition" if you have long-term health issues</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Ask family members for help if you're unsure</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;