export default function LocationHours() {
  return (
    <section id="location" className="py-16 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12" style={{color: '#FCD34D'}}>
          Visit Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Location */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6" style={{color: '#FCD34D'}}>
              Location
            </h3>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>The Gilded Shear</strong><br />
                123 Main Street<br />
                Downtown District<br />
                City, State 12345
              </p>
              <p className="text-lg">
                📞 (555) 123-4567<br />
                ✉️ hello@thegildedshear.com
              </p>
            </div>
          </div>
          
          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6" style={{color: '#FCD34D'}}>
              Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

