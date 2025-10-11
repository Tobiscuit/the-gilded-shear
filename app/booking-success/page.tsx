import Link from 'next/link';

export default function BookingSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFF8E7'}}>
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing The Gilded Shear. Your appointment has been successfully booked and payment processed.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You will receive a confirmation email with all the details shortly. If you need to make any changes, please contact us.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-yellow-700 transition-colors"
          >
            Return to Homepage
          </Link>
          <Link 
            href="/#booking"
            className="block w-full border-2 border-yellow-600 text-yellow-600 py-3 px-6 rounded-lg font-bold hover:bg-yellow-50 transition-colors"
          >
            Book Another Appointment
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Questions? Contact us at:</p>
          <p className="font-medium">hello@thegildedshear.com</p>
        </div>
      </div>
    </div>
  );
}
