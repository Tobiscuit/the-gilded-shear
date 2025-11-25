'use client';

import { useState, useEffect } from 'react';
import { generateTimeSlots, isDateAvailable } from '@/lib/booking-utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export default function Calendar({ selectedDate, onDateSelect, selectedTime, onTimeSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    setCurrentMonth(new Date());
  }, []);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    if (!currentMonth) return [];
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Use UTC for consistency

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isAvailable = isDateAvailable(date.toISOString().split('T')[0]);
      
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isAvailable: isCurrentMonth && !isPast && isAvailable,
      });
    }
    
    return days;
  };

  // Update available time slots when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedDate) {
        // Generate all possible slots
        const allSlots = generateTimeSlots(selectedDate);
        
        // Fetch booked slots from server
        const { getAvailability } = await import('@/app/actions/get-availability');
        const bookedSlots = await getAvailability(selectedDate);
        
        // Filter out booked slots
        const available = allSlots.filter(slot => !bookedSlots.includes(slot));
        
        console.log('Availability Check:', {
          date: selectedDate,
          allSlots,
          bookedSlots,
          available
        });

        setAvailableSlots(available);
        
        // Reset selected time if it's not available for new date
        if (selectedTime && !available.includes(selectedTime)) {
          onTimeSelect('');
        }
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedTime, onTimeSelect]);

  const handleDateClick = (date: string, isAvailable: boolean) => {
    if (isAvailable) {
      onDateSelect(date);
    }
  };

  const handleTimeClick = (time: string) => {
    onTimeSelect(time);
  };

  const goToPreviousMonth = () => {
    if (currentMonth) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    }
  };

  const goToNextMonth = () => {
    if (currentMonth) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    }
  };

  const formatMonthYear = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString: string) => {
    // Create date in UTC to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC' // Ensure consistent formatting
    });
  };

  const calendarDays = generateCalendarDays();

  // Show loading state until client-side hydration is complete
  if (!isClient || !currentMonth) {
    return (
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 w-full max-w-md shadow-lg">
      <div className="flex min-w-72 flex-1 flex-col gap-0.5">
        {/* Calendar Header */}
        <div className="flex items-center p-1 justify-between mb-4">
          <button 
            onClick={goToPreviousMonth}
            className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
          >
            <div className="flex size-10 items-center justify-center">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </div>
          </button>
          <p className="text-gray-900 text-lg font-bold flex-1 text-center font-display">
            {formatMonthYear(currentMonth)}
          </p>
          <button 
            onClick={goToNextMonth}
            className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
          >
            <div className="flex size-10 items-center justify-center">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </div>
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {/* Day headers */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <p key={`day-${index}`} className="text-gray-500 text-xs font-bold tracking-wider flex h-10 w-full items-center justify-center pb-0.5">
              {day}
            </p>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map(({ date, day, isCurrentMonth, isAvailable }, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(date, isAvailable)}
              disabled={!isAvailable}
              className={`h-10 w-full text-gray-900 text-sm font-medium ${
                !isAvailable ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`flex size-full items-center justify-center rounded-full ${
                !isAvailable 
                  ? 'text-gray-300'
                  : selectedDate === date
                  ? 'bg-yellow-500 text-white font-bold'
                  : 'hover:bg-yellow-100'
              } ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                {day}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Date and Time Slots */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-display font-bold text-gray-900 mb-3">
            {formatDate(selectedDate)}
          </h4>
          
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {availableSlots.map((time) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    key={time}
                    onClick={() => handleTimeClick(time)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-yellow-100'
                    }`}
                  >
                    {time}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No available times for this date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
