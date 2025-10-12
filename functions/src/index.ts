import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2025-09-30.clover',
});

// Cloud Function to handle new booking notifications
export const onBookingCreated = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;

    try {
      // Get admin users
      const adminSnapshot = await admin.firestore()
        .collection('admin')
        .where('notificationsEnabled', '==', true)
        .get();

      // Send push notifications to all admins
      const notifications = adminSnapshot.docs.map(doc => {
        const adminData = doc.data();
        if (adminData.deviceToken) {
          return admin.messaging().send({
            token: adminData.deviceToken,
            notification: {
              title: 'New Booking! 🎉',
              body: `${booking.customerName} booked ${booking.serviceName} for ${booking.date} at ${booking.time}`,
            },
            data: {
              type: 'new_booking',
              bookingId: bookingId,
              serviceName: booking.serviceName,
              customerName: booking.customerName,
            },
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(notifications);

      // Log the notification
      console.log(`Notification sent for booking ${bookingId}`);
      
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });

// Cloud Function to handle Stripe webhooks
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Save booking to Firestore
      await admin.firestore().collection('bookings').add({
        ...paymentIntent.metadata,
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

// Cloud Function to get booking statistics (admin only)
export const getBookingStats = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!context.auth || !context.auth.token.email) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminEmails = ['cousin@gmail.com', 'your-email@gmail.com'];
  if (!adminEmails.includes(context.auth.token.email)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
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
    throw new functions.https.HttpsError('internal', 'Failed to get booking stats');
  }
});
