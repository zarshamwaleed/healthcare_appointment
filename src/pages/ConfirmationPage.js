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
  ElderlyModal,  // ✅ Use ElderlyModal instead
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
  FileText,
  Stethoscope,
  Building,
  Navigation,
  PhoneCall,
  MessageSquare,
  QrCode
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
  const [countdown, setCountdown] = useState(10); // Countdown for auto-redirect

  // Modal state from provided code
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    // Simulate fetching appointment data
    const loadAppointmentData = async () => {
      setLoading(true);
      
      // Check if we have appointment data in context
      if (user.appointment) {
        setAppointment(user.appointment);
      } else {
        // Generate mock appointment data
        const mockAppointment = generateMockAppointment();
        setAppointment(mockAppointment);
      }
      
      // Start countdown for auto-redirect
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        setLoading(false);
      }, 1500);

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
      doctor: user.selectedDoctor || {
        name: 'Dr. Sarah Johnson',
        specialty: 'General Physician',
        qualification: 'MD, MBBS',
        experience: '15 years'
      },
      location: {
        name: 'City General Hospital',
        address: '123 Medical Center Drive, Healthcare City',
        floor: '3rd Floor',
        room: 'Room 304',
        contact: '+1 (555) 123-4567'
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
      preparationInstructions: [
        'Arrive 15 minutes before appointment',
        'Bring your ID and insurance card',
        'List of current medications',
        'Wear comfortable clothing',
        'Fasting not required'
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
        'Add reminder to your calendar',
        'Complete pre-visit forms if any'
      ]
    };
  };

  const handleConfirmBooking = () => {
    // In a real app, this would make an API call
    console.log('Booking confirmed!');
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleCancelAppointment = () => {
    // Handle cancellation
    clearAppointment();
    setShowCancelModal(false);
    
    // Show cancellation confirmation
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleReschedule = () => {
    setShowRescheduleModal(false);
    navigate('/booking');
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    // Simulate download
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
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(`Appointment with ${appointment.doctor.name} on ${appointment.date} at ${appointment.time}`);
      alert('Appointment details copied to clipboard!');
    }
  };

  const handleSetReminder = () => {
    setShowReminderModal(true);
  };

  const handleConfirmReminder = () => {
    // In a real app, this would set calendar reminders
    console.log(`Reminder set via ${reminderType}`);
    setShowReminderModal(false);
    
    // Show confirmation
    setTimeout(() => {
      alert(`Reminder set successfully via ${reminderType === 'email' ? 'Email' : 'SMS'}!`);
    }, 500);
  };

  const generateQRCode = () => {
    // This would generate a real QR code in production
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      JSON.stringify({
        appointmentId: appointment.id,
        confirmationNumber: appointment.confirmationNumber,
        patientId: appointment.patient.patientId,
        date: appointment.date,
        time: appointment.time
      })
    )}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
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
      <div className="max-w-4xl mx-auto py-12 text-center">
        <AlertCircle size={64} className="text-amber-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">No Appointment Found</h2>
        <p className="text-gray-600 mb-8">
          It seems your appointment details couldn't be loaded. Please try booking again.
        </p>
        <PrimaryButton onClick={() => navigate('/')}>
          Return to Home
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Modal - Shows on first load */}
    <ElderlyModal
  isOpen={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  title="🎉 Appointment Confirmed!"
  buttonText="View Appointment Details"
>
  <div className="text-center">
    <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
    </div>
    <p className="text-gray-700 mb-6">
      Your appointment has been successfully booked. You will receive a confirmation email shortly.
    </p>
  </div>
</ElderlyModal>

      {/* Provided Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Appointment"
        message="Are you sure you want to book this appointment?"
      />

      {/* Provided Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointment={appointment}
        onConfirm={handleConfirmBooking}
        onReschedule={() => {
          setShowAppointmentModal(false);
          navigate('/booking');
        }}
      />

      {/* Cancellation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        type="danger"
        confirmText="Yes, Cancel"
        cancelText="Keep Appointment"
      />

      {/* Reschedule Modal */}
      <ConfirmationModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleReschedule}
        title="Reschedule Appointment"
        message="You will be redirected to the booking page to select a new date and time."
        type="info"
        confirmText="Continue to Reschedule"
        cancelText="Keep Current Time"
      />

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4">
            <div className="text-center">
              <QrCode size={48} className="text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Appointment QR Code</h3>
              <p className="text-gray-600 mb-6">Show this at reception for quick check-in</p>
              
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <img 
                  src={generateQRCode()} 
                  alt="Appointment QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-2">
                Confirmation: {appointment.confirmationNumber}
              </p>
              
              <div className="flex gap-3">
                <OutlineButton 
                  onClick={() => setShowQRModal(false)}
                  className="flex-1"
                >
                  Close
                </OutlineButton>
                <PrimaryButton 
                  onClick={handlePrint}
                  className="flex-1"
                  icon={Printer}
                >
                  Print
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      <ConfirmationModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onConfirm={handleConfirmReminder}
        title="Set Reminder"
        type="info"
        confirmText="Set Reminder"
        cancelText="Maybe Later"
      >
        <div className="space-y-4">
          <p className="text-gray-700">How would you like to receive reminders?</p>
          
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="reminderType"
                value="email"
                checked={reminderType === 'email'}
                onChange={(e) => setReminderType(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium">Email Reminder</p>
                  <p className="text-sm text-gray-500">Receive reminder 24 hours before appointment</p>
                </div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="reminderType"
                value="sms"
                checked={reminderType === 'sms'}
                onChange={(e) => setReminderType(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium">SMS Reminder</p>
                  <p className="text-sm text-gray-500">Get text message 2 hours before appointment</p>
                </div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="reminderType"
                value="both"
                checked={reminderType === 'both'}
                onChange={(e) => setReminderType(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-gray-600" />
                <div>
                  <p className="font-medium">Both Email & SMS</p>
                  <p className="text-sm text-gray-500">Receive both email and text reminders</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </ConfirmationModal>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/booking')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft size={20} />
            Back to Booking
          </button>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Auto-redirect in</p>
            <p className="text-xl font-bold text-primary-600">{countdown}s</p>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className={`font-bold mb-3 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
            Appointment Confirmed!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your appointment has been successfully scheduled. Save or print this confirmation for your records.
          </p>
        </div>
      </div>

     <div className="lg:col-span-2 space-y-8">
  <AppointmentSummary 
    appointment={appointment}
    variant="detailed"
    onAction={(action) => {
      if (action === 'print') handlePrint();
      if (action === 'share') handleShare();
    }}
  />
  
<Instructions 
  appointmentType={appointment.type}       // instead of getAppointmentType()
  specialInstructions={appointment.specialInstructions || []} // instead of getSpecialInstructions()
  onPrint={handlePrint}
  onDownload={handleDownload}
/>

</div>

<div className="space-y-8">
  <MapView 
    location={appointment.location}
    variant="compact"
    height="300px"
  />
</div>


      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-gray-600">
              Having trouble?{' '}
              <button className="text-primary-600 hover:text-primary-800 font-medium">
                Download our mobile app
              </button>{' '}
              for easier access.
            </p>
          </div>
          
          <div className="flex gap-3">
            <SecondaryButton 
              onClick={() => navigate('/')}
              icon={Home}
            >
              Back to Home
            </SecondaryButton>
            
            <PrimaryButton 
              onClick={() => setShowConfirmModal(true)}
            >
              Confirm Another Booking
            </PrimaryButton>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            This confirmation is valid for the scheduled appointment only. 
            Please arrive 15 minutes early. Cancellation policy: {appointment.cancellationPolicy}.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            SmartHealth Care System © {new Date().getFullYear()} • HCI Project
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            font-size: 12pt;
          }
          
          .print-content {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPage;