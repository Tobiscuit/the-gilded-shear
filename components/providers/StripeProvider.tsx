'use client';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { ReactNode } from 'react';

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = clientSecret 
    ? { clientSecret }
    : { mode: 'payment' as const };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
