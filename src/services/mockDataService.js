// src/services/mockDataService.js

/**
 * Mock Data Service for Smart Health Appointment System
 * Provides simulated data for development and testing
 */

// Mock Doctors Data
export const mockDoctors = [
  {
    id: 'doc_001',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    qualification: 'MD, Cardiology',
    experience: 15,
    rating: 4.8,
    reviews: 124,
    consultationFee: 150,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTime: '09:00 AM - 05:00 PM',
    languages: ['English', 'Spanish'],
    location: 'Main Hospital - Floor 3',
    phone: '+1 (555) 123-4567',
    email: 's.johnson@hospital.com',
    bio: 'Specialized in heart diseases and preventive cardiology with 15 years of experience.',
    image: '/assets/doctors/dr-sarah-johnson.jpg',
    isAvailable: true,
    nextAvailable: '2024-01-15',
    symptoms: ['chest pain', 'high blood pressure', 'irregular heartbeat', 'shortness of breath']
  },
  {
    id: 'doc_002',
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    department: 'Neurology',
    qualification: 'MD, Neurology, PhD',
    experience: 12,
    rating: 4.9,
    reviews: 89,
    consultationFee: 180,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTime: '10:00 AM - 06:00 PM',
    languages: ['English', 'Mandarin'],
    location: 'Neuro Center - Building B',
    phone: '+1 (555) 234-5678',
    email: 'm.chen@hospital.com',
    bio: 'Expert in neurological disorders including migraines, epilepsy, and Parkinson’s disease.',
    image: '/assets/doctors/dr-michael-chen.jpg',
    isAvailable: true,
    nextAvailable: '2024-01-16',
    symptoms: ['headache', 'dizziness', 'memory loss', 'numbness', 'seizures']
  },
  {
    id: 'doc_003',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    qualification: 'MD, Pediatrics',
    experience: 8,
    rating: 4.7,
    reviews: 156,
    consultationFee: 120,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTime: '08:00 AM - 04:00 PM',
    languages: ['English', 'Spanish'],
    location: 'Children\'s Wing - Floor 2',
    phone: '+1 (555) 345-6789',
    email: 'e.rodriguez@hospital.com',
    bio: 'Dedicated pediatrician with focus on child development and preventive care.',
    image: '/assets/doctors/dr-emily-rodriguez.jpg',
    isAvailable: true,
    nextAvailable: '2024-01-15',
    symptoms: ['fever', 'cough', 'rashes', 'vaccination', 'growth concerns']
  },
  {
    id: 'doc_004',
    name: 'Dr. Robert Williams',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    qualification: 'MD, Orthopedic Surgery',
    experience: 20,
    rating: 4.6,
    reviews: 203,
    consultationFee: 200,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTime: '09:00 AM - 05:00 PM',
    languages: ['English'],
    location: 'Surgical Wing - Floor 4',
    phone: '+1 (555) 456-7890',
    email: 'r.williams@hospital.com',
    bio: 'Specializes in joint replacements, sports injuries, and fracture management.',
    image: '/assets/doctors/dr-robert-williams.jpg',
    isAvailable: false,
    nextAvailable: '2024-01-18',
    symptoms: ['joint pain', 'back pain', 'sports injury', 'fracture', 'arthritis']
  },
  {
    id: 'doc_005',
    name: 'Dr. Lisa Patel',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    qualification: 'MD, Dermatology',
    experience: 10,
    rating: 4.8,
    reviews: 178,
    consultationFee: 140,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTime: '11:00 AM - 07:00 PM',
    languages: ['English', 'Hindi', 'Gujarati'],
    location: 'Skin Clinic - Building C',
    phone: '+1 (555) 567-8901',
    email: 'l.patel@hospital.com',
    bio: 'Expert in skin conditions, cosmetic dermatology, and skin cancer screening.',
    image: '/assets/doctors/dr-lisa-patel.jpg',
    isAvailable: true,
    nextAvailable: '2024-01-17',
    symptoms: ['skin rash', 'acne', 'eczema', 'moles', 'hair loss']
  },
  {
    id: 'doc_006',
    name: 'Dr. James Wilson',
    specialization: 'General Physician',
    department: 'General Medicine',
    qualification: 'MD, General Medicine',
    experience: 25,
    rating: 4.9,
    reviews: 312,
    consultationFee: 100,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTime: '08:00 AM - 06:00 PM',
    languages: ['English', 'French'],
    location: 'Main Hospital - Floor 1',
    phone: '+1 (555) 678-9012',
    email: 'j.wilson@hospital.com',
    bio: 'Experienced general physician with expertise in preventive medicine and chronic disease management.',
    image: '/assets/doctors/dr-james-wilson.jpg',
    isAvailable: true,
    nextAvailable: '2024-01-15',
    symptoms: ['fever', 'cough', 'fatigue', 'general checkup', 'vaccination']
  }
];

