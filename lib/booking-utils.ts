import { Service } from './types';

// Available services
export const SERVICES: Service[] = [
  {
    name: 'Classic Haircut',
    duration: 60,
    price: 2500, // $25.00 in cents
    description: 'Timeless craftsmanship meets modern precision. Every cut is executed with the meticulous attention to detail that defines true mastery.'
  },
  {
    name: 'Beard Trim',
    duration: 25,
    price: 1500, // $15.00 in cents
    description: 'The art of masculine refinement. Each stroke of the blade reveals the confident gentleman within, transforming your appearance with skilled precision.'
  },
  {
    name: 'Fade Cut',
    duration: 75,
    price: 3000, // $30.00 in cents
    description: 'The pinnacle of modern barbering artistry. Seamless transitions and perfect gradients that showcase the skill of a true craftsman at work.'
  },
  {
    name: 'Haircut + Beard',
    duration: 80,
    price: 3500, // $35.00 in cents
    description: 'The complete gentleman\'s experience. A perfect combination of classic haircut and precision beard styling for the ultimate transformation.'
  }
];

// Business hours (student-friendly)
export const BUSINESS_HOURS = {
  monday: { open: '16:00', close: '20:00', closed: false },
  tuesday: { open: '16:00', close: '20:00', closed: false },
  wednesday: { open: '16:00', close: '20:00', closed: false },
  thursday: { open: '16:00', close: '20:00', closed: false },
  friday: { open: '16:00', close: '20:00', closed: false },
  saturday: { open: '10:00', close: '18:00', closed: false },
  sunday: { open: '00:00', close: '00:00', closed: true }
};

// Configuration
export const BOOKING_CONFIG = {
  BUFFER_HOURS: 2, // Minimum hours in advance for booking
  TIME_SLOT_INTERVAL: 30, // Minutes between slots
  MIN_ADVANCE_BOOKING_HOURS: 2, // Can't book within this many hours
};

// Convert military time to civilian time
function formatTimeForDisplay(militaryTime: string): string {
  const [hours, minutes] = militaryTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Generate time slots for a given date
export function generateTimeSlots(date: string): string[] {
  // Create date in UTC to avoid timezone issues
  const dateObj = new Date(date + 'T00:00:00.000Z');
  const dayOfWeek = dateObj.getUTCDay();
  const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
  const hours = BUSINESS_HOURS[dayName as keyof typeof BUSINESS_HOURS];
  
  if (hours.closed) {
    return [];
  }
  
  const slots: string[] = [];
  const [openHour, openMinute] = hours.open.split(':').map(Number);
  const [closeHour, closeMinute] = hours.close.split(':').map(Number);
  
  // Check if this is today or in the past
  const today = new Date();
  const selectedDate = new Date(date + 'T00:00:00.000Z');
  const isToday = selectedDate.toDateString() === today.toDateString();
  const isPast = selectedDate < today;
  
  // If the date is in the past, no slots available
  if (isPast) {
    return [];
  }
  
  // Get current time to filter out past slots for today
  let minHour = openHour;
  let minMinute = openMinute;
  
  if (isToday) {
    // Add buffer time (can't book within X hours of current time)
    const bufferHours = BOOKING_CONFIG.MIN_ADVANCE_BOOKING_HOURS;
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    // Calculate minimum time (current time + buffer)
    minHour = currentHour + bufferHours;
    minMinute = currentMinute;
    
    // Round up to next 30-minute interval
    if (minMinute > 0) {
      minMinute = minMinute <= 30 ? 30 : 0;
      if (minMinute === 0) {
        minHour++;
      }
    }
    
    // If buffer extends past business hours, no slots available today
    if (minHour >= closeHour || (minHour === closeHour && minMinute >= closeMinute)) {
      return [];
    }
  }
  
  // Start from the later of business open or minimum allowed time
  let currentHour = Math.max(openHour, minHour);
  let currentMinute = openMinute;
  
  // If we're starting at the minimum hour, use the minimum minute
  if (currentHour === minHour) {
    currentMinute = Math.max(openMinute, minMinute);
  }
  
  while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
    const militaryTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    const civilianTime = formatTimeForDisplay(militaryTime);
    slots.push(civilianTime);
    
    currentMinute += BOOKING_CONFIG.TIME_SLOT_INTERVAL; // Configurable intervals
    if (currentMinute >= 60) {
      currentMinute = 0;
      currentHour++;
    }
  }
  
  return slots;
}

// Check if a date is available (not in the past, within business hours)
export function isDateAvailable(date: string): boolean {
  // Use a consistent date comparison that works on both server and client
  const selectedDate = new Date(date + 'T00:00:00.000Z'); // Force UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone issues
  
  return selectedDate >= today;
}

// Format price for display
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

// Format duration for display
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
