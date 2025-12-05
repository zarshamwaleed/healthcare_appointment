import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
  AlertCircle,
  Star
} from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, isPast, isWeekend, startOfWeek, endOfWeek,
  addDays, parseISO 
} from 'date-fns';
import { useAccessibility } from '../../context/AccessibilityContext';

const CalendarView = ({ onDateSelect, selectedDate, prioritySlots = [] }) => {
  const { settings } = useAccessibility();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [monthData, setMonthData] = useState({});

  useEffect(() => {
    // Generate mock availability data
    const generateMonthData = () => {
      const data = {};
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start, end });
      
      days.forEach(day => {
        const isWeekendDay = isWeekend(day);
        const isPastDate = isPast(day) && !isToday(day);
        
        // Generate availability slots (0-10)
        let availableSlots = Math.floor(Math.random() * 11);
        if (isWeekendDay) availableSlots = Math.max(2, Math.floor(Math.random() * 5));
        if (isPastDate) availableSlots = 0;
        
        // Priority days have more availability
        if (day.getDate() % 7 === 0) availableSlots += 3; // Every 7th day
        if (day.getDate() <= 7) availableSlots += 2; // First week of month
        
        data[format(day, 'yyyy-MM-dd')] = {
          availableSlots,
          isPeak: availableSlots <= 3,
          isRecommended: availableSlots >= 7,
          priority: day.getDate() % 5 === 0, // Every 5th day is priority
          elderlyPriority: day.getDate() % 3 === 0 // Every 3rd day for elderly
        };
      });
      
      return data;
    };
    
    setMonthData(generateMonthData());
  }, [currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateStatus = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = monthData[dateKey];
    if (!data) return 'normal';
    
    if (data.availableSlots === 0) return 'unavailable';
    if (data.isPeak) return 'peak';
    if (data.isRecommended) return 'recommended';
    if (data.priority) return 'priority';
    return 'normal';
  };

  const getDateClasses = (date) => {
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isPastDate = isPast(date) && !isToday(date);
    const isWeekendDay = isWeekend(date);
    const status = getDateStatus(date);
    
    let classes = 'h-24 p-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ';
    
    // Base styles
    if (!isCurrentMonth) {
      classes += 'bg-gray-100 text-gray-400 border-gray-200 ';
    } else if (isSelected) {
      classes += 'bg-primary-600 text-white border-primary-700 shadow-lg scale-105 ';
    } else if (isPastDate) {
      classes += 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed ';
    } else {
      classes += 'bg-white hover:bg-gray-50 border-gray-200 hover:border-primary-300 hover:shadow-md ';
    }
    
    // Status colors
    if (isCurrentMonth && !isPastDate && !isSelected) {
      switch(status) {
        case 'unavailable':
          classes += 'border-red-200 bg-red-50 ';
          break;
        case 'peak':
          classes += 'border-amber-200 bg-amber-50 ';
          break;
        case 'recommended':
          classes += 'border-green-200 bg-green-50 ';
          break;
        case 'priority':
          classes += 'border-purple-200 bg-purple-50 ';
          break;
      }
    }
    
    // Weekend styling
    if (isWeekendDay && isCurrentMonth && !isSelected && !isPastDate) {
      classes += 'border-blue-100 ';
    }
    
    // Elderly mode adjustments
    if (settings.mode === 'elderly') {
      classes += 'h-28 text-lg ';
    }
    
    return classes;
  };

  const getAvailabilityIndicator = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = monthData[dateKey];
    if (!data || data.availableSlots === 0) return null;
    
    const slots = data.availableSlots;
    let color = 'text-gray-500';
    let icon = null;
    
    if (slots <= 2) {
      color = 'text-red-500';
      icon = <AlertCircle size={12} />;
    } else if (slots <= 5) {
      color = 'text-amber-500';
    } else if (slots >= 8) {
      color = 'text-green-500';
      icon = <Check size={12} />;
    }
    
    return (
      <div className={`flex items-center gap-1 text-xs ${color} mt-1`}>
        {icon}
        <span>{slots} slots</span>
      </div>
    );
  };

  const getPriorityBadge = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = monthData[dateKey];
    if (!data) return null;
    
    if (data.priority) {
      return (
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
      );
    }
    
    if (data.elderlyPriority && settings.mode === 'elderly') {
      return (
        <div className="absolute top-1 right-1">
          <Star size={10} className="text-blue-500" />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <CalendarIcon size={24} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Appointment Calendar</h2>
            <p className="text-sm text-gray-600">Select your preferred date</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Selected Date</p>
            <p className="font-bold">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm">Recommended (7+ slots)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
          <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div>
          <span className="text-sm">Peak Hours (3-6 slots)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm">Limited (0-2 slots)</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
          <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
          <span className="text-sm">Priority Day</span>
        </div>
        {settings.mode === 'elderly' && (
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border">
            <Star size={14} className="text-blue-500" />
            <span className="text-sm">Elderly Priority</span>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 p-2">
              {settings.mode === 'elderly' ? day : day.charAt(0)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isPastDate = isPast(day) && !isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dateKey = format(day, 'yyyy-MM-dd');
            const data = monthData[dateKey];
            
            return (
              <button
                key={index}
                onClick={() => !isPastDate && isCurrentMonth && onDateSelect(day)}
                disabled={isPastDate || !isCurrentMonth || (data && data.availableSlots === 0)}
                className={getDateClasses(day)}
                aria-label={`${format(day, 'MMMM d, yyyy')} - ${data?.availableSlots || 0} available slots`}
              >
                <div className="relative h-full">
                  {getPriorityBadge(day)}
                  
                  <div className="text-left">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      isToday(day) && !isSelected ? 'bg-primary-100 text-primary-700 font-bold' : ''
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    {isToday(day) && (
                      <div className="text-xs text-primary-600 font-medium mt-1">Today</div>
                    )}
                    
                    {isCurrentMonth && !isPastDate && getAvailabilityIndicator(day)}
                    
                    {data?.priority && (
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        Priority
                      </div>
                    )}
                    
                    {settings.mode === 'elderly' && data?.elderlyPriority && (
                      <div className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                        <Star size={10} />
                        Elderly Priority
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Information Panel */}
      {selectedDate && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <CalendarIcon size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
              <p className="text-gray-600">Selected Appointment Date</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-500" />
                <h4 className="font-semibold">Available Time Slots</h4>
              </div>
              <p className="text-2xl font-bold text-primary-600">
                {monthData[format(selectedDate, 'yyyy-MM-dd')]?.availableSlots || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">slots available</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-gray-500" />
                <h4 className="font-semibold">Expected Crowd</h4>
              </div>
              <p className="text-2xl font-bold">
                {monthData[format(selectedDate, 'yyyy-MM-dd')]?.isPeak ? 'High' : 'Low'}
              </p>
              <p className="text-sm text-gray-600 mt-1">Based on historical data</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-gray-500" />
                <h4 className="font-semibold">Recommended</h4>
              </div>
              <p className="text-2xl font-bold">
                {monthData[format(selectedDate, 'yyyy-MM-dd')]?.isRecommended ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {monthData[format(selectedDate, 'yyyy-MM-dd')]?.isRecommended 
                  ? 'Best availability' 
                  : 'Consider other dates'}
              </p>
            </div>
          </div>
          
          {/* Date Tips */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Tips for this date
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {isWeekend(selectedDate) ? (
                <>
                  <li>• Weekend appointments may have longer wait times</li>
                  <li>• Consider weekday mornings for faster service</li>
                </>
              ) : (
                <>
                  <li>• Morning slots typically have shorter wait times</li>
                  <li>• Book early in the day for best availability</li>
                </>
              )}
              {settings.mode === 'elderly' && (
                <li>• Elderly priority slots are available in the morning</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Date Selection */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold mb-3">Quick Date Selection</h4>
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map(days => {
            const date = addDays(new Date(), days);
            const dateKey = format(date, 'yyyy-MM-dd');
            const data = monthData[dateKey];
            const isAvailable = data && data.availableSlots > 0;
            
            return (
              <button
                key={days}
                onClick={() => isAvailable && onDateSelect(date)}
                disabled={!isAvailable}
                className={`px-4 py-2 rounded-lg transition-all ${isAvailable 
                  ? 'bg-white hover:bg-primary-50 hover:border-primary-300 border hover:shadow' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } border ${isAvailable ? 'border-gray-200' : 'border-gray-300'}`}
              >
                <div className="text-center">
                  <div className="font-bold">{format(date, 'd')}</div>
                  <div className="text-sm">{format(date, 'EEE')}</div>
                  {isAvailable && data.availableSlots <= 3 && (
                    <div className="text-xs text-amber-600 mt-1">
                      {data.availableSlots} left
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;