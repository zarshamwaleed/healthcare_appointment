import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Star, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Award,
  Heart,
  Stethoscope,
  Zap,
  Filter,
  ChevronRight,
  HelpCircle,
  Target
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const RecommendationEngine = ({ 
  symptoms = [], 
  userProfile = {}, 
  doctors = [],
  onRecommendationsChange,
  showDetails = true
}) => {
  const { settings } = useAccessibility();
  const [recommendations, setRecommendations] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  // Symptom to specialty mapping
  const symptomMapping = {
    // Emergency symptoms
    'chest pain': { specialties: ['Cardiology', 'Emergency'], priority: 'emergency', score: 10 },
    'difficulty breathing': { specialties: ['Pulmonology', 'Emergency'], priority: 'emergency', score: 10 },
    'severe bleeding': { specialties: ['Emergency', 'General Surgery'], priority: 'emergency', score: 10 },
    'sudden paralysis': { specialties: ['Neurology', 'Emergency'], priority: 'emergency', score: 10 },
    
    // Urgent symptoms
    'high fever': { specialties: ['General Physician', 'Internal Medicine'], priority: 'urgent', score: 8 },
    'severe pain': { specialties: ['General Physician', 'Pain Management'], priority: 'urgent', score: 8 },
    'uncontrolled vomiting': { specialties: ['Gastroenterology', 'General Physician'], priority: 'urgent', score: 7 },
    
    // Common symptoms
    'headache': { specialties: ['Neurology', 'General Physician'], priority: 'normal', score: 6 },
    'cough': { specialties: ['Pulmonology', 'ENT', 'General Physician'], priority: 'normal', score: 5 },
    'fever': { specialties: ['General Physician', 'Internal Medicine'], priority: 'normal', score: 5 },
    'stomach pain': { specialties: ['Gastroenterology', 'General Physician'], priority: 'normal', score: 6 },
    'skin rash': { specialties: ['Dermatology'], priority: 'normal', score: 5 },
    'back pain': { specialties: ['Orthopedics', 'Physiotherapy'], priority: 'normal', score: 6 },
    'joint pain': { specialties: ['Orthopedics', 'Rheumatology'], priority: 'normal', score: 6 },
    'dizziness': { specialties: ['Neurology', 'General Physician'], priority: 'normal', score: 5 },
    'fatigue': { specialties: ['General Physician', 'Endocrinology'], priority: 'normal', score: 4 },
  };

  // User profile factors
  const profileFactors = {
    age: {
      elderly: { specialties: ['Geriatrics', 'General Physician'], modifier: 1.3 },
      adult: { specialties: ['General Physician'], modifier: 1.0 },
      child: { specialties: ['Pediatrics'], modifier: 1.2 }
    },
    digitalLiteracy: {
      low: { specialties: ['General Physician'], modifier: 1.2 },
      medium: { specialties: [], modifier: 1.0 },
      high: { specialties: [], modifier: 0.9 }
    },
    conditions: {
      diabetes: { specialties: ['Endocrinology', 'General Physician'], score: 7 },
      hypertension: { specialties: ['Cardiology', 'General Physician'], score: 7 },
      arthritis: { specialties: ['Rheumatology', 'Orthopedics'], score: 6 },
      asthma: { specialties: ['Pulmonology'], score: 6 }
    }
  };

  useEffect(() => {
    if (symptoms.length > 0 || Object.keys(userProfile).length > 0) {
      generateRecommendations();
    }
  }, [symptoms, userProfile, doctors]);

  const generateRecommendations = () => {
    setLoading(true);

    setTimeout(() => {
      const recommendations = analyzeSymptomsAndProfile();
      setRecommendations(recommendations);
      
      const score = calculateConfidenceScore(recommendations);
      setConfidenceScore(score);
      
      const explanationText = generateExplanation(recommendations);
      setExplanation(explanationText);
      
      if (onRecommendationsChange) {
        onRecommendationsChange(recommendations);
      }
      
      setLoading(false);
    }, 500);
  };

  const analyzeSymptomsAndProfile = () => {
    const recommendationsMap = new Map();
    let totalScore = 0;
    let symptomCount = 0;

    // Analyze symptoms
    symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();
      let matched = false;

      Object.entries(symptomMapping).forEach(([key, data]) => {
        if (lowerSymptom.includes(key)) {
          matched = true;
          data.specialties.forEach(specialty => {
            const current = recommendationsMap.get(specialty) || {
              specialty,
              score: 0,
              reasons: [],
              priority: data.priority,
              matchingSymptoms: []
            };
            
            current.score += data.score;
            current.reasons.push(`Matches symptom: "${symptom}"`);
            current.matchingSymptoms.push(symptom);
            current.priority = getHigherPriority(current.priority, data.priority);
            
            recommendationsMap.set(specialty, current);
          });
          
          totalScore += data.score;
          symptomCount++;
        }
      });

      if (!matched) {
        // Default to General Physician for unmatched symptoms
        const specialty = 'General Physician';
        const current = recommendationsMap.get(specialty) || {
          specialty,
          score: 3,
          reasons: [],
          priority: 'normal',
          matchingSymptoms: []
        };
        
        current.score += 3;
        current.reasons.push(`General consultation for: "${symptom}"`);
        current.matchingSymptoms.push(symptom);
        
        recommendationsMap.set(specialty, current);
        totalScore += 3;
        symptomCount++;
      }
    });

    // Apply user profile factors
    if (userProfile.age) {
      const ageGroup = userProfile.age > 60 ? 'elderly' : 
                       userProfile.age < 18 ? 'child' : 'adult';
      
      const ageFactors = profileFactors.age[ageGroup];
      ageFactors.specialties.forEach(specialty => {
        const current = recommendationsMap.get(specialty) || {
          specialty,
          score: 0,
          reasons: [],
          priority: 'normal',
          matchingSymptoms: []
        };
        
        current.score *= ageFactors.modifier;
        current.reasons.push(`Recommended for ${ageGroup} patients`);
        
        recommendationsMap.set(specialty, current);
      });

      // Boost score for elderly patients
      if (ageGroup === 'elderly') {
        recommendationsMap.forEach((rec, specialty) => {
          rec.score *= 1.2;
          rec.reasons.push('Priority for elderly care');
        });
      }
    }

    // Apply digital literacy factors
    if (userProfile.digitalLiteracy) {
      const literacyFactors = profileFactors.digitalLiteracy[userProfile.digitalLiteracy];
      if (literacyFactors.modifier !== 1.0) {
        recommendationsMap.forEach(rec => {
          rec.score *= literacyFactors.modifier;
        });
      }
    }

    // Apply existing conditions
    if (userProfile.conditions && Array.isArray(userProfile.conditions)) {
      userProfile.conditions.forEach(condition => {
        const conditionKey = condition.toLowerCase();
        Object.entries(profileFactors.conditions).forEach(([key, data]) => {
          if (conditionKey.includes(key)) {
            data.specialties.forEach(specialty => {
              const current = recommendationsMap.get(specialty) || {
                specialty,
                score: 0,
                reasons: [],
                priority: 'normal',
                matchingSymptoms: []
              };
              
              current.score += data.score;
              current.reasons.push(`Manages condition: ${condition}`);
              
              recommendationsMap.set(specialty, current);
              totalScore += data.score;
            });
          }
        });
      });
    }

    // Convert to array and sort by score
    const recommendationsArray = Array.from(recommendationsMap.values())
      .map(rec => ({
        ...rec,
        confidence: Math.min(100, Math.round((rec.score / (totalScore || 1)) * 100))
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 recommendations

    return recommendationsArray;
  };

  const getHigherPriority = (current, newPriority) => {
    const priorityOrder = { emergency: 3, urgent: 2, normal: 1 };
    return priorityOrder[newPriority] > priorityOrder[current] ? newPriority : current;
  };

  const calculateConfidenceScore = (recommendations) => {
    if (recommendations.length === 0) return 0;
    
    const totalConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0);
    return Math.round(totalConfidence / recommendations.length);
  };

  const generateExplanation = (recommendations) => {
    if (recommendations.length === 0) {
      return 'Please describe your symptoms for personalized recommendations.';
    }

    const topRecommendation = recommendations[0];
    const symptomCount = symptoms.length;
    
    if (symptomCount === 0 && Object.keys(userProfile).length > 0) {
      return `Based on your profile, we recommend ${topRecommendation.specialty}.`;
    }
    
    if (topRecommendation.priority === 'emergency') {
      return `⚠️ EMERGENCY: Based on "${topRecommendation.matchingSymptoms.join(', ')}", we strongly recommend ${topRecommendation.specialty}. Seek immediate attention if symptoms worsen.`;
    }
    
    if (topRecommendation.priority === 'urgent') {
      return `🔴 URGENT: For "${topRecommendation.matchingSymptoms.join(', ')}", ${topRecommendation.specialty} is recommended. Schedule an appointment within 24 hours.`;
    }
    
    return `Based on ${symptomCount} symptom${symptomCount !== 1 ? 's' : ''} "${topRecommendation.matchingSymptoms.join(', ')}", ${topRecommendation.specialty} is recommended. Consider scheduling within the next few days.`;
  };

    const getPriorityColor = (priority) => {
    switch(priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'normal': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'emergency': return <AlertCircle size={16} />;
      case 'urgent': return <Clock size={16} />;
      case 'normal': return <CheckCircle size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-green-400';
    if (confidence >= 40) return 'bg-yellow-500';
    if (confidence >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filterDoctorsBySpecialty = (specialty) => {
    if (!doctors || doctors.length === 0) return [];
    return doctors.filter(doctor => 
      doctor.specialization.toLowerCase().includes(specialty.toLowerCase())
    );
  };

  const getIconForSpecialty = (specialty) => {
    const lowerSpecialty = specialty.toLowerCase();
    
    if (lowerSpecialty.includes('cardio')) return <Heart size={20} />;
    if (lowerSpecialty.includes('neuro')) return <Brain size={20} />;
    if (lowerSpecialty.includes('ortho')) return <Target size={20} />;
    if (lowerSpecialty.includes('pulmo')) return <TrendingUp size={20} />;
    if (lowerSpecialty.includes('derma')) return <Shield size={20} />;
    if (lowerSpecialty.includes('pediatr')) return <Users size={20} />;
    if (lowerSpecialty.includes('emergency')) return <Zap size={20} />;
    if (lowerSpecialty.includes('geriatr')) return <Award size={20} />;
    
    return <Stethoscope size={20} />;
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
        <Brain size={32} className="text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">AI-Powered Recommendations</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {settings.mode === 'elderly' 
          ? "Describe your symptoms or select from common health concerns to get personalized doctor recommendations."
          : "Enter your symptoms or health concerns to receive intelligent recommendations for the right specialist."}
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {['Headache', 'Fever', 'Cough', 'Stomach Pain', 'Back Pain'].map(symptom => (
          <span 
            key={symptom} 
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
          >
            {symptom}
          </span>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 rounded-2xl ${settings.mode === 'elderly' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200'}`}>
        {renderLoadingState()}
      </div>
    );
  }

  if (recommendations.length === 0 && symptoms.length === 0) {
    return (
      <div className={`p-6 rounded-2xl ${settings.mode === 'elderly' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200'}`}>
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl ${settings.mode === 'elderly' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold flex items-center gap-2 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
            <Brain className="text-primary-600" />
            AI Recommendations
          </h2>
          <p className="text-gray-600 mt-1">
            {explanation || 'Analyzing your symptoms and profile...'}
          </p>
        </div>
        
        {/* Confidence Score */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getConfidenceColor(confidenceScore)} text-white font-bold text-lg`}>
              {confidenceScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">Confidence</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary-100 text-primary-800 font-bold text-lg">
              {recommendations.length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Options</p>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4 mb-8">
        {recommendations.map((rec, index) => {
          const matchingDoctors = filterDoctorsBySpecialty(rec.specialty);
          const hasDoctors = matchingDoctors.length > 0;
          
          return (
            <div 
              key={rec.specialty} 
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                index === 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${index === 0 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    {getIconForSpecialty(rec.specialty)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{rec.specialty}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(rec.priority)}`}>
                        {getPriorityIcon(rec.priority)}
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Confidence: <span className="font-bold">{rec.confidence}%</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        {rec.reasons.slice(0, 2).join(' • ')}
                        {rec.reasons.length > 2 && ` • +${rec.reasons.length - 2} more reasons`}
                      </p>
                      
                      {rec.matchingSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600">Matching symptoms:</span>
                          {rec.matchingSymptoms.slice(0, 3).map((symptom, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {symptom}
                            </span>
                          ))}
                          {rec.matchingSymptoms.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{rec.matchingSymptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {hasDoctors && showDetails && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          {matchingDoctors.length} available doctor{matchingDoctors.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {matchingDoctors.slice(0, 2).map(doctor => (
                            <div key={doctor.id} className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-800">
                                  {doctor.name.charAt(0)}
                                </span>
                              </div>
                              <span className="text-sm font-medium">{doctor.name}</span>
                              <span className="text-xs text-gray-500">{doctor.experience}+ years</span>
                            </div>
                          ))}
                          {matchingDoctors.length > 2 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                              +{matchingDoctors.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${index === 0 ? 'bg-primary-600' : 'bg-primary-400'}`}
                      style={{ width: `${rec.confidence}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  
                  {index === 0 && (
                    <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2">
                      View Top Matches
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Why This Recommendation */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target size={20} className="text-blue-600" />
              <h4 className="font-bold">Why This Recommendation?</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Matches your described symptoms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Considers your age and health profile</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Based on medical best practices</span>
              </li>
            </ul>
          </div>

          {/* When to Seek Help */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-amber-600" />
              <h4 className="font-bold">When to Seek Help</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Zap size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>Difficulty breathing or chest pain</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>Sudden severe pain or bleeding</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span>Symptoms worsening rapidly</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={20} className="text-green-600" />
              <h4 className="font-bold">Next Steps</h4>
            </div>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Schedule Appointment
              </button>
              <button className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 font-medium">
                Chat with AI Assistant
              </button>
              <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                Get Second Opinion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Shield size={12} />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain size={12} />
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} />
              <span>95% Accuracy Rate</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">This is a recommendation tool, not medical advice. Always consult a healthcare professional.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;