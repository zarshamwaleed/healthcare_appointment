import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useUser } from '../context/UserContext';
import AppointmentSummary from '../components/confirmation/AppointmentSummary'; 
import Instructions from '../components/confirmation/Instructions';
import MapView from '../components/confirmation/MapView';
import { 
  Card,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  DangerButton,
  ConfirmationModal,
  ElderlyModal,
  AppointmentModal
} from '../components/common';
import Loader from '../components/common/Loader';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Printer, 
  Download,
  Share2,
  ArrowLeft,
  Home,
  Bell,
  Shield,
  Heart,
  AlertCircle,
  ChevronRight,
  Wifi,
  ParkingCircle,
  FileText,
  Stethoscope,
  Building,
  Navigation,
  PhoneCall,
  MessageSquare,
  QrCode,
  Sparkles,
  ClipboardCheck,
  CalendarDays,
  Smartphone,
  ChevronLeft,
  ExternalLink,
  Copy,
  ThumbsUp
} from 'lucide-react';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useAccessibility();
  const { user, clearAppointment } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderType, setReminderType] = useState('email');
  const [isPrinting, setIsPrinting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isDark = settings.mode === 'dark';

  useEffect(() => {
    const loadAppointmentData = async () => {
      setLoading(true);
      
      if (user.appointment) {
        setAppointment(user.appointment);
      } else {
        const mockAppointment = generateMockAppointment();
        setAppointment(mockAppointment);
      }
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        setLoading(false);
      }, 1200);

      return () => clearInterval(countdownInterval);
    };

    loadAppointmentData();
  }, [user.appointment]);

  const generateMockAppointment = () => {
    const now = new Date();
    const appointmentDate = new Date(now);
    appointmentDate.setDate(appointmentDate.getDate() + 2);
    
    return {
      id: `APT-${Date.now().toString().slice(-8)}`,
      date: appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: '10:30 AM',
      type: 'general',
      doctor: user.selectedDoctor || {
        name: 'Dr. Sarah Johnson',
        specialty: 'General Physician',
        qualification: 'MD, MBBS',
        experience: '15 years',
        rating: 4.8
      },
      location: {
        name: 'City General Hospital',
        address: '123 Medical Center Drive, Healthcare City',
        floor: '3rd Floor',
        room: 'Room 304',
        contact: '+1 (555) 123-4567',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      patient: {
        name: user.name || 'John Doe',
        age: user.age || 45,
        phone: '+1 (555) 987-6543',
        email: 'john.doe@example.com',
        patientId: `PID-${Date.now().toString().slice(-6)}`
      },
      symptoms: user.symptoms || ['Headache', 'Fever'],
      priority: 'Normal',
      status: 'Confirmed',
      confirmationNumber: `CNF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      estimatedDuration: '30 minutes',
      specialInstructions: [
        'Fasting not required',
        'Bring previous medical reports'
      ],
      preparationInstructions: [
        'Arrive 15 minutes before appointment',
        'Bring your ID and insurance card',
        'List of current medications',
        'Wear comfortable clothing'
      ],
      cancellationPolicy: 'Free cancellation up to 24 hours before appointment',
      fee: {
        consultation: 450,
        tax: 45,
        total: 495
      },
      paymentStatus: 'Paid',
      nextSteps: [
        'Check your email for confirmation',
        'Save this confirmation number',
        'Add reminder to your calendar'
      ]
    };
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    const data = JSON.stringify(appointment, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.confirmationNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Healthcare Appointment',
          text: `Appointment with ${appointment.doctor.name} on ${appointment.date} at ${appointment.time}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`Appointment with ${appointment.doctor.name} on ${appointment.date} at ${appointment.time}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyConfirmation = () => {
    navigator.clipboard.writeText(appointment.confirmationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Loader 
          type="healthcare" 
          size="large" 
          text="Finalizing your appointment details..." 
        />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md mx-4 text-center">
          <AlertCircle size={64} className="text-amber-500 dark:text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No Appointment Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            It seems your appointment details couldn't be loaded. Please try booking again.
          </p>
          <PrimaryButton onClick={() => navigate('/')}>
            Return to Home
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Success Modal */}
      <ElderlyModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="🎉 Appointment Confirmed!"
        buttonText="View Appointment Details"
      >
        <div className="text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-emerald-400 mx-auto" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Your appointment has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ClipboardCheck size={16} />
            <span>Confirmation Number: {appointment.confirmationNumber}</span>
          </div>
        </div>
      </ElderlyModal>

      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Confirmation Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl mb-6">
            <CheckCircle size={56} className="text-green-600 dark:text-emerald-400" />
          </div>
          <h1 className={`font-bold mb-4 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'} text-gray-900 dark:text-white`}>
            Appointment Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Your appointment has been successfully scheduled. Save or print this confirmation for your records.
          </p>
          
          {/* Confirmation Number */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 mb-6">
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">Confirmation Number</p>
              <p className="font-mono font-bold text-xl text-gray-900 dark:text-white">
                {appointment.confirmationNumber}
              </p>
            </div>
            <button
              onClick={handleCopyConfirmation}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Copy confirmation number"
            >
              {copied ? (
                <CheckCircle size={18} className="text-green-600 dark:text-emerald-400" />
              ) : (
                <Copy size={18} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
{/* Quick Info Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
        <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
        <p className="font-bold text-gray-900 dark:text-white">{appointment.date}</p>
      </div>
    </div>
  </div>
  
  <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
        <Clock size={20} className="text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
        <p className="font-bold text-gray-900 dark:text-white">{appointment.time}</p>
      </div>
    </div>
  </div>
  
  <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
        <Stethoscope size={20} className="text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
        <p className="font-bold text-gray-900 dark:text-white">{appointment.doctor.name}</p>
      </div>
    </div>
  </div>
  
  <div className="p-5 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
        <MapPin size={20} className="text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
        <p className="font-bold text-gray-900 dark:text-white">{appointment.location.name}</p>
      </div>
    </div>
  </div>
</div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl transition-all hover:shadow-md text-gray-700 dark:text-gray-100"
          >
            <Printer size={18} />
            <span>Print</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl transition-all hover:shadow-md text-gray-700 dark:text-gray-100"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl transition-all hover:shadow-md text-gray-700 dark:text-gray-100"
          >
            <Share2 size={18} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
          
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-xl transition-all hover:shadow-md text-gray-700 dark:text-gray-100"
          >
            <QrCode size={18} />
            <span>QR Code</span>
          </button>
          
          <button
            onClick={() => setShowReminderModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Bell size={18} />
            <span>Set Reminder</span>
          </button>
        </div>

        {/* Content Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'overview'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <FileText size={18} className="inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'instructions'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <ClipboardCheck size={18} className="inline mr-2" />
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'location'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              <MapPin size={18} className="inline mr-2" />
              Location
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <AppointmentSummary 
                  appointment={appointment}
                  variant="detailed"
                  onAction={(action) => {
                    if (action === 'print') handlePrint();
                    if (action === 'share') handleShare();
                  }}
                />
              </div>
            )}
            
            {activeTab === 'instructions' && (
              <div className="animate-fade-in">
                <Instructions 
                  appointmentType={appointment.type}
                  specialInstructions={appointment.specialInstructions || []}
                  onPrint={handlePrint}
                  onDownload={handleDownload}
                />
              </div>
            )}
            
            {activeTab === 'location' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <MapView 
                        location={appointment.location}
                        variant="detailed"
                        height="400px"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Location Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Hospital</p>
                          <p className="font-medium text-gray-900 dark:text-white">{appointment.location.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                          <p className="text-gray-700 dark:text-gray-300">{appointment.location.address}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Floor & Room</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {appointment.location.floor} • {appointment.location.room}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.location.contact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Facilities</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Navigation size={16} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Wheelchair Accessible</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <ParkingCircle size={16} className="text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Free Parking</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <Wifi size={16} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">Free Wi-Fi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Need Assistance?</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is available 24/7 to help with any questions.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-5 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
            >
              Reschedule
            </button>
            
            <button
              onClick={() => navigate('/booking')}
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
            >
              Book Another
            </button>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            This confirmation is valid for the scheduled appointment only. 
            Please arrive 15 minutes early. Cancellation policy: {appointment.cancellationPolicy}.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            SmartHealth Care System © {new Date().getFullYear()} • HCI Project
          </p>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`rounded-2xl p-8 max-w-sm w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900/40 rounded-full mb-4">
                <QrCode size={32} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Appointment QR Code</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Show this at reception for quick check-in</p>
              
              <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl mb-6">
                <div className="w-48 h-48 mx-auto bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <QrCode size={120} className="text-gray-400 dark:text-gray-600" />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Confirmation: {appointment.confirmationNumber}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer size={16} />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      <ConfirmationModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onConfirm={() => {
          console.log(`Reminder set via ${reminderType}`);
          setShowReminderModal(false);
          setTimeout(() => {
            alert(`Reminder set successfully via ${reminderType === 'email' ? 'Email' : 'SMS'}!`);
          }, 500);
        }}
        title="Set Reminder"
        type="info"
        confirmText="Set Reminder"
        cancelText="Maybe Later"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">How would you like to receive reminders?</p>
          <div className="space-y-2">
            {['email', 'sms', 'both'].map((type) => (
              <label key={type} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="reminderType"
                  value={type}
                  checked={reminderType === type}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="text-primary-600"
                />
                <div className="flex items-center gap-2">
                  {type === 'email' && <Mail size={20} className="text-gray-600 dark:text-gray-400" />}
                  {type === 'sms' && <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />}
                  {type === 'both' && <Bell size={20} className="text-gray-600 dark:text-gray-400" />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-300">
                      {type === 'email' && 'Email Reminder'}
                      {type === 'sms' && 'SMS Reminder'}
                      {type === 'both' && 'Both Email & SMS'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {type === 'email' && 'Receive reminder 24 hours before appointment'}
                      {type === 'sms' && 'Get text message 2 hours before appointment'}
                      {type === 'both' && 'Receive both email and text reminders'}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default ConfirmationPage;