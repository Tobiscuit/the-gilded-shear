'use client';

import { useState } from 'react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  customerInfo: CustomerInfo;
  onInfoChange: (info: CustomerInfo) => void;
}

export default function CustomerForm({ customerInfo, onInfoChange }: CustomerFormProps) {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateField = (field: keyof CustomerInfo, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const phoneRegex = /^\+?[\d\s-()]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onInfoChange({ ...customerInfo, [field]: value });
    validateField(field, value);
  };

  const isFormValid = () => {
    return (
      customerInfo.name.length >= 2 &&
      customerInfo.email.includes('@') &&
      customerInfo.phone.length >= 10 &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl border-2 border-[#c8a46e]/30 shadow-2xl">
      
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#0A192F] mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg 
              bg-gray-50 text-[#0A192F] placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#c8a46e] focus:border-[#c8a46e]
              transition-all duration-200 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#c8a46e]/30 hover:border-[#c8a46e]/50'
            }`}
            placeholder="John Smith"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 font-medium">⚠ {errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#0A192F] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg 
              bg-gray-50 text-[#0A192F] placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#c8a46e] focus:border-[#c8a46e]
              transition-all duration-200 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#c8a46e]/30 hover:border-[#c8a46e]/50'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 font-medium">⚠ {errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#0A192F] mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg 
              bg-gray-50 text-[#0A192F] placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-[#c8a46e] focus:border-[#c8a46e]
              transition-all duration-200 ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#c8a46e]/30 hover:border-[#c8a46e]/50'
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2 font-medium">⚠ {errors.phone}</p>
          )}
        </div>
      </div>

      {/* Form Validation Status */}
      <div className="mt-6 pt-6 border-t border-[#c8a46e]/20">
        {isFormValid() ? (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold">
              All information looks good!
            </p>
          </div>
        ) : (
          <p className="text-gray-600 text-sm font-medium">
            Please fill in all required fields correctly.
          </p>
        )}
      </div>
    </div>
  );
}
