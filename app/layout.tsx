import type { Metadata } from 'next';
import './globals.css';
import PwaRegister from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'The Gilded Shear | Master Barber Craftsmanship',
  description: 'Experience the art of precision barbering. Skilled, trustworthy, and meticulous craftsmanship for the modern gentleman.',
  keywords: ['barber', 'haircut', 'mens grooming', 'fade', 'beard trim'],
  authors: [{ name: 'Edgar Nava' }],
  creator: 'Edgar Nava',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'The Gilded Shear | Master Barber Craftsmanship',
    description: 'Experience the art of precision barbering.',
    siteName: 'The Gilded Shear',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Gilded Shear | Master Barber Craftsmanship',
    description: 'Experience the art of precision barbering.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Gilded Shear',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#0A192F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}

