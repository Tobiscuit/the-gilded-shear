import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Gallery from '@/components/sections/Gallery';
import Booking from '@/components/sections/Booking';
import LocationHours from '@/components/sections/LocationHours';

export default function Home() {
  return (
    <main className="min-h-screen" style={{backgroundColor: '#FFF8E7'}}>
      <Hero />
      <Services />
      <Gallery />
      <Booking />
      <LocationHours />
    </main>
  );
}

