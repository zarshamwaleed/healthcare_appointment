import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Check, 
  X, 
  Users, 
  Star, 
  Zap,
  Sunrise,
  Sunset,
  Coffee,
  Moon,
  Filter,
  Calendar,
  AlertCircle,
  TrendingDown,
  Timer,
  ChevronRight,
  Battery,
  Shield,
  Sparkles,
  Heart,
  ArrowRight,
  Loader
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const TimeSlots = ({ selectedDate, onTimeSelect, selectedTime }) => {
  const { settings } = useAccessibility();
  const [timeSlots, setTimeSlots] = useState([]);
  const [timePeriod, setTimePeriod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    showPeak: true,
    showRecommended: true,
    showPriority: true,
    maxWaitTime: 45,
    minDoctors: 1,
    morningOnly: false
  });

  const timePeriods = [
    { 
      id: 'all', 
      name: 'All Day', 
      icon: <Clock size={20} />,
      gradient: 'from-blue-500 to-indigo-500',
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'morning', 
      name: 'Morning', 
      icon: <Sunrise size={20} />,
      gradient: 'from-orange-500 to-yellow-500',
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      id: 'afternoon', 
      name: 'Afternoon', 
      icon: <Coffee size={20} />,
      gradient: 'from-amber-500 to-orange-500',
      color: 'text-amber-600 dark:text-amber-400'
    },
    { 
      id: 'evening', 
      name: 'Evening', 
      icon: <Sunset size={20} />,
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600 dark:text-purple-400'
    },
    { 
      id: 'night', 
      name: 'Night', 
      icon: <Moon size={20} />,
      gradient: 'from-indigo-500 to-blue-500',
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  useEffect(() => {
    if (!selectedDate) return;

    const generateTimeSlots = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const slots = [];
        const baseDate = selectedDate;
        const isWeekend = baseDate.getDay() === 0 || baseDate.getDay() === 6;
        
        // Time slot configurations
        const slotConfigs = [
          { hour: 9, period: 'morning', isPeak: false, isPriority: true },
          { hour: 10, period: 'morning', isPeak: true, isPriority: true },
          { hour: 11, period: 'morning', isPeak: true, isPriority: false },
          { hour: 12, period: 'afternoon', isPeak: true, isPriority: false },
          { hour: 13, period: 'afternoon', isPeak: true, isPriority: false },
          { hour: 14, period: 'afternoon', isPeak: false, isPriority: true },
          { hour: 15, period: 'afternoon', isPeak: false, isPriority: true },
          { hour: 16, period: 'evening', isPeak: true, isPriority: false },
          { hour: 17, period: 'evening', isPeak: true, isPriority: false },
          { hour: 18, period: 'evening', isPeak: false, isPriority: true },
          { hour: 19, period: 'night', isPeak: false, isPriority: true },
          { hour: 20, period: 'night', isPeak: false, isPriority: true }
        ];

        slotConfigs.forEach(config => {
          // Skip if morning only filter is on and not morning
          if (filters.morningOnly && config.period !== 'morning') return;

          // Random availability
          const isAvailable = Math.random() > 0.25;
          const waitTime = config.isPeak ? 
            (isWeekend ? 45 + Math.floor(Math.random() * 15) : 30 + Math.floor(Math.random() * 15)) :
            (isWeekend ? 20 + Math.floor(Math.random() * 10) : 15 + Math.floor(Math.random() * 10));
          
          const crowdLevel = config.isPeak ? 
            (isWeekend ? 'High' : 'Medium') : 
            'Low';
          
          const doctorAvailability = config.isPriority ? 
            Math.floor(Math.random() * 2) + 2 : // 2-3 doctors for priority
            Math.floor(Math.random() * 2) + 1;  // 1-2 doctors otherwise

          const isRecommended = !config.isPeak && config.hour >= 14 && config.hour <= 16;
          const isPopular = (config.hour === 10 || config.hour === 14) && isAvailable;
          const isBestValue = !config.isPeak && config.hour >= 15 && waitTime <= 20;

          // Get period color
          const periodInfo = timePeriods.find(p => p.id === config.period);
          
          slots.push({
            id: `${config.period}-${config.hour}`,
            time: `${config.hour.toString().padStart(2, '0')}:00`,
            period: config.period,
            periodInfo,
            isAvailable,
            isPeak: config.isPeak,
            isPriority: config.isPriority,
            waitTime: `${waitTime} min`,
            crowdLevel,
            doctorAvailability,
            isRecommended,
            isPopular,
            isBestValue,
            energyLevel: config.isPeak ? 'High' : 'Normal',
            successRate: isAvailable ? 95 - (config.isPeak ? 10 : 0) : 0,
            slotQuality: isRecommended ? 'Excellent' : config.isPeak ? 'Fair' : 'Good'
          });
        });

        setTimeSlots(slots);
        setLoading(false);
      }, 500);
    };

    generateTimeSlots();
  }, [selectedDate, filters.morningOnly]);

  const filteredSlots = useMemo(() => {
    let result = timeSlots;

    if (timePeriod !== 'all') {
      result = result.filter(slot => slot.period === timePeriod);
    }

    if (!filters.showPeak) {
      result = result.filter(slot => !slot.isPeak);
    }

    if (filters.showRecommended) {
      result = result.filter(slot => slot.isRecommended || slot.isBestValue);
    }

    if (filters.showPriority && settings.mode === 'elderly') {
      result = result.filter(slot => slot.isPriority);
    }

    result = result.filter(slot => 
      parseInt(slot.waitTime) <= filters.maxWaitTime &&
      slot.doctorAvailability >= filters.minDoctors
    );

    return result;
  }, [timeSlots, timePeriod, filters, settings.mode]);

  const getSlotQualityColor = (quality) => {
    switch(quality) {
      case 'Excellent': return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'Good': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Fair': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-400';
    }
  };

  const SlotCard = ({ slot }) => {
    const isSelected = selectedTime === slot.time;
    
    return (
      <div
        onClick={() => slot.isAvailable && onTimeSelect(slot.time)}
        className={`
          relative group cursor-pointer transition-all duration-300
          ${!slot.isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}
          ${isSelected ? 'ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2' : ''}
        `}
      >
        {/* Quality Indicator Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${getSlotQualityColor(slot.slotQuality)}`} />
        
        <div className={`
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow
          ${!slot.isAvailable ? 'bg-gray-50 dark:bg-gray-900/50' : ''}
        `}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {slot.time}
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 ${slot.periodInfo.color} bg-opacity-10`}>
                {slot.periodInfo.icon}
                <span className="capitalize">{slot.period}</span>
              </div>
            </div>
            
            {/* Availability Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              slot.isAvailable 
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {slot.isAvailable ? 'Available' : 'Booked'}
            </div>
          </div>

          {/* Slot Details */}
          {slot.isAvailable && (
            <div className="space-y-3">
              {/* Status Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {slot.waitTime} wait
                  </span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  slot.crowdLevel === 'Low' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                    slot.crowdLevel === 'Medium'
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                }`}>
                  {slot.crowdLevel} Crowd
                </div>
              </div>

              {/* Doctors & Quality */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {slot.doctorAvailability} doctors
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {slot.slotQuality} Quality
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1">
                {slot.isPriority && settings.mode === 'elderly' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    <Shield size={10} />
                    Priority
                  </span>
                )}
                {slot.isBestValue && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                    <Sparkles size={10} />
                    Best Value
                  </span>
                )}
                {slot.isRecommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                    <Heart size={10} />
                    Recommended
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
                <Check size={16} />
                Selected Time
              </div>
            </div>
          )}

          {/* Booked State */}
          {!slot.isAvailable && (
            <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 mt-3">
              <X size={16} />
              <span>Fully Booked</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getPeriodStats = () => {
    const stats = {};
    timePeriods.forEach(period => {
      const periodSlots = timeSlots.filter(s => s.period === period.id);
      const available = periodSlots.filter(s => s.isAvailable).length;
      const total = periodSlots.length;
      
      stats[period.id] = {
        available,
        total,
        percentage: total > 0 ? Math.round((available / total) * 100) : 0,
        avgWait: periodSlots.length > 0 
          ? Math.round(periodSlots.reduce((sum, s) => sum + parseInt(s.waitTime), 0) / periodSlots.length)
          : 0
      };
    });
    
    return stats;
  };

  const stats = getPeriodStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg shadow">
                <Clock size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select Time Slot
              </h1>
            </div>
            
            {selectedDate ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2">
                  <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {filteredSlots.length} available slots
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Please select a date first to view available times
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            
            {selectedDate && (
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                View All Slots
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wait Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Max Wait Time: {filters.maxWaitTime} min
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={filters.maxWaitTime}
                onChange={(e) => setFilters({...filters, maxWaitTime: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>

            {/* Doctors Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Min Doctors: {filters.minDoctors}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={filters.minDoctors}
                onChange={(e) => setFilters({...filters, minDoctors: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>1</span>
                <span>3</span>
              </div>
            </div>

            {/* Toggle Filters */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showPeak}
                  onChange={(e) => setFilters({...filters, showPeak: e.target.checked})}
                  className="rounded text-primary-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Show Peak Hours</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.showRecommended}
                  onChange={(e) => setFilters({...filters, showRecommended: e.target.checked})}
                  className="rounded text-primary-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Recommended Only</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.morningOnly}
                  onChange={(e) => setFilters({...filters, morningOnly: e.target.checked})}
                  className="rounded text-primary-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Morning Only</span>
              </label>
              {settings.mode === 'elderly' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.showPriority}
                    onChange={(e) => setFilters({...filters, showPriority: e.target.checked})}
                    className="rounded text-primary-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Priority Slots Only</span>
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Time Period Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Time Periods</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredSlots.length} slots
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {timePeriods.map(period => {
            const periodStats = stats[period.id];
            const isActive = timePeriod === period.id;
            
            return (
              <button
                key={period.id}
                onClick={() => setTimePeriod(period.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all relative overflow-hidden
                  ${isActive 
                    ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                  }
                `}
              >
                {/* Background Gradient */}
                {isActive && (
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${period.gradient}`} />
                )}
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`
                      p-2 rounded-lg ${isActive 
                        ? 'bg-gradient-to-r from-white to-gray-50 shadow' 
                        : 'bg-gray-100 dark:bg-gray-700'
                      }
                    `}>
                      {period.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 dark:text-white">{period.name}</div>
                      {periodStats && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {periodStats.available}/{periodStats.total} slots
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {periodStats && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Avg wait: {periodStats.avgWait} min
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Grid */}
      {!selectedDate ? (
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full mb-4">
            <Calendar size={48} className="text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Select a Date First</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Choose a date from the calendar to view available time slots for your appointment.
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin text-primary-600" size={32} />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading available time slots...</p>
        </div>
      ) : (
        <>
          {/* Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <TrendingDown className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Wait Time</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.min(...filteredSlots.filter(s => s.isAvailable).map(s => parseInt(s.waitTime)))} min
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Users className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Doctors Available</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.max(...filteredSlots.filter(s => s.isAvailable).map(s => s.doctorAvailability))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-purple-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                  <Zap className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Peak Hours</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredSlots.filter(s => s.isPeak && s.isAvailable).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSlots.map(slot => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>

          {filteredSlots.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Slots Available</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your filters or select a different date to see more availability.
              </p>
            </div>
          )}
        </>
      )}

      {/* Selected Time Details */}
      {selectedTime && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-primary-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <Clock size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Selected Time Slot</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })} • {selectedTime}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                // Scroll to confirmation button or proceed
                document.querySelector('button[onClick*="setShowConfirmModal"]')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              Proceed to Confirm
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preparation Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Check size={18} className="text-emerald-600 dark:text-emerald-400" />
                Preparation Checklist
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Arrive 15 minutes before your appointment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Bring valid ID and insurance information
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Complete digital forms in advance if available
                  </span>
                </li>
              </ul>
            </div>

            {/* Location & Reminders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-blue-600 dark:text-blue-400" />
                Reminders
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    You'll receive a confirmation email shortly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Check-in at Reception Desk A, 3rd Floor
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Free cancellation up to 24 hours before
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Suggestions */}
      <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">💡 Smart Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Timer className="text-emerald-600 dark:text-emerald-400" size={20} />
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Fastest Appointment</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Book early morning slots (9:00-10:00 AM) for shortest wait times.
            </p>
            <button 
              onClick={() => {
                const morningSlot = filteredSlots.find(s => s.time.startsWith('09:') || s.time.startsWith('10:'));
                if (morningSlot) onTimeSelect(morningSlot.time);
              }}
              className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1"
            >
              Book Fast Slot <ChevronRight size={16} />
            </button>
          </div>
          
          {settings.mode === 'elderly' && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="text-blue-600 dark:text-blue-400" size={20} />
                <h4 className="font-semibold text-blue-800 dark:text-blue-300">Elderly Priority</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Priority morning slots with extended consultation time available.
              </p>
              <button 
                onClick={() => {
                  const prioritySlot = filteredSlots.find(s => s.isPriority);
                  if (prioritySlot) onTimeSelect(prioritySlot.time);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
              >
                View Priority Slots <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;