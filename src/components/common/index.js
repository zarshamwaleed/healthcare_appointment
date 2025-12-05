// Export all common components
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Loader } from './Loader';
export { default as Modal } from './Modal';
export { default as Navigation } from './Navigation';

// Named exports from Button
export { 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton,
  ElderlyButton,
  SuccessButton,
  DangerButton,
  BookAppointmentButton,
  SearchButton,
  NextButton,
  AddButton,
  ProfileButton
} from './Button';

// Named exports from Card
export { 
  DoctorCard, 
  AppointmentCard,
  ElderlyCard 
} from './Card';

// Named exports from Modal
export { 
  ConfirmationModal,
  AppointmentModal,
  ElderlyModal 
} from './Modal';

// Named exports from Loader
export { 
  PageLoader,
  InlineLoader,
  ElderlyLoader 
} from './Loader';

// Named exports from Navigation
export { 
  TopNavigation,
  SidebarNavigation 
} from './Navigation';
