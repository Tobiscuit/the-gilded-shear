'use server';

import { db, Timestamp } from '@/lib/firebase-admin';

export async function getAvailability(dateString: string) {
  try {
    // dateString is "YYYY-MM-DD"
    // Create start and end of day timestamps
    const startOfDay = new Date(`${dateString}T00:00:00`);
    const endOfDay = new Date(`${dateString}T23:59:59`);

    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .where('appointmentDate', '>=', Timestamp.fromDate(startOfDay))
      .where('appointmentDate', '<=', Timestamp.fromDate(endOfDay))
      .get();
    
    // Extract booked times
    const bookedTimes = snapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.appointmentDate.toDate();
      // Format as "H:MM AM/PM" to match generateTimeSlots output (e.g., "4:00 PM")
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    });

    return bookedTimes;
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
}
