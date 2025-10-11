import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

// Initialize Firebase Admin SDK (only runs on server)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// Export Admin services
export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminMessaging = getMessaging();

// Admin email whitelist (server-side)
export const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export default adminDb;
