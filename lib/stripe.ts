import { loadStripe } from '@stripe/stripe-js';

// Get publishable key from environment
let publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Remove any surrounding quotes that might have been accidentally included
if (publishableKey) {
  publishableKey = publishableKey.trim().replace(/^["']|["']$/g, '');
}

if (!publishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Validate key format
if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
  throw new Error(`Invalid Stripe publishable key format. Expected key starting with pk_test_ or pk_live_, got: ${publishableKey.substring(0, 20)}...`);
}

// Log in development only (helps with debugging)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Stripe publishable key loaded:', publishableKey.substring(0, 20) + '...');
}

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(publishableKey);

// Stripe configuration options
export const stripeOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#c8a46e', // Artisan Gold
      colorBackground: '#ffffff',
      colorText: '#0A192F', // Deep Navy
      colorDanger: '#df1b41',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
      },
      '.Input:focus': {
        borderColor: '#c8a46e',
        boxShadow: '0 0 0 3px rgba(200, 164, 110, 0.1)',
      },
      '.Label': {
        fontWeight: '600',
        color: '#0A192F',
        marginBottom: '8px',
      },
    },
  },
  loader: 'auto' as const,
};
