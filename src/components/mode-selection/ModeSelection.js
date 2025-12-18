import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import ModeCard from './ModeCard';
import { Mic, Type, Eye, Monitor, Hand } from 'lucide-react';

const ModeSelection = () => {
  const navigate = useNavigate();
  const { setUserMode, settings } = useAccessibility();

  const modes = [
    {
      id: 'standard',
      title: 'Standard Mode',
      icon: <Monitor size={48} />,
      description: 'For regular users familiar with digital interfaces',
      features: ['Standard text size', 'Full feature set', 'Regular navigation'],
      color: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-800 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
      buttonText: 'text-white',
    },
    {
      id: 'elderly',
      title: 'Elderly Mode',
      icon: <Type size={48} />,
      description: 'Larger text, simplified interface for elderly users',
      features: ['Extra large text', 'Voice assistance', 'Simplified steps', 'High contrast'],
      color: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-800 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
      buttonText: 'text-white',
    },
    {
      id: 'voice',
      title: 'Voice Mode',
      icon: <Mic size={48} />,
      description: 'Navigate and book using voice commands',
      features: ['Voice input', 'Audio feedback', 'Hands-free operation', 'Voice navigation'],
      color: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-800 dark:text-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
      buttonText: 'text-white',
    },
 
    {
      id: 'sign-language',
      title: 'Sign Language Mode',
      icon: <Hand size={48} />,
      description: 'Use ASL hand signs to input symptoms',
      features: ['Camera-based input', 'ASL alphabet recognition', 'Visual feedback', 'Letter-by-letter input'],
      color: 'from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700',
      iconColor: 'text-pink-600 dark:text-pink-400',
      textColor: 'text-pink-800 dark:text-pink-300',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      buttonColor: 'bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600',
      buttonText: 'text-white',
    },
  ];

  const handleModeSelect = (modeId) => {
    setUserMode(modeId);
    navigate('/symptoms');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {modes.map((mode) => (
        <ModeCard
          key={mode.id}
          mode={mode}
          onSelect={() => handleModeSelect(mode.id)}
          isDarkMode={settings.darkMode}
          highContrast={settings.highContrast}
          fontSize={settings.fontSize}
        />
      ))}
    </div>
  );
};

export default ModeSelection;