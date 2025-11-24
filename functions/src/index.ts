import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
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
      console.log('No booking data found');
      return;
    }

    try {
      // Get barber profile for FCM tokens
      const barberProfileSnap = await admin.firestore()
        .doc('barberProfile/main')
        .get();

      if (!barberProfileSnap.exists) {
        console.log('No barber profile found');
        return;
      }

      const barberData = barberProfileSnap.data();
      const tokens = (barberData?.fcmTokens || []) as string[];

      if (tokens.length === 0) {
        console.log('No FCM tokens found for barber');
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
      console.log(`${response.successCount} messages were sent successfully`);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
});

// Cloud Function to handle Stripe webhooks (Gen 2)
export const stripeWebhook = onRequest({ secrets: [stripeWebhookSecret, stripeSecretKey] }, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = stripeWebhookSecret.value();
  const stripe = getStripe();

  if (!sig) {
    console.log('No stripe-signature header');
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
    console.log(`Webhook signature verification failed.`, err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Extract and map metadata
      const { 
        service, 
        customerName, 
        customerEmail, 
        customerPhone, 
        bookingDate, 
        bookingTime 
      } = paymentIntent.metadata;

      // Create Date object from date and time strings
      // bookingDate: "YYYY-MM-DD", bookingTime: "HH:MM"
      const appointmentDate = new Date(`${bookingDate}T${bookingTime}:00`);

      // Save booking to Firestore with correct schema
      await admin.firestore().collection('bookings').add({
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        serviceName: service,
        appointmentDate: admin.firestore.Timestamp.fromDate(appointmentDate),
        status: 'confirmed',
        paymentIntentId: paymentIntent.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });

      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
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
    console.error('Error getting booking stats:', error);
    throw new HttpsError('internal', 'Failed to get booking stats');
  }
});
