import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarView from '../components/appointment-booking/CalendarView';
import TimeSlots from '../components/appointment-booking/TimeSlots';
import { useUser } from '../context/UserContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { ConfirmationModal } from '../components/common/Modal';
import PrimaryButton from '../components/common/Button';
import { DoctorCard } from '../components/common/Card';
import { Calendar, Clock, AlertCircle, ChevronRight, User, Shield, Clock as ClockIcon, X } from 'lucide-react';

const AppointmentBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { settings } = useAccessibility();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [priority, setPriority] = useState('normal');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (user?.selectedDoctor) {
      setSelectedDoctor(user.selectedDoctor);
    }
  }, [user]);

  const canConfirm = selectedDate && selectedTime && selectedDoctor;

  const handleConfirmBooking = () => {
    setShowConfirmModal(false);
    navigate('/confirmation', {
      state: { 
        doctor: selectedDoctor, 
        date: selectedDate, 
        time: selectedTime, 
        priority 
      }
    });
  };

  const steps = [
    { id: 1, title: 'Select Doctor', icon: <User size={18} /> },
    { id: 2, title: 'Pick Date & Time', icon: <Calendar size={18} /> },
    { id: 3, title: 'Confirm Details', icon: <Shield size={18} /> },
  ];

  const getPriorityColor = (level) => {
    switch(level) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'priority': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with progress steps */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${settings?.visuallyImpaired ? 'text-4xl' : ''} text-gray-900 dark:text-white mb-2`}>
                Book Your Appointment
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Select your preferred doctor, date, and time
              </p>
            </div>
            
            {selectedDoctor && (
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
                Start Over
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${currentStep >= step.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {step.icon}
                    </div>
                    <span className={`
                      text-sm font-medium transition-colors
                      ${currentStep >= step.id 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2 relative">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ${
                          currentStep > step.id ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!selectedDoctor ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center shadow-xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <AlertCircle className="text-blue-600 dark:text-blue-400" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Select a Healthcare Professional
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Choose from our network of certified doctors and specialists to begin your appointment booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PrimaryButton 
                  onClick={() => navigate('/doctors')}
                  className="px-8 py-3 text-lg"
                >
                  Browse Doctors
                </PrimaryButton>
                <button
                  onClick={() => navigate('/doctors?specialty=general')}
                  className="px-6 py-3 rounded-lg border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  View General Physicians
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Steps */}
            <div className="lg:col-span-2 space-y-8">
              {/* Doctor Info Card */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Selected Professional
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      You can change your selection anytime
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-2"
                  >
                    Change Doctor
                    <ChevronRight size={16} />
                  </button>
                </div>
                <DoctorCard
                  name={selectedDoctor.name}
                  specialty={selectedDoctor.specialization || selectedDoctor.specialty || ''}
                  rating={selectedDoctor.rating || 0}
                  showAction={false}
                />
              </div>

              {/* Date Selection */}
              <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Date</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose your preferred appointment date
                    </p>
                  </div>
                </div>
                <CalendarView 
                  selectedDate={selectedDate} 
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                    setCurrentStep(2);
                  }} 
                />
              </section>

              {/* Time Selection */}
              {selectedDate && (
                <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <ClockIcon className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Time Slot</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Available times for {selectedDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <TimeSlots
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={(time) => {
                      setSelectedTime(time);
                      setCurrentStep(3);
                    }}
                  />
                </section>
              )}
            </div>

            {/* Right Column - Summary */}
            <aside className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg sticky top-6">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-700">
                  Appointment Summary
                </h3>

                {/* Appointment Details */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Appointment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : (
                            <span className="text-gray-400 dark:text-gray-500">Not selected</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {selectedTime || (
                            <span className="text-gray-400 dark:text-gray-500">Not selected</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Selection */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Priority Level
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['normal', 'priority', 'urgent'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setPriority(level)}
                          className={`
                            py-2 px-3 rounded-lg text-sm font-medium transition-all
                            ${priority === level 
                              ? `${getPriorityColor(level)} border-2 border-current` 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                          `}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estimated Duration */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-600 dark:text-blue-400" size={18} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Estimated Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        30-45 minutes consultation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <PrimaryButton
                    disabled={!canConfirm}
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full py-3 text-lg font-semibold"
                  >
                    Confirm Appointment
                  </PrimaryButton>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="w-full py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Choose Different Doctor
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Contact our support team for assistance with booking.
                </p>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                  Contact Support →
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
          title="Confirm Your Appointment"
          message={
            <div className="text-left">
              <p className="mb-4">Please review your appointment details:</p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                  <span className="font-medium">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(priority)}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          }
          confirmText="Book Appointment"
          cancelText="Review Details"
        />
      </div>
    </div>
  );
};

export default AppointmentBookingPage;