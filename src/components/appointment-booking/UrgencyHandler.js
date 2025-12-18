import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Heart, 
  Brain, 
  Thermometer,
  Eye,
  Ear,
  Wind,
  Bone,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Check
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useUser } from '../../context/UserContext';

const UrgencyHandler = ({ symptoms = [], onUrgencyChange }) => {
  const { settings } = useAccessibility();
  const { user } = useUser();
  const [urgencyScore, setUrgencyScore] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [symptomAnalysis, setSymptomAnalysis] = useState([]);
  const [showEmergency, setShowEmergency] = useState(false);

  // Emergency symptoms database
  const emergencySymptoms = [
    { id: 'chest-pain', name: 'Chest Pain', icon: <Heart size={20} />, severity: 10, system: 'Cardiac' },
    { id: 'breathing', name: 'Difficulty Breathing', icon: <Wind size={20} />, severity: 9, system: 'Respiratory' },
    { id: 'bleeding', name: 'Severe Bleeding', icon: <Activity size={20} />, severity: 10, system: 'Circulatory' },
    { id: 'paralysis', name: 'Sudden Paralysis', icon: <Brain size={20} />, severity: 10, system: 'Neurological' },
    { id: 'head-injury', name: 'Severe Head Injury', icon: <Brain size={20} />, severity: 9, system: 'Neurological' },
    { id: 'unconscious', name: 'Loss of Consciousness', icon: <Activity size={20} />, severity: 10, system: 'Neurological' }
  ];

  const urgentSymptoms = [
    { id: 'high-fever', name: 'High Fever (>103°F)', icon: <Thermometer size={20} />, severity: 8, system: 'General' },
    { id: 'severe-pain', name: 'Severe Pain', icon: <Activity size={20} />, severity: 7, system: 'General' },
    { id: 'vomiting', name: 'Uncontrolled Vomitation', icon: <Activity size={20} />, severity: 7, system: 'Gastrointestinal' },
    { id: 'vision-loss', name: 'Sudden Vision Loss', icon: <Eye size={20} />, severity: 9, system: 'Ophthalmic' },
    { id: 'dehydration', name: 'Severe Dehydration', icon: <Activity size={20} />, severity: 8, system: 'General' }
  ];

  const moderateSymptoms = [
    { id: 'persistent-fever', name: 'Persistent Fever', icon: <Thermometer size={20} />, severity: 6, system: 'General' },
    { id: 'rash', name: 'Widespread Rash', icon: <Activity size={20} />, severity: 5, system: 'Dermatological' },
    { id: 'joint-pain', name: 'Severe Joint Pain', icon: <Bone size={20} />, severity: 6, system: 'Musculoskeletal' },
    { id: 'dizziness', name: 'Persistent Dizziness', icon: <Brain size={20} />, severity: 5, system: 'Neurological' },
    { id: 'hearing-loss', name: 'Sudden Hearing Loss', icon: <Ear size={20} />, severity: 7, system: 'ENT' }
  ];

  useEffect(() => {
    analyzeSymptoms();
  }, [symptoms, user]);

  const analyzeSymptoms = () => {
    if (!symptoms.length) {
      setUrgencyScore(0);
      setUrgencyLevel('normal');
      setRecommendedAction('Please describe your symptoms for urgency assessment.');
      setSymptomAnalysis([]);
      return;
    }

    let totalScore = 0;
    const analysis = [];
    let hasEmergency = false;
    let hasUrgent = false;

    // Convert symptoms to lowercase for matching
    const lowerSymptoms = symptoms.map(s => s.toLowerCase());

    // Check for emergency symptoms
    emergencySymptoms.forEach(symptom => {
      if (lowerSymptoms.some(s => s.includes(symptom.name.toLowerCase().split(' ')[0]))) {
        totalScore += symptom.severity;
        analysis.push({
          ...symptom,
          detected: true,
          level: 'emergency'
        });
        hasEmergency = true;
      }
    });

    // Check for urgent symptoms
    urgentSymptoms.forEach(symptom => {
      if (lowerSymptoms.some(s => s.includes(symptom.name.toLowerCase().split(' ')[0]))) {
        totalScore += symptom.severity;
        analysis.push({
          ...symptom,
          detected: true,
          level: 'urgent'
        });
        hasUrgent = true;
      }
    });

    // Check for moderate symptoms
    moderateSymptoms.forEach(symptom => {
      if (lowerSymptoms.some(s => s.includes(symptom.name.toLowerCase().split(' ')[0]))) {
        totalScore += symptom.severity;
        analysis.push({
          ...symptom,
          detected: true,
          level: 'moderate'
        });
      }
    });

    // Add points for multiple symptoms
    if (symptoms.length >= 3) totalScore += 3;
    if (symptoms.length >= 5) totalScore += 2;

    // Adjust for user age (elderly get higher priority)
    if (user.age && user.age > 60) {
      totalScore += 3;
    }

    // Adjust for digital literacy (low literacy users might under-report)
    if (user.digitalLiteracy === 'low') {
      totalScore += 2;
    }

    // Determine urgency level
    let level = 'normal';
    let action = '';

    if (hasEmergency) {
      level = 'emergency';
      action = '🚨 EMERGENCY: Seek immediate medical attention. Call 102 or go to nearest emergency room.';
      setShowEmergency(true);
    } else if (hasUrgent || totalScore >= 15) {
      level = 'urgent';
      action = '⚠️ URGENT: Book same-day appointment or visit urgent care within 2 hours.';
    } else if (totalScore >= 10) {
      level = 'high';
      action = '🔴 HIGH PRIORITY: Schedule appointment within 24 hours.';
    } else if (totalScore >= 5) {
      level = 'moderate';
      action = '🟡 MODERATE: Book appointment within 2-3 days.';
    } else {
      level = 'normal';
      action = '🟢 NORMAL: Schedule routine appointment at your convenience.';
    }

    setUrgencyScore(totalScore);
    setUrgencyLevel(level);
    setRecommendedAction(action);
    setSymptomAnalysis(analysis);
    
    // Notify parent component
    if (onUrgencyChange) {
      onUrgencyChange(level);
    }
  };

  const getUrgencyColor = (level) => {
    switch(level) {
      case 'emergency': return 'from-red-600 to-red-700';
      case 'urgent': return 'from-amber-600 to-orange-600';
      case 'high': return 'from-violet-600 to-purple-700';
      case 'moderate': return 'from-blue-600 to-blue-700';
      default: return 'from-emerald-600 to-green-700';
    }
  };

  const getUrgencyIcon = (level) => {
    switch(level) {
      case 'emergency': return <AlertTriangle size={24} />;
      case 'urgent': return <Zap size={24} />;
      case 'high': return <Shield size={24} />;
      case 'moderate': return <Clock size={24} />;
      default: return <Check size={24} />;
    }
  };

  const getUrgencyLabel = (level) => {
    switch(level) {
      case 'emergency': return 'EMERGENCY';
      case 'urgent': return 'URGENT';
      case 'high': return 'HIGH PRIORITY';
      case 'moderate': return 'MODERATE';
      default: return 'NORMAL';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Urgency Display */}
      <div className={`bg-gradient-to-r ${getUrgencyColor(urgencyLevel)} text-white p-6 rounded-2xl shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              {getUrgencyIcon(urgencyLevel)}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{getUrgencyLabel(urgencyLevel)}</h2>
              <p className="text-white/90">Based on {symptoms.length} reported symptoms</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold">{urgencyScore}</div>
            <div className="text-white/80">Urgency Score</div>
          </div>
        </div>
      </div>

      {/* Emergency Alert (if applicable) */}
      {showEmergency && (
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <AlertTriangle size={32} className="animate-bounce" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">🚨 IMMEDIATE ATTENTION REQUIRED</h3>
                <p className="text-lg mt-2">
                  Based on your symptoms, you need emergency medical care immediately.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white/20 rounded-xl">
                <h4 className="font-bold mb-2">What to do now:</h4>
                <ol className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="font-bold">1.</span>
                    <span>Call 102 for emergency ambulance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">2.</span>
                    <span>Go to nearest emergency room</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">3.</span>
                    <span>Do not drive yourself</span>
                  </li>
                </ol>
              </div>
              
              <div className="p-4 bg-white/20 rounded-xl">
                <h4 className="font-bold mb-2">Emergency Contacts:</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xl font-bold">102</div>
                    <div className="text-sm">Ambulance & Emergency</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">108</div>
                    <div className="text-sm">Disaster Management</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.open('tel:102')}
              className="w-full mt-6 py-4 bg-white text-red-600 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
            >
              📞 CALL EMERGENCY: 102
            </button>
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <ChevronRight size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Recommended Action</h3>
            <p className="text-blue-700 dark:text-blue-400">{recommendedAction}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-300">Response Time</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {urgencyLevel === 'emergency' ? 'Immediate' :
               urgencyLevel === 'urgent' ? 'Within 2 hours' :
               urgencyLevel === 'high' ? '24 hours' :
               urgencyLevel === 'moderate' ? '2-3 days' : '1-2 weeks'}
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-300">Care Setting</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {urgencyLevel === 'emergency' ? 'Emergency Room' :
               urgencyLevel === 'urgent' ? 'Urgent Care' :
               'Clinic Appointment'}
            </p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-300">Priority Level</h4>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getUrgencyColor(urgencyLevel)}`}></div>
              <span className="text-xl font-bold capitalize text-gray-900 dark:text-white">{urgencyLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Analysis */}
      {symptomAnalysis.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Symptom Analysis</h3>
          
          <div className="space-y-4">
            {symptomAnalysis.map((symptom, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  symptom.level === 'emergency' ? 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20' :
                  symptom.level === 'urgent' ? 'border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' :
                  'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      symptom.level === 'emergency' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' :
                      symptom.level === 'urgent' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300' :
                      'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                    }`}>
                      {symptom.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{symptom.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          symptom.level === 'emergency' ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' :
                          symptom.level === 'urgent' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                          'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                        }`}>
                          {symptom.level.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{symptom.system} System</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{symptom.severity}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Severity Score</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Symptom Impact</span>
                    <span>{symptom.severity}/10</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        symptom.level === 'emergency' ? 'bg-red-500' :
                        symptom.level === 'urgent' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${symptom.severity * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgency Scale Explanation */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Understanding Urgency Levels</h3>
        
        <div className="space-y-3">
          {[
            { level: 'emergency', label: 'Emergency', color: 'bg-red-500', description: 'Life-threatening conditions requiring immediate care' },
            { level: 'urgent', label: 'Urgent', color: 'bg-amber-500', description: 'Serious conditions needing same-day attention' },
            { level: 'high', label: 'High Priority', color: 'bg-violet-500', description: 'Conditions requiring care within 24 hours' },
            { level: 'moderate', label: 'Moderate', color: 'bg-blue-500', description: 'Conditions that should be addressed within days' },
            { level: 'normal', label: 'Normal', color: 'bg-emerald-500', description: 'Routine care or follow-up appointments' }
          ].map((item, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border-2 ${
                urgencyLevel === item.level 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 bg-opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.label}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      item.level === 'emergency' ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' :
                      item.level === 'urgent' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                      item.level === 'high' ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300' :
                      item.level === 'moderate' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' :
                      'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      Score: {item.level === 'emergency' ? '25+' :
                             item.level === 'urgent' ? '15-24' :
                             item.level === 'high' ? '10-14' :
                             item.level === 'moderate' ? '5-9' : '0-4'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors & Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-emerald-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">Factors Increasing Urgency</h3>
          <ul className="space-y-2 text-emerald-700 dark:text-emerald-400">
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Age over 60 or under 2 years</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Chronic conditions (diabetes, heart disease)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Weakened immune system</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Multiple symptoms present</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span>Symptoms worsening rapidly</span>
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-300">When to Seek Immediate Help</h3>
          <ul className="space-y-2 text-blue-700 dark:text-blue-400">
            <li className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <span>Chest pain or pressure</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <span>Difficulty breathing</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <span>Severe bleeding</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <span>Sudden weakness or numbness</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              <span>Thoughts of self-harm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Next Steps Based on Your Urgency Level</h3>
        
        <div className="space-y-4">
          {urgencyLevel === 'emergency' && (
            <div className="space-y-2">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <h4 className="font-bold text-red-800 dark:text-red-300 mb-2">IMMEDIATE ACTION REQUIRED</h4>
                <ol className="space-y-2 text-red-700 dark:text-red-400">
                  <li className="flex items-center gap-2">
                    <span className="font-bold">1.</span>
                    <span>Call 102 for emergency ambulance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">2.</span>
                    <span>Do not eat or drink anything</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">3.</span>
                    <span>Have someone stay with you</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">4.</span>
                    <span>Bring medications list to hospital</span>
                  </li>
                </ol>
              </div>
            </div>
          )}
          
          {urgencyLevel === 'urgent' && (
            <div className="space-y-2">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">URGENT CARE NEEDED</h4>
                <ol className="space-y-2 text-amber-700 dark:text-amber-400">
                  <li className="flex items-center gap-2">
                    <span className="font-bold">1.</span>
                    <span>Book same-day appointment using priority slots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">2.</span>
                    <span>Visit urgent care center if no appointments available</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">3.</span>
                    <span>Monitor symptoms closely</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-bold">4.</span>
                    <span>Go to ER if symptoms worsen</span>
                  </li>
                </ol>
              </div>
            </div>
          )}
          
          {(urgencyLevel === 'high' || urgencyLevel === 'moderate' || urgencyLevel === 'normal') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">1. Book Appointment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use the calendar to schedule your appointment within the recommended timeframe.
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">2. Monitor Symptoms</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep track of your symptoms and note any changes or worsening.
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">3. Prepare for Visit</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bring your ID, insurance information, and list of current medications.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            💡 <strong>Note:</strong> This urgency assessment is based on the symptoms you've reported. 
            If your symptoms change or worsen, reassess your urgency level or seek immediate medical attention.
          </p>
        </div>
      </div>

      {/* Accessibility Note */}
      {settings.mode === 'elderly' && (
        <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20 rounded-2xl border border-blue-300 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300">Elderly User Priority</h3>
              <p className="text-blue-700 dark:text-blue-400">
                As an elderly user, you receive priority booking and extended consultation times. 
                Your urgency level has been adjusted to ensure you receive timely care.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrgencyHandler;        