// Mock Symptoms Data
export const mockSymptoms = [
  { id: 'sym_001', name: 'Headache', category: 'Neurological', severity: 'medium' },
  { id: 'sym_002', name: 'Fever', category: 'General', severity: 'medium' },
  { id: 'sym_003', name: 'Cough', category: 'Respiratory', severity: 'low' },
  { id: 'sym_004', name: 'Chest Pain', category: 'Cardiac', severity: 'high' },
  { id: 'sym_005', name: 'Shortness of Breath', category: 'Respiratory', severity: 'high' },
  { id: 'sym_006', name: 'Dizziness', category: 'Neurological', severity: 'medium' },
  { id: 'sym_007', name: 'Nausea', category: 'Gastrointestinal', severity: 'medium' },
  { id: 'sym_008', name: 'Joint Pain', category: 'Musculoskeletal', severity: 'medium' },
  { id: 'sym_009', name: 'Fatigue', category: 'General', severity: 'low' },
  { id: 'sym_010', name: 'Skin Rash', category: 'Dermatological', severity: 'low' },
  { id: 'sym_011', name: 'Back Pain', category: 'Musculoskeletal', severity: 'medium' },
  { id: 'sym_012', name: 'Abdominal Pain', category: 'Gastrointestinal', severity: 'medium' },
  { id: 'sym_013', name: 'Sore Throat', category: 'ENT', severity: 'low' },
  { id: 'sym_014', name: 'Runny Nose', category: 'ENT', severity: 'low' },
  { id: 'sym_015', name: 'Difficulty Sleeping', category: 'General', severity: 'low' }
];

// Mock Departments
export const mockDepartments = [
  { id: 'dept_001', name: 'Cardiology', icon: 'heart', doctorCount: 8 },
  { id: 'dept_002', name: 'Neurology', icon: 'brain', doctorCount: 6 },
  { id: 'dept_003', name: 'Pediatrics', icon: 'baby', doctorCount: 10 },
  { id: 'dept_004', name: 'Orthopedics', icon: 'bone', doctorCount: 7 },
  { id: 'dept_005', name: 'Dermatology', icon: 'skin', doctorCount: 5 },
  { id: 'dept_006', name: 'General Medicine', icon: 'stethoscope', doctorCount: 12 },
  { id: 'dept_007', name: 'ENT', icon: 'ear', doctorCount: 4 },
  { id: 'dept_008', name: 'Ophthalmology', icon: 'eye', doctorCount: 5 },
  { id: 'dept_009', name: 'Dentistry', icon: 'tooth', doctorCount: 6 },
  { id: 'dept_010', name: 'Emergency', icon: 'ambulance', doctorCount: 15 }
];

// Mock Time Slots
export const mockTimeSlots = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM'
];

// Mock Appointments History
export const mockAppointments = [
  {
    id: 'app_001',
    doctorId: 'doc_001',
    doctorName: 'Dr. Sarah Johnson',
    department: 'Cardiology',
    date: '2024-01-10',
    time: '10:00 AM',
    timeSlot: '10:00 AM - 10:30 AM',
    symptoms: ['chest pain', 'shortness of breath'],
    priority: 'urgent',
    status: 'completed',
    notes: 'ECG normal, advised lifestyle changes',
    followUpRequired: true,
    followUpDate: '2024-02-10',
    location: 'Main Hospital - Floor 3',
    roomNumber: '301',
    duration: 30
  },
  {
    id: 'app_002',
    doctorId: 'doc_003',
    doctorName: 'Dr. Emily Rodriguez',
    department: 'Pediatrics',
    date: '2024-01-05',
    time: '02:30 PM',
    timeSlot: '02:30 PM - 03:00 PM',
    symptoms: ['fever', 'cough'],
    priority: 'normal',
    status: 'completed',
    notes: 'Viral infection, prescribed medication',
    followUpRequired: false,
    location: 'Children\'s Wing - Floor 2',
    roomNumber: '205',
    duration: 30
  },
  {
    id: 'app_003',
    doctorId: 'doc_006',
    doctorName: 'Dr. James Wilson',
    department: 'General Medicine',
    date: '2024-01-20',
    time: '11:00 AM',
    timeSlot: '11:00 AM - 11:30 AM',
    symptoms: ['annual checkup'],
    priority: 'low',
    status: 'upcoming',
    location: 'Main Hospital - Floor 1',
    roomNumber: '101',
    duration: 30
  }
];

