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
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden" style={{backgroundColor: '#FFF8E7'}}>
      <header className="absolute top-0 left-0 right-0 z-10 px-6 pt-6 pb-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-gray-800 font-display text-2xl font-bold">
            The Gilded Shear
          </div>
          
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-8">
                <a 
                  className="text-gray-800 hover:text-yellow-600 transition-colors font-medium drop-shadow-sm" 
                  href="#services"
                >
                  Services
                </a>
                <a 
                  className="text-gray-800 hover:text-yellow-600 transition-colors font-medium drop-shadow-sm" 
                  href="#gallery"
                >
                  Gallery
                </a>
                <a 
                  className="text-gray-800 hover:text-yellow-600 transition-colors font-medium drop-shadow-sm" 
                  href="#booking"
                >
                  Contact
                </a>
              </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-800 hover:text-yellow-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
            <nav className="flex flex-col space-y-4 p-4">
              <a 
                className="text-gray-800 hover:text-yellow-600 transition-colors font-medium py-2" 
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                className="text-gray-800 hover:text-yellow-600 transition-colors font-medium py-2" 
                href="#gallery"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </a>
              <a 
                className="text-gray-800 hover:text-yellow-600 transition-colors font-medium py-2" 
                href="#booking"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>
      
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full flex-1">
            <div className="@container">
              <div className="flex flex-col-reverse lg:flex-row items-center min-h-screen pt-8 lg:pt-16 pb-20">
                <div className="w-full lg:w-1/2 flex justify-center py-10 px-4 sm:px-8 lg:px-16" style={{backgroundColor: '#FFF8E7'}}>
                  <div className="max-w-md text-center lg:text-left">
                    <h1 className="text-gray-900 font-display text-5xl md:text-7xl font-bold leading-tight">
                      Mastering the Craft of Style
                    </h1>
                    <p className="mt-4 text-gray-700 text-lg font-body leading-relaxed">
                      Bespoke Grooming for the Modern Gentleman.
                    </p>
                    <button 
                      onClick={scrollToBooking}
                      className="mt-6 mx-auto lg:mx-0 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-yellow-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-yellow-700 transition-colors shadow-lg"
                    >
                      <span className="truncate">Book Now</span>
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 h-96 lg:h-screen flex items-center justify-center p-6">
                  <div 
                    className="w-full h-full rounded-2xl bg-center bg-no-repeat bg-cover shadow-2xl" 
                    data-alt="High-contrast photo of a barber meticulously trimming a client's beard." 
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuALs71Y45GUk4ls4eGSFi_jGbe1360TaJnlu9KaDNBEhVsE7OL9TLQqfzZqfLUQqj7n009sfpVZplYmsPYPqeBV4BssHItxpzJOcgVioYb4wRS3IkzFd-4Cby6mWC5gENxZBa5GXaFlX6CpZ3QFGG3ZK2UYi-i8s0Q__N26m7k_K6j9KaQeGvCPyjRerMd_FvVeRNQ9FYjM1xqUNCaof279tVtBojqASOWLy1RHnu7KnnYSVRI6YNwlgpDbzVHswRAxiqTGbmsjk26_")`,
                      filter: 'saturate(0.8) contrast(1.1)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

