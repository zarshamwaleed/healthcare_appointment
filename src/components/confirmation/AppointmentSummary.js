import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  Building, 
  Phone, 
  Mail,
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  Star,
  Award,
  Navigation,
  Heart
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';

const AppointmentSummary = ({ appointment, onAction, variant = 'detailed' }) => {
  const { settings } = useAccessibility();

  if (!appointment) {
    return (
      <Card variant="warning" className="text-center py-12">
        <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No Appointment Data</h3>
        <p className="text-gray-600">Appointment details are not available.</p>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const statusColors = getStatusColor(appointment.status);

  const renderCompactView = () => (
    <Card variant="primary" className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{appointment.date}</h3>
              <p className="text-gray-600">{appointment.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope size={16} className="text-gray-500" />
            <span className="font-medium">{appointment.doctor.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Building size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">{appointment.location.name}</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors.bg} ${statusColors.text}`}>
            {appointment.status}
          </span>
          <p className="text-xs text-gray-500 mt-2">ID: {appointment.confirmationNumber}</p>
        </div>
      </div>
    </Card>
  );

  const renderDetailedView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`font-bold mb-2 ${settings.mode === 'elderly' ? 'text-2xl' : 'text-xl'}`}>
              Appointment Summary
            </h2>
            <p className="text-white/90">All your appointment details in one place</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold">{appointment.confirmationNumber}</div>
            <div className="text-sm text-white/80">Confirmation Number</div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl border ${statusColors.border} ${statusColors.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className={statusColors.text} />
            <div>
              <h3 className="font-bold">Status: {appointment.status}</h3>
              <p className="text-sm">
                {appointment.status === 'confirmed' 
                  ? 'Your appointment is confirmed and ready!' 
                  : 'Please check the status for updates.'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Booked on</p>
            <p className="font-medium">{new Date(appointment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Appointment Time */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-2">Appointment Time</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-bold">{appointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-bold">{appointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span>{appointment.estimatedDuration}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Doctor Information */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Stethoscope size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-2">Doctor Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-lg">{appointment.doctor.name}</p>
                    <p className="text-gray-600">{appointment.doctor.specialty}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="font-medium">{appointment.doctor.qualification}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{appointment.doctor.experience}</p>
                    </div>
                  </div>
                  {appointment.doctor.rating && (
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="font-bold">{appointment.doctor.rating}</span>
                      <span className="text-gray-600 text-sm">rating</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Location Information */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-2">Location</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold">{appointment.location.name}</p>
                    <p className="text-gray-600 text-sm">{appointment.location.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Floor/Room</p>
                      <p className="font-medium">
                        {appointment.location.floor} • {appointment.location.room}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{appointment.location.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Navigation size={16} />
                    <span>Wheelchair accessible • Free parking</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Patient Information */}
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <User size={24} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-2">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold">{appointment.patient.name}</p>
                    <p className="text-gray-600">Patient ID: {appointment.patient.patientId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{appointment.patient.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium">{appointment.patient.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{appointment.patient.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <Card>
          <h3 className="font-bold mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Fee</span>
              <span>₹{appointment.fee.consultation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Tax</span>
              <span>₹{appointment.fee.tax}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="text-green-600">₹{appointment.fee.total}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
              <CheckCircle size={16} />
              <span>Payment Status: {appointment.paymentStatus}</span>
            </div>
          </div>
        </Card>

        {/* Symptoms */}
        {appointment.symptoms && appointment.symptoms.length > 0 && (
          <Card variant="info">
            <h3 className="font-bold mb-3">Reported Symptoms</h3>
            <div className="space-y-2">
              {appointment.symptoms.map((symptom, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-blue-600" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Priority & Notes */}
        <Card>
          <h3 className="font-bold mb-3">Additional Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Priority Level</p>
              <p className="font-medium">{appointment.priority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cancellation Policy</p>
              <p className="text-sm">{appointment.cancellationPolicy}</p>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm text-gray-500">Special Notes</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Elderly Support Section */}
      {settings.mode === 'elderly' && (
        <Card variant="elderly">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Heart size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-3">👵 Elderly Support Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Navigation size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Wheelchair Access</p>
                    <p className="text-sm text-gray-600">Ramp and elevator available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Companion Seating</p>
                    <p className="text-sm text-gray-600">Space for family members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Priority Waiting</p>
                    <p className="text-sm text-gray-600">Reduced wait times</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Senior Staff</p>
                    <p className="text-sm text-gray-600">Trained in elderly care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Call to Action */}
      {onAction && (
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button 
            onClick={() => onAction('print')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Print Summary
          </button>
          <button 
            onClick={() => onAction('share')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Share Appointment
          </button>
        </div>
      )}
    </div>
  );

  return variant === 'compact' ? renderCompactView() : renderDetailedView();
};

export default AppointmentSummary;