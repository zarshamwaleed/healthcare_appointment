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
  Video,
  ChevronDown,
  MoreVertical,
  Printer,
  Eye,
  MessageCircle,
  Navigation,
  Pill
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
  
  // Handler for document download
  const handleDownloadDocument = (docName) => {
    alert(`Downloading document: ${docName}`);
    const link = document.createElement('a');
    const blob = new Blob(['Document content: ' + docName], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = `${docName}_${new Date().getTime()}.txt`;
    link.click();
  };
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
  const [expandedCard, setExpandedCard] = useState(null);

  // Mock data - in real app, this would come from API
  const mockAppointments = [
    {
      id: 'apt-001',
      doctor: {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        avatar: 'SJ',
        hospital: 'City General Hospital',
        rating: 4.8
      },
      date: '2024-01-15',
      time: '10:30 AM',
      duration: '30 mins',
      type: 'in-person',
      status: 'completed',
      location: 'City General Hospital',
      room: 'Room 304',
      symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
      diagnosis: 'Hypertension',
      prescription: 'Amlodipine 5mg, once daily',
      followUp: '2024-02-15',
      followUpReason: 'Blood pressure monitoring',
      rating: 5,
      notes: 'Regular checkup, blood pressure under control. Recommended lifestyle changes including reduced salt intake and regular exercise.',
      documents: ['blood_report.pdf', 'ecg_result.pdf'],
      cost: '$120',
      insurance: 'Covered 80%',
      waitTime: '5 mins'
    },
    {
      id: 'apt-002',
      doctor: {
        name: 'Dr. Michael Chen',
        specialty: 'General Physician',
        avatar: 'MC',
        hospital: 'MediCare Center',
        rating: 4.6
      },
      date: '2024-01-10',
      time: '2:00 PM',
      duration: '45 mins',
      type: 'telemedicine',
      status: 'completed',
      location: 'Virtual Consultation',
      room: 'Video Call',
      symptoms: ['Fever', 'Cough', 'Fatigue', 'Headache'],
      diagnosis: 'Viral Infection',
      prescription: 'Paracetamol 500mg, Vitamin C tablets',
      followUp: null,
      followUpReason: null,
      rating: 4,
      notes: 'Patient presented with flu-like symptoms. Recommended rest, fluids, and isolation for 48 hours.',
      documents: ['lab_report.pdf', 'prescription.pdf'],
      cost: '$75',
      insurance: 'Covered 90%',
      waitTime: 'On time'
    },
    {
      id: 'apt-003',
      doctor: {
        name: 'Dr. Priya Sharma',
        specialty: 'Dermatology',
        avatar: 'PS',
        hospital: 'Skin Care Clinic',
        rating: 4.9
      },
      date: '2024-01-20',
      time: '11:15 AM',
      duration: '20 mins',
      type: 'in-person',
      status: 'upcoming',
      location: 'Skin Care Clinic',
      room: 'Room 102',
      symptoms: ['Skin rash', 'Itching', 'Redness'],
      diagnosis: null,
      prescription: null,
      followUp: null,
      followUpReason: null,
      rating: null,
      notes: 'Follow-up for previous treatment evaluation',
      documents: [],
      cost: '$95',
      insurance: 'Covered 70%',
      waitTime: 'Scheduled'
    },
    {
      id: 'apt-004',
      doctor: {
        name: 'Dr. Robert Williams',
        specialty: 'Orthopedics',
        avatar: 'RW',
        hospital: 'Bone & Joint Center',
        rating: 4.7
      },
      date: '2023-12-05',
      time: '3:30 PM',
      duration: '60 mins',
      type: 'in-person',
      status: 'cancelled',
      location: 'Bone & Joint Center',
      room: 'Room 205',
      symptoms: ['Back pain', 'Stiffness'],
      diagnosis: null,
      prescription: null,
      followUp: null,
      followUpReason: null,
      rating: null,
      notes: 'Rescheduled due to emergency. New appointment booked for Dec 12.',
      documents: ['xray_referral.pdf'],
      cost: '$150',
      insurance: 'Covered 85%',
      waitTime: 'N/A'
    },
    {
      id: 'apt-005',
      doctor: {
        name: 'Dr. Lisa Brown',
        specialty: 'Pediatrics',
        avatar: 'LB',
        hospital: 'Childrens Health Center',
        rating: 4.9
      },
      date: '2023-11-20',
      time: '9:00 AM',
      duration: '30 mins',
      type: 'telemedicine',
      status: 'completed',
      location: 'Virtual Consultation',
      room: 'Video Call',
      symptoms: ['Child fever', 'Cold', 'Loss of appetite'],
      diagnosis: 'Common Cold',
      prescription: 'Childrens Tylenol, Saline nasal drops',
      followUp: null,
      followUpReason: null,
      rating: 5,
      notes: 'Child recovering well. Temperature normal after 48 hours.',
      documents: ['growth_chart.pdf'],
      cost: '$65',
      insurance: 'Covered 95%',
      waitTime: '2 mins'
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
      case 'completed': 
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'upcoming': 
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'rescheduled': 
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default: 
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
    return type === 'telemedicine' ? 
      <Video size={16} className="text-purple-600 dark:text-purple-400" /> : 
      <User size={16} className="text-blue-600 dark:text-blue-400" />;
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

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleExportHistory = () => {
    alert('Export feature would generate a PDF/CSV of your medical history');
  };

  const handleShareAppointment = (appointment) => {
    alert(`Share appointment with Dr. ${appointment.doctor.name}`);
  };

  const handleBookAgain = (doctor) => {
    alert(`Book new appointment with Dr. ${doctor.name}`);
  };

  const handleViewDetails = (appointment) => {
    alert(`View detailed records for appointment ${appointment.id}`);
  };

  const renderAppointmentCard = (appointment) => {
    const isExpanded = expandedCard === appointment.id;
    
    return (
      <Card 
        key={appointment.id} 
        className={`transition-all duration-300 hover:shadow-lg dark:hover:shadow-slate-900 ${
          isExpanded ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
        }`}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center">
                <div className="text-primary-800 dark:text-primary-300 font-bold text-lg">
                  {appointment.doctor.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {appointment.doctor.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {appointment.doctor.specialty} • {appointment.doctor.hospital}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700">
                    {getTypeIcon(appointment.type)}
                    {appointment.type === 'telemedicine' ? 'Telemedicine' : 'In-person'}
                  </span>
                  {appointment.doctor.rating && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-full text-sm">
                      <Star size={12} className="fill-amber-500 dark:fill-amber-400 text-amber-500" />
                      {appointment.doctor.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {appointment.time}
              </div>
              <div className="text-gray-900 dark:text-white font-medium">
                {formatDate(appointment.date)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {appointment.duration} • {appointment.room}
              </div>
              <button
                onClick={() => toggleCardExpansion(appointment.id)}
                className="mt-2 p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
              >
                <ChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={18} />
              </button>
            </div>
          </div>

          {/* Quick Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Wait Time</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.waitTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cost</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.cost}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill size={16} className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Insurance</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.insurance}</p>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-fadeIn">
              {/* Symptoms & Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Symptoms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {appointment.symptoms.map((symptom, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-lg border border-blue-100 dark:border-blue-800"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
                
                {appointment.diagnosis && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Diagnosis</h4>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg border border-green-100 dark:border-green-800">
                      {appointment.diagnosis}
                    </div>
                  </div>
                )}
              </div>

              {/* Prescription & Notes */}
              {(appointment.prescription || appointment.notes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointment.prescription && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Prescription</h4>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-lg border border-purple-100 dark:border-purple-800">
                        {appointment.prescription}
                      </div>
                    </div>
                  )}
                  {appointment.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Doctor's Notes</h4>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700">
                        {appointment.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Documents */}
              {appointment.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {appointment.documents.map((doc, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <FileText size={14} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                        <button onClick={() => handleDownloadDocument(doc)} className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow Up */}
              {appointment.followUp && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Follow-up Scheduled</h4>
                  <p className="text-amber-700 dark:text-amber-400">
                    Next appointment: {formatDate(appointment.followUp)}
                    {appointment.followUpReason && ` • ${appointment.followUpReason}`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleViewDetails(appointment)}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Eye size={14} />
              View Details
            </button>
            
            {appointment.status === 'completed' && (
              <>
                <button
                  onClick={() => handleBookAgain(appointment.doctor)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Repeat size={14} />
                  Book Again
                </button>
                <button
                  onClick={() => handleShareAppointment(appointment)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </>
            )}
            
            {appointment.status === 'upcoming' && (
              <button
                onClick={() => alert(`Join ${appointment.type === 'telemedicine' ? 'video call' : 'appointment'}`)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                {appointment.type === 'telemedicine' ? (
                  <>
                    <Video size={14} />
                    Join Call
                  </>
                ) : (
                  <>
                    <Navigation size={14} />
                    Directions
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={() => alert('Contact doctor')}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={14} />
              Contact
            </button>
          </div>
        </div>
      </Card>
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {[
        { label: 'Total Appointments', value: stats.total, color: 'from-primary-500 to-blue-500', icon: Calendar },
        { label: 'Upcoming', value: stats.upcoming, color: 'from-blue-500 to-cyan-500', icon: Clock },
        { label: 'Completed', value: stats.completed, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
        { label: 'Cancelled', value: stats.cancelled, color: 'from-red-500 to-pink-500', icon: XCircle },
        { label: 'Telemedicine', value: stats.telemedicine, color: 'from-purple-500 to-violet-500', icon: Video }
      ].map((stat, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <Stethoscope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400" size={24} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Loading your medical history...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${settings.mode === 'elderly' ? 'p-4' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-bold mb-2 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
            <Calendar className="inline mr-3 text-primary-600 dark:text-primary-400" size={28} />
            Medical History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your past and upcoming medical appointments
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleExportHistory}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => alert('Book new appointment')}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Calendar size={18} />
            Book New
          </button>
        </div>
      </div>

      {/* Stats */}
      {showStats && renderStats()}

      {/* Filters & Search */}
      {showFilters && (
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search appointments by doctor, specialty, symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  settings.mode === 'elderly' ? 'text-lg py-4' : ''
                }`}
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Status',
                  value: filters.status,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' }
                  ],
                  onChange: (value) => setFilters({...filters, status: value})
                },
                {
                  label: 'Type',
                  value: filters.type,
                  options: [
                    { value: 'all', label: 'All Types' },
                    { value: 'in-person', label: 'In-person' },
                    { value: 'telemedicine', label: 'Telemedicine' }
                  ],
                  onChange: (value) => setFilters({...filters, type: value})
                },
                {
                  label: 'Time Frame',
                  value: filters.timeFrame,
                  options: [
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'this-week', label: 'This Week' },
                    { value: 'this-month', label: 'This Month' },
                    { value: 'past-3-months', label: 'Past 3 Months' }
                  ],
                  onChange: (value) => setFilters({...filters, timeFrame: value})
                },
                {
                  label: 'Sort By',
                  value: filters.sortBy,
                  options: [
                    { value: 'date-desc', label: 'Date (Newest)' },
                    { value: 'date-asc', label: 'Date (Oldest)' },
                    { value: 'doctor-asc', label: 'Doctor (A-Z)' },
                    { value: 'specialty-asc', label: 'Specialty (A-Z)' }
                  ],
                  onChange: (value) => setFilters({...filters, sortBy: value})
                }
              ].map((filter, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    {filter.label}
                  </label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  >
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-lg">
            <span className="font-bold">{filteredAppointments.length}</span> appointments
          </div>
          {searchTerm && (
            <p className="text-gray-600 dark:text-gray-300">
              Search results for: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )}
        </div>
        
        {filteredAppointments.length === 0 && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                status: 'all',
                type: 'all',
                timeFrame: 'all',
                sortBy: 'date-desc'
              });
            }}
            className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-slate-700">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? 'No appointments match your search. Try different keywords or clear filters.'
              : 'You have no appointments in this time period. Book your first appointment today!'}
          </p>
          <button
            onClick={() => alert('Book new appointment')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Calendar size={18} />
            Book Your First Appointment
          </button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(renderAppointmentCard)}
        </div>
      )}

      {/* Health Insights */}
      {filteredAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-primary-800 dark:text-primary-300 mb-2">
                  Health Insights
                </h3>
                <p className="text-primary-700 dark:text-primary-400">
                  Based on your {stats.completed} completed appointments, you're maintaining good health habits.
                  {stats.telemedicine > 0 && ` You've used telemedicine ${stats.telemedicine} times this year.`}
                </p>
              </div>
            </div>
  
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;