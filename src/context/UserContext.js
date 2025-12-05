import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    age: null,
    digitalLiteracy: 'medium', // 'low', 'medium', 'high'
    preferredLanguage: 'en',
    healthConditions: [],
    deviceType: 'phone', // 'phone', 'tablet', 'kiosk'
    symptoms: [],
    selectedDoctor: null,
    appointment: null,
  });

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addSymptoms = (symptoms) => {
    setUser(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, ...symptoms]
    }));
  };

  const setAppointment = (appointmentData) => {
    setUser(prev => ({
      ...prev,
      appointment: appointmentData
    }));
  };

  const clearAppointment = () => {
    setUser(prev => ({
      ...prev,
      symptoms: [],
      selectedDoctor: null,
      appointment: null
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addSymptoms,
      setAppointment,
      clearAppointment
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};