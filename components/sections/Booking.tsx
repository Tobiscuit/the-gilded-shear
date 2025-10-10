'use client';

import { useState } from 'react';

export default function Booking() {
  const [selectedService, setSelectedService] = useState('Beard Trim');
  const [selectedDate, setSelectedDate] = useState('5');

  const services = [
    { name: 'Classic Haircut', duration: '45 min', price: '$40' },
    { name: 'Beard Trim', duration: '30 min', price: '$25' },
    { name: 'Hot Towel Shave', duration: '45 min', price: '$45' },
    { name: 'The Full Works', duration: '90 min', price: '$80' }
  ];

  const calendarDays = [
    // Previous month (disabled)
    ...Array.from({ length: 7 }, (_, i) => ({ day: 24 + i, disabled: true })),
    // Current month
    ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, disabled: false }))
  ];

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day.toString());
  };

  return (
    <section id="booking" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900 mb-4">
          Book Your Appointment
        </h2>
        <p className="text-gray-600 text-base md:text-lg text-center mb-12 max-w-2xl mx-auto">
          Select your desired service and a time that works for you. We look forward to seeing you at The Gilded Shear.
        </p>
        
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12 w-full">
          {/* Service Selection */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-display font-bold mb-4 text-gray-900">
              Select Service
            </h3>
            <div className="space-y-3">
              {services.map((service) => (
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
                    {service.duration} - {service.price}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Picker */}
          <div className="flex-1 flex flex-col items-center w-full lg:w-2/3">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 w-full max-w-md shadow-lg">
              <div className="flex min-w-72 flex-1 flex-col gap-0.5">
                <div className="flex items-center p-1 justify-between mb-4">
                  <button className="text-gray-600 hover:bg-gray-100 rounded-full p-2">
                    <div className="flex size-10 items-center justify-center">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </div>
                  </button>
                  <p className="text-gray-900 text-lg font-bold flex-1 text-center font-display">
                    October 2023
                  </p>
                  <button className="text-gray-600 hover:bg-gray-100 rounded-full p-2">
                    <div className="flex size-10 items-center justify-center">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </div>
                  </button>
                </div>
                
                <div className="grid grid-cols-7">
                  {/* Day headers */}
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <p key={`day-${index}`} className="text-gray-500 text-xs font-bold tracking-wider flex h-10 w-full items-center justify-center pb-0.5">
                      {day}
                    </p>
                  ))}
                  
                  {/* Calendar days */}
                  {calendarDays.map(({ day, disabled }, index) => (
                    <button
                      key={index}
                      onClick={() => !disabled && handleDateSelect(day)}
                      disabled={disabled}
                      className={`h-10 w-full text-gray-900 text-sm font-medium ${
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className={`flex size-full items-center justify-center rounded-full ${
                        disabled 
                          ? 'text-gray-300'
                          : selectedDate === day.toString()
                          ? 'bg-yellow-500 text-white font-bold'
                          : 'hover:bg-yellow-100'
                      }`}>
                        {day}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex mt-12 justify-center">
          <button className="bg-yellow-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-colors shadow-lg">
            Confirm Booking
          </button>
        </div>
      </div>
    </section>
  );
}

