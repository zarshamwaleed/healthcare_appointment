import React from 'react';
import { 
  Star, 
  Heart, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight,
  Shield,
  Award,
  CheckCircle,
  AlertCircle,
  Info as InfoIcon,   // ✅ Add this line
  Calendar as CalendarIcon  // ✅ If you use Calendar
} from 'lucide-react';


import { useAccessibility } from '../../context/AccessibilityContext';

const Card = ({
  children,
  variant = 'default',
  elevated = false,
  interactive = false,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  padding = 'medium',
  border = true,
  ...props
}) => {
  const { settings } = useAccessibility();

  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-gray-100 text-gray-400 border-gray-200';
    }

    if (selected) {
      return settings.highContrast 
        ? 'bg-black text-white border-2 border-white' 
        : 'bg-primary-50 border-primary-300 text-primary-900';
    }

    switch(variant) {
      case 'primary':
        return settings.highContrast 
          ? 'bg-black text-white border-2 border-white' 
          : 'bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 text-primary-900';
      
      case 'secondary':
        return 'bg-gray-50 border-gray-200 text-gray-900';
      
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-900';
      
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      
      case 'elderly':
        return 'bg-blue-50 border-4 border-blue-300 text-blue-900 text-lg';
      
      case 'simple':
        return 'bg-white border-gray-100 text-gray-900';
      
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  const getPaddingClasses = () => {
    if (settings.mode === 'elderly') {
      switch(padding) {
        case 'small': return 'p-5';
        case 'medium': return 'p-6';
        case 'large': return 'p-8';
        case 'none': return 'p-0';
        default: return 'p-6';
      }
    }

    switch(padding) {
      case 'small': return 'p-4';
      case 'medium': return 'p-5';
      case 'large': return 'p-6';
      case 'none': return 'p-0';
      default: return 'p-5';
    }
  };

  const getBorderClasses = () => {
    if (!border) return '';
    return disabled ? 'border' : 'border';
  };

  const getInteractiveClasses = () => {
    if (!interactive || disabled) return '';
    return 'cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1';
  };

  const getElevationClasses = () => {
    if (!elevated) return 'shadow-sm';
    return settings.mode === 'elderly' ? 'shadow-xl' : 'shadow-lg';
  };

  const cardClasses = `
    rounded-xl
    ${getVariantClasses()}
    ${getBorderClasses()}
    ${getPaddingClasses()}
    ${getElevationClasses()}
    ${getInteractiveClasses()}
    ${className}
  `;

  const CardComponent = interactive && !disabled ? 'button' : 'div';

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <CardComponent
      className={cardClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

// Card Header Component
export const CardHeader = ({ 
  title, 
  subtitle, 
  icon,
  action,
  className = '' 
}) => {
  const { settings } = useAccessibility();
  
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            {React.cloneElement(icon, { size: settings.mode === 'elderly' ? 24 : 20 })}
          </div>
        )}
        <div>
          <h3 className={`font-bold ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-gray-600 ${settings.mode === 'elderly' ? 'text-lg' : 'text-sm'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

// Card Content Component
export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({ 
  children, 
  align = 'between',
  className = '' 
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`mt-4 flex items-center ${alignmentClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

// Pre-configured Card Components
export const DoctorCard = ({
  name,
  specialty,
  rating,
  experience,
  availability,
  distance,
  onSelect,
  isSelected,
  className = ''
}) => {
  const { settings } = useAccessibility();

  return (
    <Card
      variant={isSelected ? 'primary' : 'default'}
      interactive
      selected={isSelected}
      onClick={onSelect}
      className={className}
    >
      <CardHeader
        title={name}
        subtitle={specialty}
        icon={<Shield size={20} />}
        action={
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="font-bold">{rating}</span>
          </div>
        }
      />
      
      <CardContent>
        <div className={`space-y-2 ${settings.mode === 'elderly' ? 'space-y-3' : ''}`}>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-gray-500" />
            <span className="text-gray-700">{experience} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className={`${availability === 'Available Now' ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
              {availability}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-gray-700">{distance} away</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
          View Profile
          <ChevronRight size={16} />
        </button>
      </CardFooter>
    </Card>
  );
};

export const AppointmentCard = ({
  date,
  time,
  doctor,
  location,
  status = 'confirmed',
  onReschedule,
  onCancel,
  className = ''
}) => {
  const statusConfig = {
    confirmed: { color: 'text-green-600', bg: 'bg-green-100', label: 'Confirmed' },
    pending: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
    cancelled: { color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
    completed: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Completed' }
  };

  const statusInfo = statusConfig[status] || statusConfig.confirmed;

  return (
    <Card variant="default" className={className}>
      <CardHeader
        title={`${date} at ${time}`}
        subtitle={doctor}
       icon={<InfoIcon size={24} />}
        action={
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        }
      />
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-gray-700">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-gray-700">Room 304, 3rd Floor</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Please arrive 15 minutes early and bring your ID and insurance card.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter align="between">
        {status === 'confirmed' && (
          <>
            <button 
              onClick={onReschedule}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Reschedule
            </button>
            <button 
              onClick={onCancel}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Cancel
            </button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export const InfoCard = ({
  title,
  description,
 icon = <InfoIcon size={24} />,
  variant = 'info',
  action,
  className = ''
}) => {
  const variantIcons = {
    info: <AlertCircle size={24} className="text-blue-600" />,
    success: <CheckCircle size={24} className="text-green-600" />,
    warning: <AlertCircle size={24} className="text-amber-600" />,
    danger: <AlertCircle size={24} className="text-red-600" />
  };

  return (
    <Card variant={variant} className={className}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg">
          {variantIcons[variant] || icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">{title}</h4>
          <p className="text-gray-600">{description}</p>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const ElderlyCard = ({ children, className = '' }) => {
  return (
    <Card 
      variant="elderly" 
      padding="large"
      elevated
      className={className}
    >
      <div className="text-center">
        {children}
      </div>
    </Card>
  );
};

export default Card;