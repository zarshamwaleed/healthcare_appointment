import React from 'react';
import { Loader2, Check, X, ArrowRight, Plus, Search, Calendar, User } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  success = false,
  danger = false,
  ...props
}) => {
  const { settings } = useAccessibility();

  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-slate-600';
    }

    if (success) {
      return 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 text-white border-green-700 focus:ring-green-500 dark:focus:ring-green-400';
    }

    if (danger) {
      return 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 active:bg-red-800 text-white border-red-700 focus:ring-red-500 dark:focus:ring-red-400';
    }

    switch(variant) {
      case 'primary':
        return 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 active:bg-blue-800 text-white border-blue-700 dark:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400';
      
      case 'secondary':
        return 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 active:bg-blue-100 dark:active:bg-slate-500 focus:ring-blue-500 dark:focus:ring-blue-400';
      
      case 'outline':
        return 'bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:ring-gray-500 dark:focus:ring-blue-400';
      
      case 'ghost':
        return 'bg-transparent dark:bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-gray-500 dark:focus:ring-blue-400';
      
      case 'text':
        return 'bg-transparent dark:bg-transparent text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline focus:ring-blue-500 dark:focus:ring-blue-400';
      
      case 'elderly':
        return 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-xl font-bold border-4 border-blue-400 dark:border-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400';
      
      default:
        return 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white';
    }
  };

  const getSizeClasses = () => {
    if (settings.mode === 'elderly') {
      switch(size) {
        case 'small': return 'px-5 py-3 text-lg';
        case 'medium': return 'px-7 py-4 text-xl';
        case 'large': return 'px-9 py-5 text-2xl';
        default: return 'px-7 py-4 text-xl';
      }
    }

    switch(size) {
      case 'small': return 'px-3 py-1.5 text-sm';
      case 'medium': return 'px-5 py-2.5 text-base';
      case 'large': return 'px-7 py-3.5 text-lg';
      default: return 'px-5 py-2.5 text-base';
    }
  };

  const getIconSize = () => {
    if (settings.mode === 'elderly') {
      switch(size) {
        case 'small': return 20;
        case 'medium': return 24;
        case 'large': return 28;
        default: return 24;
      }
    }

    switch(size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getCommonClasses = () => {
    return `
      inline-flex items-center justify-center
      font-medium rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${settings.mode === 'elderly' ? 'min-h-[60px] min-w-[120px]' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${loading ? 'opacity-80 cursor-wait' : ''}
      ${getVariantClasses()}
      ${getSizeClasses()}
      ${className}
    `;
  };

  const renderIcon = () => {
  if (loading) {
    return <Loader2 size={getIconSize()} className="animate-spin mr-2" />;
  }

  if (success) {
    return <Check size={getIconSize()} className="mr-2" />;
  }

  if (danger) {
    return <X size={getIconSize()} className="mr-2" />;
  }

  if (icon) {
    // Handle if icon is already a JSX element (like <Calendar />)
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        size: getIconSize(),
        className: `${icon.props.className || ''} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`
      });
    }
    
    // Handle if icon is a component (like Calendar)
    const IconComponent = icon;
    return (
      <IconComponent 
        size={getIconSize()} 
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} 
      />
    );
  }

  return null;
};

  const buttonContent = (
    <>
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={getCommonClasses()}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
      aria-busy={loading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

// Pre-configured button components
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const ElderlyButton = (props) => <Button variant="elderly" {...props} />;
export const SuccessButton = (props) => <Button success {...props} />;
export const DangerButton = (props) => <Button danger {...props} />;

// Action buttons with icons
export const BookAppointmentButton = (props) => (
  <Button 
    variant="primary" 
    icon={Calendar}
    iconPosition="right"
    {...props}
  >
    Book Appointment
  </Button>
);

export const SearchButton = (props) => (
  <Button 
    variant="secondary" 
    icon={Search}
    {...props}
  >
    Search Doctors
  </Button>
);

export const NextButton = (props) => (
  <Button 
    variant="primary" 
    icon={ArrowRight}
    iconPosition="right"
    {...props}
  >
    Continue
  </Button>
);

export const AddButton = (props) => (
  <Button 
    variant="outline" 
    icon={Plus}
    size="small"
    {...props}
  >
    Add
  </Button>
);

export const ProfileButton = (props) => (
  <Button 
    variant="ghost" 
    icon={User}
    size="small"
    {...props}
  >
    Profile
  </Button>
);

export default Button;