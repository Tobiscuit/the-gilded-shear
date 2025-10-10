'use client';

export default function Services() {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Classic Cut */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              content_cut
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Classic Cut
            </h3>
            <p className="text-gray-600 text-lg">
              $45 | 45 min
            </p>
          </div>
          
          {/* Beard Trim */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              person
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Beard Trim
            </h3>
            <p className="text-gray-600 text-lg">
              $25 | 30 min
            </p>
          </div>
          
          {/* Fade */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-yellow-500">
            <span className="material-symbols-outlined text-yellow-600 mb-4 block" style={{fontSize: '48px'}}>
              waves
            </span>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Fade
            </h3>
            <p className="text-gray-600 text-lg">
              $50 | 50 min
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

