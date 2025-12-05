// src/context/AppointmentContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { dateTimeUtils } from '../utils/dateTimeUtils';

const defaultAppointment = {
  id: null,
  userId: null,
  symptoms: [],
  bodyLocations: [],
  severity: 'medium', // low, medium, high, emergency
  description: '',
  doctorId: null,
  doctorName: '',
  department: '',
  date: '',
  time: '',
  timeSlot: '',
  duration: 30, // minutes
  priority: 'normal', // normal, urgent, emergency
  status: 'pending', // pending, confirmed, completed, cancelled
  location: '',
  roomNumber: '',
  notes: '',
  reminderSent: false,
  followUpRequired: false,
  createdAt: null,
  updatedAt: null
};

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [currentAppointment, setCurrentAppointment] = useState(defaultAppointment);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Load appointments from storage
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const savedAppointments = await storageService.get('appointments') || [];
        setAppointments(savedAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, []);

  // Save appointments to storage
  useEffect(() => {
    if (appointments.length > 0) {
      storageService.set('appointments', appointments);
    }
  }, [appointments]);

  // Initialize new appointment
  const startNewAppointment = (userId) => {
    const newAppointment = {
      ...defaultAppointment,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString()
    };
    setCurrentAppointment(newAppointment);
    return newAppointment;
  };

  // Update current appointment
  const updateAppointment = (updates) => {
    setCurrentAppointment(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  // Add symptoms to appointment
  const addSymptoms = (symptoms, bodyLocations = []) => {
    setCurrentAppointment(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, ...symptoms],
      bodyLocations: [...prev.bodyLocations, ...bodyLocations]
    }));
  };

  // Set doctor selection
  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentAppointment(prev => ({
      ...prev,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      location: doctor.location
    }));
  };

  // Set date and time
  const selectDateTime = (date, timeSlot) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setCurrentAppointment(prev => ({
      ...prev,
      date,
      timeSlot,
      time: timeSlot.split(' - ')[0]
    }));
  };

  // Calculate priority based on symptoms and severity
  const calculatePriority = (symptoms, severity) => {
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious'];
    const urgentSymptoms = ['high fever', 'severe pain', 'head injury'];
    
    if (emergencySymptoms.some(s => symptoms.includes(s))) {
      return 'emergency';
    } else if (urgentSymptoms.some(s => symptoms.includes(s)) || severity === 'high') {
      return 'urgent';
    } else if (severity === 'medium') {
      return 'normal';
    } else {
      return 'low';
    }
  };

  // Submit appointment
  const submitAppointment = () => {
    const priority = calculatePriority(currentAppointment.symptoms, currentAppointment.severity);
    
    const finalAppointment = {
      ...currentAppointment,
      priority,
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    };

    // Add to appointments list
    setAppointments(prev => [finalAppointment, ...prev]);
    
    // Reset current appointment
    setCurrentAppointment(defaultAppointment);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTimeSlot('');

    return finalAppointment;
  };

  // Cancel appointment
  const cancelAppointment = (appointmentId) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelled', updatedAt: new Date().toISOString() }
          : appointment
      )
    );
  };

  // Reschedule appointment
  const rescheduleAppointment = (appointmentId, newDate, newTimeSlot) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              date: newDate,
              timeSlot: newTimeSlot,
              time: newTimeSlot.split(' - ')[0],
              updatedAt: new Date().toISOString()
            }
          : appointment
      )
    );
  };

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(app =>
      app.status === 'confirmed' && 
      app.date >= today
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get past appointments
  const getPastAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(app =>
      (app.status === 'completed' || app.date < today) &&
      app.status !== 'cancelled'
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Get appointment by ID
  const getAppointmentById = (id) => {
    return appointments.find(app => app.id === id);
  };

  // Get appointments by status
  const getAppointmentsByStatus = (status) => {
    return appointments.filter(app => app.status === status);
  };

  // Get appointments count by status
  const getAppointmentStats = () => {
    const stats = {
      total: appointments.length,
      upcoming: getUpcomingAppointments().length,
      completed: getAppointmentsByStatus('completed').length,
      cancelled: getAppointmentsByStatus('cancelled').length,
      pending: getAppointmentsByStatus('pending').length
    };
    return stats;
  };

  // Check if date is available for doctor
  const isDateAvailable = (doctorId, date) => {
    // In a real app, this would check doctor's schedule
    // For now, we'll simulate by checking existing appointments
    const existingAppointments = appointments.filter(
      app => app.doctorId === doctorId && 
      app.date === date && 
      app.status !== 'cancelled'
    );
    
    // Assume doctor can handle max 8 appointments per day
    return existingAppointments.length < 8;
  };

  // Get available time slots for a doctor on a specific date
  const getAvailableTimeSlots = (doctorId, date) => {
    const doctorAppointments = appointments.filter(
      app => app.doctorId === doctorId && 
      app.date === date && 
      app.status !== 'cancelled'
    );
    
    const bookedSlots = doctorAppointments.map(app => app.timeSlot);
    
    // Generate time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = dateTimeUtils.generateTimeSlots('09:00', '17:00', 30);
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const value = {
    currentAppointment,
    appointments,
    isLoading,
    selectedDoctor,
    selectedDate,
    selectedTimeSlot,
    startNewAppointment,
    updateAppointment,
    addSymptoms,
    selectDoctor,
    selectDateTime,
    submitAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentById,
    getAppointmentsByStatus,
    getAppointmentStats,
    isDateAvailable,
    getAvailableTimeSlots
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContext;