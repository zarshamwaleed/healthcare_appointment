import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useUser } from '../context/UserContext';
import { 
  Card,
  PrimaryButton,
  SecondaryButton,
  OutlineButton
} from '../components/common';
import Loader from '../components/common/Loader';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
  Stethoscope
} from 'lucide-react';

// Import your 4 components
import RecommendationEngine from '../components/doctor-selection/RecommendationEngine';
import DepartmentFilter from '../components/doctor-selection/DepartmentFilter';
import DoctorList from '../components/doctor-selection/DoctorList';
import DoctorCard from '../components/doctor-selection/DoctorCard';

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
    distance: '',
    price: '',
    telemedicine: false,
    elderlyFriendly: false,
    languages: [],
    priceRange: [0, 1000]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const doctorsPerPage = 6;

  const specialties = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'ENT Specialist',
    'Gynecologist',
    'Pediatrician',
    'Psychiatrist',
    'Dentist'
  ];

  const availabilityOptions = [
    'Available Today',
    'Available This Week',
    'Telemedicine',
    'Emergency'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      
      const mockDoctors = generateMockDoctors();
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchDoctors();
  }, [user.symptoms]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, filters, sortBy, doctors]);

  const generateMockDoctors = () => {
    const doctorNames = [
      'Dr. Sarah Johnson',
      'Dr. Michael Chen',
      'Dr. Robert Williams',
      'Dr. Maria Garcia',
      'Dr. James Wilson',
      'Dr. Lisa Brown',
      'Dr. David Miller',
      'Dr. Jennifer Davis',
      'Dr. Thomas Taylor',
      'Dr. Susan Anderson',
      'Dr. Rajesh Kumar',
      'Dr. Priya Sharma'
    ];

    const symptomsMap = {
      'headache': ['Neurologist', 'General Physician'],
      'fever': ['General Physician', 'Internal Medicine'],
      'cough': ['Pulmonology', 'ENT', 'General Physician'],
      'stomach': ['Gastroenterology', 'General Physician'],
      'skin': ['Dermatology'],
      'chest': ['Cardiology', 'Emergency'],
      'back': ['Orthopedics', 'Physiotherapy']
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
      const isPriority = user.age > 60 && Math.random() > 0.7;
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
        isPriority,
        isElderlyFriendly,
        telemedicine: Math.random() > 0.5,
        description: 'Experienced specialist with excellent patient reviews. Known for thorough diagnosis and compassionate care.',
        hospital: ['City General Hospital', 'Medicare Center', 'Wellness Clinic'][Math.floor(Math.random() * 3)],
        waitTime: Math.floor(Math.random() * 30) + 10,
        patientReviews: Math.floor(Math.random() * 500) + 100
      };
    });
  };

  const applyFiltersAndSearch = () => {
    let result = [...doctors];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialty.toLowerCase().includes(term) ||
        doctor.hospital.toLowerCase().includes(term)
      );
    }

    // Apply filters using DoctorList's filter logic
    if (filters.specialty) {
      result = result.filter(doctor => doctor.specialty === filters.specialty);
    }

    if (filters.availability) {
      if (filters.availability === 'Available Today') {
        result = result.filter(doctor => doctor.availability === 'Available Today');
      } else if (filters.availability === 'Telemedicine') {
        result = result.filter(doctor => doctor.telemedicine);
      }
    }

    if (filters.rating) {
      result = result.filter(doctor => parseFloat(doctor.rating) >= parseFloat(filters.rating));
    }

    if (filters.distance) {
      const maxDistance = parseFloat(filters.distance);
      result = result.filter(doctor => parseFloat(doctor.distance) <= maxDistance);
    }

    // Apply sorting
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
        // Show recommended doctors first
        result.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
        break;
    }

    // Prioritize elderly-friendly doctors for elderly users
    if (settings.mode === 'elderly') {
      result.sort((a, b) => {
        if (a.isElderlyFriendly && !b.isElderlyFriendly) return -1;
        if (!a.isElderlyFriendly && b.isElderlyFriendly) return 1;
        return 0;
      });
    }

    setFilteredDoctors(result);
    setCurrentPage(1);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    updateUser({ selectedDoctor: doctor });
  };

  const handleBookAppointment = (doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      updateUser({ selectedDoctor: doctor });
      navigate('/booking');
    } else if (selectedDoctor) {
      navigate('/booking');
    }
  };

  const handleViewProfile = (doctor) => {
    console.log('View profile:', doctor);
    // Navigate to doctor profile or open modal
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      availability: '',
      rating: '',
      distance: '',
      price: '',
      telemedicine: false,
      elderlyFriendly: false,
      languages: [],
      priceRange: [0, 1000]
    });
    setSearchTerm('');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRecommendationsChange = (recommendations) => {
    console.log('AI Recommendations:', recommendations);
    if (recommendations.length > 0) {
      const topSpecialty = recommendations[0].specialty;
      setFilters(prev => ({ ...prev, specialty: topSpecialty }));
    }
  };

  const handleSpecialtyFilter = (specialty) => {
    setFilters(prev => ({
      ...prev,
      specialty: prev.specialty === specialty ? '' : specialty
    }));
  };

  const getPaginationData = () => {
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    return { currentDoctors, totalPages };
  };

  const { currentDoctors, totalPages } = getPaginationData();

  const getFilterBadgeCount = () => {
    let count = 0;
    Object.values(filters).forEach(value => {
      if (value) count++;
    });
    if (searchTerm) count++;
    return count;
  };

  const getRecommendationReason = () => {
    if (!user.symptoms || user.symptoms.length === 0) {
      return "Based on general healthcare needs";
    }
    
    const symptomText = user.symptoms.join(', ');
    return `Based on your symptoms: ${symptomText}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <Loader type="healthcare" size="large" text="Finding the best doctors for you..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/symptoms')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-4"
        >
          <ChevronLeft size={20} />
          Back to Symptoms
        </button>
        
        <h1 className={`font-bold mb-3 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
          <Stethoscope className="inline mr-2 text-primary-600" />
          Select a Doctor
        </h1>
        <p className="text-gray-600">
          {getRecommendationReason()}
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - AI Recommendations & Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Recommendation Engine */}
          <RecommendationEngine
            symptoms={user.symptoms || []}
            userProfile={user}
            doctors={doctors}
            onRecommendationsChange={handleRecommendationsChange}
            showDetails={true}
          />

          {/* Department Filter */}
          <DepartmentFilter
            symptoms={user.symptoms || []}
            onFilterChange={handleFiltersChange}
            initialFilters={filters}
            compact={false}
          />

          {/* Quick Stats Card */}
          <Card className="p-4">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Doctors</span>
                <span className="font-bold">{doctors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Today</span>
                <span className="font-bold text-green-600">
                  {doctors.filter(d => d.availability === 'Available Today').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telemedicine</span>
                <span className="font-bold text-blue-600">
                  {doctors.filter(d => d.telemedicine).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elderly Friendly</span>
                <span className="font-bold text-purple-600">
                  {doctors.filter(d => d.isElderlyFriendly).length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Doctor List */}
        <div className="lg:col-span-3">
          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search doctors by name, specialty, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      settings.mode === 'elderly' ? 'text-lg' : ''
                    }`}
                  />
                </div>

                {/* Filter Button */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter size={20} />
                    Filters
                    {getFilterBadgeCount() > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {getFilterBadgeCount()}
                      </span>
                    )}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="recommended">Recommended First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="availability">Available Today</option>
                    <option value="distance">Nearest First</option>
                    <option value="price">Lowest Fee</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-1">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {key}: {value}
                        <button onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))} className="ml-1">
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                  
                  <button
                    onClick={clearFilters}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredDoctors.length}</span> doctors
                {selectedDoctor && (
                  <span className="ml-4">
                    • Selected: <span className="font-bold text-primary-600">{selectedDoctor.name}</span>
                  </span>
                )}
              </p>
            </div>
            
            {selectedDoctor && (
              <div className="flex gap-3">
                <SecondaryButton onClick={() => setSelectedDoctor(null)}>
                  Change Selection
                </SecondaryButton>
                <PrimaryButton 
                  onClick={() => handleBookAppointment(selectedDoctor)} 
                  icon={Calendar}
                >
                  Book Appointment
                </PrimaryButton>
              </div>
            )}
          </div>

          {/* Doctor List Component */}
          <DoctorList
            doctors={filteredDoctors}
            loading={false}
            onDoctorSelect={handleSelectDoctor}
            onBookAppointment={handleBookAppointment}
            onViewProfile={handleViewProfile}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            symptoms={user.symptoms || []}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Pagination (Fallback if DoctorList doesn't have it) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Selection Summary */}
          {selectedDoctor && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-green-800">✓ Doctor Selected</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-600" />
                      <span className="font-medium">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-gray-500" />
                      <span>{selectedDoctor.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>Next: {selectedDoctor.nextAvailable}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <SecondaryButton onClick={() => setSelectedDoctor(null)}>
                    Change Doctor
                  </SecondaryButton>
                  <PrimaryButton 
                    onClick={() => handleBookAppointment(selectedDoctor)} 
                    icon={Calendar}
                    size={settings.mode === 'elderly' ? 'large' : 'medium'}
                  >
                    Book Appointment
                  </PrimaryButton>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-800">💡 Tips for Choosing a Doctor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-amber-500" />
                  <h4 className="font-semibold">Check Ratings</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Look for doctors with 4+ stars and read patient reviews for quality care.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-green-500" />
                  <h4 className="font-semibold">Availability</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Consider wait times and next available slots for urgent needs.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-red-500" />
                  <h4 className="font-semibold">Location</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Choose doctors closer to you for convenience, especially for follow-ups.
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-purple-500" />
                  <h4 className="font-semibold">Specialization</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Match doctor's specialty with your specific health concerns.
                </p>
              </div>
            </div>
            
            {settings.mode === 'elderly' && (
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">👵 For Elderly Patients</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Look for "Elderly Friendly" doctors with experience in geriatric care</li>
                  <li>• Consider telemedicine options for routine follow-ups</li>
                  <li>• Choose doctors with shorter wait times to avoid long sitting</li>
                  <li>• Check if the clinic/hospital has wheelchair accessibility</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-10">
        <PrimaryButton
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter size={20} />}
          className="rounded-full p-4 shadow-lg"
        >
          Filters
        </PrimaryButton>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20 p-4">
          <div className="bg-white rounded-2xl p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)} 
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <DepartmentFilter
              symptoms={user.symptoms || []}
              onFilterChange={handleFiltersChange}
              initialFilters={filters}
              compact={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSelectionPage;