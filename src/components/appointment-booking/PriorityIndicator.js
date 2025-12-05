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
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: <AlertTriangle size={24} />,
      description: 'Immediate medical attention required',
      waitTime: 'Immediate',
      recommendation: 'Go to emergency room or call 102'
    },
    urgent: {
      level: 2,
      label: 'Urgent',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      icon: <Zap size={24} />,
      description: 'Same-day appointment recommended',
      waitTime: 'Within 2 hours',
      recommendation: 'Book today or visit urgent care'
    },
    high: {
      level: 3,
      label: 'High Priority',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: <Shield size={24} />,
      description: 'Priority booking within 24 hours',
      waitTime: '24 hours',
      recommendation: 'Schedule within next business day'
    },
    normal: {
      level: 4,
      label: 'Normal',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: <Clock size={24} />,
      description: 'Routine care',
      waitTime: '2-3 days',
      recommendation: 'Schedule at your convenience'
    },
    low: {
      level: 5,
      label: 'Low Priority',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
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
      color: 'bg-blue-100 text-blue-800'
    },
    pregnant: {
      icon: <Heart size={20} />,
      label: 'Maternity Priority',
      benefits: ['Priority booking', 'Specialist care', 'Extended time'],
      color: 'bg-pink-100 text-pink-800'
    },
    disability: {
      icon: <Shield size={20} />,
      label: 'Accessibility Priority',
      benefits: ['Wheelchair access', 'Sign language support', 'Priority seating'],
      color: 'bg-purple-100 text-purple-800'
    },
    veteran: {
      icon: <Star size={20} />,
      label: 'Veteran Priority',
      benefits: ['Priority access', 'Dedicated staff', 'Expedited service'],
      color: 'bg-amber-100 text-amber-800'
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
        className="fixed top-20 right-4 z-50 p-3 bg-white rounded-full shadow-lg border hover:shadow-xl transition-shadow"
        aria-label="Show priority indicator"
      >
        <AlertTriangle size={20} className="text-red-500" />
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Priority Indicator */}
      <div className={`relative overflow-hidden rounded-2xl border-2 ${displayPriority.borderColor} ${displayPriority.bgColor} p-6 animate-fade-in`}>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close priority indicator"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Priority Icon */}
          <div className={`p-4 rounded-xl bg-gradient-to-br ${displayPriority.color} text-white shadow-lg`}>
            {displayPriority.icon}
          </div>

          {/* Priority Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{displayPriority.label} Priority</h2>
              <span className={`px-3 py-1 rounded-full ${displayPriority.textColor} ${displayPriority.bgColor} border ${displayPriority.borderColor} text-sm font-semibold`}>
                Level {displayPriority.level}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{displayPriority.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-gray-500" />
                  <span className="font-semibold">Expected Wait</span>
                </div>
                <p className="text-xl font-bold">{displayPriority.waitTime}</p>
              </div>
              
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="font-semibold">Recommendation</span>
                </div>
                <p className="font-medium">{displayPriority.recommendation}</p>
              </div>
              
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Info size={16} className="text-gray-500" />
                  <span className="font-semibold">Based On</span>
                </div>
                <p className="font-medium">
                  {symptoms.length > 0 ? `${symptoms.length} symptoms` : 'User profile'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Low Priority</span>
            <span>High Priority</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${displayPriority.color} transition-all duration-500`}
              style={{ width: `${(1 - (displayPriority.level - 1) / 4) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Object.values(priorityLevels).map(level => (
              <div
                key={level.label}
                className={`text-center ${calculatedPriority === Object.keys(priorityLevels).find(k => priorityLevels[k] === level) ? 'font-bold' : ''}`}
              >
                {level.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User-Specific Priority Benefits */}
      {userPriority && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${userPriority.color}`}>
              {userPriority.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{userPriority.label} Activated</h3>
              <p className="text-gray-600">Special benefits for your user category</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {userPriority.benefits.map((benefit, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="font-medium">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-blue-700">
            These benefits are automatically applied to your appointment booking.
          </div>
        </div>
      )}

      {/* Symptom-Based Priority Breakdown */}
      {symptoms.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-xl font-bold">How Your Priority Was Determined</h3>
            <span className="text-gray-500">{expanded ? '▲' : '▼'}</span>
          </button>
          
          {expanded && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">Your Symptoms</h4>
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
                          <span>{symptom}</span>
                          {isEmergency && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              Emergency
                            </span>
                          )}
                          {isUrgent && !isEmergency && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">Priority Factors</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 rounded mt-0.5">
                        <AlertTriangle size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium">Symptom Severity:</span>
                        <p className="text-sm text-gray-600">
                          {calculatedPriority === 'emergency' ? 'Emergency symptoms detected' :
                           calculatedPriority === 'urgent' ? 'Urgent symptoms present' :
                           'Routine symptoms only'}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 rounded mt-0.5">
                        <User size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium">User Category:</span>
                        <p className="text-sm text-gray-600">
                          {userType ? `${userType.replace('-', ' ')} priority applied` : 'Standard user'}
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 rounded mt-0.5">
                        <Clock size={12} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium">Time Sensitivity:</span>
                        <p className="text-sm text-gray-600">
                          Based on symptom urgency and recommended response time
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info size={16} />
                  What This Means For You
                </h4>
                <p className="text-gray-600">
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
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <h3 className="text-xl font-bold mb-3 text-green-800">✅ Recommended Action</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                {calculatedPriority === 'emergency' ? 'Call emergency services or visit nearest ER immediately' :
                 calculatedPriority === 'urgent' ? 'Book same-day appointment using priority slots' :
                 'Schedule appointment using the calendar below'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Keep emergency contacts accessible</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Monitor symptoms and seek help if they worsen</span>
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
          <h3 className="text-xl font-bold mb-3 text-blue-800">📞 Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <div className="font-semibold">Medical Emergency</div>
              <div className="text-2xl font-bold text-red-600">102</div>
              <p className="text-sm text-gray-600">24/7 Ambulance Service</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="font-semibold">Poison Control</div>
              <div className="text-2xl font-bold text-amber-600">1-800-222-1222</div>
              <p className="text-sm text-gray-600">24/7 Poison Helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Comparison */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200">
        <h3 className="text-xl font-bold mb-4">Priority Level Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Response Time</th>
                <th className="p-3 text-left">Booking Window</th>
                <th className="p-3 text-left">Typical Symptoms</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(priorityLevels).map(([key, level]) => (
                <tr 
                  key={key}
                  className={`border-t ${calculatedPriority === key ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${level.color}`}></div>
                      <span className={`font-medium ${calculatedPriority === key ? 'text-blue-700' : ''}`}>
                        {level.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">{level.waitTime}</td>
                  <td className="p-3">
                    {key === 'emergency' ? 'Immediate' :
                     key === 'urgent' ? 'Same day' :
                     key === 'high' ? '24 hours' :
                     key === 'normal' ? '2-3 days' : '1-2 weeks'}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
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