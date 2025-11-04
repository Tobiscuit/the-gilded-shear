import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2025-10-29.clover',
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
