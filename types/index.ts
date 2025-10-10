import { Timestamp } from 'firebase/firestore';

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: Timestamp;
  duration: number; // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutes
  iconName: string;
  active: boolean;
  displayOrder: number;
}

export interface Availability {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStart?: string; // "12:00"
  breakEnd?: string; // "13:00"
}

export interface BarberProfile {
  id: string;
  businessName: string;
  barberName: string;
  phone: string;
  email: string;
  address: string;
  bio: string;
  fcmTokens: string[]; // For push notifications
  galleryImages: string[];
}

