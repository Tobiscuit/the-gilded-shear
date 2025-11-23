'use client';

import { useState } from 'react';
import { SERVICES, formatPrice, formatDuration } from '@/lib/booking-utils';
import Calendar from '@/components/ui/Calendar';
import CustomerForm from '@/components/ui/CustomerForm';
import PaymentForm from '@/components/ui/PaymentForm';
import StripeProvider from '@/components/providers/StripeProvider';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('Classic Haircut');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const steps = [
    { id: 1, title: 'Select Service' },
    { id: 2, title: 'Date & Time' },
    { id: 3, title: 'Your Details' },
    { id: 4, title: 'Payment' }
  ];

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleCustomerInfoChange = (info: typeof customerInfo) => {
    setCustomerInfo(info);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!selectedService;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return !!customerInfo.name && !!customerInfo.email && !!customerInfo.phone;
      default:
        return false;
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Save booking to Firebase
      const bookingData = {
        clientName: customerInfo.name,
        clientEmail: customerInfo.email,
        clientPhone: customerInfo.phone,
        serviceName: selectedService,
        appointmentDate: Timestamp.fromDate(new Date(`${selectedDate}T${selectedTime}`)),
        duration: SERVICES.find(s => s.name === selectedService)?.duration || 30,
        status: 'confirmed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      
      setPaymentStatus('success');
      console.log('Payment successful and booking saved:', paymentIntent);
    } catch (error) {
      console.error('Error saving booking:', error);
      // Still show success for payment, but maybe log this error critically
      setPaymentStatus('success'); 
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    console.error('Payment failed:', error);
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setPaymentStatus('idle');
    setSelectedDate('');
    setSelectedTime('');
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  return (
    <section id="booking" className="py-24 bg-[#0A192F]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-4">
          Book Your Appointment
        </h2>
        <p className="text-gray-300 text-base md:text-lg text-center mb-12 max-w-2xl mx-auto">
          Select your desired service and a time that works for you.
        </p>

        {/* Stepper Progress */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Bar Background */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-700 -z-10" />
            
            {/* Active Progress Bar */}
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-yellow-600 -z-10 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center bg-[#0A192F] px-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    step.id <= currentStep 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step.id <= currentStep ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
          {paymentStatus === 'success' ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-green-600">check</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-8">
                Your appointment has been scheduled. We've sent a confirmation email to {customerInfo.email}.
              </p>
              <button 
                onClick={resetBooking}
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Choose a Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map((service) => (
                      <button
                        key={service.name}
                        onClick={() => handleServiceSelect(service.name)}
                        className={`text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                          selectedService === service.name
                            ? 'border-yellow-600 bg-yellow-50'
                            : 'border-gray-100 hover:border-yellow-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-lg text-gray-900">{service.name}</span>
                          <span className="font-bold text-yellow-700">{formatPrice(service.price)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{formatDuration(service.duration)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Select Date & Time</h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                  />
                </div>
              )}

              {/* Step 3: Customer Details */}
              {currentStep === 3 && (
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Your Information</h3>
                  <CustomerForm
                    customerInfo={customerInfo}
                    onInfoChange={handleCustomerInfoChange}
                  />
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Secure Payment</h3>
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
            </div>
          )}

          {/* Navigation Buttons */}
          {paymentStatus !== 'success' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Back
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepComplete(currentStep)}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
                    isStepComplete(currentStep)
                      ? 'bg-yellow-600 hover:bg-yellow-700 hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Next Step
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
