import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  CheckCircle, 
  XCircle, 
  Clock as ClockIcon,
  Filter,
  Search,
  Download,
  Share2,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  BarChart3,
  FileText,
  MessageSquare,
  Star,
  Repeat,
  Phone,
  Video
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import Button from '../common/Button';

const HistoryView = ({ 
  userId,
  showFilters = true,
  showStats = true,
  limit = null
}) => {
  const { settings } = useAccessibility();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    timeFrame: 'all',
    sortBy: 'date-desc'
  });
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    telemedicine: 0
  });

  // Mock data - in real app, this would come from API
  const mockAppointments = [
    {
      id: 'apt-001',
      doctor: {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        avatar: 'SJ'
      },
      date: '2024-01-15',
      time: '10:30 AM',
      duration: '30 mins',
      type: 'in-person',
      status: 'completed',
      location: 'City General Hospital',
      symptoms: ['Chest pain', 'Shortness of breath'],
      diagnosis: 'Hypertension',
      prescription: 'Amlodipine 5mg',
      followUp: '2024-02-15',
      rating: 5,
      notes: 'Regular checkup, blood pressure under control',
      documents: ['blood_report.pdf', 'ecg_result.pdf']
    },
    {
      id: 'apt-002',
      doctor: {
        name: 'Dr. Michael Chen',
        specialty: 'General Physician',
        avatar: 'MC'
      },
      date: '2024-01-10',
      time: '2:00 PM',
      duration: '45 mins',
      type: 'telemedicine',
      status: 'completed',
      location: 'Virtual Consultation',
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      diagnosis: 'Viral Infection',
      prescription: 'Paracetamol, Vitamin C',
      followUp: null,
      rating: 4,
      notes: 'Recommended rest and fluids',
      documents: ['lab_report.pdf']
    },
    {
      id: 'apt-003',
      doctor: {
        name: 'Dr. Priya Sharma',
        specialty: 'Dermatology',
        avatar: 'PS'
      },
      date: '2024-01-20',
      time: '11:15 AM',
      duration: '20 mins',
      type: 'in-person',
      status: 'upcoming',
      location: 'Skin Care Clinic',
      symptoms: ['Skin rash', 'Itching'],
      diagnosis: null,
      prescription: null,
      followUp: null,
      rating: null,
      notes: null,
      documents: []
    },
    {
      id: 'apt-004',
      doctor: {
        name: 'Dr. Robert Williams',
        specialty: 'Orthopedics',
        avatar: 'RW'
      },
      date: '2023-12-05',
      time: '3:30 PM',
      duration: '60 mins',
      type: 'in-person',
      status: 'cancelled',
      location: 'Bone & Joint Center',
      symptoms: ['Back pain'],
      diagnosis: null,
      prescription: null,
      followUp: null,
      rating: null,
      notes: 'Rescheduled to next week',
      documents: []
    },
    {
      id: 'apt-005',
      doctor: {
        name: 'Dr. Lisa Brown',
        specialty: 'Pediatrics',
        avatar: 'LB'
      },
      date: '2023-11-20',
      time: '9:00 AM',
      duration: '30 mins',
      type: 'telemedicine',
      status: 'completed',
      location: 'Virtual Consultation',
      symptoms: ['Child fever', 'Cold'],
      diagnosis: 'Common Cold',
      prescription: 'Childrens Tylenol',
      followUp: null,
      rating: 5,
      notes: 'Child recovering well',
      documents: []
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setFilteredAppointments(mockAppointments);
      calculateStats(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, appointments]);

  const calculateStats = (appts) => {
    const statsData = {
      total: appts.length,
      upcoming: appts.filter(a => a.status === 'upcoming').length,
      completed: appts.filter(a => a.status === 'completed').length,
      cancelled: appts.filter(a => a.status === 'cancelled').length,
      telemedicine: appts.filter(a => a.type === 'telemedicine').length
    };
    setStats(statsData);
  };

  const applyFilters = () => {
    let results = [...appointments];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(appt =>
        appt.doctor.name.toLowerCase().includes(term) ||
        appt.doctor.specialty.toLowerCase().includes(term) ||
        appt.location.toLowerCase().includes(term) ||
        appt.symptoms.some(s => s.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      results = results.filter(appt => appt.status === filters.status);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      results = results.filter(appt => appt.type === filters.type);
    }

    // Apply time frame filter
    if (filters.timeFrame !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      results = results.filter(appt => {
        const apptDate = new Date(appt.date);
        
        switch(filters.timeFrame) {
          case 'today':
            return apptDate.getTime() === today.getTime();
          case 'this-week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return apptDate >= weekAgo;
          case 'this-month':
            return apptDate.getMonth() === now.getMonth() && 
                   apptDate.getFullYear() === now.getFullYear();
          case 'past-3-months':
            const threeMonthsAgo = new Date(now);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return apptDate >= threeMonthsAgo;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch(filters.sortBy) {
      case 'date-asc':
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date-desc':
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'doctor-asc':
        results.sort((a, b) => a.doctor.name.localeCompare(b.doctor.name));
        break;
      case 'specialty-asc':
        results.sort((a, b) => a.doctor.specialty.localeCompare(b.doctor.specialty));
        break;
    }

    // Apply limit if specified
    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    setFilteredAppointments(results);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'upcoming': return <ClockIcon size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'telemedicine' ? <Video size={16} /> : <User size={16} />;
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleExportHistory = () => {
    // Export functionality
    alert('Export feature would generate a PDF/CSV of your medical history');
  };

  const handleShareAppointment = (appointment) => {
    // Share functionality
    alert(`Share appointment with Dr. ${appointment.doctor.name}`);
  };

  const handleBookAgain = (doctor) => {
    // Book again functionality
    alert(`Book new appointment with Dr. ${doctor.name}`);
  };

  const handleViewDetails = (appointment) => {
    // View details functionality
    alert(`View detailed records for appointment ${appointment.id}`);
  };

  const renderAppointmentCard = (appointment) => {
    return (
      <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <div className="text-primary-800 font-bold">
                  {appointment.doctor.avatar}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{appointment.doctor.name}</h3>
                <p className="text-gray-600">{appointment.doctor.specialty}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {getTypeIcon(appointment.type)}
                    {appointment.type === 'telemedicine' ? 'Telemedicine' : 'In-person'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {appointment.time}
              </div>
              <div className="text-gray-600">{formatDate(appointment.date)}</div>
              <div className="text-sm text-gray-500">{appointment.duration}</div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm">{appointment.location}</span>
              </div>
              
              {appointment.symptoms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Symptoms:</p>
                  <div className="flex flex-wrap gap-1">
                    {appointment.symptoms.map((symptom, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {appointment.diagnosis && (
                <div>
                  <p className="text-sm text-gray-500">Diagnosis</p>
                  <p className="font-medium">{appointment.diagnosis}</p>
                </div>
              )}
              
              {appointment.prescription && (
                <div>
                  <p className="text-sm text-gray-500">Prescription</p>
                  <p className="font-medium">{appointment.prescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {appointment.rating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= appointment.rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Rated {appointment.rating}/5
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="small"
              onClick={() => handleViewDetails(appointment)}
              icon={<FileText size={14} />}
            >
              View Details
            </Button>
            
            {appointment.status === 'completed' && (
              <>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleBookAgain(appointment.doctor)}
                  icon={<Repeat size={14} />}
                >
                  Book Again
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleShareAppointment(appointment)}
                  icon={<Share2 size={14} />}
                >
                  Share
                </Button>
              </>
            )}
            
            {appointment.status === 'upcoming' && (
              <Button
                variant="primary"
                size="small"
                onClick={() => alert(`Join ${appointment.type === 'telemedicine' ? 'video call' : 'appointment'}`)}
                icon={appointment.type === 'telemedicine' ? <Video size={14} /> : <Phone size={14} />}
              >
                {appointment.type === 'telemedicine' ? 'Join Call' : 'Directions'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card className="text-center p-4">
        <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Appointments</div>
      </Card>
      <Card className="text-center p-4">
        <div className="text-3xl font-bold text-blue-600">{stats.upcoming}</div>
        <div className="text-sm text-gray-600">Upcoming</div>
      </Card>
      <Card className="text-center p-4">
        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </Card>
      <Card className="text-center p-4">
        <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
        <div className="text-sm text-gray-600">Cancelled</div>
      </Card>
      <Card className="text-center p-4">
        <div className="text-3xl font-bold text-purple-600">{stats.telemedicine}</div>
        <div className="text-sm text-gray-600">Telemedicine</div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <Card className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading appointment history...</p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${settings.mode === 'elderly' ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-bold mb-2 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
            <Calendar className="inline mr-2 text-primary-600" />
            Appointment History
          </h1>
          <p className="text-gray-600">
            View and manage your past and upcoming medical appointments
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExportHistory}
          >
            Export History
          </Button>
          <Button
            variant="primary"
            icon={<Calendar size={18} />}
            onClick={() => alert('Book new appointment')}
          >
            Book New
          </Button>
        </div>
      </div>

      {/* Stats */}
      {showStats && renderStats()}

      {/* Filters & Search */}
      {showFilters && (
        <Card>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search appointments by doctor, specialty, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  settings.mode === 'elderly' ? 'text-lg' : ''
                }`}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="in-person">In-person</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Frame</label>
                <select
                  value={filters.timeFrame}
                  onChange={(e) => setFilters({...filters, timeFrame: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="past-3-months">Past 3 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="doctor-asc">Doctor (A-Z)</option>
                  <option value="specialty-asc">Specialty (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-bold">{filteredAppointments.length}</span> appointments
        </p>
        {filteredAppointments.length === 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: 'all',
                type: 'all',
                timeFrame: 'all',
                sortBy: 'date-desc'
              });
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Appointments Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'No appointments match your search. Try different keywords or clear filters.'
              : 'You have no appointments in this time period.'}
          </p>
          <Button
            variant="primary"
            onClick={() => alert('Book new appointment')}
          >
            Book Your First Appointment
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(renderAppointmentCard)}
        </div>
      )}

      {/* Health Insights */}
      {filteredAppointments.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <TrendingUp size={20} />
                Health Insights
              </h3>
              <p className="text-blue-700">
                Based on your {stats.completed} completed appointments, you're maintaining good health habits.
                {stats.telemedicine > 0 && ` You've used telemedicine ${stats.telemedicine} times.`}
              </p>
            </div>
            <Button
              variant="primary"
              icon={<BarChart3 size={18} />}
              onClick={() => alert('View detailed health insights')}
            >
              View Health Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryView;