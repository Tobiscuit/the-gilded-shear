importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAwNlkIG3kVxBYMjBRrFH8vPg7wfxl8YCI",
  authDomain: "the-gilded-shear.firebaseapp.com",
  projectId: "the-gilded-shear",
  storageBucket: "the-gilded-shear.firebasestorage.app",
  messagingSenderId: "434851862135",
  appId: "1:434851862135:web:7708d772119b52d6759872"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
