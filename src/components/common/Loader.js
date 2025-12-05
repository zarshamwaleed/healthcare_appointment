import React from 'react';
import { Loader2, Heart, Shield, Stethoscope, Activity, Zap } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const Loader = ({
  type = 'spinner',
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  progress,
  indeterminate = true,
  className = ''
}) => {
  const { settings } = useAccessibility();

  const getSizeClasses = () => {
    if (settings.mode === 'elderly') {
      switch(size) {
        case 'small': return 'w-12 h-12';
        case 'medium': return 'w-16 h-16';
        case 'large': return 'w-24 h-24';
        default: return 'w-16 h-16';
      }
    }

    switch(size) {
      case 'small': return 'w-8 h-8';
      case 'medium': return 'w-12 h-12';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    if (settings.mode === 'elderly') {
      switch(size) {
        case 'small': return 'text-lg';
        case 'medium': return 'text-xl';
        case 'large': return 'text-2xl';
        default: return 'text-xl';
      }
    }

    switch(size) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getColorClasses = () => {
    switch(color) {
      case 'primary':
        return settings.highContrast ? 'text-black' : 'text-primary-600';
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'danger':
        return 'text-red-600';
      case 'blue':
        return 'text-blue-600';
      case 'purple':
        return 'text-purple-600';
      default:
        return 'text-primary-600';
    }
  };

  const renderSpinner = () => {
    const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 32;
    
    return (
      <div className={`${getSizeClasses()} ${getColorClasses()}`}>
        <Loader2 className="w-full h-full animate-spin" />
      </div>
    );
  };

  const renderPulse = () => {
    return (
      <div className={`flex items-center justify-center ${getSizeClasses()}`}>
        <div className={`relative ${getSizeClasses()}`}>
          <div className={`absolute inset-0 rounded-full ${getColorClasses().replace('text-', 'bg-')} opacity-20 animate-ping`}></div>
          <div className={`absolute inset-2 rounded-full ${getColorClasses().replace('text-', 'bg-')} animate-pulse`}></div>
        </div>
      </div>
    );
  };

  const renderDots = () => {
    const dotSize = size === 'small' ? 'w-2 h-2' : size === 'medium' ? 'w-3 h-3' : 'w-4 h-4';
    
    return (
      <div className="flex items-center space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSize} rounded-full ${getColorClasses().replace('text-', 'bg-')} animate-bounce`}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    );
  };

  const renderProgress = () => {
    const containerSize = size === 'small' ? 'w-32' : size === 'medium' ? 'w-48' : 'w-64';
    
    return (
      <div className={`${containerSize}`}>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full ${getColorClasses().replace('text-', 'bg-')} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderHealthcare = () => {
    const iconSize = size === 'small' ? 24 : size === 'medium' ? 32 : 48;
    
    return (
      <div className="relative">
        <div className="flex items-center justify-center">
          <Stethoscope 
            size={iconSize} 
            className={`${getColorClasses()} animate-pulse`} 
          />
          <div className="absolute -top-1 -right-1">
            <Heart 
              size={iconSize / 2} 
              className="text-red-500 animate-heartbeat" 
            />
          </div>
        </div>
      </div>
    );
  };

  const renderLoader = () => {
    switch(type) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'progress':
        return renderProgress();
      case 'healthcare':
        return renderHealthcare();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center 
        ${overlay ? 'bg-black/50' : 'bg-white'} ${className}`}>
        {renderLoader()}
        {text && (
          <p className={`mt-4 ${getTextSize()} text-gray-700 font-medium`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderLoader()}
      {text && (
        <p className={`mt-2 ${getTextSize()} text-gray-600`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Pre-configured loaders
export const PageLoader = ({ text = 'Loading...' }) => (
  <Loader 
    type="healthcare" 
    size="large" 
    fullScreen 
    overlay 
    text={text}
  />
);

export const InlineLoader = ({ size = 'small', text }) => (
  <Loader 
    type="dots" 
    size={size} 
    text={text}
  />
);

export const ProgressLoader = ({ progress, text }) => (
  <Loader 
    type="progress" 
    size="medium" 
    progress={progress}
    text={text}
  />
);

export const ElderlyLoader = ({ text = 'Please wait...' }) => {
  const { settings } = useAccessibility();
  
  return (
    <div className="text-center space-y-4">
      <Loader 
        type="pulse" 
        size={settings.mode === 'elderly' ? 'large' : 'medium'}
        color="blue"
      />
      <p className={`${settings.mode === 'elderly' ? 'text-xl' : 'text-base'} text-gray-700`}>
        {text}
      </p>
      <div className="w-48 mx-auto bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Taking a moment to load... Please don't refresh the page.
        </p>
      </div>
    </div>
  );
};

// Loading overlay for async operations
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = 'Processing...' 
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 z-40 flex flex-col items-center justify-center rounded-lg">
        <Loader type="spinner" size="medium" />
        <p className="mt-2 text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Loader;