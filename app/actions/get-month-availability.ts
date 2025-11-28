'use server';

import { db, Timestamp } from '@/lib/firebase-admin';

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
      
      // Format date as YYYY-MM-DD
      const dateKey = dateObj.toISOString().split('T')[0];
      
      // Format time as "H:MM AM/PM"
      const timeStr = dateObj.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });

      if (!bookedSlotsByDate[dateKey]) {
        bookedSlotsByDate[dateKey] = [];
      }
      bookedSlotsByDate[dateKey].push(timeStr);
    });

    return bookedSlotsByDate;
  } catch (error) {
    console.error('Error fetching month availability:', error);
    return {};
  }
}
