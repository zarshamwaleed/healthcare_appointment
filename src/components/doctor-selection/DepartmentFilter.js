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
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Filter size={20} className="text-primary-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
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
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
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
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            Recommended for Your Symptoms
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {recommendedDepartments
              .filter(dept => dept.recommended)
              .map(dept => (
                <button
                  key={dept.id}
                  onClick={() => handleSpecialtyChange(dept.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left w-full ${
                    filters.specialty === dept.id
                      ? 'bg-primary-600 text-white shadow-md border-primary-600'
                      : `border border-transparent ${dept.color} hover:opacity-80 hover:shadow-sm dark:bg-transparent dark:text-white`
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${dept.color} dark:bg-slate-700 dark:text-white`}>
                    {dept.icon}
                  </div>
                  <span className="text-sm font-medium dark:text-white">{dept.name}</span>
                  {filters.specialty === dept.id && <Check size={16} className="ml-auto text-white" />}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* All Departments */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Medical Specialties</h4>
        <div className="grid grid-cols-2 gap-3">
          {departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => handleSpecialtyChange(dept.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left w-full ${
                filters.specialty === dept.id
                  ? 'border-primary-500 bg-primary-50 shadow-md dark:bg-primary-600 dark:text-white'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${dept.color} dark:bg-slate-700 dark:text-white`}>
                {dept.icon}
              </div>
              <span className="text-xs font-medium flex-1 truncate dark:text-white">{dept.name}</span>
              {filters.specialty === dept.id && (
                <Check size={16} className="text-primary-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Availability</h4>
        <div className="grid grid-cols-2 gap-3">
          {availabilityOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleAvailabilityChange(option.id)}
              className={`flex items-center gap-2 p-3.5 rounded-xl border-2 transition-all w-full ${
                filters.availability === option.id
                  ? 'border-primary-500 bg-primary-50 shadow-md dark:bg-primary-600 dark:text-white'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
              }`}
            >
              <div className="mr-2 text-gray-600 dark:text-gray-300">{option.icon}</div>
              <span className="text-sm font-medium dark:text-white">{option.label}</span>
              {filters.availability === option.id && <Check size={16} className="ml-auto text-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Rating & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Minimum Rating</h4>
          <div className="space-y-2">
              {ratingOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleRatingChange(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    filters.rating === option.value
                      ? 'bg-primary-100 text-primary-700 border-primary-300 font-medium dark:bg-primary-600 dark:text-white'
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-white">{option.label}</span>
                    {filters.rating === option.value && <Check size={16} />}
                  </div>
                </button>
              ))}
            </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Experience</h4>
          <div className="space-y-2">
            {experienceOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleExperienceChange(option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  filters.experience === option.value
                    ? 'bg-primary-100 text-primary-700 border-primary-300 font-medium dark:bg-primary-600 dark:text-white'
                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-white">{option.label}</span>
                  {filters.experience === option.value && <Check size={16} />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900">Maximum Distance</h4>
        <div className="grid grid-cols-2 gap-3">
          {distanceOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleDistanceChange(option.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all w-full ${
                filters.distance === option.value
                  ? 'border-primary-500 bg-primary-50 shadow-md font-medium dark:bg-primary-600 dark:text-white'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
              }`}
            >
              <span className="text-sm font-medium dark:text-white">{option.label}</span>
              {filters.distance === option.value && <Check size={16} className="ml-auto text-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Features */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-900">Accessibility Features</h4>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handleTelemedicineChange}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full ${
              filters.telemedicine
                ? 'border-green-500 bg-green-50 shadow-md dark:bg-green-900/20 dark:text-white'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${filters.telemedicine ? 'bg-green-100' : 'bg-gray-100'} dark:bg-slate-700 dark:text-white`}>
                <Users size={18} className={filters.telemedicine ? 'text-green-600' : 'text-gray-600'} />
              </div>
              <span className="font-medium dark:text-white">Telemedicine Available</span>
            </div>
            {filters.telemedicine && <Check size={20} className="text-green-600" />}
          </button>

          <button
            onClick={handleElderlyFriendlyChange}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full ${
              filters.elderlyFriendly
                ? 'border-blue-500 bg-blue-50 shadow-md dark:bg-blue-900/20 dark:text-white'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${filters.elderlyFriendly ? 'bg-blue-100' : 'bg-gray-100'} dark:bg-slate-700 dark:text-white`}>
                <Star size={18} className={filters.elderlyFriendly ? 'text-blue-600' : 'text-gray-600'} />
              </div>
              <span className="font-medium dark:text-white">Elderly Friendly</span>
            </div>
            {filters.elderlyFriendly && <Check size={20} className="text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
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
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-slate-700 rounded-lg">
            <Filter size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter Doctors</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Refine your search by specialty, availability, and more</p>
          </div>
        </div>
        
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 font-medium"
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {renderFilterContent()}
    </div>
  );

  return compact ? renderCompactView() : renderDetailedView();
};

export default DepartmentFilter;