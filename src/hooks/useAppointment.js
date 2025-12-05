// src/hooks/useAppointment.js
import { useState, useCallback, useEffect } from 'react';
import { mockDataService } from '../services/mockDataService';
import { storageService } from '../services/storageService';

export const useAppointment = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load appointments on mount
  useEffect(() => {
    if (userId) {
      loadAppointments();
    }
  }, [userId]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from API first, fallback to storage
      let loadedAppointments = [];
      
      try {
        loadedAppointments = await mockDataService.getUserAppointments(userId);
      } catch (apiError) {
        console.warn('API failed, using localStorage:', apiError);
        loadedAppointments = storageService.getAppointments();
      }
      
      setAppointments(loadedAppointments);
      storageService.saveAppointments(loadedAppointments);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add user ID and timestamps
      const newAppointment = {
        ...appointmentData,
        id: `app_${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Save to API
      const created = await mockDataService.bookAppointment(newAppointment);
      
      // Update local state
      setAppointments(prev => [created, ...prev]);
      setCurrentAppointment(created);
      
      // Save to storage
      storageService.saveAppointments([created, ...appointments]);
      
      return created;
    } catch (err) {
      setError('Failed to create appointment');
      console.error('Error creating appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, appointments]);

  const updateAppointment = useCallback(async (appointmentId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedAppointment = {
        ...updates,
        id: appointmentId,
        updatedAt: new Date().toISOString()
      };

      // Update in state
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, ...updatedAppointment } : app
        )
      );

      // Update current appointment if it's the one being edited
      if (currentAppointment?.id === appointmentId) {
        setCurrentAppointment(prev => ({ ...prev, ...updatedAppointment }));
      }

      // Save to storage
      storageService.saveAppointments(appointments.map(app =>
        app.id === appointmentId ? { ...app, ...updatedAppointment } : app
      ));

      return updatedAppointment;
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments, currentAppointment]);

  const cancelAppointment = useCallback(async (appointmentId, reason = '') => {
    try {
      await mockDataService.cancelAppointment(appointmentId);
      
      const updated = await updateAppointment(appointmentId, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString()
      });
      
      return updated;
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  }, [updateAppointment]);

  const rescheduleAppointment = useCallback(async (appointmentId, newDate, newTimeSlot) => {
    try {
      const result = await mockDataService.rescheduleAppointment(appointmentId, newDate, newTimeSlot);
      
      const updated = await updateAppointment(appointmentId, {
        date: newDate,
        timeSlot: newTimeSlot,
        time: newTimeSlot.split(' - ')[0],
        rescheduledAt: new Date().toISOString()
      });
      
      return updated;
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      throw err;
    }
  }, [updateAppointment]);

  const getAppointmentById = useCallback((appointmentId) => {
    return appointments.find(app => app.id === appointmentId);
  }, [appointments]);

  const getUpcomingAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(app => 
        app.status === 'confirmed' && 
        app.date >= today
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  const getPastAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(app => 
        (app.status === 'completed' || app.date < today) &&
        app.status !== 'cancelled'
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments]);

  const getAppointmentsByStatus = useCallback((status) => {
    return appointments.filter(app => app.status === status);
  }, [appointments]);

  const getAppointmentStats = useCallback(() => {
    const upcoming = getUpcomingAppointments().length;
    const past = getPastAppointments().length;
    const cancelled = getAppointmentsByStatus('cancelled').length;
    
    return {
      total: appointments.length,
      upcoming,
      past,
      cancelled,
      confirmed: getAppointmentsByStatus('confirmed').length,
      pending: getAppointmentsByStatus('pending').length
    };
  }, [appointments, getUpcomingAppointments, getPastAppointments, getAppointmentsByStatus]);

  const setCurrent = useCallback((appointment) => {
    setCurrentAppointment(appointment);
  }, []);

  const clearCurrent = useCallback(() => {
    setCurrentAppointment(null);
  }, []);

  return {
    // State
    appointments,
    currentAppointment,
    loading,
    error,
    
    // Actions
    loadAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    setCurrent,
    clearCurrent,
    
    // Getters
    getAppointmentById,
    getUpcomingAppointments,
    getPastAppointments,
    getAppointmentsByStatus,
    getAppointmentStats
  };
};

export default useAppointment;