import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();

// Define Secrets
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Initialize Stripe (Lazy initialization inside functions to access secrets)
const getStripe = () => {
  return new Stripe(stripeSecretKey.value(), {
    apiVersion: '2025-11-17.clover',
  });
};

// Cloud Function to handle new booking notifications (Gen 2)
export const onBookingCreated = onDocumentCreated("bookings/{bookingId}", async (event) => {
    const booking = event.data?.data();
    const bookingId = event.params.bookingId;

    if (!booking) {
      logger.warn('No booking data found for event', { bookingId });
      return;
    }

    try {
      // Get barber profile for FCM tokens
      // Note: This sends notifications ONLY to the barber, not the client
      const barberProfileSnap = await admin.firestore()
        .doc('barberProfile/main')
        .get();

      if (!barberProfileSnap.exists) {
        logger.warn('No barber profile found');
        return;
      }

      const barberData = barberProfileSnap.data();
      const tokens = (barberData?.fcmTokens || []) as string[];

      if (tokens.length === 0) {
        logger.info('No FCM tokens found for barber, skipping notification');
        return;
      }

      // Format date safely
      let dateStr = 'Unknown Date';
      let timeStr = 'Unknown Time';
      
      if (booking.appointmentDate && typeof booking.appointmentDate.toDate === 'function') {
        const dateObj = booking.appointmentDate.toDate();
        dateStr = dateObj.toLocaleDateString();
        timeStr = dateObj.toLocaleTimeString();
      }

      // Send multicast message to all tokens
      const message = {
        tokens: tokens,
        notification: {
          title: 'New Booking! 💈',
          body: `${booking.clientName || 'Client'} booked ${booking.serviceName || 'Service'} for ${dateStr} at ${timeStr}`,
        },
        data: {
          type: 'new_booking',
          bookingId: bookingId,
          serviceName: booking.serviceName || '',
          clientName: booking.clientName || '',
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info('Notification sent', { 
        successCount: response.successCount, 
        failureCount: response.failureCount 
      });

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        logger.error('List of tokens that caused failures: ' + failedTokens);
      }

    } catch (error) {
      logger.error('Error sending notification:', error);
    }
});

// Cloud Function to handle Stripe webhooks (Gen 2)
export const stripeWebhook = onRequest({ secrets: [stripeWebhookSecret, stripeSecretKey] }, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = stripeWebhookSecret.value();
  const stripe = getStripe();

  if (!sig) {
    logger.warn('No stripe-signature header');
    res.status(400).send('Webhook Error: No signature');
    return;
  }

  let event;

  try {
    // In v2, rawBody is reliably available
    const rawBody = req.rawBody;
    if (!rawBody) throw new Error('Missing rawBody');
    
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed.`, err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        logger.info('Processing PaymentIntent:', { id: paymentIntent.id });
        logger.debug('Metadata:', paymentIntent.metadata);

        // Extract and map metadata
        const { 
          service, 
          customerName, 
          customerEmail, 
          customerPhone, 
          bookingDate, 
          bookingTime 
        } = paymentIntent.metadata || {}; // Handle missing metadata

        if (!bookingDate || !bookingTime) {
          throw new Error('Missing bookingDate or bookingTime in metadata');
        }

        // Create Date object from date and time strings
        // bookingDate: "YYYY-MM-DD", bookingTime: "H:MM AM/PM" or "HH:MM"
        
        let time24 = bookingTime;
        
        // Convert 12-hour format to 24-hour format if needed
        if (bookingTime.includes('AM') || bookingTime.includes('PM')) {
          const [time, modifier] = bookingTime.split(' ');
          let [hours, minutes] = time.split(':');
          
          if (hours === '12') {
            hours = '00';
          }
          
          if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12 + '';
          }
          
          time24 = `${hours}:${minutes}`;
        }

        // Helper to interpret date/time in specific timezone (America/Chicago)
        // We want to find a UTC timestamp X such that X in Chicago is the booking time.
        const targetTimezone = 'America/Chicago';
        const dateStr = `${bookingDate}T${time24}:00`; // e.g. "2025-11-28T16:30:00"
        
        // 1. Create a UTC date that matches the wall-clock time
        const utcGuess = new Date(dateStr + 'Z');
        
        // 2. See what time that UTC date is in Chicago
        // e.g. 16:30 UTC -> 10:30 Chicago
        const tzString = utcGuess.toLocaleString('en-US', { timeZone: targetTimezone });
        const tzDate = new Date(tzString); // Parse back as if it were UTC (server local)
        
        // 3. Calculate difference
        // 16:30 - 10:30 = 6 hours
        const diff = utcGuess.getTime() - tzDate.getTime();
        
        // 4. Add difference to original guess to get the correct UTC timestamp
        // 16:30 UTC + 6 hours = 22:30 UTC
        // 22:30 UTC in Chicago is 16:30. Correct.
        const appointmentDate = new Date(utcGuess.getTime() + diff);
        
        if (isNaN(appointmentDate.getTime())) {
           throw new Error(`Invalid date created from ${bookingDate}T${time24}:00 (Original: ${bookingTime})`);
        }

        // Save booking to Firestore with correct schema
        await admin.firestore().collection('bookings').add({
          clientName: customerName || 'Unknown',
          clientEmail: customerEmail || 'Unknown',
          clientPhone: customerPhone || 'Unknown',
          serviceName: service || 'Unknown Service',
          appointmentDate: admin.firestore.Timestamp.fromDate(appointmentDate),
          status: 'confirmed',
          paymentIntentId: paymentIntent.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });

        logger.info('PaymentIntent succeeded and booking saved:', { id: paymentIntent.id });
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logger.warn('PaymentIntent failed:', { id: failedPayment.id });
        break;
      
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    logger.error('Error processing webhook event:', error);
    res.status(500).send(`Error processing event: ${error}`);
    return;
  }

  res.json({received: true});
});

// Cloud Function to get booking statistics (Gen 2)
export const getBookingStats = onCall(async (request) => {
  // Verify admin authentication
  if (!request.auth || !request.auth.token.email) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminEmails = ['cousin@gmail.com', 'your-email@gmail.com'];
  if (!adminEmails.includes(request.auth.token.email)) {
    throw new HttpsError('permission-denied', 'Admin access required');
  }

  try {
    // Get bookings for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsSnapshot = await admin.firestore()
      .collection('bookings')
      .where('createdAt', '>=', thirtyDaysAgo)
      .get();

    const stats = {
      totalBookings: bookingsSnapshot.size,
      totalRevenue: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
    };

    bookingsSnapshot.forEach(doc => {
      const booking = doc.data();
      if (booking.status === 'confirmed') {
        stats.confirmedBookings++;
        stats.totalRevenue += booking.amount || 0;
      } else {
        stats.pendingBookings++;
      }
    });

    return stats;
  } catch (error) {
    logger.error('Error getting booking stats:', error);
    throw new HttpsError('internal', 'Failed to get booking stats');
  }
});
