export default function LocationHours() {
  return (
    <section id="location" className="py-20 bg-[#050d1a] border-t border-[#c8a46e]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 text-white">
          Get In Touch
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6 text-[#c8a46e]">
              Contact
            </h3>
            <div className="space-y-4">
              <p className="text-lg text-gray-200">
                <strong className="text-white">The Gilded Shear</strong><br />
                Mobile Barber Services
              </p>
              <p className="text-lg text-gray-200">
                <span className="text-[#c8a46e]">📞</span> (555) 123-4567<br />
                <span className="text-[#c8a46e]">✉️</span> hello@thegildedshear.com<br />
                <span className="text-[#c8a46e]">📸</span> @thegildedshear
              </p>
              <p className="text-sm text-gray-400 italic">
                Location provided upon booking confirmation
              </p>
            </div>
          </div>
          
          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6 text-[#c8a46e]">
              Available Hours
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#c8a46e]/10 pb-2">
                <span className="text-gray-200">Monday - Friday</span>
                <span className="text-white font-medium">4:00 PM - 8:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-[#c8a46e]/10 pb-2">
                <span className="text-gray-200">Saturday</span>
                <span className="text-white font-medium">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-[#c8a46e]/10 pb-2">
                <span className="text-gray-200">Sunday</span>
                <span className="text-[#c8a46e] font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-[#c8a46e]/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} The Gilded Shear. All rights reserved.</p>
          <div className="mt-2 flex justify-center">
            <a href="/login" className="p-4 opacity-50 hover:opacity-100 transition-opacity text-xs uppercase tracking-widest">Admin Access</a>
          </div>
        </div>
      </div>
    </section>
  );
}