import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  FileText, 
  Pill,
  Droplets,
  Utensils,
  Heart,
  UserPlus,
  Phone,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Thermometer,
  Stethoscope,
  Activity
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';
import { PrimaryButton, OutlineButton } from '../common/Button';

const Instructions = ({ appointmentType = 'general', specialInstructions = [], onPrint, onDownload }) => {
  const { settings } = useAccessibility();
  const [expandedSections, setExpandedSections] = useState({
    before: true,
    during: false,
    after: false,
    emergency: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAppointmentInstructions = () => {
    const baseInstructions = {
      general: {
        before: [
          'Arrive 15 minutes before your scheduled appointment',
          'Bring your government-issued ID (Aadhar Card, Passport, etc.)',
          'Carry your health insurance card and policy details',
          'Bring a list of current medications with dosages',
          'Wear comfortable, loose-fitting clothing',
          'Bring any relevant medical records or test results',
          'Complete any pre-appointment forms online if provided'
        ],
        during: [
          'Check in at the reception desk upon arrival',
          'Inform staff of any changes in your health condition',
          'Be prepared to discuss your symptoms in detail',
          'Ask questions if something is unclear',
          'Take notes if needed or request written instructions',
          'Inform the doctor about all medications and supplements'
        ],
        after: [
          'Follow the treatment plan provided by your doctor',
          'Schedule follow-up appointments if recommended',
          'Take medications as prescribed',
          'Monitor your symptoms and note any changes',
          'Contact the clinic if symptoms worsen',
          'Keep your appointment summary for future reference'
        ],
        emergency: [
          'For medical emergencies, call 102 or visit nearest emergency room',
          'If experiencing chest pain, difficulty breathing, or severe bleeding, seek immediate help',
          'Keep emergency contact numbers handy',
          'Inform family members about your appointment details'
        ]
      },
      bloodTest: {
        before: [
          'Fast for 8-12 hours before the test (water is allowed)',
          'Continue taking prescribed medications unless instructed otherwise',
          'Drink plenty of water the day before',
          'Avoid strenuous exercise 24 hours before',
          'Get adequate sleep the night before',
          'Wear clothing with loose sleeves for easy access'
        ],
        during: [
          'Inform technician if you have a history of fainting',
          'Stay relaxed and breathe normally',
          'Look away if you are uncomfortable with needles',
          'Apply pressure to the puncture site after completion'
        ],
        after: [
          'Keep the bandage on for 30-60 minutes',
          'Avoid heavy lifting with the punctured arm for 24 hours',
          'Drink plenty of fluids',
          'Results will be available in 24-48 hours',
          'Schedule follow-up to discuss results'
        ]
      },
      scan: {
        before: [
          'Follow specific preparation instructions provided',
          'Remove all metal objects and jewelry',
          'Inform staff if you have any implants or devices',
          'Wear comfortable, metal-free clothing',
          'Arrive 30 minutes before for paperwork'
        ],
        during: [
          'Remain still during the procedure',
          'Follow breathing instructions if given',
          'Communicate any discomfort immediately',
          'The procedure typically takes 15-45 minutes'
        ],
        after: [
          'You can resume normal activities immediately',
          'Drink plenty of water if contrast was used',
          'Results will be reviewed by a specialist',
          'Follow-up appointment will be scheduled'
        ]
      },
      surgery: {
        before: [
          'Complete all pre-operative tests',
          'Follow fasting instructions (typically 8 hours)',
          'Arrange for transportation home',
          'Bring a companion for support',
          'Pack an overnight bag if staying',
          'Follow medication instructions carefully'
        ],
        during: [
          'You will be monitored throughout',
          'Family will be updated periodically',
          'The surgical team will ensure your comfort'
        ],
        after: [
          'Follow post-operative care instructions',
          'Take prescribed pain medication as directed',
          'Attend all follow-up appointments',
          'Monitor for signs of infection',
          'Gradually resume activities as advised'
        ]
      }
    };

    return baseInstructions[appointmentType] || baseInstructions.general;
  };

  const instructions = getAppointmentInstructions();

  const renderInstructionItem = (instruction, index, icon = CheckCircle) => {
    const IconComponent = icon;
    const isDark = settings.mode === 'dark' || settings.visuallyImpaired;
    
    return (
      <li key={index} className="flex items-start gap-3 py-2">
        <div className={`p-1 rounded mt-0.5 ${
          icon === AlertCircle 
            ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' 
            : 'bg-green-100 text-green-600 dark:bg-emerald-900/40 dark:text-emerald-300'
        }`}>
          <IconComponent size={16} />
        </div>
        <span className={`flex-1 text-gray-700 dark:text-gray-300 ${
          settings.mode === 'elderly' ? 'text-lg leading-relaxed' : ''
        }`}>
          {instruction}
        </span>
      </li>
    );
  };

  const renderSection = (title, items, sectionKey, icon, isEmergency = false) => {
    const IconComponent = icon;
    const isDark = settings.mode === 'dark';
    
    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`
            w-full flex items-center justify-between p-4 rounded-xl 
            transition-all duration-200 mb-2 group
            ${isDark 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 hover:border-gray-600' 
              : 'bg-gradient-to-r from-gray-50 to-white hover:bg-gray-100 border border-gray-200'
            } dark:border-slate-700
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-lg shadow-sm ${isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
              } dark:border-slate-700
            `}>
              <IconComponent size={20} className={
                isEmergency 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-primary-600 dark:text-primary-400'
              } />
            </div>
            <h3 className={`
              font-bold ${settings.mode === 'elderly' ? 'text-xl' : 'text-lg'}
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              {title}
            </h3>
          </div>
          <div className={`
            ${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500'}
          `}>
            {expandedSections[sectionKey] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {expandedSections[sectionKey] && (
          <div className="animate-fade-in">
            <Card className="mt-2" variant={isDark ? 'dark' : 'light'}>
              <ul className="space-y-1">
                {items.map((item, index) => 
                  renderInstructionItem(item, index, isEmergency ? AlertCircle : CheckCircle)
                )}
              </ul>
              
              {/* Special Notes for Each Section */}
              {sectionKey === 'before' && (
                <div className={`
                  mt-6 p-4 rounded-lg border ${
                    isDark 
                      ? 'bg-blue-900/20 border-blue-800/40' 
                      : 'bg-blue-50 border-blue-200'
                  }
                `}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={18} className={
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    } />
                    <h4 className={`font-semibold ${
                      isDark ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      Important Notes
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Utensils size={16} className={
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      } />
                      <span className={`text-sm ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Fasting may be required for some tests
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill size={16} className={
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      } />
                      <span className={`text-sm ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Bring all current medications
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className={
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      } />
                      <span className={`text-sm ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Complete forms in advance if possible
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} className={
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      } />
                      <span className={`text-sm ${
                        isDark ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Bring a companion if needed
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    );
  };

  const isDark = settings.mode === 'dark';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`
          inline-flex p-4 rounded-full mb-4 ${
            isDark 
              ? 'bg-gradient-to-r from-primary-900/30 to-blue-900/30 border border-primary-800/40' 
              : 'bg-gradient-to-r from-primary-100 to-blue-100'
          }
        `}>
          <FileText size={48} className={
            isDark ? 'text-primary-400' : 'text-primary-600'
          } />
        </div>
        <h1 className={`
          font-bold mb-3 ${settings.mode === 'elderly' ? 'text-3xl' : 'text-2xl'}
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Appointment Instructions
        </h1>
        <p className={`
          max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}
        `}>
          Follow these guidelines to ensure a smooth appointment experience. 
          Your preparation helps us provide you with the best care.
        </p>
      </div>

      {/* Appointment Type Indicator */}
      <div className={`
        p-6 rounded-2xl border ${
          isDark 
            ? 'bg-gradient-to-r from-primary-900/20 to-blue-900/20 border-primary-800/40' 
            : 'bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200'
        }
      `}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`
              text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              {appointmentType === 'general' ? 'General Consultation' :
               appointmentType === 'bloodTest' ? 'Blood Test Appointment' :
               appointmentType === 'scan' ? 'Imaging/Scan Appointment' :
               'Surgical Procedure'}
            </h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Please read all instructions carefully before your appointment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} className={
              isDark ? 'text-primary-400' : 'text-primary-600'
            } />
            <span className={`
              font-bold ${isDark ? 'text-primary-300' : 'text-primary-700'}
            `}>
              Estimated Time: {
                appointmentType === 'general' ? '30-45 minutes' :
                appointmentType === 'bloodTest' ? '15-30 minutes' :
                appointmentType === 'scan' ? '45-90 minutes' :
                'Varies by procedure'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Instructions Sections */}
      <div className="space-y-2">
        {renderSection(
          'Before Your Appointment',
          instructions.before,
          'before',
          Clock
        )}

        {renderSection(
          'During Your Appointment',
          instructions.during,
          'during',
          UserPlus
        )}

        {renderSection(
          'After Your Appointment',
          instructions.after,
          'after',
          CheckCircle
        )}

        {renderSection(
          'Emergency Information',
          instructions.emergency,
          'emergency',
          AlertCircle,
          true
        )}
      </div>

      {/* Special Instructions */}
      {specialInstructions.length > 0 && (
        <Card variant="warning">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <AlertCircle size={24} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-3 text-gray-900 dark:text-white">
                Special Instructions for You
              </h3>
              <ul className="space-y-2">
                {specialInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {instruction}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Medication Instructions */}
      <Card variant={isDark ? 'darkInfo' : 'info'}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
            <Pill size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">
              Medication Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`
                  font-semibold mb-2 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }
                `}>
                  ✅ Do Continue
                </h4>
                <ul className={`
                  text-sm space-y-1 ${
                    isDark ? 'text-emerald-300' : 'text-emerald-700'
                  }
                `}>
                  <li>• Prescribed maintenance medications</li>
                  <li>• Blood pressure medications</li>
                  <li>• Heart medications</li>
                  <li>• Thyroid medications</li>
                </ul>
              </div>
              <div>
                <h4 className={`
                  font-semibold mb-2 ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }
                `}>
                  ❌ Check With Doctor
                </h4>
                <ul className={`
                  text-sm space-y-1 ${
                    isDark ? 'text-amber-300' : 'text-amber-700'
                  }
                `}>
                  <li>• Blood thinners (aspirin, warfarin)</li>
                  <li>• Diabetes medications</li>
                  <li>• Herbal supplements</li>
                  <li>• Over-the-counter pain relievers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Hydration & Nutrition */}
      <Card variant={isDark ? 'dark' : 'light'}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-emerald-900/40">
            <Droplets size={24} className="text-green-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">
              Hydration & Nutrition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`
                  text-4xl font-bold mb-2 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }
                `}>
                  8+
                </div>
                <p className={`
                  text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}
                `}>
                  Glasses of water daily before appointment
                </p>
              </div>
              <div className="text-center">
                <div className={`
                  text-4xl font-bold mb-2 ${
                    isDark ? 'text-emerald-400' : 'text-green-600'
                  }
                `}>
                  2
                </div>
                <p className={`
                  text-sm ${isDark ? 'text-emerald-300' : 'text-green-700'}
                `}>
                  Days of light, healthy meals before
                </p>
              </div>
              <div className="text-center">
                <div className={`
                  text-4xl font-bold mb-2 ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }
                `}>
                  0
                </div>
                <p className={`
                  text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}
                `}>
                  Alcohol 24 hours before appointment
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* For Elderly Patients */}
      {settings.mode === 'elderly' && (
        <Card variant={isDark ? 'darkElderly' : 'elderly'}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <Heart size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className={`
                font-bold text-xl mb-3 ${
                  isDark ? 'text-blue-300' : 'text-blue-800'
                }
              `}>
                👵 Special Considerations for Elderly Patients
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`
                    font-semibold mb-2 ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }
                  `}>
                    Comfort & Safety
                  </h4>
                  <ul className={`
                    space-y-2 ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }
                  `}>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Bring a family member or caregiver</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Use wheelchair assistance if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Take rest breaks during waiting</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className={`
                    font-semibold mb-2 ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }
                  `}>
                    Communication
                  </h4>
                  <ul className={`
                    space-y-2 ${
                      isDark ? 'text-blue-300' : 'text-blue-700'
                    }
                  `}>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Ask for large print instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Request slower speaking pace if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Bring hearing aids if you use them</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Health Metrics Card */}
      <Card variant={isDark ? 'dark' : 'light'}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/40">
            <Activity size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">
              Health Metrics to Track
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Thermometer className="mx-auto mb-2 text-red-500 dark:text-red-400" size={20} />
                <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">98.6°F</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Activity className="mx-auto mb-2 text-blue-500 dark:text-blue-400" size={20} />
                <div className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">120/80</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Stethoscope className="mx-auto mb-2 text-green-500 dark:text-green-400" size={20} />
                <div className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">72 BPM</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="mx-auto mb-2 text-amber-500 dark:text-amber-400" size={20} />
                <div className="text-sm text-gray-600 dark:text-gray-400">Sleep</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">7-8 hrs</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card variant={isDark ? 'dark' : 'light'}>
        <h3 className={`
          font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          Need Help or Have Questions?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`
            p-4 rounded-lg ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-50 border border-gray-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-3">
              <Phone size={24} className={
                isDark ? 'text-primary-400' : 'text-primary-600'
              } />
              <div>
                <h4 className={`
                  font-semibold ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Phone Support
                </h4>
                <p className={`
                  text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Available 24/7
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className={`
                font-bold text-lg ${isDark ? 'text-red-400' : 'text-red-600'}
              `}>
                102
              </p>
              <p className={`
                text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Medical Emergency
              </p>
              <p className={`
                font-bold text-lg ${isDark ? 'text-primary-300' : 'text-primary-700'}
              `}>
                1800-123-4567
              </p>
              <p className={`
                text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}
              `}>
                Appointment Support
              </p>
            </div>
          </div>
          
          <div className={`
            p-4 rounded-lg ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-50 border border-gray-200'
            }
          `}>
            <div className="flex items-center gap-3 mb-3">
              <FileText size={24} className={
                isDark ? 'text-primary-400' : 'text-primary-600'
              } />
              <div>
                <h4 className={`
                  font-semibold ${isDark ? 'text-white' : 'text-gray-900'}
                `}>
                  Document Support
                </h4>
                <p className={`
                  text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  Download or print instructions
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <OutlineButton 
                onClick={onDownload}
                icon={Download}
                fullWidth
                variant={isDark ? 'dark' : 'light'}
              >
                Download PDF
              </OutlineButton>
              <OutlineButton 
                onClick={onPrint}
                icon={Printer}
                fullWidth
                variant={isDark ? 'dark' : 'light'}
              >
                Print Instructions
              </OutlineButton>
            </div>
          </div>
        </div>
      </Card>

      {/* Final Reminder */}
      <div className={`
        p-6 rounded-2xl border ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-emerald-800/40' 
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
        }
      `}>
        <div className="flex items-center gap-4">
          <CheckCircle size={32} className={
            isDark ? 'text-emerald-400' : 'text-green-600'
          } />
          <div>
            <h3 className={`
              text-xl font-bold mb-2 ${
                isDark ? 'text-emerald-300' : 'text-green-800'
              }
            `}>
              You're All Set!
            </h3>
            <p className={isDark ? 'text-emerald-200' : 'text-green-700'}>
              Following these instructions will help ensure your appointment goes smoothly. 
              If you have any questions or need to reschedule, please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;