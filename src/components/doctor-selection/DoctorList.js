import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Filter, 
  Search, 
  Grid, 
  List, 
  MapPin, 
  Star, 
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  TrendingUp,
  Shield,
  Award,
  Building
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import DoctorCard from './DoctorCard';
import DepartmentFilter from './DepartmentFilter';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { mockDataService } from '../../services/mockDataService';
const DoctorList = ({
  doctors = [],
  loading = false,
  onDoctorSelect,
  onBookAppointment,
  onViewProfile,
  filters = {},
  onFiltersChange,
  symptoms = [],
  itemsPerPage = 6,
  viewMode = 'grid', // 'grid' or 'list'
  onViewModeChange,
  className = ''
}) => {
  const { settings } = useAccessibility();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    // Just use the doctors passed from parent - they're already filtered
    setFilteredDoctors(doctors);
    setCurrentPage(1);
  }, [doctors]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      specialty: '',
      availability: '',
      rating: '',
      experience: '',
      distance: '',
      telemedicine: false,
      elderlyFriendly: false,
      languages: [],
      priceRange: [0, 1000]
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.specialty) count++;
    if (filters.rating && filters.rating !== 'any') count++;
    if (filters.experience && filters.experience !== 'any') count++;
    if (filters.distance && filters.distance !== 'any') count++;
    if (filters.telemedicine) count++;
    if (filters.elderlyFriendly) count++;
    if (filters.languages.length > 0) count++;
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000)) count++;
    if (searchTerm) count++;
    return count;
  };

  const renderStats = () => {
    const stats = {
      total: doctors.length,
      availableToday: doctors.filter(d => d.availability === 'Available Today').length,
      telemedicine: doctors.filter(d => d.telemedicine).length,
      elderlyFriendly: doctors.filter(d => d.isElderlyFriendly).length
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Doctors</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.availableToday}</div>
          <div className="text-sm text-gray-600">Available Today</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.telemedicine}</div>
          <div className="text-sm text-gray-600">Telemedicine</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.elderlyFriendly}</div>
          <div className="text-sm text-gray-600">Elderly Friendly</div>
        </Card>
      </div>
    );
  };

  const renderControls = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
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

        {/* View Mode & Sort */}
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
              aria-label="List view"
            >
              <List size={20} />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="recommended">Recommended First</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="distance">Nearest First</option>
            <option value="price">Lowest Fee</option>
            <option value="availability">Available Today</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-1">
                ×
              </button>
            </span>
          )}
          
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            if (key === 'priceRange' && (value[0] > 0 || value[1] < 1000)) {
              return (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  Price: ₹{value[0]}-{value[1]}
                  <button onClick={() => onFiltersChange({ ...filters, priceRange: [0, 1000] })} className="ml-1">
                    ×
                  </button>
                </span>
              );
            }
            
            if (Array.isArray(value) && value.length > 0) {
              return value.map(item => (
                <span key={`${key}-${item}`} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {key}: {item}
                  <button onClick={() => onFiltersChange({
                    ...filters,
                    [key]: value.filter(v => v !== item)
                  })} className="ml-1">
                    ×
                  </button>
                </span>
              ));
            }
            
            if (typeof value === 'boolean' && value) {
              return (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {key.replace('Friendly', ' Friendly').replace(/^./, str => str.toUpperCase())}
                  <button onClick={() => onFiltersChange({ ...filters, [key]: false })} className="ml-1">
                    ×
                  </button>
                </span>
              );
            }
            
            if (typeof value === 'string' && value) {
              return (
                <span key={key} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {key}: {value}
                  <button onClick={() => onFiltersChange({ ...filters, [key]: '' })} className="ml-1">
                    ×
                  </button>
                </span>
              );
            }
            
            return null;
          })}
          
          <button
            onClick={handleClearFilters}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="text-center py-12">
      <div className="max-w-md mx-auto">
        <AlertCircle size={64} className="text-amber-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">No Doctors Found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any doctors matching your filters. Try adjusting your search criteria.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Adjust Filters
          </button>
        </div>
      </div>
    </Card>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`w-10 h-10 rounded-lg font-medium ${
                1 === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium ${
              page === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-10 h-10 rounded-lg font-medium ${
                totalPages === currentPage ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader type="healthcare" size="large" text="Loading available doctors..." />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8">
          <DepartmentFilter
            symptoms={symptoms}
            onFilterChange={onFiltersChange}
            initialFilters={filters}
            compact={false}
          />
        </div>
      )}

      {/* Doctors Grid/List */}
      {filteredDoctors.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {currentDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                variant={viewMode === 'list' ? 'expanded' : 'grid'}
                onSelect={onDoctorSelect}
                onBook={onBookAppointment}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>

          {renderPagination()}
        </>
      )}

      {/* Recommendations for Elderly */}
      {settings.mode === 'elderly' && doctors.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            <Shield size={24} />
            Elderly-Friendly Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award size={16} className="text-blue-600" />
                Experienced Doctors
              </h4>
              <p className="text-sm text-gray-600">
                Choose doctors with 10+ years experience for comprehensive geriatric care.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building size={16} className="text-blue-600" />
                Nearby Locations
              </h4>
              <p className="text-sm text-gray-600">
                Select hospitals within 5km for easier travel and reduced commute time.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Telemedicine Option
              </h4>
              <p className="text-sm text-gray-600">
                Consider telemedicine for follow-ups to avoid travel while maintaining care.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;