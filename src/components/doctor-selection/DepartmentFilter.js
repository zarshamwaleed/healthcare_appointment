import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  X, 
  Check, 
  Search, 
  Heart, 
  Brain, 
  Eye, 
  Bone,
  Stethoscope,
  Thermometer,
  Users,
  Clock,
  Award,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const DepartmentFilter = ({ 
  symptoms = [],
  onFilterChange,
  initialFilters = {},
  compact = false
}) => {
  const { settings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(!compact);
  const [filters, setFilters] = useState({
    specialty: initialFilters.specialty || '',
    availability: initialFilters.availability || '',
    rating: initialFilters.rating || '',
    experience: initialFilters.experience || '',
    distance: initialFilters.distance || '',
    telemedicine: initialFilters.telemedicine || false,
    elderlyFriendly: initialFilters.elderlyFriendly || false,
    languages: initialFilters.languages || [],
    priceRange: initialFilters.priceRange || [0, 1000]
  });

  const [priceRange, setPriceRange] = useState(filters.priceRange);

  const departments = [
    { id: 'general', name: 'General Physician', icon: <Stethoscope size={18} />, color: 'bg-blue-100 text-blue-800' },
    { id: 'cardio', name: 'Cardiology', icon: <Heart size={18} />, color: 'bg-red-100 text-red-800' },
    { id: 'neuro', name: 'Neurology', icon: <Brain size={18} />, color: 'bg-purple-100 text-purple-800' },
    { id: 'ortho', name: 'Orthopedics', icon: <Bone size={18} />, color: 'bg-amber-100 text-amber-800' },
    { id: 'derma', name: 'Dermatology', icon: <Eye size={18} />, color: 'bg-green-100 text-green-800' },
    { id: 'ent', name: 'ENT', icon: <Users size={18} />, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'gastro', name: 'Gastroenterology', icon: <Thermometer size={18} />, color: 'bg-orange-100 text-orange-800' },
    { id: 'pediatric', name: 'Pediatrics', icon: <Award size={18} />, color: 'bg-pink-100 text-pink-800' },
  ];

  const availabilityOptions = [
    { id: 'today', label: 'Available Today', icon: <Clock size={16} /> },
    { id: 'this-week', label: 'This Week', icon: <TrendingUp size={16} /> },
    { id: 'telemedicine', label: 'Telemedicine', icon: <Users size={16} /> },
    { id: 'emergency', label: 'Emergency', icon: <Heart size={16} /> },
  ];

  const ratingOptions = [
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: 'any', label: 'Any Rating' },
  ];

  const experienceOptions = [
    { value: '10', label: '10+ Years' },
    { value: '5', label: '5+ Years' },
    { value: '3', label: '3+ Years' },
    { value: 'any', label: 'Any Experience' },
  ];

  const distanceOptions = [
    { value: '5', label: 'Within 5 km' },
    { value: '10', label: 'Within 10 km' },
    { value: '20', label: 'Within 20 km' },
    { value: 'any', label: 'Any Distance' },
  ];

  const languageOptions = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'];

  const getRecommendedDepartments = () => {
    if (!symptoms.length) return departments;
    
    const symptomMap = {
      'headache': ['neurology', 'general'],
      'fever': ['general', 'pediatric'],
      'cough': ['ent', 'general'],
      'chest': ['cardio', 'general'],
      'stomach': ['gastro', 'general'],
      'skin': ['derma'],
      'bone': ['ortho'],
      'joint': ['ortho'],
    };

    const recommended = new Set();
    
    symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();
      Object.entries(symptomMap).forEach(([key, depts]) => {
        if (lowerSymptom.includes(key)) {
          depts.forEach(dept => recommended.add(dept));
        }
      });
    });

    return departments.map(dept => ({
      ...dept,
      recommended: recommended.has(dept.id)
    }));
  };

  const recommendedDepartments = getRecommendedDepartments();

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSpecialtyChange = (specialtyId) => {
    setFilters(prev => ({
      ...prev,
      specialty: prev.specialty === specialtyId ? '' : specialtyId
    }));
  };

  const handleAvailabilityChange = (availabilityId) => {
    setFilters(prev => ({
      ...prev,
      availability: prev.availability === availabilityId ? '' : availabilityId
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const handleExperienceChange = (experience) => {
    setFilters(prev => ({ ...prev, experience }));
  };

  const handleDistanceChange = (distance) => {
    setFilters(prev => ({ ...prev, distance }));
  };

  const handleTelemedicineChange = () => {
    setFilters(prev => ({ ...prev, telemedicine: !prev.telemedicine }));
  };

  const handleElderlyFriendlyChange = () => {
    setFilters(prev => ({ ...prev, elderlyFriendly: !prev.elderlyFriendly }));
  };

  const handleLanguageToggle = (language) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      specialty: '',
      availability: '',
      rating: '',
      experience: '',
      distance: '',
      telemedicine: false,
      elderlyFriendly: false,
      languages: [],
      priceRange: [0, 1000]
    };
    
    setFilters(clearedFilters);
    setPriceRange([0, 1000]);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.specialty) count++;
    if (filters.availability) count++;
    if (filters.rating && filters.rating !== 'any') count++;
    if (filters.experience && filters.experience !== 'any') count++;
    if (filters.distance && filters.distance !== 'any') count++;
    if (filters.telemedicine) count++;
    if (filters.elderlyFriendly) count++;
    if (filters.languages.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  };

  const renderCompactView = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Filter size={20} className="text-primary-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold">Filters</h3>
            <p className="text-sm text-gray-600">
              {getActiveFilterCount()} active filter{getActiveFilterCount() !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          )}
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {renderFilterContent()}
        </div>
      )}
    </div>
  );

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Recommended Departments */}
      {symptoms.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            Recommended for Your Symptoms
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedDepartments
              .filter(dept => dept.recommended)
              .map(dept => (
                <button
                  key={dept.id}
                  onClick={() => handleSpecialtyChange(dept.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    filters.specialty === dept.id
                      ? 'bg-primary-600 text-white'
                      : `${dept.color} hover:opacity-90`
                  }`}
                >
                  {dept.icon}
                  <span className="text-sm font-medium">{dept.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* All Departments */}
      <div>
        <h4 className="font-semibold mb-3">Medical Specialties</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => handleSpecialtyChange(dept.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                filters.specialty === dept.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${dept.color} mb-2`}>
                {dept.icon}
              </div>
              <span className="text-sm font-medium text-center">{dept.name}</span>
              {filters.specialty === dept.id && (
                <Check size={14} className="text-primary-600 mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold mb-3">Availability</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availabilityOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleAvailabilityChange(option.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                filters.availability === option.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rating & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-3">Minimum Rating</h4>
          <div className="space-y-2">
            {ratingOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleRatingChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  filters.rating === option.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {filters.rating === option.value && <Check size={16} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Experience</h4>
          <div className="space-y-2">
            {experienceOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleExperienceChange(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  filters.experience === option.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {filters.experience === option.value && <Check size={16} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="font-semibold mb-3">Maximum Distance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {distanceOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleDistanceChange(option.value)}
              className={`px-3 py-2 rounded-lg border transition-all ${
                filters.distance === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Features */}
      <div>
        <h4 className="font-semibold mb-3">Accessibility Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleTelemedicineChange}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              filters.telemedicine
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-600" />
              <span>Telemedicine Available</span>
            </div>
            {filters.telemedicine && <Check size={18} className="text-green-600" />}
          </button>

          <button
            onClick={handleElderlyFriendlyChange}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              filters.elderlyFriendly
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star size={18} className="text-gray-600" />
              <span>Elderly Friendly</span>
            </div>
            {filters.elderlyFriendly && <Check size={18} className="text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h4 className="font-semibold mb-3">Languages Spoken</h4>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map(language => (
            <button
              key={language}
              onClick={() => handleLanguageToggle(language)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                filters.languages.includes(language)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-3">Consultation Fee Range</h4>
        <div className="space-y-4">
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Clear All Filters
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Filter size={24} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Filter Doctors</h2>
            <p className="text-gray-600">Refine your search by specialty, availability, and more</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear All ({getActiveFilterCount()})
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {renderFilterContent()}
    </div>
  );

  return compact ? renderCompactView() : renderDetailedView();
};

export default DepartmentFilter;