# Barber Shop PWA - "The Master Craftsman"

A modern Progressive Web App for a solo barber business, built with **Next.js**, **Firebase**, and archetypal brand psychology.

---

## 🎯 Project Goals

1. **Instant Booking Notifications**: Barber receives push notifications the moment a client books
2. **Zero Friction**: No app store downloads, works directly in browser
3. **Professional Branding**: Built on the Creator/Artisan archetype
4. **Low Cost**: Free tier services for the first ~3,000 bookings/month

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS (design system from `design_system.json`)
- **PWA**: `next-pwa` with Service Worker
- **Backend**: Firebase (Firestore, Cloud Functions, FCM)
- **Email**: SendGrid API
- **Hosting**: Vercel (frontend) + Firebase (functions)

### Key Features
- ✅ Push notifications via Firebase Cloud Messaging
- ✅ Single-page scrolling design
- ✅ Offline-capable with Service Worker
- ✅ Installable as PWA (Add to Home Screen)
- ✅ Email confirmations via SendGrid
- ✅ Responsive, mobile-first design

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Complete system architecture, data models, flows, and deployment
- **[DIAGRAMS.md](./DIAGRAMS.md)**: 15 Mermaid diagrams visualizing the entire system
- **[design_system.json](./design_system.json)**: Brand design system with colors, typography, archetype

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project
- A SendGrid account (free tier)

### Initial Setup

```bash
# Clone and install
git clone <repo>
cd edgar-nava-barber
npm install

# Setup Firebase
firebase login
firebase init

# Setup environment variables
cp .env.example .env.local
# Fill in Firebase config and SendGrid API key

# Run locally
npm run dev
```

### Development Commands

```bash
# Frontend dev server
npm run dev

# Firebase emulators (functions + firestore)
firebase emulators:start

# Build for production
npm run build

# Deploy frontend
vercel --prod

# Deploy Cloud Functions
firebase deploy --only functions
```

---

## 📁 Project Structure

```
edgar-nava-barber/
├── public/
│   ├── icons/              # PWA icons
│   └── images/             # Gallery photos
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main single-page app
│   ├── components/
│   │   ├── sections/       # Hero, Services, Gallery, Booking, Location
│   │   └── ui/             # Reusable UI components
│   ├── lib/
│   │   ├── firebase.ts     # Firebase initialization
│   │   └── designSystem.ts # Design tokens
│   └── types/
│       └── index.ts        # TypeScript interfaces
├── functions/              # Firebase Cloud Functions
│   └── src/
│       ├── index.ts
│       └── onBookingCreated.ts
├── design_system.json      # Brand design system
├── ARCHITECTURE.md         # System documentation
├── DIAGRAMS.md             # Visual diagrams
└── README.md               # This file
```

---

## 🎨 Design System

Built on the **Creator/Artisan** archetype:

### Color Palette
- **Deep Navy** `#0A192F`: Primary (trust, expertise)
- **Artisan Gold** `#C69F43`: Secondary (quality, prestige)
- **Warm Cream** `#FFF8E7`: Background (welcoming)
- **Bright Gold** `#EAA90F`: CTAs (attention-grabbing)
- **Charcoal** `#333333`: Text (readable)

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Montserrat (clean sans-serif)

See [design_system.json](./design_system.json) for complete system.

---

## 📱 PWA Features

### Installability
- Manifest file with icons (192x192, 512x512)
- Service Worker for offline support
- "Add to Home Screen" prompt

### Push Notifications
- Firebase Cloud Messaging (FCM)
- Automatic permission request on barber's device
- Instant delivery when new booking created

### Offline Support
- Cached static assets (HTML, CSS, JS, images)
- Cached services, gallery, hours
- Graceful degradation (can't book offline)

---

## 🔔 Notification Flow

1. **Client books appointment** → Firestore
2. **Firestore onCreate trigger** → Cloud Function
3. **Cloud Function** sends:
   - Push notification → Barber's device (FCM)
   - Email confirmation → Client (SendGrid)
4. **Booking status** updated to "confirmed"

See [DIAGRAMS.md](./DIAGRAMS.md) for detailed sequence diagrams.

---

## 🔒 Security

### Firestore Rules
- ✅ Public read: services, availability, barber profile
- ✅ Public create: bookings (with validation)
- ❌ Public update/delete: bookings (functions only)
- ❌ Admin only: services, profile updates

### Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_VAPID_KEY=...
SENDGRID_API_KEY=...
```

---

## 📊 Performance Targets

- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **TTI**: < 3.5s
- **Lighthouse PWA**: 100
- **Lighthouse Performance**: > 90

---

## 💰 Cost Breakdown

### Firebase (Free Tier)
- Firestore: 50K reads, 20K writes/day → **FREE**
- Cloud Functions: 125K invocations → **FREE**
- FCM: Unlimited → **FREE**

### SendGrid (Free Tier)
- 100 emails/day → **FREE**

### Vercel (Free Tier)
- Unlimited bandwidth → **FREE**

**Total: $0/month** for ~3,000 bookings/month

---

## 🛠️ Development Roadmap

### Phase 1: MVP (Current)
- [x] Design system
- [x] Architecture documentation
- [ ] Next.js setup
- [ ] Component development
- [ ] Firebase integration
- [ ] Push notifications
- [ ] Email confirmations

### Phase 2: Enhancements
- [ ] Admin panel for barber
- [ ] Calendar view
- [ ] Gallery management
- [ ] SMS backup (optional)

### Phase 3: Advanced
- [ ] Client booking history
- [ ] Google Calendar sync
- [ ] Automated reminders
- [ ] Analytics dashboard

---

## 🧪 Testing

### Manual Checklist
- [ ] Install PWA on Android
- [ ] Install PWA on iOS
- [ ] Grant notification permission
- [ ] Submit test booking
- [ ] Verify push notification received
- [ ] Verify email received
- [ ] Test offline mode

---

## 📖 Learning Resources

- [Next.js PWA Guide](https://github.com/shadowwalker/next-pwa)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [SendGrid API](https://docs.sendgrid.com/api-reference)

---

## 🤝 Contributing

This is a personal project for learning purposes. Feel free to fork and adapt for your own use.

---

## 📝 Notes on Scope Management

This project is designed with **iterative discovery** in mind:

1. **Documentation first** to prevent scope creep
2. **Mermaid diagrams** for visual clarity
3. **Phased roadmap** to stay focused
4. **Clear success metrics** to know when we're done

If a "better business use case" is discovered during development, document it in **ARCHITECTURE.md** under "Future Enhancements" rather than implementing immediately.

---

## 📞 Contact

Built with care for Edgar Nava's barbershop business.

---

**Last Updated**: October 10, 2025

