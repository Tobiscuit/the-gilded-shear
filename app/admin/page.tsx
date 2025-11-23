'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, Timestamp, where, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { auth, db, messaging } from '@/lib/firebase';
import { Booking } from '@/types';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (!user) return;

    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('appointmentDate', 'desc'));

    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
    });

    return () => unsubscribeBookings();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!messaging) return;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY
        });
        
        if (token && user) {
          // Save token to barber profile
          // Assuming a single barber profile for now or using user.uid
          const barberRef = doc(db, 'barberProfile', 'main'); // Using 'main' as a singleton ID
          
          // Check if doc exists
          const docSnap = await getDoc(barberRef);
          
          if (docSnap.exists()) {
            await updateDoc(barberRef, {
              fcmTokens: arrayUnion(token)
            });
          } else {
            await setDoc(barberRef, {
              fcmTokens: [token],
              email: user.email,
              updatedAt: Timestamp.now()
            });
          }
          alert('Notifications enabled!');
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8a46e]"></div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysBookings = bookings.filter(b => {
    const date = b.appointmentDate.toDate();
    return date >= today && date < new Date(today.getTime() + 86400000);
  }).length;
  
  const pendingRequests = bookings.filter(b => b.status === 'pending').length;
  
  // Calculate monthly revenue
  const currentMonth = today.getMonth();
  const monthlyRevenue = bookings
    .filter(b => b.appointmentDate.toDate().getMonth() === currentMonth && b.status !== 'cancelled')
    .reduce((acc, curr) => {
      // Estimate price based on service name (this should ideally come from the booking data)
      let price = 0;
      if (curr.serviceName.includes('Classic')) price = 30;
      if (curr.serviceName.includes('Beard')) price = 20;
      if (curr.serviceName.includes('Fade')) price = 35;
      return acc + price;
    }, 0);

  return (
    <div className="min-h-screen bg-[#0A192F]">
      {/* Admin Header */}
      <header className="bg-[#0A192F] border-b border-[#c8a46e]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#c8a46e]">admin_panel_settings</span>
            <h1 className="text-white font-display font-bold text-xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {notificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#c8a46e]/20 text-[#c8a46e] text-xs rounded-full hover:bg-[#c8a46e]/30 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">notifications</span>
                Enable Alerts
              </button>
            )}
            <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#c8a46e]/30 rounded-lg text-[#c8a46e] text-sm hover:bg-[#c8a46e]/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notificationPermission !== 'granted' && (
          <div className="md:hidden mb-6 p-4 bg-[#c8a46e]/10 border border-[#c8a46e]/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c8a46e]">notifications_active</span>
              <span className="text-white text-sm">Get notified for new bookings</span>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-3 py-1.5 bg-[#c8a46e] text-[#0A192F] text-xs font-bold rounded-lg"
            >
              Enable
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-[#0A192F]/50 border border-[#c8a46e]/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Today's Bookings</h3>
            <p className="text-3xl font-display font-bold text-white">{todaysBookings}</p>
          </div>
          <div className="bg-[#0A192F]/50 border border-[#c8a46e]/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Pending Requests</h3>
            <p className="text-3xl font-display font-bold text-[#c8a46e]">{pendingRequests}</p>
          </div>
          <div className="bg-[#0A192F]/50 border border-[#c8a46e]/20 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Est. Revenue (Mo)</h3>
            <p className="text-3xl font-display font-bold text-white">${monthlyRevenue}</p>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-[#0A192F]/50 border border-[#c8a46e]/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#c8a46e]/20 flex justify-between items-center">
            <h2 className="text-xl font-display font-bold text-white">Recent Bookings</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">calendar_month</span>
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#c8a46e]/10">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-[#c8a46e]/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-bold text-lg">{booking.clientName}</h3>
                      <p className="text-[#c8a46e] text-sm">{booking.serviceName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">event</span>
                      {booking.appointmentDate.toDate().toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {booking.appointmentDate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">call</span>
                      {booking.clientPhone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
