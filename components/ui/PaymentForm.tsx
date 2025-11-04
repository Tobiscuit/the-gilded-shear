'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { SERVICES } from '@/lib/booking-utils';
import StripeProvider from '@/components/providers/StripeProvider';

interface PaymentFormProps {
  selectedService: string;
  selectedDate: string;
  selectedTime: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

// Internal form component that uses Stripe hooks
function PaymentFormContent({
  selectedService,
  selectedDate,
  selectedTime,
  customerInfo,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get service details
  const service = SERVICES.find(s => s.name === selectedService);
  if (!service) {
    onPaymentError('Invalid service selected');
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet. Please wait...');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // First, validate and submit the PaymentElement
      // This ensures the PaymentElement is mounted and validated
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Validation failed');
        onPaymentError(submitError.message || 'Validation failed');
        setIsProcessing(false);
        return;
      }

      // Now confirm the payment - the client secret is already set in the Elements provider
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess({ service, customerInfo, paymentIntent });
      } else {
        // Payment might require additional action (like 3D Secure)
        // The redirect will handle it
        onPaymentSuccess({ service, customerInfo, paymentIntent });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-display font-bold mb-4 text-gray-900">
        Complete Your Booking
      </h3>
      
      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-2">Booking Details</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Service:</strong> {selectedService}</p>
          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Duration:</strong> {service.duration} minutes</p>
          <p><strong>Total:</strong> ${(service.price / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
        
        {errorMessage && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
            !stripe || !elements || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${(service.price / 100).toFixed(2)}`}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Your payment is secure and encrypted. We use Stripe for payment processing.
      </p>
    </div>
  );
}

// Main component that wraps with StripeProvider
export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Create payment intent only once when component mounts
  // Stripe Elements doesn't allow changing clientSecret after initialization
  useEffect(() => {
    // Prevent re-initialization if already created
    if (hasInitialized) {
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const service = SERVICES.find(s => s.name === props.selectedService);
        if (!service) {
          props.onPaymentError('Invalid service selected');
          return;
        }

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: service.price,
            currency: 'usd',
            service: props.selectedService,
            customerInfo: props.customerInfo,
            bookingDetails: {
              date: props.selectedDate,
              time: props.selectedTime,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
        setHasInitialized(true);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to initialize payment';
        props.onPaymentError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Show loading state while creating payment intent
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Initializing payment...</div>
        </div>
      </div>
    );
  }

  return (
    <StripeProvider clientSecret={clientSecret}>
      <PaymentFormContent {...props} />
    </StripeProvider>
  );
}
