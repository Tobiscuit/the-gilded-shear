'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="relative min-h-screen flex items-center bg-[#0A192F] overflow-hidden">
      {/* Background Gradient/Texture Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] opacity-50" />
      
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 pt-6 pb-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-[#c8a46e] font-display text-2xl font-bold">
            The Gilded Shear
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <a 
              className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium drop-shadow-sm" 
              href="#services"
            >
              Services
            </a>
            <a 
              className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium drop-shadow-sm" 
              href="#gallery"
            >
              Gallery
            </a>
            <a 
              className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium drop-shadow-sm" 
              href="#booking"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#c8a46e] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0A192F] border-b border-[#c8a46e]/20 shadow-lg z-50">
            <nav className="flex flex-col space-y-4 p-4">
              <a 
                className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium py-2" 
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium py-2" 
                href="#gallery"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </a>
              <a 
                className="text-gray-300 hover:text-[#c8a46e] transition-colors font-medium py-2" 
                href="#booking"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left pt-10 lg:pt-0">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-[#c8a46e] mb-6 leading-tight">
              Mastering the <br/>
              <span className="text-white">Craft of Style</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Bespoke grooming for the modern gentleman. Experience the finest cuts and shaves in the comfort of your own space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToBooking}
                className="px-10 py-4 bg-gradient-to-r from-[#c8a46e] to-[#a68a5a] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(200,164,110,0.3)] hover:shadow-[0_0_30px_rgba(200,164,110,0.5)] hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Book Now
              </button>
              <a 
                href="#services" 
                className="px-10 py-4 border border-[#c8a46e]/30 text-[#c8a46e] font-bold rounded-lg hover:bg-[#c8a46e]/10 transition-all duration-300 text-lg flex items-center justify-center"
              >
                View Services
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-400">
              <span className="flex text-[#c8a46e]">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </span>
              <span>Premium Mobile Service</span>
            </div>
          </div>

          {/* Hero Image with Blend */}
          <div className="relative h-[500px] lg:h-[700px] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent z-10 bottom-0 h-1/3" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0A192F] via-transparent to-transparent z-10 right-0 w-1/4 hidden lg:block" />
            
            {/* Placeholder for Barber Image - Replace with actual image */}
            <div className="w-full h-full bg-premium-texture rounded-2xl shadow-2xl overflow-hidden relative group">
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-[#c8a46e]/20 text-9xl font-display font-bold rotate-12 select-none">GS</span>
               </div>
               {/* Image would go here with object-cover */}
               {/* <img src="/path/to/barber.jpg" alt="Barber" className="w-full h-full object-cover opacity-80 mix-blend-overlay" /> */}
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#0A192F] border border-[#c8a46e]/30 p-6 rounded-xl shadow-xl z-20 hidden md:block">
              <p className="text-[#c8a46e] font-display font-bold text-3xl">10+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
