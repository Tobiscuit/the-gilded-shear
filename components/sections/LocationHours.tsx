export default function LocationHours() {
  return (
    <section id="location" className="py-20" style={{backgroundColor: '#FFF8E7'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12" style={{color: '#0A192F'}}>
          Get In Touch
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6" style={{color: '#9A7B34'}}>
              Contact
            </h3>
            <div className="space-y-4">
              <p className="text-lg" style={{color: '#0A192F'}}>
                <strong>The Gilded Shear</strong><br />
                Mobile Barber Services
              </p>
              <p className="text-lg" style={{color: '#0A192F'}}>
                📞 (555) 123-4567<br />
                ✉️ hello@thegildedshear.com<br />
                📸 @thegildedshear
              </p>
              <p className="text-sm" style={{color: '#0A192F'}}>
                <em>Location provided upon booking confirmation</em>
              </p>
            </div>
          </div>
          
          {/* Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-display font-bold mb-6" style={{color: '#9A7B34'}}>
              Available Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{color: '#0A192F'}}>Monday - Friday</span>
                <span style={{color: '#0A192F'}}>4:00 PM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span style={{color: '#0A192F'}}>Saturday</span>
                <span style={{color: '#0A192F'}}>10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span style={{color: '#0A192F'}}>Sunday</span>
                <span style={{color: '#0A192F'}}>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}