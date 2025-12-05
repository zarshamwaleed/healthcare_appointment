import React, { useState } from 'react';
import CalendarView from '../components/appointment-booking/CalendarView';
import TimeSlots from '../components/appointment-booking/TimeSlots';
import PriorityIndicator from '../components/appointment-booking/PriorityIndicator';
import UrgencyHandler from '../components/appointment-booking/UrgencyHandler';
import { useUser } from '../context/UserContext';
import { ConfirmationModal } from '../components/common/Modal';
import PrimaryButton from '../components/common/Button';
import { DoctorCard } from '../components/common/Card'; // Import DoctorCard

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user } = useUser();

  // Example doctor data; replace with API or context data as needed
  const doctors = [
    { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology', rating: 4.5 },
    { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurology', rating: 4.7 },
    { id: 3, name: 'Dr. Sam Brown', specialty: 'Pediatrics', rating: 4.3 },
  ];

  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleConfirmBooking = () => {
    console.log('Appointment confirmed:', selectedDate, selectedTime, selectedDoctor);
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Doctor Selection Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Available Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              rating={doctor.rating}
              onSelect={() => selectDoctor(doctor)}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar & Time Selection */}
        <div className="lg:col-span-2 space-y-8">
          <UrgencyHandler symptoms={user.symptoms} />
          <CalendarView 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <TimeSlots 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />
        </div>

        {/* Right Column: Priority & Summary */}
        <div className="space-y-8">
          <PriorityIndicator 
            urgencyLevel="high"
            userType="elderly"
            symptoms={user.symptoms}
          />

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Appointment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{selectedTime || 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-semibold">{selectedDoctor ? selectedDoctor.name : 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">High Priority</span>
              </div>
              <PrimaryButton
                className="w-full mt-6"
                onClick={() => setShowConfirmModal(true)}
              >
                Confirm Appointment
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Appointment"
        message="Are you sure you want to book this appointment?"
      />
    </div>
  );
};

export default AppointmentBookingPage;
