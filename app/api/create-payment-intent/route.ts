import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

let secretKey = process.env.STRIPE_SECRET_KEY;

// Remove any surrounding quotes that might have been accidentally included
if (secretKey) {
  secretKey = secretKey.trim().replace(/^["']|["']$/g, '');
}

if (!secretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Validate key format
if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
  throw new Error(`Invalid Stripe secret key format. Expected key starting with sk_test_ or sk_live_, got: ${secretKey.substring(0, 20)}...`);
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, service, customerInfo, bookingDetails } = body;

    // Validate required fields
    if (!amount || !service || !customerInfo || !bookingDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        service,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        bookingDate: bookingDetails.date,
        bookingTime: bookingDetails.time,
      },
      description: `${service} booking for ${customerInfo.name}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
