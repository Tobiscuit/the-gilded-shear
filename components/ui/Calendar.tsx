'use client';

import { useState, useEffect, useMemo } from 'react';
import { generateTimeSlots, isDateAvailable } from '@/lib/booking-utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export default function Calendar({ selectedDate, onDateSelect, selectedTime, onTimeSelect }: CalendarProps) {
  // Initialize with current date immediately to avoid hydration mismatch
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Generate calendar days - memoized to avoid recalculation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
  }, [currentMonth]);

  // Cache for monthly availability: { "YYYY-M": { "YYYY-MM-DD": ["4:00 PM"] } }
  const [monthlyAvailability, setMonthlyAvailability] = useState<Record<string, Record<string, string[]>>>({});
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);

  // Fetch availability for the current month when it changes
  useEffect(() => {
    const fetchMonthData = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const cacheKey = `${year}-${month}`;

      // If we already have data for this month, don't fetch again
      if (monthlyAvailability[cacheKey]) {
        return;
      }

      setIsLoadingMonth(true);
      try {
        const { getMonthAvailability } = await import('@/app/actions/get-month-availability');
        const data = await getMonthAvailability(year, month);
        
        setMonthlyAvailability(prev => ({
          ...prev,
          [cacheKey]: data
        }));
      } catch (error) {
        console.error('Error fetching month availability:', error);
      } finally {
        setIsLoadingMonth(false);
      }
    };

    fetchMonthData();
  }, [currentMonth, monthlyAvailability]);

  // Update available time slots instantly when date changes
  useEffect(() => {
    if (selectedDate) {
      const allSlots = generateTimeSlots(selectedDate);
      
      // Get booked slots from our local cache
      // selectedDate is "YYYY-MM-DD"
      const bookedSlots = Object.values(monthlyAvailability).reduce((acc, monthData) => {
        if (monthData[selectedDate]) {
          return monthData[selectedDate];
        }
        return acc;
      }, [] as string[]) || [];

      const available = allSlots.filter(slot => !bookedSlots.includes(slot));
      
      setAvailableSlots(available);
      
      if (selectedTime && !available.includes(selectedTime)) {
        onTimeSelect('');
      }
    }
  }, [selectedDate, monthlyAvailability, selectedTime, onTimeSelect]);

  const handleDateClick = (date: string, isAvailable: boolean) => {
    if (isAvailable) {
      onDateSelect(date);
    }
  };

  const handleTimeClick = (time: string) => {
    onTimeSelect(time);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

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
