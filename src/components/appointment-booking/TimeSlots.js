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
        { name: 'Morning', start: 9, end: 12, icon: <Sunrise size={16} />, color: 'bg-blue-100 text-blue-800' },
        { name: 'Afternoon', start: 12, end: 17, icon: <Coffee size={16} />, color: 'bg-amber-100 text-amber-800' },
        { name: 'Evening', start: 17, end: 20, icon: <Sunset size={16} />, color: 'bg-purple-100 text-purple-800' },
        { name: 'Night', start: 20, end: 22, icon: <Moon size={16} />, color: 'bg-gray-100 text-gray-800' }
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
    let classes = 'p-4 rounded-xl border transition-all duration-200 ';
    
    if (!slot.isAvailable) {
      classes += 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed ';
    } else if (selectedTime === slot.time) {
      classes += 'bg-gradient-to-r from-primary-600 to-blue-600 text-white border-primary-700 shadow-lg scale-105 ';
    } else {
      classes += 'bg-white hover:bg-gray-50 border-gray-200 hover:border-primary-300 hover:shadow-md ';
      
      // Slot type styling
      if (slot.slotType === 'elderly-priority') {
        classes += 'border-blue-300 bg-blue-50 ';
      } else if (slot.slotType === 'peak') {
        classes += 'border-amber-300 bg-amber-50 ';
      } else if (slot.isRecommended) {
        classes += 'border-green-300 bg-green-50 ';
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
        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
          Booked
        </span>
      );
    }
    
    if (slot.slotType === 'elderly-priority') {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
          <Star size={10} />
          Elderly Priority
        </span>
      );
    }
    
    if (slot.slotType === 'peak') {
      return (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
          <Zap size={10} />
          Peak Hours
        </span>
      );
    }
    
    if (slot.isRecommended) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          Recommended
        </span>
      );
    }
    
    if (slot.isPopular) {
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock size={28} className="text-primary-600" />
            Select Time Slot
          </h2>
          <p className="text-gray-600">
            {selectedDate 
              ? `Available slots for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
              : 'Select a date first to see available times'
            }
          </p>
        </div>
        
        {selectedDate && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Available Slots</p>
            <p className="text-2xl font-bold text-primary-600">
              {timeSlots.filter(s => s.isAvailable).length} / {timeSlots.length}
            </p>
          </div>
        )}
      </div>

      {/* Time Period Navigation */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-semibold mb-3">Time Periods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timePeriods.map(period => (
            <button
              key={period.id}
              onClick={() => setTimePeriod(period.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                timePeriod === period.id 
                  ? 'border-primary-500 bg-primary-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  timePeriod === period.id 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {period.icon}
                </div>
                <div className="text-left">
                  <div className="font-bold">{period.name}</div>
                  {period.id !== 'all' && stats[period.id] && (
                    <div className="text-sm text-gray-600">
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
            <div key={period} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{period}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  (data.available / data.total) > 0.5 ? 'bg-green-100 text-green-800' :
                  (data.available / data.total) > 0.2 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {Math.round((data.available / data.total) * 100)}% available
                </span>
              </div>
              <div className="text-2xl font-bold">
                {data.available} <span className="text-lg text-gray-500">/ {data.total}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Avg wait: {data.avgWait}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Slot Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-sm">Elderly Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
          <span className="text-sm">Peak Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm">Recommended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
          <span className="text-sm">Popular</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span className="text-sm">Booked</span>
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
                    <div className="text-2xl font-bold">{slot.time}</div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${slot.periodColor}`}>
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
                      <span className="text-gray-600">Wait Time:</span>
                      <span className="font-semibold">{slot.waitTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Crowd Level:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        slot.crowdLevel === 'Low' ? 'bg-green-100 text-green-800' :
                        slot.crowdLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {slot.crowdLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Doctors Available:</span>
                      <span className="flex items-center gap-1">
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
                  <div className="flex items-center justify-center gap-2 text-gray-500">
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
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <Clock size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Date Selected</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please select a date from the calendar to view available time slots.
          </p>
        </div>
      )}

      {/* Selected Time Details */}
      {selectedTime && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Clock size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Selected Time Slot</h3>
              <p className="text-gray-600">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">Arrival Instructions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Arrive 15 minutes early</li>
                <li>• Bring your ID and insurance card</li>
                <li>• Complete digital forms in advance</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">Preparation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fasting not required</li>
                <li>• Bring current medications list</li>
                <li>• Wear comfortable clothing</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-sm text-gray-600">
                Main Hospital Building, 3rd Floor<br />
                Check-in at Reception Desk A
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Best Time Recommendations */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <h3 className="text-xl font-bold mb-3 text-green-800">💡 Best Time Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">For Shortest Wait Times</h4>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <span>Early morning (9:00 - 10:00 AM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <span>Late afternoon (3:00 - 4:00 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-600" />
                <span>Avoid peak hours (11:00 AM - 1:00 PM)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">For Elderly Users</h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600" />
                <span>Priority morning slots (9:00 - 11:00 AM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600" />
                <span>Avoid crowded evening hours</span>
              </li>
              <li className="flex items-center gap-2">
                <Star size={16} className="text-blue-600" />
                <span>Extended consultation time available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Time Selection */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold mb-3">Quick Time Selection</h4>
        <div className="flex flex-wrap gap-3">
          {['09:00', '11:00', '14:00', '16:00', '18:00'].map(time => {
            const slot = timeSlots.find(s => s.time === time && s.isAvailable);
            return (
              <button
                key={time}
                onClick={() => slot && onTimeSelect(time)}
                disabled={!slot}
                className={`px-4 py-3 rounded-lg transition-all ${
                  slot 
                    ? 'bg-white hover:bg-primary-50 hover:border-primary-300 border hover:shadow' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } border ${slot ? 'border-gray-200' : 'border-gray-300'}`}
              >
                <div className="text-center">
                  <div className="text-xl font-bold">{time}</div>
                  <div className="text-sm">
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