'use client';

export default function Services() {
  return (
    <section id="services" className="py-24" style={{backgroundColor: '#0A192F'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6" style={{color: '#FFFFFF'}}>
          The Services We Offer
        </h2>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto" style={{color: '#F6F7F8'}}>
          Each service is crafted with the precision and care of a master artisan. We don't just cut hair – we sculpt confidence, one strand at a time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Classic Cut */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              content_cut
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
              Classic Cut
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Timeless craftsmanship meets modern precision. Every cut is executed with the meticulous attention to detail that defines true mastery.
            </p>
          </div>
          
          {/* Beard Trim */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              person
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
              Beard Trim
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The art of masculine refinement. Each stroke of the blade reveals the confident gentleman within, transforming your appearance with skilled precision.
            </p>
          </div>
          
          {/* Fade */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              waves
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
              Fade
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The pinnacle of modern barbering artistry. Seamless transitions and perfect gradients that showcase the skill of a true craftsman at work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

