import React, { useState, useEffect } from 'react';
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
  Moon
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const TimeSlots = ({ selectedDate, onTimeSelect, selectedTime }) => {
  const { settings } = useAccessibility();
  const [timeSlots, setTimeSlots] = useState([]);
  const [timePeriod, setTimePeriod] = useState('all'); // 'morning', 'afternoon', 'evening', 'all'
  const [filteredSlots, setFilteredSlots] = useState([]);

  useEffect(() => {
    // Generate time slots for the selected date
    const generateTimeSlots = () => {
      const slots = [];
      const baseDate = selectedDate || new Date();
      
      // Define time periods
      const periods = [
        { 
          name: 'Morning', 
          start: 9, 
          end: 12, 
          icon: <Sunrise size={16} />, 
          color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800'
        },
        { 
          name: 'Afternoon', 
          start: 12, 
          end: 17, 
          icon: <Coffee size={16} />, 
          color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-800'
        },
        { 
          name: 'Evening', 
          start: 17, 
          end: 20, 
          icon: <Sunset size={16} />, 
          color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300',
          borderColor: 'border-violet-200 dark:border-violet-800'
        },
        { 
          name: 'Night', 
          start: 20, 
          end: 22, 
          icon: <Moon size={16} />, 
          color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700'
        }
      ];

      // Generate slots for each period
      periods.forEach(period => {
        for (let hour = period.start; hour < period.end; hour++) {
          // Random availability (70% chance of being available)
          const isAvailable = Math.random() > 0.3;
          
          // Determine slot type
          let slotType = 'standard';
          let priorityLevel = 'normal';
          
          if (hour >= 9 && hour <= 11) {
            // Morning slots are priority for elderly
            if (settings.mode === 'elderly') {
              slotType = 'elderly-priority';
              priorityLevel = 'high';
            } else if (Math.random() > 0.7) {
              slotType = 'peak';
              priorityLevel = 'medium';
            }
          } else if (hour >= 16 && hour <= 18) {
            // Evening slots are often peak
            if (Math.random() > 0.5) {
              slotType = 'peak';
              priorityLevel = 'medium';
            }
          }
          
          // Calculate wait time
          let waitTime = '15-30 min';
          if (slotType === 'peak') waitTime = '45-60 min';
          if (slotType === 'elderly-priority') waitTime = '10-20 min';
          
          // Determine crowd level
          let crowdLevel = 'Low';
          if (slotType === 'peak') crowdLevel = 'High';
          if (hour === 10 || hour === 14 || hour === 17) crowdLevel = 'Medium';

          slots.push({
            id: `${period.name}-${hour}`,
            time: `${hour.toString().padStart(2, '0')}:00`,
            period: period.name,
            periodIcon: period.icon,
            periodColor: period.color,
            borderColor: period.borderColor,
            isAvailable,
            slotType,
            priorityLevel,
            waitTime,
            crowdLevel,
            doctorAvailability: Math.floor(Math.random() * 3) + 1, // 1-3 doctors
            isRecommended: Math.random() > 0.7,
            isPopular: (hour === 10 || hour === 14) && isAvailable
          });
        }
      });

      return slots;
    };

    setTimeSlots(generateTimeSlots());
  }, [selectedDate, settings.mode]);

  useEffect(() => {
    // Filter slots based on selected period
    if (timePeriod === 'all') {
      setFilteredSlots(timeSlots);
    } else {
      setFilteredSlots(timeSlots.filter(slot => 
        slot.period.toLowerCase() === timePeriod.toLowerCase()
      ));
    }
  }, [timePeriod, timeSlots]);

  const timePeriods = [
    { id: 'all', name: 'All Day', icon: <Clock size={18} /> },
    { id: 'morning', name: 'Morning', icon: <Sunrise size={18} /> },
    { id: 'afternoon', name: 'Afternoon', icon: <Coffee size={18} /> },
    { id: 'evening', name: 'Evening', icon: <Sunset size={18} /> }
  ];

  const getSlotClasses = (slot) => {
    let classes = 'p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 ';
    
    if (!slot.isAvailable) {
      classes += 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700 cursor-not-allowed ';
    } else if (selectedTime === slot.time) {
      classes += 'bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 text-white border-primary-700 dark:border-primary-600 shadow-lg scale-105 ';
    } else {
      classes += 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-400 hover:shadow-md ';
      
      // Slot type styling
      if (slot.slotType === 'elderly-priority') {
        classes += 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 ';
      } else if (slot.slotType === 'peak') {
        classes += 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 ';
      } else if (slot.isRecommended) {
        classes += 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 ';
      } else if (slot.isPopular) {
        classes += 'border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 ';
      }
    }
    
    // Elderly mode adjustments
    if (settings.mode === 'elderly') {
      classes += 'text-lg ';
    }
    
    return classes;
  };

  const getSlotBadge = (slot) => {
    if (!slot.isAvailable) {
      return (
        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
          Booked
        </span>
      );
    }
    
    if (slot.slotType === 'elderly-priority') {
      return (
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1">
          <Star size={10} />
          Elderly Priority
        </span>
      );
    }
    
    if (slot.slotType === 'peak') {
      return (
        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs rounded-full flex items-center gap-1">
          <Zap size={10} />
          Peak Hours
        </span>
      );
    }
    
    if (slot.isRecommended) {
      return (
        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
          Recommended
        </span>
      );
    }
    
    if (slot.isPopular) {
      return (
        <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs rounded-full">
          Popular
        </span>
      );
    }
    
    return null;
  };

  const getTimePeriodStats = () => {
    const stats = {
      morning: { available: 0, total: 0, avgWait: '25 min' },
      afternoon: { available: 0, total: 0, avgWait: '35 min' },
      evening: { available: 0, total: 0, avgWait: '40 min' }
    };
    
    timeSlots.forEach(slot => {
      if (stats[slot.period.toLowerCase()]) {
        stats[slot.period.toLowerCase()].total++;
        if (slot.isAvailable) {
          stats[slot.period.toLowerCase()].available++;
        }
      }
    });
    
    return stats;
  };

  const stats = getTimePeriodStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock size={28} className="text-primary-600 dark:text-primary-400" />
            Select Time Slot
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedDate 
              ? `Available slots for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
              : 'Select a date first to see available times'
            }
          </p>
        </div>
        
        {selectedDate && (
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Available Slots</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {timeSlots.filter(s => s.isAvailable).length} / {timeSlots.length}
            </p>
          </div>
        )}
      </div>

      {/* Time Period Navigation */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Time Periods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timePeriods.map(period => (
            <button
              key={period.id}
              onClick={() => setTimePeriod(period.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                timePeriod === period.id 
                  ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-sm' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  timePeriod === period.id 
                    ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {period.icon}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">{period.name}</div>
                  {period.id !== 'all' && stats[period.id] && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stats[period.id].available} slots
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Period Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {Object.entries(stats).map(([period, data]) => (
            <div key={period} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize text-gray-900 dark:text-gray-300">{period}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  (data.available / data.total) > 0.5 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' :
                  (data.available / data.total) > 0.2 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                }`}>
                  {Math.round((data.available / data.total) * 100)}% available
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.available} <span className="text-lg text-gray-500 dark:text-gray-400">/ {data.total}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Avg wait: {data.avgWait}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slot Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Elderly Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Peak Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Recommended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-violet-100 dark:bg-violet-900/40 border border-violet-300 dark:border-violet-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Popular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Booked</span>
        </div>
      </div>

      {/* Time Slots Grid */}
      {selectedDate ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => slot.isAvailable && onTimeSelect(slot.time)}
              disabled={!slot.isAvailable}
              className={getSlotClasses(slot)}
              aria-label={`${slot.time} - ${slot.period} - ${slot.isAvailable ? 'Available' : 'Booked'}`}
            >
              <div className="space-y-3">
                {/* Time and Period */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{slot.time}</div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${slot.periodColor} border ${slot.borderColor}`}>
                      {slot.periodIcon}
                      {slot.period}
                    </div>
                  </div>
                  {getSlotBadge(slot)}
                </div>

                {/* Slot Details */}
                {slot.isAvailable && (
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Wait Time:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{slot.waitTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Crowd Level:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        slot.crowdLevel === 'Low' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' :
                        slot.crowdLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                        'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                      }`}>
                        {slot.crowdLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Doctors Available:</span>
                      <span className="flex items-center gap-1 text-gray-900 dark:text-white">
                        <Users size={12} />
                        {slot.doctorAvailability}
                      </span>
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {selectedTime === slot.time && (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Check size={20} />
                    <span className="font-semibold">Selected</span>
                  </div>
                )}

                {/* Booked Indicator */}
                {!slot.isAvailable && (
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <X size={20} />
                    <span>Booked</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <Clock size={48} className="text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Date Selected</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Please select a date from the calendar to view available time slots.
          </p>
        </div>
      )}

      {/* Selected Time Details */}
      {selectedTime && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-primary-200 dark:border-gray-700 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <Clock size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Selected Time Slot</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Arrival Instructions</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Arrive 15 minutes early</li>
                <li>• Bring your ID and insurance card</li>
                <li>• Complete digital forms in advance</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Preparation</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Fasting not required</li>
                <li>• Bring current medications list</li>
                <li>• Wear comfortable clothing</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Location</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Main Hospital Building, 3rd Floor<br />
                Check-in at Reception Desk A
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Best Time Recommendations */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-3 text-emerald-800 dark:text-emerald-300">💡 Best Time Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-300">For Shortest Wait Times</h4>
            <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Early morning (9:00 - 10:00 AM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Late afternoon (3:00 - 4:00 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Avoid peak hours (11:00 AM - 1:00 PM)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-300">For Elderly Users</h4>
            <ul className="space-y-2 text-blue-700 dark:text-blue-300">
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Priority morning slots (9:00 - 11:00 AM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Avoid crowded evening hours</span>
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Extended consultation time available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Time Selection */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Time Selection</h4>
        <div className="flex flex-wrap gap-3">
          {['09:00', '11:00', '14:00', '16:00', '18:00'].map(time => {
            const slot = timeSlots.find(s => s.time === time && s.isAvailable);
            return (
              <button
                key={time}
                onClick={() => slot && onTimeSelect(time)}
                disabled={!slot}
                className={`px-4 py-3 rounded-lg transition-all border ${
                  slot 
                    ? 'bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-400 hover:shadow border-gray-200 dark:border-gray-700' 
                    : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed border-gray-300 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className={`text-xl font-bold ${slot ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {time}
                  </div>
                  <div className={`text-sm ${slot ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    {slot ? 'Available' : 'Booked'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;