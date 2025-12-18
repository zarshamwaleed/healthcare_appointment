import React, { useState } from 'react';
import { 
  Shield, 
  Type, 
  Eye, 
  Heart,
  Baby,
  Smartphone,
  Globe,
  Check,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Target,
  Zap,
  Users,
  Accessibility,
  Award,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const PersonaSelector = ({ 
  onPersonaSelect,
  initialPersona = null,
  showDetails = true,
  multiSelect = false
}) => {
  const { settings, setUserMode } = useAccessibility();
  const [selectedPersonas, setSelectedPersonas] = useState(initialPersona ? [initialPersona] : []);
  const [expandedPersona, setExpandedPersona] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const personas = [
    {
      id: 'elderly',
      title: 'Elderly Patient',
      icon: <Shield size={20} />,
      color: 'from-blue-500 to-blue-600',
      darkColor: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Age 60+ with accessibility needs',
      features: ['Large text & buttons', 'High contrast mode', 'Voice guidance', 'Simplified navigation', 'Emergency SOS'],
      demographics: 'Age: 60-80+',
      commonNeeds: ['Chronic conditions', 'Multiple medications', 'Mobility assistance'],
      digitalLiteracy: 'Medium',
      preferredCommunication: 'Voice, Simple text',
      recommendedFor: 'Seniors needing accessibility'
    },
    {
      id: 'low-literacy',
      title: 'Low Literacy',
      icon: <Type size={20} />,
      color: 'from-emerald-500 to-emerald-600',
      darkColor: 'from-emerald-600 to-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      description: 'Basic reading skills',
      features: ['Visual icons', 'Audio explanations', 'Step-by-step guidance', 'Video tutorials'],
      demographics: 'Education: primary level',
      commonNeeds: ['Simple instructions', 'Visual aids', 'Reassurance'],
      digitalLiteracy: 'Low',
      preferredCommunication: 'Pictures, Videos',
      recommendedFor: 'Visual learners'
    },
    {
      id: 'visual-impairment',
      title: 'Visually Impaired',
      icon: <Eye size={20} />,
      color: 'from-violet-500 to-purple-600',
      darkColor: 'from-violet-600 to-purple-700',
      iconColor: 'text-violet-600 dark:text-violet-400',
      textColor: 'text-violet-700 dark:text-violet-300',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800',
      description: 'Vision challenges',
      features: ['Screen reader', 'High contrast', 'Keyboard nav', 'Audio descriptions'],
      demographics: 'All ages',
      commonNeeds: ['Audio feedback', 'Contrast adjustment'],
      digitalLiteracy: 'High',
      preferredCommunication: 'Audio, Braille',
      recommendedFor: 'Vision challenges'
    },
    {
      id: 'young-adult',
      title: 'Young Adult',
      icon: <Zap size={20} />,
      color: 'from-amber-500 to-amber-600',
      darkColor: 'from-amber-600 to-amber-700',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-700 dark:text-amber-300',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      description: 'Tech-savvy, quick',
      features: ['Fast interface', 'Modern design', 'Quick booking', 'Digital payments'],
      demographics: 'Age: 18-30',
      commonNeeds: ['Quick access', 'Digital records', 'Mobile-first'],
      digitalLiteracy: 'High',
      preferredCommunication: 'App, Chat, Email',
      recommendedFor: 'Tech-savvy users'
    },
    {
      id: 'parent',
      title: 'Parent',
      icon: <Baby size={20} />,
      color: 'from-pink-500 to-pink-600',
      darkColor: 'from-pink-600 to-pink-700',
      iconColor: 'text-pink-600 dark:text-pink-400',
      textColor: 'text-pink-700 dark:text-pink-300',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      description: 'Family health management',
      features: ['Multiple profiles', 'Family scheduling', 'Child content', 'Vaccination tracker'],
      demographics: 'Managing dependents',
      commonNeeds: ['Child health', 'Family scheduling'],
      digitalLiteracy: 'Medium',
      preferredCommunication: 'Notifications, SMS',
      recommendedFor: 'Family healthcare'
    },
    {
      id: 'chronic-condition',
      title: 'Chronic Condition',
      icon: <Heart size={20} />,
      color: 'from-red-500 to-red-600',
      darkColor: 'from-red-600 to-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      description: 'Long-term management',
      features: ['Medication tracker', 'Symptom diary', 'Reminders', 'Progress charts'],
      demographics: 'Chronic illnesses',
      commonNeeds: ['Regular monitoring', 'Medication management'],
      digitalLiteracy: 'Medium',
      preferredCommunication: 'Reminders, Reports',
      recommendedFor: 'Long-term health'
    },
    {
      id: 'tech-savvy-senior',
      title: 'Tech-Savvy Senior',
      icon: <Smartphone size={20} />,
      color: 'from-indigo-500 to-indigo-600',
      darkColor: 'from-indigo-600 to-indigo-700',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      description: 'Comfortable with tech',
      features: ['Advanced features', 'Health analytics', 'Device integration', 'Customization'],
      demographics: '60+ with tech experience',
      commonNeeds: ['Detailed data', 'Preventive care'],
      digitalLiteracy: 'High',
      preferredCommunication: 'App, Video calls',
      recommendedFor: 'Tech-savvy seniors'
    },
    {
      id: 'rural-remote',
      title: 'Rural User',
      icon: <Globe size={20} />,
      color: 'from-teal-500 to-teal-600',
      darkColor: 'from-teal-600 to-teal-700',
      iconColor: 'text-teal-600 dark:text-teal-400',
      textColor: 'text-teal-700 dark:text-teal-300',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800',
      description: 'Limited connectivity',
      features: ['Offline mode', 'Low bandwidth', 'SMS support', 'Local language'],
      demographics: 'Remote areas',
      commonNeeds: ['Telemedicine', 'Medicine delivery'],
      digitalLiteracy: 'Low',
      preferredCommunication: 'SMS, Phone calls',
      recommendedFor: 'Poor connectivity areas'
    }
  ];

  const filteredPersonas = personas.filter(persona =>
    persona.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePersonaClick = (persona) => {
    const isSelected = isPersonaSelected(persona.id);
    const isExpanded = expandedPersona === persona.id;
    
    if (multiSelect) {
      // For multi-select mode
      if (isSelected) {
        // If already selected, deselect and collapse
        setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id));
        setExpandedPersona(null);
      } else {
        // If not selected, select and expand
        setSelectedPersonas([...selectedPersonas, persona]);
        setExpandedPersona(persona.id);
      }
    } else {
      // For single-select mode
      if (isSelected && isExpanded) {
        // If selected and expanded, just collapse
        setExpandedPersona(null);
      } else if (isSelected && !isExpanded) {
        // If selected but collapsed, expand
        setExpandedPersona(persona.id);
      } else {
        // If not selected, select and expand
        setSelectedPersonas([persona]);
        setExpandedPersona(persona.id);
        
        if (setUserMode) {
          setUserMode(persona.id);
        }
        
        if (onPersonaSelect) {
          onPersonaSelect(persona);
        }
      }
    }
  };

  const handleExpandClick = (personaId, e) => {
    e.stopPropagation();
    setExpandedPersona(expandedPersona === personaId ? null : personaId);
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
    const isExpanded = expandedPersona === persona.id;
    
    return (
      <div
        key={persona.id}
        className="h-full"
      >
        <div
          className={`h-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
            isSelected 
              ? `border-primary-500 dark:border-primary-400 shadow-lg ${persona.bgColor}` 
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
          }`}
          onClick={() => handlePersonaClick(persona)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${persona.bgColor} border ${persona.borderColor}`}>
                <div className={persona.iconColor}>
                  {persona.icon}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                  {persona.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {persona.description}
                </p>
              </div>
            </div>
            
            {/* Selection Indicator */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isSelected 
                ? 'bg-gradient-to-br from-primary-500 to-blue-500 dark:from-primary-400 dark:to-blue-400 border-transparent' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {isSelected && <Check size={12} className="text-white" />}
            </div>
          </div>

          {/* Quick Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {persona.features.slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg border border-gray-200 dark:border-gray-700 truncate max-w-[120px]"
                  title={feature}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Expand Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => handleExpandClick(persona.id, e)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp size={12} />
                </>
              ) : (
                <>
                  Show details
                  <ChevronDown size={12} />
                </>
              )}
            </button>
            
            {/* Digital Literacy Indicator */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Tech:</div>
              <div className={`px-2 py-0.5 rounded-full text-xs ${
                persona.digitalLiteracy === 'High' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                persona.digitalLiteracy === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
              }`}>
                {persona.digitalLiteracy}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-fadeIn">
              {/* Demographics & Needs */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Demographics</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{persona.demographics}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Common Needs</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.commonNeeds.map((need, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-xs rounded-lg"
                      >
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Communication</h4>
                  <p className="text-sm text-gray-900 dark:text-white truncate">{persona.preferredCommunication}</p>
                </div>
              </div>

              {/* All Features */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Features</h4>
                <div className="space-y-1">
                  {persona.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Sparkles size={12} className={`${persona.iconColor} mt-0.5 flex-shrink-0`} />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getRecommendation = () => {
    if (selectedPersonas.length === 0) return null;
    
    if (multiSelect) {
      return `Selected ${selectedPersonas.length} profiles`;
    }
    
    const persona = selectedPersonas[0];
    return `Best for ${persona.demographics.toLowerCase()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl mb-4 border border-primary-200 dark:border-gray-700">
          <Target size={28} className="text-primary-600 dark:text-primary-400" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Select Your Profile
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose profiles that match your needs for personalized experience
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPersonas.length > 0 ? (
          filteredPersonas.map(renderPersonaCard)
        ) : (
          <div className="col-span-full text-center py-12">
            <Users size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Profiles Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try different keywords or browse all profiles.
            </p>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedPersonas.length > 0 && (
        <div className="bg-gradient-to-r from-primary-500 to-blue-500 dark:from-primary-600 dark:to-blue-600 rounded-xl p-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">
                  Personalization Ready
                </h3>
                <p className="text-primary-100 text-sm">
                  {getRecommendation()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPersonas([])}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-white text-primary-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 font-semibold text-sm"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1 text-gray-900 dark:text-white text-sm">How to Choose?</h3>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                Click to select and expand. Click again to collapse.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Accessibility size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1 text-gray-900 dark:text-white text-sm">Accessibility First</h3>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                Each profile optimizes features for specific needs.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-amber-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Award size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-1 text-gray-900 dark:text-white text-sm">Best Practices</h3>
              <p className="text-gray-700 dark:text-gray-300 text-xs">
                Choose based on your most frequent needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
            Quick Selection Guide
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <span className="font-semibold">For seniors:</span> Elderly or Tech-Savvy Senior
            </p>
          </div>
          <div className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <span className="font-semibold">For vision needs:</span> Visually Impaired
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;