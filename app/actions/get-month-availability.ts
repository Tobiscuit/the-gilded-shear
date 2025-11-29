'use server';

import { db, Timestamp } from '@/lib/firebase-admin';

// Helper: Convert military time to civilian time (same as client)
function formatTimeForDisplay(militaryTime: string): string {
  const [hours, minutes] = militaryTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export async function getMonthAvailability(year: number, month: number) {
  try {
    // Create start and end of month timestamps
    // Month is 0-indexed (0 = January, 11 = December)
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .where('appointmentDate', '>=', Timestamp.fromDate(startOfMonth))
      .where('appointmentDate', '<=', Timestamp.fromDate(endOfMonth))
      .get();
    
    // Group bookings by date
    // Returns: { "2025-11-28": ["4:00 PM", "4:30 PM"], ... }
    const bookedSlotsByDate: Record<string, string[]> = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const dateObj = data.appointmentDate.toDate();
      const duration = data.serviceDuration || 60; // Default to 60 minutes if missing
      
      console.log('DEBUG: Booking found:', {
        id: doc.id,
        serviceName: data.serviceName,
        serviceDuration: data.serviceDuration,
        calculatedDuration: duration,
        appointmentDate: dateObj.toISOString()
      });
      
      // Format date as YYYY-MM-DD
      const dateKey = dateObj.toISOString().split('T')[0];
      
      if (!bookedSlotsByDate[dateKey]) {
        bookedSlotsByDate[dateKey] = [];
      }

      // Calculate all blocked slots within the service duration
      // For a 60-min service at 4:00 PM, block: [4:00 PM, 4:30 PM]
      // For a 25-min service at 4:00 PM, block: [4:00 PM] only
      const slotInterval = 30; // Minutes per slot
      const startTime = dateObj.getTime();

      const blockedForThisBooking = [];
      for (let offset = 0; offset < duration; offset += slotInterval) {
        const blockedTime = new Date(startTime + offset * 60000);
        
        // CRITICAL: Convert UTC timestamp to Chicago timezone before formatting
        // The stored timestamp is in UTC, but we need to format it as Chicago local time
        const chicagoTimeString = blockedTime.toLocaleString('en-US', { 
          timeZone: 'America/Chicago',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        }); // Returns "HH:MM" in Chicago time
        
        // Parse the Chicago time string to get hours and minutes
        const [hoursStr, minutesStr] = chicagoTimeString.split(':');
        const militaryTime = `${hoursStr}:${minutesStr}`;
        
        // Then convert to civilian time using the SAME function as client
        const blockedTimeStr = formatTimeForDisplay(militaryTime);
        
        bookedSlotsByDate[dateKey].push(blockedTimeStr);
        blockedForThisBooking.push(blockedTimeStr);
      }
      
      console.log('DEBUG: Blocked slots for this booking:', blockedForThisBooking);
    });
    
    console.log('DEBUG: Final bookedSlotsByDate:', bookedSlotsByDate);

    return bookedSlotsByDate;
  } catch (error) {
    console.error('Error fetching month availability:', error);
    return {};
  }
}
