// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, Type, Eye, Smartphone, Users,
  Calendar, Stethoscope
} from 'lucide-react';
import { PrimaryButton, ElderlyCard } from '../components/common';
import { UserProvider } from '../context/UserContext';
import { AccessibilityProvider, useAccessibility } from '../context/AccessibilityContext';
import { AppointmentProvider } from '../context/AppointmentContext';
import { UIProvider } from '../context/UIContext';

const HomePageContent = () => {
  const navigate = useNavigate();
  const { settings, setUserMode } = useAccessibility();

  const features = [
    { icon: <Mic />, title: 'Voice Commands', desc: 'Speak to book appointments' },
    { icon: <Type />, title: 'Large Text', desc: 'Easy reading for elderly' },
    { icon: <Eye />, title: 'Visual Interface', desc: 'Icons for low literacy' },
    { icon: <Smartphone />, title: 'Adaptive Layout', desc: 'Works on all devices' },
    { icon: <Users />, title: 'Multi-user Support', desc: 'For all age groups' },
    { icon: <Calendar />, title: 'Smart Scheduling', desc: 'Priority-based booking' },
  ];

  const userTypes = [
    { type: 'elderly', label: 'Elderly Users', icon: '👵', color: 'bg-blue-100 text-blue-800' },
    { type: 'low-literacy', label: 'Low Literacy', icon: '📖', color: 'bg-green-100 text-green-800' },
    { type: 'voice', label: 'Voice Preference', icon: '🎤', color: 'bg-purple-100 text-purple-800' },
    { type: 'standard', label: 'Standard Users', icon: '💻', color: 'bg-gray-100 text-gray-800' },
  ];

  const handleGetStarted = () => navigate('/mode-selection');
  const handleQuickStart = (mode) => { setUserMode(mode); navigate('/symptoms'); };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-100 text-primary-600 mb-6">
          <Stethoscope size={settings.mode === 'elderly' ? 48 : 32} />
        </div>
        
        <h1 className={`font-bold mb-4 ${settings.mode === 'elderly' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}`}>
          Smart Healthcare Appointment System
        </h1>
        
        <p className={`text-gray-600 max-w-3xl mx-auto mb-8 ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
          An inclusive, adaptive interface designed for everyone—especially elderly and low-literacy users. 
          Book appointments with voice, touch, or visual cues.
        </p>
        
        <PrimaryButton onClick={handleGetStarted}>Get Started</PrimaryButton>
      </section>

      {/* Features and user types sections */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElderlyCard>
            <h3>For Elderly Users</h3>
            <p>Simple interface with large text</p>
          </ElderlyCard>
        </div>
      </section>

      <section>
        <h2 className={`font-bold mb-6 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
          Quick Start for Different Users
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userTypes.map((user) => (
            <button
              key={user.type}
              onClick={() => handleQuickStart(user.type)}
              className={`card hover:scale-105 transition-transform ${user.color}`}
            >
              <div className="text-3xl mb-3">{user.icon}</div>
              <h3 className="font-semibold mb-2">{user.label}</h3>
              <p className="text-sm opacity-80">Click to start in optimized mode</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`font-bold mb-6 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
          Intelligent Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card group hover:shadow-xl">
              <div className="inline-flex p-3 rounded-lg bg-primary-50 text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                {React.cloneElement(feature.icon, { size: 24 })}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
        <h2 className={`font-bold mb-8 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'} text-center`}>
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {['Choose Mode', 'Describe Symptoms', 'Select Doctor', 'Book Appointment'].map((step, index) => (
            <div key={step} className="text-center">
              <div className={`w-12 h-12 rounded-full ${settings.highContrast ? 'bg-black text-white' : 'bg-primary-600 text-white'} flex items-center justify-center font-bold text-xl mx-auto mb-4`}>
                {index + 1}
              </div>
              <h3 className="font-semibold mb-2">{step}</h3>
              <p className="text-gray-600 text-sm">
                {index === 0 && 'Select interface mode based on your needs'}
                {index === 1 && 'Use voice, text, or body map to describe'}
                {index === 2 && 'System recommends suitable doctors'}
                {index === 3 && 'Pick time slot and confirm booking'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Wrap HomePageContent with all providers
const HomePage = () => (
  <UserProvider>
    <AccessibilityProvider>
      <AppointmentProvider>
        <UIProvider>
          <HomePageContent />
        </UIProvider>
      </AppointmentProvider>
    </AccessibilityProvider>
  </UserProvider>
);

export default HomePage;
