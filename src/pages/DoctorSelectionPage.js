import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useUser } from '../context/UserContext';
import { 
  Card,
  PrimaryButton,
  SecondaryButton
} from '../components/common';
import Loader from '../components/common/Loader';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Award,
  ChevronLeft,
  X,
  Calendar,
  Stethoscope,
  Users
} from 'lucide-react';
import RecommendationEngine from '../components/doctor-selection/RecommendationEngine';
import DepartmentFilter from '../components/doctor-selection/DepartmentFilter';
import DoctorList from '../components/doctor-selection/DoctorList';

const DoctorSelectionPage = () => {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  const { user, updateUser } = useUser();
  
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availability: '',
    rating: '',
    experience: '',
    distance: '',
    telemedicine: false,
    elderlyFriendly: false,
    languages: []
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    const mockDoctors = generateMockDoctors();
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
    setLoading(false);
    
    if (user.selectedDoctor) {
      setSelectedDoctor(user.selectedDoctor);
    }
  }, []);

  useEffect(() => {
    if (doctors.length > 0) {
      applyFiltersAndSearch();
    }
  }, [doctors, searchTerm, filters, sortBy, settings.mode]);

  const generateMockDoctors = () => {
    const doctorNames = [
      'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Robert Williams',
      'Dr. Maria Garcia', 'Dr. James Wilson', 'Dr. Lisa Brown',
      'Dr. David Miller', 'Dr. Jennifer Davis', 'Dr. Thomas Taylor',
      'Dr. Susan Anderson', 'Dr. Rajesh Kumar', 'Dr. Priya Sharma'
    ];

    const symptomsMap = {
      'headache': ['Neurologist', 'General Physician'],
      'fever': ['General Physician', 'Internal Medicine'],
      'cough': ['Pulmonology', 'ENT', 'General Physician'],
      'stomach': ['Gastroenterology', 'General Physician'],
      'skin': ['Dermatology'],
      'chest': ['Cardiology', 'Emergency'],
      'back': ['Orthopedics', 'Physiotherapy'],
      'leg': ['Orthopedics', 'General Physician'],
      'arm': ['Orthopedics', 'General Physician']
    };

    const getRecommendedSpecialties = () => {
      if (!user.symptoms || user.symptoms.length === 0) {
        return ['General Physician'];
      }
      
      const allSpecialties = new Set();
      user.symptoms.forEach(symptom => {
        const lowerSymptom = symptom.toLowerCase();
        Object.entries(symptomsMap).forEach(([key, specialties]) => {
          if (lowerSymptom.includes(key)) {
            specialties.forEach(s => allSpecialties.add(s));
          }
        });
      });
      
      return Array.from(allSpecialties).length > 0 
        ? Array.from(allSpecialties) 
        : ['General Physician'];
    };

    const recommendedSpecialties = getRecommendedSpecialties();

    return doctorNames.map((name, index) => {
      const randomSpecialty = recommendedSpecialties[
        Math.floor(Math.random() * recommendedSpecialties.length)
      ] || 'General Physician';
      
      const isRecommended = Math.random() > 0.5;
      const isElderlyFriendly = user.age > 60 && Math.random() > 0.5;
      
      return {
        id: `doc-${index + 1}`,
        name,
        specialization: randomSpecialty,
        specialty: randomSpecialty,
        rating: (4 + Math.random()).toFixed(1),
        experience: Math.floor(Math.random() * 20) + 5,
        education: ['MBBS', 'MD', 'DM'][Math.floor(Math.random() * 3)],
        availability: Math.random() > 0.3 ? 'Available Today' : 'Available This Week',
        nextAvailable: ['9:30 AM', '11:00 AM', '2:00 PM', '4:30 PM'][Math.floor(Math.random() * 4)],
        consultationFee: Math.floor(Math.random() * 500) + 300,
        distance: (Math.random() * 10 + 1).toFixed(1),
        languages: ['English', 'Hindi', 'Tamil'].slice(0, Math.floor(Math.random() * 3) + 1),
        isRecommended,
        isElderlyFriendly,
        telemedicine: Math.random() > 0.5,
        description: 'Experienced specialist with excellent patient reviews and compassionate care.',
        hospital: ['City General Hospital', 'Medicare Center', 'Wellness Clinic'][Math.floor(Math.random() * 3)],
        waitTime: Math.floor(Math.random() * 30) + 10,
        patientReviews: Math.floor(Math.random() * 500) + 100
      };
    });
  };

  const applyFiltersAndSearch = () => {
    let result = [...doctors];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.hospital.toLowerCase().includes(term)
      );
    }

    if (filters.specialty) {
      const specialtyMap = {
        'general': 'General Physician',
        'cardio': 'Cardiology',
        'neuro': 'Neurology',
        'ortho': 'Orthopedics',
        'derma': 'Dermatology',
        'ent': 'ENT',
        'gastro': 'Gastroenterology',
        'pediatric': 'Pediatrics'
      };
      const specialtyName = specialtyMap[filters.specialty] || filters.specialty;
      result = result.filter(doctor => doctor.specialty === specialtyName);
    }

    if (filters.availability === 'today') {
      result = result.filter(doctor => doctor.availability === 'Available Today');
    } else if (filters.availability === 'this-week') {
      result = result.filter(doctor => doctor.availability === 'Available This Week');
    } else if (filters.availability === 'telemedicine') {
      result = result.filter(doctor => doctor.telemedicine);
    }

    if (filters.rating && filters.rating !== 'any') {
      result = result.filter(doctor => parseFloat(doctor.rating) >= parseFloat(filters.rating));
    }

    if (filters.experience && filters.experience !== 'any') {
      result = result.filter(doctor => parseInt(doctor.experience) >= parseInt(filters.experience));
    }

    if (filters.distance && filters.distance !== 'any') {
      result = result.filter(doctor => parseFloat(doctor.distance) <= parseFloat(filters.distance));
    }

    if (filters.telemedicine) {
      result = result.filter(doctor => doctor.telemedicine);
    }

    if (filters.elderlyFriendly) {
      result = result.filter(doctor => doctor.isElderlyFriendly);
    }

    if (filters.languages && filters.languages.length > 0) {
      result = result.filter(doctor => 
        filters.languages.some(lang => doctor.languages.includes(lang))
      );
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'distance':
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'availability':
        result.sort((a, b) => a.availability === 'Available Today' ? -1 : 1);
        break;
      case 'price':
        result.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
        break;
    }

    if (settings.mode === 'elderly') {
      result.sort((a, b) => {
        if (a.isElderlyFriendly && !b.isElderlyFriendly) return -1;
        if (!a.isElderlyFriendly && b.isElderlyFriendly) return 1;
        return 0;
      });
    }

    setFilteredDoctors(result);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    updateUser({ selectedDoctor: doctor });
  };

  const handleBookAppointment = (doctor) => {
    if (doctor) {
      updateUser({ selectedDoctor: doctor });
      navigate('/booking');
    } else if (selectedDoctor) {
      navigate('/booking');
    }
  };

  const handleViewProfile = (doctor) => {
    console.log('View profile:', doctor);
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      availability: '',
      rating: '',
      experience: '',
      distance: '',
      telemedicine: false,
      elderlyFriendly: false,
      languages: []
    });
    setSearchTerm('');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getFilterBadgeCount = () => {
    let count = 0;
    if (filters.specialty) count++;
    if (filters.availability) count++;
    if (filters.rating) count++;
    if (filters.distance) count++;
    if (searchTerm) count++;
    return count;
  };

  const getRecommendationReason = () => {
    if (!user.symptoms || user.symptoms.length === 0) {
      return "Browse available doctors";
    }
    return `Doctors for: ${user.symptoms.join(', ')}`;
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-8">
        <Loader type="healthcare" size="large" text="Finding the best doctors for you..." />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters & Recommendations */}
          <div className={`lg:col-span-1 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Filters */}
            <DepartmentFilter
              symptoms={user.symptoms || []}
              onFilterChange={handleFiltersChange}
              initialFilters={filters}
              compact={false}
            />
          </div>

          {/* Main Content - Doctor List */}
          <div className="lg:col-span-3">
            {/* Search & Sort Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name, specialty, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                      settings.mode === 'elderly' ? 'text-lg' : ''
                    }`}
                  />
                </div>

                {/* Sort & Filter Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Filter size={20} />
                    Filters
                    {getFilterBadgeCount() > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {getFilterBadgeCount()}
                      </span>
                    )}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 dark:text-white text-xs font-normal ${
                      settings.mode === 'elderly' ? 'text-sm' : 'text-xs'
                    }`}
                    style={{ fontSize: settings.mode === 'elderly' ? '14px' : '11px' }}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="availability">Available Today</option>
                    <option value="distance">Nearest</option>
                    <option value="price">Lowest Fee</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || Object.values(filters).some(f => f && (typeof f !== 'object' || f.length > 0))) && (
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  
                  {filters.specialty && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {filters.specialty}
                      <button onClick={() => setFilters(prev => ({ ...prev, specialty: '' }))} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  
                  {filters.availability && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {filters.availability}
                      <button onClick={() => setFilters(prev => ({ ...prev, availability: '' }))} className="hover:text-green-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  
                  {filters.rating && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {filters.rating}+ Stars
                      <button onClick={() => setFilters(prev => ({ ...prev, rating: '' }))} className="hover:text-yellow-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-gray-700 dark:text-gray-300">
                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
              </p>
              
              {selectedDoctor && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Selected: {selectedDoctor.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <SecondaryButton 
                      onClick={() => setSelectedDoctor(null)}
                      className="text-sm py-1 px-3"
                    >
                      Change
                    </SecondaryButton>
                    <PrimaryButton 
                      onClick={() => handleBookAppointment(selectedDoctor)} 
                      icon={Calendar}
                      className="text-sm py-1 px-3"
                    >
                      Book
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor List */}
            <DoctorList
              doctors={filteredDoctors}
              loading={false}
              onDoctorSelect={handleSelectDoctor}
              onBookAppointment={handleBookAppointment}
              onViewProfile={handleViewProfile}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              symptoms={user.symptoms || []}
              viewMode="grid"
              onViewModeChange={() => {}}
            />

            {/* Empty State */}
            {filteredDoctors.length === 0 && (
              <Card className="p-12 text-center bg-white">
                <Stethoscope size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No doctors found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <PrimaryButton onClick={clearFilters}>
                  Clear All Filters
                </PrimaryButton>
              </Card>
            )}

            {/* Tips Section */}
            {filteredDoctors.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-blue-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-blue-900 dark:text-white">Tips for Choosing a Doctor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={18} className="text-amber-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Check Ratings</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Look for doctors with 4+ stars and positive patient reviews
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-green-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Availability</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Consider wait times and next available slots
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-red-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose doctors closer to you for convenience
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-purple-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Specialization</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Match specialty with your health concerns
                    </p>
                  </div>
                </div>

                {settings.mode === 'elderly' && (
                  <div className="mt-6 p-4 bg-blue-100 dark:bg-slate-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-white">For Elderly Patients</h4>
                    <ul className="text-sm text-blue-800 dark:text-gray-200 space-y-1">
                      <li>• Look for "Elderly Friendly" doctors</li>
                      <li>• Consider telemedicine for routine checkups</li>
                      <li>• Choose doctors with shorter wait times</li>
                      <li>• Check wheelchair accessibility</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSelectionPage;
