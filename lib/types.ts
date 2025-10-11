export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  duration: number; // in minutes
  price: number; // in cents for Stripe
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  name: string;
  duration: number; // in minutes
  price: number; // in cents
  description: string;
}

export interface AdminSettings {
  deviceToken?: string;
  notificationEnabled: boolean;
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  bookingId?: string;
}
