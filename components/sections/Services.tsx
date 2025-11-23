'use client';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#0A192F] relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-premium-texture opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-white">
          The Services We Offer
        </h2>
        <p className="text-lg text-center mb-16 max-w-3xl mx-auto text-gray-200 font-light">
          Each service is crafted with the precision and care of a master artisan. We don't just cut hair – we sculpt confidence, one strand at a time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Classic Cut */}
          <div className="group bg-[#0A192F]/50 backdrop-blur-sm border border-[#c8a46e]/30 rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(200,164,110,0.15)] hover:border-[#c8a46e]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#c8a46e] to-[#a68a5a] p-[1px] group-hover:shadow-[0_0_20px_rgba(200,164,110,0.4)] transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c8a46e] text-4xl group-hover:scale-110 transition-transform duration-300">
                  content_cut
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-[#c8a46e] transition-colors">
              Classic Cut
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
              Timeless craftsmanship meets modern precision. Every cut is executed with the meticulous attention to detail that defines true mastery.
            </p>
          </div>
          
          {/* Beard Trim */}
          <div className="group bg-[#0A192F]/50 backdrop-blur-sm border border-[#c8a46e]/30 rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(200,164,110,0.15)] hover:border-[#c8a46e]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#c8a46e] to-[#a68a5a] p-[1px] group-hover:shadow-[0_0_20px_rgba(200,164,110,0.4)] transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c8a46e] text-4xl group-hover:scale-110 transition-transform duration-300">
                  person
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-[#c8a46e] transition-colors">
              Beard Trim
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
              The art of masculine refinement. Each stroke of the blade reveals the confident gentleman within, transforming your appearance with skilled precision.
            </p>
          </div>
          
          {/* Fade */}
          <div className="group bg-[#0A192F]/50 backdrop-blur-sm border border-[#c8a46e]/30 rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(200,164,110,0.15)] hover:border-[#c8a46e]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#c8a46e] to-[#a68a5a] p-[1px] group-hover:shadow-[0_0_20px_rgba(200,164,110,0.4)] transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c8a46e] text-4xl group-hover:scale-110 transition-transform duration-300">
                  waves
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-[#c8a46e] transition-colors">
              Fade
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
              The pinnacle of modern barbering artistry. Seamless transitions and perfect gradients that showcase the skill of a true craftsman at work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

