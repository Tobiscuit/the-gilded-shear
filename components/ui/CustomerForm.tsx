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
    <div className="bg-[#0A192F]/50 p-6 rounded-xl border border-[#c8a46e]/30 shadow-lg backdrop-blur-sm">
      <h3 className="text-xl font-display font-bold mb-4 text-white">
        Your Information
      </h3>
      
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a46e] bg-[#0A192F] text-white placeholder-gray-500 ${
              errors.name ? 'border-red-500' : 'border-[#c8a46e]/30'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a46e] bg-[#0A192F] text-white placeholder-gray-500 ${
              errors.email ? 'border-red-500' : 'border-[#c8a46e]/30'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8a46e] bg-[#0A192F] text-white placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-[#c8a46e]/30'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Form Validation Status */}
      <div className="mt-4">
        {isFormValid() ? (
          <p className="text-green-600 text-sm font-medium">
            ✓ All information looks good!
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Please fill in all required fields correctly.
          </p>
        )}
      </div>
    </div>
  );
}
