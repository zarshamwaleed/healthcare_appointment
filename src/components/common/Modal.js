import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  overlay = true,
  closeOnOverlayClick = true,
  showHeader = true,
  footer,
  type = 'default',
  icon,
  className = '',
  ariaLabel,
  disableEscapeClose = false,
  focusFirstElement = true
}) => {
  const { settings } = useAccessibility();
  const { theme } = useTheme();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !disableEscapeClose) {
        onClose();
      }
    };

    const handleFocus = () => {
      if (focusFirstElement && isOpen) {
        const modalElement = document.querySelector('.modal-content');
        const focusableElements = modalElement?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements?.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      handleFocus();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, disableEscapeClose, focusFirstElement]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getSizeClasses = () => {
    if (settings.mode === 'elderly') {
      switch(size) {
        case 'small': return 'max-w-lg';
        case 'medium': return 'max-w-2xl';
        case 'large': return 'max-w-4xl';
        case 'full': return 'max-w-full mx-4';
        default: return 'max-w-2xl';
      }
    }

    switch(size) {
      case 'small': return 'max-w-md';
      case 'medium': return 'max-w-lg';
      case 'large': return 'max-w-3xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-lg';
    }
  };

  const getTypeClasses = () => {
    switch(type) {
      case 'success':
        return 'border-green-200 dark:border-green-700';
      case 'warning':
        return 'border-amber-200 dark:border-amber-700';
      case 'danger':
        return 'border-red-200 dark:border-red-700';
      case 'info':
        return 'border-blue-200 dark:border-blue-700';
      default:
        return 'border-gray-200 dark:border-slate-700';
    }
  };

  const getTypeIcon = () => {
    if (icon) return icon;
    
    switch(type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  const getTypeColors = () => {
    switch(type) {
      case 'success':
        return { bg: 'bg-green-50 dark:bg-green-900', text: 'text-green-800 dark:text-green-100' };
      case 'warning':
        return { bg: 'bg-amber-50 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-100' };
      case 'danger':
        return { bg: 'bg-red-50 dark:bg-red-900', text: 'text-red-800 dark:text-red-100' };
      case 'info':
        return { bg: 'bg-blue-50 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-100' };
      default:
        return { bg: 'bg-white dark:bg-slate-800', text: 'text-gray-900 dark:text-gray-100' };
    }
  };

  const typeColors = getTypeColors();
  const typeIcon = getTypeIcon();

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Modal Container */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabel ? undefined : "modal-title"}
        aria-label={ariaLabel}
      >
        <div 
          className={`
            modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl 
            ${getSizeClasses()} 
            ${getTypeClasses()} 
            ${className}
            animate-modal-in
            ${settings.mode === 'elderly' ? 'text-lg' : ''}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {showHeader && (
            <div className={`px-6 py-4 border-b ${typeColors.bg} ${typeColors.text} rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {typeIcon && (
                    <div className="p-2 bg-white rounded-lg">
                      {typeIcon}
                    </div>
                  )}
                  <h2 
                    id="modal-title"
                    className={`font-bold ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}`}
                  >
                    {title}
                  </h2>
                </div>
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={settings.mode === 'elderly' ? 24 : 20} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Modal Footer Component
export const ModalFooter = ({ 
  children, 
  align = 'end',
  className = '' 
}) => {
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex items-center gap-3 ${alignmentClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

// Pre-configured Modal Components
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="small"
    >
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>
        
        <ModalFooter align="end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export const InfoModal = ({
  isOpen,
  onClose,
  title,
  message,
  icon = <Info className="w-8 h-8 text-blue-600" />,
  buttonText = 'OK'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type="info"
      size="small"
      showHeader={false}
    >
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-blue-100 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{message}</p>
        <div className="pt-4">
          <Button
            variant="primary"
            onClick={onClose}
            fullWidth
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const AppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  onReschedule
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="medium"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{appointment?.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold">{appointment?.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-semibold">{appointment?.doctor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{appointment?.location}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Preparation Instructions</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Arrive 15 minutes before appointment</li>
            <li>• Bring your ID and insurance card</li>
            <li>• List of current medications</li>
            <li>• Wear comfortable clothing</li>
          </ul>
        </div>

        <ModalFooter align="between">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onReschedule}
            >
              Reschedule
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
            >
              Confirm Booking
            </Button>
          </div>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export const ElderlyModal = ({
  isOpen,
  onClose,
  title,
  children,
  buttonText = 'Close'
}) => {
  const { settings } = useAccessibility();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={settings.mode === 'elderly' ? 'large' : 'medium'}
      showCloseButton={false}
    >
      <div className="space-y-6">
        <div className={`${settings.mode === 'elderly' ? 'text-xl' : 'text-base'}`}>
          {children}
        </div>
        
        <div className="text-center">
          <Button
            variant="elderly"
            onClick={onClose}
            fullWidth
            size={settings.mode === 'elderly' ? 'large' : 'medium'}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const HelpModal = ({
  isOpen,
  onClose,
  title = 'Need Help?',
  helpItems = []
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="medium"
      icon={<HelpCircle className="w-6 h-6 text-purple-600" />}
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Here are some resources that might help you:
        </p>
        
        <div className="space-y-3">
          {helpItems.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <ModalFooter align="end">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default Modal;