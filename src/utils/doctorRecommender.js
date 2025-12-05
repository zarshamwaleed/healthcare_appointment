import { DEPARTMENT_MAPPING } from './constants';

export const recommendDoctor = (symptoms, userType) => {
  if (!symptoms || symptoms.length === 0) {
    return ['General Physician'];
  }

  // Convert symptoms to lowercase for matching
  const lowerSymptoms = symptoms.map(s => s.toLowerCase());
  
  // Find all matching departments
  const matchedDepartments = new Set();
  
  lowerSymptoms.forEach(symptom => {
    if (DEPARTMENT_MAPPING[symptom]) {
      DEPARTMENT_MAPPING[symptom].forEach(dept => matchedDepartments.add(dept));
    }
  });

  // If no specific match, return General Physician
  if (matchedDepartments.size === 0) {
    return ['General Physician'];
  }

  // Convert Set to Array
  let recommendations = Array.from(matchedDepartments);

  // Adjust recommendations based on user type
  if (userType === 'elderly') {
    // Elderly patients often need GP first
    if (!recommendations.includes('General Physician')) {
      recommendations.unshift('General Physician');
    }
  }

  // Prioritize emergency departments for critical symptoms
  const criticalSymptoms = ['chest pain', 'difficulty breathing', 'severe pain'];
  const hasCriticalSymptom = lowerSymptoms.some(symptom => 
    criticalSymptoms.includes(symptom)
  );

  if (hasCriticalSymptom) {
    if (!recommendations.includes('Emergency')) {
      recommendations.unshift('Emergency');
    }
  }

  // Remove duplicates and limit to 3 recommendations
  recommendations = [...new Set(recommendations)].slice(0, 3);

  return recommendations;
};

export const getUrgencyLevel = (symptoms) => {
  const urgentSymptoms = [
    'chest pain', 'difficulty breathing', 'severe bleeding',
    'sudden paralysis', 'severe headache', 'high fever'
  ];

  const lowerSymptoms = symptoms.map(s => s.toLowerCase());
  
  const urgentCount = lowerSymptoms.filter(symptom => 
    urgentSymptoms.includes(symptom)
  ).length;

  if (urgentCount > 0) return 'urgent';
  if (symptoms.length >= 3) return 'high';
  return 'normal';
};

export const filterDoctorsBySpecialty = (doctors, specialties) => {
  return doctors.filter(doctor => 
    specialties.some(specialty => 
      doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    )
  );
};