// Mock User Profiles
export const mockUsers = [
  {
    id: 'user_001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    age: 45,
    gender: 'male',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 987-6543',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Peanuts'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    persona: 'default'
  },
  {
    id: 'user_002',
    name: 'Mary Johnson',
    email: 'mary.j@email.com',
    phone: '+1 (555) 234-5678',
    age: 72,
    gender: 'female',
    bloodGroup: 'A+',
    emergencyContact: '+1 (555) 876-5432',
    medicalHistory: ['Arthritis', 'High Cholesterol'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Atorvastatin 20mg', 'Ibuprofen 400mg'],
    persona: 'elderly'
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'notif_001',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 10:00 AM',
    timestamp: '2024-01-19T09:00:00Z',
    read: false,
    important: true
  },
  {
    id: 'notif_002',
    type: 'system',
    title: 'New Feature Available',
    message: 'Voice input for symptoms is now available',
    timestamp: '2024-01-18T14:30:00Z',
    read: true,
    important: false
  }
];

// Service Functions
export const mockDataService = {
  // Doctor related functions
  getDoctors: (filters = {}) => {
    let doctors = [...mockDoctors];
    
    if (filters.department && filters.department !== 'all') {
      doctors = doctors.filter(doc => doc.department === filters.department);
    }
    
    if (filters.available) {
      doctors = doctors.filter(doc => doc.isAvailable);
    }
    
    if (filters.specialization) {
      doctors = doctors.filter(doc => doc.specialization === filters.specialization);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      doctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) ||
        doc.specialization.toLowerCase().includes(searchLower) ||
        doc.department.toLowerCase().includes(searchLower)
      );
    }
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(doctors);
      }, 500);
    });
  },
  
  getDoctorById: (id) => {
    const doctor = mockDoctors.find(doc => doc.id === id);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (doctor) {
          resolve(doctor);
        } else {
          reject(new Error('Doctor not found'));
        }
      }, 300);
    });
  },
  
  // Symptoms related functions
  getSymptoms: (category = 'all') => {
    let symptoms = [...mockSymptoms];
    
    if (category !== 'all') {
      symptoms = symptoms.filter(sym => sym.category === category);
    }
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(symptoms);
      }, 200);
    });
  },
  
  suggestSymptoms: (input) => {
    if (!input || input.length < 2) {
      return Promise.resolve([]);
    }
    
    const inputLower = input.toLowerCase();
    const suggestions = mockSymptoms.filter(sym => 
      sym.name.toLowerCase().includes(inputLower)
    ).slice(0, 5);
    
    return Promise.resolve(suggestions);
  },
  
  recommendDoctors: (symptoms = []) => {
    if (symptoms.length === 0) {
      return Promise.resolve(mockDoctors.slice(0, 6));
    }
    
    // Simple recommendation logic based on symptom matching
    const doctorScores = mockDoctors.map(doctor => {
      let score = 0;
      symptoms.forEach(symptom => {
        if (doctor.symptoms && doctor.symptoms.includes(symptom.toLowerCase())) {
          score += 2;
        }
      });
      
      // Add bonus for experience and rating
      score += doctor.experience * 0.1;
      score += doctor.rating * 0.5;
      
      return { doctor, score };
    });
    
    // Sort by score and get top 6
    const recommended = doctorScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.doctor);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(recommended);
      }, 800);
    });
  },
  
  // Departments
  getDepartments: () => {
    return Promise.resolve(mockDepartments);
  },
  
  // Time slots
  getTimeSlots: (doctorId, date) => {
    // Filter out booked slots (simulated)
    const bookedSlots = mockAppointments
      .filter(app => app.doctorId === doctorId && app.date === date)
      .map(app => app.timeSlot);
    
    const availableSlots = mockTimeSlots.filter(slot => !bookedSlots.includes(slot));
    
    return Promise.resolve(availableSlots);
  },
  
  // Check doctor availability
  checkAvailability: (doctorId, date, timeSlot) => {
    const isBooked = mockAppointments.some(app => 
      app.doctorId === doctorId && 
      app.date === date && 
      app.timeSlot === timeSlot
    );
    
    return Promise.resolve(!isBooked);
  },
  
  // Book appointment
  bookAppointment: (appointmentData) => {
    const newAppointment = {
      id: `app_${Date.now()}`,
      ...appointmentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    // In a real app, this would save to backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newAppointment);
      }, 1000);
    });
  },
  
  // Get user appointments
  getUserAppointments: (userId) => {
    // For now, return all mock appointments
    return Promise.resolve(mockAppointments);
  },
  
  // Cancel appointment
  cancelAppointment: (appointmentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Appointment cancelled successfully' });
      }, 500);
    });
  },
  
  // Reschedule appointment
  rescheduleAppointment: (appointmentId, newDate, newTimeSlot) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Appointment rescheduled successfully',
          newDate,
          newTimeSlot 
        });
      }, 700);
    });
  },
  
  // Get notifications
  getNotifications: (userId) => {
    return Promise.resolve(mockNotifications);
  },
  
  // Mark notification as read
  markNotificationAsRead: (notificationId) => {
    return Promise.resolve({ success: true });
  },
  
  // Get user profile
  getUserProfile: (userId) => {
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    return Promise.resolve(user);
  },
  
  // Update user profile
  updateUserProfile: (userId, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, user: updates });
      }, 400);
    });
  },
  
  // Search function
  search: (query, type = 'all') => {
    const queryLower = query.toLowerCase();
    let results = [];
    
    if (type === 'all' || type === 'doctors') {
      const doctorResults = mockDoctors.filter(doc => 
        doc.name.toLowerCase().includes(queryLower) ||
        doc.specialization.toLowerCase().includes(queryLower) ||
        doc.department.toLowerCase().includes(queryLower)
      ).map(doc => ({ type: 'doctor', ...doc }));
      
      results = [...results, ...doctorResults];
    }
    
    if (type === 'all' || type === 'symptoms') {
      const symptomResults = mockSymptoms.filter(sym => 
        sym.name.toLowerCase().includes(queryLower)
      ).map(sym => ({ type: 'symptom', ...sym }));
      
      results = [...results, ...symptomResults];
    }
    
    if (type === 'all' || type === 'departments') {
      const deptResults = mockDepartments.filter(dept => 
        dept.name.toLowerCase().includes(queryLower)
      ).map(dept => ({ type: 'department', ...dept }));
      
      results = [...results, ...deptResults];
    }
    
    return Promise.resolve(results.slice(0, 10));
  },
  
  // Get emergency contacts
  getEmergencyContacts: () => {
    return Promise.resolve([
      { name: 'Emergency Department', phone: '911', type: 'emergency' },
      { name: 'Hospital Main Line', phone: '+1 (555) 000-1234', type: 'hospital' },
      { name: 'Poison Control', phone: '1-800-222-1222', type: 'emergency' }
    ]);
  },
  
  // Get healthcare tips
  getHealthTips: (category) => {
    const tips = [
      { id: 1, title: 'Stay Hydrated', category: 'general', content: 'Drink at least 8 glasses of water daily.' },
      { id: 2, title: 'Regular Exercise', category: 'fitness', content: '30 minutes of moderate exercise 5 days a week.' },
      { id: 3, title: 'Healthy Diet', category: 'nutrition', content: 'Include fruits and vegetables in every meal.' },
      { id: 4, title: 'Sleep Well', category: 'general', content: 'Aim for 7-9 hours of quality sleep each night.' },
      { id: 5, title: 'Manage Stress', category: 'mental', content: 'Practice mindfulness and relaxation techniques.' }
    ];
    
    const filteredTips = category ? tips.filter(tip => tip.category === category) : tips;
    
    return Promise.resolve(filteredTips);
  }
};

export default mockDataService;