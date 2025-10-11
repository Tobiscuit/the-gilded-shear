'use client';

import { useState } from 'react';
import { SERVICES, formatPrice, formatDuration } from '@/lib/booking-utils';
import Calendar from '@/components/ui/Calendar';
import CustomerForm from '@/components/ui/CustomerForm';
import PaymentForm from '@/components/ui/PaymentForm';
import StripeProvider from '@/components/providers/StripeProvider';

export default function Booking() {
  const [selectedService, setSelectedService] = useState('Classic Haircut');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleCustomerInfoChange = (info: typeof customerInfo) => {
    setCustomerInfo(info);
  };

  // Check if booking is ready to proceed
  const isBookingReady = () => {
    return (
      selectedService &&
      selectedDate &&
      selectedTime &&
      customerInfo.name &&
      customerInfo.email &&
      customerInfo.phone
    );
  };

  const handleConfirmBooking = () => {
    if (isBookingReady()) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentStatus('success');
    console.log('Payment successful:', paymentIntent);
    // TODO: Save booking to Firebase and send notifications
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    console.error('Payment failed:', error);
  };

  const resetBooking = () => {
    setShowPayment(false);
    setPaymentStatus('idle');
    setSelectedDate('');
    setSelectedTime('');
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  return (
    <section id="booking" className="py-24" style={{backgroundColor: '#0A192F'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-4">
          Book Your Appointment
        </h2>
        <p className="text-gray-300 text-base md:text-lg text-center mb-12 max-w-2xl mx-auto">
          Select your desired service and a time that works for you. We look forward to seeing you at The Gilded Shear.
        </p>
        
        {/* Show booking form or payment form */}
        {!showPayment ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {/* Service Selection */}
              <div className="lg:col-span-1">
                <h3 className="text-xl font-display font-bold mb-4 text-white">
                  Select Service
                </h3>
                <div className="space-y-3">
                  {SERVICES.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleServiceSelect(service.name)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedService === service.name
                          ? 'border-yellow-500 bg-yellow-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      <p className="font-bold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDuration(service.duration)} - {formatPrice(service.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar and Customer Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Calendar */}
                <div className="flex justify-center">
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />
                </div>

                {/* Customer Information */}
                <div className="flex justify-center">
                  <CustomerForm
                    customerInfo={customerInfo}
                    onInfoChange={handleCustomerInfoChange}
                  />
                </div>
              </div>
            </div>
        
            <div className="flex mt-12 justify-center">
              <button 
                onClick={handleConfirmBooking}
                disabled={!isBookingReady()}
                className={`px-12 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg ${
                  isBookingReady()
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isBookingReady() ? 'Proceed to Payment' : 'Complete All Fields'}
              </button>
            </div>
          </>
        ) : (
          /* Payment Form */
          <div className="flex justify-center">
            <PaymentForm
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              customerInfo={customerInfo}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        )}

        {/* Payment Status Messages */}
        {paymentStatus === 'success' && (
          <div className="mt-8 text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-bold">Payment Successful!</p>
              <p className="text-sm">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
              <button 
                onClick={resetBooking}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mt-8 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-bold">Payment Failed</p>
              <p className="text-sm">There was an issue processing your payment. Please try again.</p>
              <button 
                onClick={() => setPaymentStatus('idle')}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

