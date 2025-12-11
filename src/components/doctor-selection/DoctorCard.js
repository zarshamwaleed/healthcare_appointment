import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Users,
  Phone,
  Video,
  Calendar,
  Shield,
  Heart,
  Check,
  TrendingUp,
  Languages,
  Wallet,
  Building,
  Navigation,
  ChevronRight,
  MessageSquare,
  PhoneCall
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import Card from '../common/Card';

const DoctorCard = ({
  doctor,
  isSelected = false,
  onSelect,
  onBook,
  onViewProfile,
  variant = 'grid',
  className = ''
}) => {
  const { settings } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    name,
    specialty,
    rating,
    experience,
    availability,
    nextAvailable,
    consultationFee,
    distance,
    languages = [],
    isRecommended = false,
    isPriority = false,
    isElderlyFriendly = false,
    telemedicine = false,
    description,
    hospital,
    waitTime,
    patientReviews,
    education = [],
    achievements = []
  } = doctor;

  const handleSelect = () => {
    if (onSelect) {
      onSelect(doctor);
    }
  };

  const handleBook = (e) => {
    e.stopPropagation();
    if (onBook) {
      onBook(doctor);
    }
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(doctor);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={14} className="text-amber-500 fill-amber-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={14} className="text-amber-500 fill-amber-500" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-gray-300" />);
      }
    }

    return stars;
  };

  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'Available Today':
        return 'bg-green-100 text-green-800';
      case 'Available This Week':
        return 'bg-blue-100 text-blue-800';
      case 'Limited Slots':
        return 'bg-amber-100 text-amber-800';
      case 'Booked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCompactView = () => (
    <Card
      interactive
      selected={isSelected}
      onClick={handleSelect}
      className={`hover:shadow-lg transition-all duration-200 ${className} ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center">
            <Users size={28} className="text-primary-600" />
          </div>
          {isRecommended && (
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <TrendingUp size={12} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg truncate text-gray-900 dark:text-white">{name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{specialty}</p>
            </div>
            <div className="flex items-center gap-1">
              {renderRatingStars(rating)}
              <span className="font-bold ml-1">{rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span>{experience} years</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{distance} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>₹{consultationFee}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availability)} dark:bg-opacity-20`}>{availability}</span>
            <button
              onClick={handleBook}
              className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderGridView = () => (
    <Card
      interactive
      selected={isSelected}
      onClick={handleSelect}
      className={`hover:shadow-xl transition-all duration-200 ${className} ${
        isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : ''
      }`}
    >
      {/* Header with Badges */}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl flex items-center justify-center">
                <Users size={28} className="text-primary-600" />
              </div>
              {isPriority && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{specialty}</p>
            </div>
          </div>
          
            <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1 text-gray-900 dark:text-white">
              {renderRatingStars(rating)}
              <span className="font-bold ml-1">{rating}</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">₹{consultationFee}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Consultation Fee</span>
          </div>
        </div>

        {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
          {isRecommended && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center gap-1 dark:bg-amber-900/20 dark:text-amber-300">
              <TrendingUp size={10} />
              Recommended
            </span>
          )}
          {isElderlyFriendly && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1 dark:bg-blue-900/20 dark:text-blue-200">
              <Shield size={10} />
              Elderly Friendly
            </span>
          )}
          {telemedicine && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1 dark:bg-green-900/20 dark:text-green-200">
              <Video size={10} />
              Telemedicine
            </span>
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(availability)}`}>
            {availability}
          </span>
        </div>
      </div>

      {/* Doctor Details */}
          <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
            <Award size={16} className="text-gray-500 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{experience} years</p>
            </div>
          </div>
          
              <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-500">Next Available</p>
              <p className="font-medium">{nextAvailable}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-medium">{distance} km</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Building size={16} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Hospital</p>
              <p className="font-medium truncate">{hospital}</p>
            </div>
          </div>
        </div>

        {/* Languages */}
          {languages.length > 0 && (
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-gray-500 dark:text-gray-300" />
            <div className="flex flex-wrap gap-1">
              {languages.map((lang, index) => (
                <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{patientReviews}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">Patient Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{waitTime}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">Avg Wait Time</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleViewProfile}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          <ChevronRight size={16} />
          View Profile
        </button>
        <button
          onClick={handleBook}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Calendar size={16} />
          Book Now
        </button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        </div>
      )}
    </Card>
  );

  const renderExpandedView = () => (
    <Card className={`${className} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <Users size={36} className="text-primary-600" />
              </div>
              <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                {isRecommended && (
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <TrendingUp size={12} className="text-white" />
                  </div>
                )}
                {isPriority && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart size={12} className="text-white" />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-gray-600 text-lg">{specialty}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  {renderRatingStars(rating)}
                  <span className="font-bold ml-1">{rating}</span>
                  <span className="text-gray-500">({patientReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-gray-500" />
                  <span>{experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">₹{consultationFee}</div>
            <div className="text-sm text-gray-500">Consultation Fee</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1.5 rounded-full font-medium ${getAvailabilityColor(availability)}`}>
            {availability} • Next: {nextAvailable}
          </span>
          {isElderlyFriendly && (
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium flex items-center gap-1">
              <Shield size={14} />
              Elderly Friendly
            </span>
          )}
          {telemedicine && (
            <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-medium flex items-center gap-1">
              <Video size={14} />
              Telemedicine Available
            </span>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Hospital & Location</h4>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Building size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{hospital}</p>
                  <p className="text-gray-600 text-sm">{distance} km away</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Navigation size={14} className="text-primary-600" />
                    <span className="text-sm text-primary-600">Wheelchair accessible • Free parking</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Languages Spoken</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gray-100 rounded-lg font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {education.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Education</h4>
                <ul className="space-y-1">
                  {education.map((edu, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={14} className="text-green-600" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">About Dr. {name.split(' ')[1]}</h4>
              <p className="text-gray-700">{description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Patient Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{patientReviews}</div>
                  <div className="text-sm text-blue-600">Patient Reviews</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{waitTime}</div>
                  <div className="text-sm text-green-600">Average Wait Time</div>
                </div>
              </div>
            </div>

            {achievements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Achievements</h4>
                <ul className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Award size={14} className="text-amber-600" />
                      <span className="text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleSelect}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
              isSelected
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
            }`}
          >
            {isSelected ? (
              <>
                <Check size={20} />
                Selected
              </>
            ) : (
              'Select This Doctor'
            )}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleViewProfile}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <MessageSquare size={18} />
              Contact
            </button>
            <button
              onClick={handleBook}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Calendar size={18} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  switch(variant) {
    case 'compact':
      return renderCompactView();
    case 'expanded':
      return renderExpandedView();
    case 'grid':
    default:
      return renderGridView();
  }
};

export default DoctorCard;