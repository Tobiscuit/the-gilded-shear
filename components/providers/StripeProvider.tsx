'use client';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { ReactNode } from 'react';

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string | null;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  // Only render Elements if we have a clientSecret
  if (!clientSecret) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
