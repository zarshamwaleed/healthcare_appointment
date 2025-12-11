// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common';
import { useAccessibility } from '../context/AccessibilityContext';
import useAIGuidePage from '../hooks/useAIGuidePage';

const HomePage = () => {
  const navigate = useNavigate();
  const { settings, setUserMode } = useAccessibility();
  
  // Notify AI Guide that user is on home page
  useAIGuidePage('home');

  const features = [
    { 
      title: 'Voice Commands', 
      desc: 'Speak naturally to book your appointments. Our advanced voice recognition makes healthcare accessible hands-free.',
      gradient: 'from-purple-600 via-purple-500 to-indigo-600'
    },
    { 
      title: 'Large Text Mode', 
      desc: 'Crystal clear, extra-large typography designed specifically for comfortable reading and easy navigation.',
      gradient: 'from-blue-600 via-blue-500 to-cyan-600'
    },
    { 
      title: 'Visual Interface', 
      desc: 'Intuitive visual cues and simplified navigation paths designed for users of all literacy levels.',
      gradient: 'from-emerald-600 via-teal-500 to-green-600'
    },
    { 
      title: 'Adaptive Layout', 
      desc: 'Seamlessly responsive design that adapts perfectly to any device - phone, tablet, or desktop.',
      gradient: 'from-amber-600 via-orange-500 to-red-600'
    },
    { 
      title: 'Multi-User Support', 
      desc: 'Personalized experiences for every age group with customizable accessibility settings.',
      gradient: 'from-pink-600 via-rose-500 to-purple-600'
    },
    { 
      title: 'Smart Scheduling', 
      desc: 'AI-powered priority-based booking system that considers urgency and availability.',
      gradient: 'from-indigo-600 via-violet-500 to-purple-600'
    },
  ];

  const userTypes = [
    { 
      type: 'elderly', 
      label: 'Elderly Care', 
      description: 'Enhanced visibility with larger text and simplified navigation',
      gradient: 'from-blue-500 to-indigo-600',
      bgPattern: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      type: 'low-literacy', 
      label: 'Visual Mode', 
      description: 'Icon-based interface with minimal text for easy understanding',
      gradient: 'from-green-500 to-teal-600',
      bgPattern: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    
    { 
      type: 'voice', 
      label: 'Voice Enabled', 
      description: 'Complete voice control for hands-free appointment booking',
      gradient: 'from-pink-500 to-rose-600',
      bgPattern: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      type: 'standard', 
      label: 'Standard Access', 
      description: 'Full-featured interface with all advanced capabilities',
      gradient: 'from-gray-600 to-gray-800',
      bgPattern: 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    },
  ];

  const handleGetStarted = () => navigate('/mode-selection');
  const handleQuickStart = (mode) => { setUserMode(mode); navigate('/symptoms'); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 transition-colors duration-200">
      {/* Hero Section - Clean Medical Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Subtle Background Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-50 rounded-full blur-3xl opacity-20"></div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="px-5 py-2 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    We Are Here For Your Care
                  </span>
                </div>
              </div>
              
              <h1 className={`font-bold mb-6 leading-tight text-gray-900 dark:text-white ${
                settings.mode === 'elderly' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'
              }`}>
                Best Care <span className="text-gray-700 dark:text-gray-300">&</span>
                <br />
                <span className="text-blue-600 dark:text-blue-400">Better Doctor</span>
              </h1>
              
              <p className={`text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg ${
                settings.mode === 'elderly' ? 'text-xl' : 'text-lg'
              }`}>
                An intelligent, inclusive platform designed for everyone. Book your healthcare 
                appointments easily with voice commands, visual guides, or traditional navigation. 
                Your health, your way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button 
                  onClick={handleGetStarted}
                  className={`${settings.mode === 'elderly' ? 'px-10 py-5 text-xl' : 'px-8 py-4 text-base'} 
                    bg-blue-600 text-white font-semibold rounded-lg 
                    shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 
                    transform hover:scale-105 transition-all duration-300
                    hover:bg-blue-700`}
                >
                  MAKE AN APPOINTMENT
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
                {[
                  { value: '99%', label: 'Satisfaction' },
                  { value: '4+', label: 'Modes' },
                  { value: '24/7', label: 'Support' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-left">
                    <div className={`font-bold text-blue-600 mb-1 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-gray-600 font-medium ${settings.mode === 'elderly' ? 'text-base' : 'text-sm'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration Area */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                {/* Illustration Placeholder - Medical Scene */}
                <div className="relative">
                  {/* Background Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40"></div>
                  </div>
                  
                  {/* Doctor/Patient Illustration Representation */}
                  <div className="relative z-10 flex items-center justify-center py-16">
                    <div className="text-center space-y-6">
                      {/* Doctor Icon Representation */}
                      <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3">
                        <div className="text-white text-8xl">🏥</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-blue-200 rounded-full mx-auto"></div>
                        <div className="h-4 w-32 bg-indigo-200 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-2xl shadow-lg transform rotate-12 flex items-center justify-center text-white text-2xl">
                    ⚕️
                  </div>
                  <div className="absolute bottom-20 left-5 w-16 h-16 bg-indigo-500 rounded-full shadow-lg flex items-center justify-center text-white text-xl">
                    💊
                  </div>
                  <div className="absolute top-1/2 right-0 w-12 h-12 bg-cyan-400 rounded-lg shadow-md transform -rotate-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="relative py-20 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`font-bold mb-4 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-4xl' : 'text-3xl md:text-4xl'}`}>
              Choose Your Experience
            </h2>
            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
              Select the interface that best suits your needs and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((user) => (
              <button
                key={user.type}
                onClick={() => handleQuickStart(user.type)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${user.gradient} opacity-0 dark:opacity-20
                              group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-between min-h-[280px]">
                  <div>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${user.gradient} 
                                  mb-6 shadow-md group-hover:shadow-lg transition-all group-hover:scale-110 
                                  flex items-center justify-center`}>
                      <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                    </div>
                    <h3 className={`font-bold mb-3 text-gray-900 dark:text-white group-hover:text-white transition-colors 
                                  ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
                      {user.label}
                    </h3>
                    <p className={`text-gray-600 dark:text-gray-300 group-hover:text-white/90 transition-colors leading-relaxed
                                ${settings.mode === 'elderly' ? 'text-lg' : 'text-sm'}`}>
                      {user.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 dark:text-gray-300 group-hover:text-white transition-colors">
                      Get Started
                    </span>
                    <div className="text-gray-400 dark:text-gray-300 group-hover:text-white transition-colors">→</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`font-bold mb-4 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-4xl' : 'text-3xl md:text-4xl'}`}>
              Intelligent Features
            </h2>
            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
              Cutting-edge technology designed to make healthcare accessible to everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl 
                         transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700
                         hover:-translate-y-1"
              >
                {/* Gradient Accent */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.gradient}`}></div>
                
                <div className="p-8 pl-10">
                  {/* Number Badge */}
                  <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} 
                                items-center justify-center text-white font-bold text-lg mb-6
                                shadow-md group-hover:scale-110 transition-all`}>
                    {index + 1}
                  </div>
                  
                  <h3 className={`font-bold mb-3 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${settings.mode === 'elderly' ? 'text-lg' : 'text-base'}`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-white dark:bg-slate-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`font-bold mb-4 text-center text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-4xl' : 'text-3xl md:text-4xl'}`}>
            How It Works
          </h2>
          <p className={`text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
            Four simple steps to book your healthcare appointment
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '1', 
                title: 'Choose Mode', 
                desc: 'Select the interface that matches your comfort level and accessibility needs',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-purple-50'
              },
              { 
                step: '2', 
                title: 'Describe Symptoms', 
                desc: 'Use voice, text, or visual body map to communicate your health concerns',
                color: 'from-indigo-500 to-purple-500',
                bgColor: 'bg-indigo-50'
              },
              { 
                step: '3', 
                title: 'Select Doctor', 
                desc: 'AI recommends the most suitable specialists based on your symptoms',
                color: 'from-purple-500 to-pink-500',
                bgColor: 'bg-purple-50'
              },
              { 
                step: '4', 
                title: 'Book Appointment', 
                desc: 'Choose your preferred time slot and receive instant confirmation',
                color: 'from-pink-500 to-rose-500',
                bgColor: 'bg-pink-50'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connecting Arrow */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-slate-700 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-gray-200 dark:border-l-slate-700 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
                
                <div className="relative text-center z-10">
                  {/* Step Number */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 mb-6 ${item.bgColor} dark:bg-slate-800 rounded-2xl shadow-md`}>
                    <span className={`font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}`}>
                      {item.step}
                    </span>
                  </div>
                  
                  <h3 className={`font-bold mb-3 text-gray-900 dark:text-white ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${settings.mode === 'elderly' ? 'text-lg' : 'text-base'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
