import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../context/AccessibilityContext';
import ModeCard from './ModeCard';
import { Mic, Type, Eye, Monitor, Hand } from 'lucide-react';

const ModeSelection = () => {
  const navigate = useNavigate();
  const { setUserMode } = useAccessibility();

  const modes = [
    {
      id: 'standard',
      title: 'Standard Mode',
      icon: <Monitor size={48} />,
      description: 'For regular users familiar with digital interfaces',
      features: ['Standard text size', 'Full feature set', 'Regular navigation'],
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'elderly',
      title: 'Elderly Mode',
      icon: <Type size={48} />,
      description: 'Larger text, simplified interface for elderly users',
      features: ['Extra large text', 'Voice assistance', 'Simplified steps', 'High contrast'],
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      id: 'voice',
      title: 'Voice Mode',
      icon: <Mic size={48} />,
      description: 'Navigate and book using voice commands',
      features: ['Voice input', 'Audio feedback', 'Hands-free operation', 'Voice navigation'],
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'icon',
      title: 'Icon Mode',
      icon: <Eye size={48} />,
      description: 'Visual interface for low-literacy users',
      features: ['Icon-based navigation', 'Minimal text', 'Visual cues', 'Simple choices'],
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
    },
    {
      id: 'sign-language',
      title: 'Sign Language Mode',
      icon: <Hand size={48} />,
      description: 'Use ASL hand signs to input symptoms',
      features: ['Camera-based input', 'ASL alphabet recognition', 'Visual feedback', 'Letter-by-letter input'],
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-700',
      bgColor: 'bg-pink-50',
    },
  ];

  const handleModeSelect = (modeId) => {
    setUserMode(modeId);
    navigate('/symptoms');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {modes.map((mode) => (
        <ModeCard
          key={mode.id}
          mode={mode}
          onSelect={() => handleModeSelect(mode.id)}
        />
      ))}
    </div>
  );
};

export default ModeSelection;