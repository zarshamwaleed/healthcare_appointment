import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  Heart, 
  Star, 
  Zap,
  CheckCircle,
  Info,
  User,
  Calendar
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const PriorityIndicator = ({ urgencyLevel = 'normal', userType = 'standard', symptoms = [] }) => {
  const { settings } = useAccessibility();
  const [isVisible, setIsVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const priorityLevels = {
    emergency: {
      level: 1,
      label: 'Emergency',
      color: 'from-red-500 to-red-600',
      darkColor: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: <AlertTriangle size={24} />,
      description: 'Immediate medical attention required',
      waitTime: 'Immediate',
      recommendation: 'Go to emergency room or call 102'
    },
    urgent: {
      level: 2,
      label: 'Urgent',
      color: 'from-amber-500 to-orange-600',
      darkColor: 'from-amber-600 to-orange-700',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      textColor: 'text-amber-700 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      icon: <Zap size={24} />,
      description: 'Same-day appointment recommended',
      waitTime: 'Within 2 hours',
      recommendation: 'Book today or visit urgent care'
    },
    high: {
      level: 3,
      label: 'High Priority',
      color: 'from-violet-500 to-purple-600',
      darkColor: 'from-violet-600 to-purple-700',
      bgColor: 'bg-violet-50 dark:bg-violet-950/20',
      textColor: 'text-violet-700 dark:text-violet-300',
      borderColor: 'border-violet-200 dark:border-violet-800',
      icon: <Shield size={24} />,
      description: 'Priority booking within 24 hours',
      waitTime: '24 hours',
      recommendation: 'Schedule within next business day'
    },
    normal: {
      level: 4,
      label: 'Normal',
      color: 'from-blue-500 to-blue-600',
      darkColor: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: <Clock size={24} />,
      description: 'Routine care',
      waitTime: '2-3 days',
      recommendation: 'Schedule at your convenience'
    },
    low: {
      level: 5,
      label: 'Low Priority',
      color: 'from-emerald-500 to-green-600',
      darkColor: 'from-emerald-600 to-green-700',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle size={24} />,
      description: 'Non-urgent follow-up',
      waitTime: '1-2 weeks',
      recommendation: 'Schedule within 2 weeks'
    }
  };

  const userPriorities = {
    elderly: {
      icon: <User size={20} />,
      label: 'Elderly Priority',
      benefits: ['Priority slots', 'Extended consultation', 'Wheelchair access'],
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    pregnant: {
      icon: <Heart size={20} />,
      label: 'Maternity Priority',
      benefits: ['Priority booking', 'Specialist care', 'Extended time'],
      color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    disability: {
      icon: <Shield size={20} />,
      label: 'Accessibility Priority',
      benefits: ['Wheelchair access', 'Sign language support', 'Priority seating'],
      color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300',
      borderColor: 'border-violet-200 dark:border-violet-800'
    },
    veteran: {
      icon: <Star size={20} />,
      label: 'Veteran Priority',
      benefits: ['Priority access', 'Dedicated staff', 'Expedited service'],
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800'
    }
  };

  const currentPriority = priorityLevels[urgencyLevel] || priorityLevels.normal;
  const userPriority = userPriorities[userType];

  const emergencySymptoms = [
    'chest pain', 'difficulty breathing', 'severe bleeding',
    'sudden paralysis', 'loss of consciousness', 'severe head injury'
  ];

  const urgentSymptoms = [
    'high fever', 'severe pain', 'uncontrolled vomiting',
    'severe dehydration', 'sudden vision loss'
  ];

  const getSymptomSeverity = () => {
    const hasEmergency = symptoms.some(s => 
      emergencySymptoms.includes(s.toLowerCase())
    );
    const hasUrgent = symptoms.some(s => 
      urgentSymptoms.includes(s.toLowerCase())
    );

    if (hasEmergency) return 'emergency';
    if (hasUrgent) return 'urgent';
    if (symptoms.length >= 3) return 'high';
    return 'normal';
  };

  const determinePriority = () => {
    const symptomSeverity = getSymptomSeverity();
    
    // User type adjustments
    if (userType === 'elderly' && symptomSeverity === 'normal') {
      return 'high'; // Elderly get priority even for normal symptoms
    }
    
    return symptomSeverity;
  };

  const calculatedPriority = determinePriority();
  const displayPriority = priorityLevels[calculatedPriority];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-20 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
        aria-label="Show priority indicator"
      >
        <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Priority Indicator */}
      <div className={`relative overflow-hidden rounded-2xl border-2 ${displayPriority.borderColor} ${displayPriority.bgColor} p-6 animate-fade-in`}>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Close priority indicator"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Priority Icon */}
          <div className={`p-4 rounded-xl bg-gradient-to-br ${displayPriority.color} dark:${displayPriority.darkColor} text-white shadow-lg`}>
            {displayPriority.icon}
          </div>

          {/* Priority Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayPriority.label} Priority</h2>
              <span className={`px-3 py-1 rounded-full ${displayPriority.textColor} ${displayPriority.bgColor} border ${displayPriority.borderColor} text-sm font-semibold`}>
                Level {displayPriority.level}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">{displayPriority.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Expected Wait</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{displayPriority.waitTime}</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Recommendation</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-300">{displayPriority.recommendation}</p>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Based On</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-300">
                  {symptoms.length > 0 ? `${symptoms.length} symptoms` : 'User profile'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Low Priority</span>
            <span>High Priority</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${displayPriority.color} dark:${displayPriority.darkColor} transition-all duration-500`}
              style={{ width: `${(1 - (displayPriority.level - 1) / 4) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            {Object.values(priorityLevels).map(level => (
              <div
                key={level.label}
                className={`text-center ${calculatedPriority === Object.keys(priorityLevels).find(k => priorityLevels[k] === level) ? 'font-bold text-gray-900 dark:text-white' : ''}`}
              >
                {level.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User-Specific Priority Benefits */}
      {userPriority && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${userPriority.color} border ${userPriority.borderColor}`}>
              {userPriority.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{userPriority.label} Activated</h3>
              <p className="text-gray-600 dark:text-gray-400">Special benefits for your user category</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {userPriority.benefits.map((benefit, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-200">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-blue-700 dark:text-blue-300">
            These benefits are automatically applied to your appointment booking.
          </div>
        </div>
      )}

      {/* Symptom-Based Priority Breakdown */}
      {symptoms.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">How Your Priority Was Determined</h3>
            <span className="text-gray-500 dark:text-gray-400">{expanded ? '▲' : '▼'}</span>
          </button>
          
          {expanded && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Your Symptoms</h4>
                  <div className="space-y-2">
                    {symptoms.map((symptom, index) => {
                      const isEmergency = emergencySymptoms.includes(symptom.toLowerCase());
                      const isUrgent = urgentSymptoms.includes(symptom.toLowerCase());
                      
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            isEmergency ? 'bg-red-500' :
                            isUrgent ? 'bg-amber-500' :
                            'bg-blue-500'
                          }`}></div>
                          <span className="text-gray-900 dark:text-gray-300">{symptom}</span>
                          {isEmergency && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                              Emergency
                            </span>
                          )}
                          {isUrgent && !isEmergency && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Priority Factors</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded mt-0.5">
                        <AlertTriangle size={12} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-300">Symptom Severity:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {calculatedPriority === 'emergency' ? 'Emergency symptoms detected' :
                           calculatedPriority === 'urgent' ? 'Urgent symptoms present' :
                           'Routine symptoms only'}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded mt-0.5">
                        <User size={12} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-300">User Category:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userType ? `${userType.replace('-', ' ')} priority applied` : 'Standard user'}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded mt-0.5">
                        <Clock size={12} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-300">Time Sensitivity:</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Based on symptom urgency and recommended response time
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-300">
                  <Info size={16} className="text-gray-600 dark:text-gray-400" />
                  What This Means For You
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your {displayPriority.label.toLowerCase()} priority level means you should {
                    calculatedPriority === 'emergency' ? 'seek immediate medical attention.' :
                    calculatedPriority === 'urgent' ? 'book an appointment within the next few hours.' :
                    calculatedPriority === 'high' ? 'schedule an appointment within 24 hours.' :
                    'book at your convenience within the next few days.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-emerald-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">✅ Recommended Action</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                {calculatedPriority === 'emergency' ? 'Call emergency services or visit nearest ER immediately' :
                 calculatedPriority === 'urgent' ? 'Book same-day appointment using priority slots' :
                 'Schedule appointment using the calendar below'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Keep emergency contacts accessible</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Monitor symptoms and seek help if they worsen</span>
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-300">📞 Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-gray-900 dark:text-gray-300">Medical Emergency</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">102</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">24/7 Ambulance Service</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="font-semibold text-gray-900 dark:text-gray-300">Poison Control</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">1-800-222-1222</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">24/7 Poison Helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Comparison */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Priority Level Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="p-3 text-left text-gray-900 dark:text-gray-300">Priority</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-300">Response Time</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-300">Booking Window</th>
                <th className="p-3 text-left text-gray-900 dark:text-gray-300">Typical Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priorityLevels).map(([key, level]) => (
                <tr 
                  key={key}
                  className={`border-t border-gray-200 dark:border-gray-700 ${
                    calculatedPriority === key ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${level.color} dark:${level.darkColor}`}></div>
                      <span className={`font-medium ${
                        calculatedPriority === key ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-300'
                      }`}>
                        {level.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-300">{level.waitTime}</td>
                  <td className="p-3 text-gray-900 dark:text-gray-300">
                    {key === 'emergency' ? 'Immediate' :
                     key === 'urgent' ? 'Same day' :
                     key === 'high' ? '24 hours' :
                     key === 'normal' ? '2-3 days' : '1-2 weeks'}
                  </td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {key === 'emergency' ? 'Chest pain, severe bleeding' :
                     key === 'urgent' ? 'High fever, severe pain' :
                     key === 'high' ? 'Multiple symptoms, elderly' :
                     key === 'normal' ? 'Routine checkup' : 'Follow-up'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriorityIndicator;