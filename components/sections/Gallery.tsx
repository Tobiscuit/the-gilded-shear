'use client';

export default function Gallery() {
  const galleryImages = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPLGOWFlvPUaULMkyWIfeI2bTxw38BMp5pIEdQRa_425Uz4OS_AD4bMYtbRFKZuRnHUjY87uW2Y11LlxNRzFN1LTwNO-q6M1I5OBpz9tjfugIXcbkfH59ECliWQyYjLW63rSV55JHSBnb20MyUNJmGOehVcxcDDg_cJWRY0q3X_OssGto0bnSgLweOhCIJCYhUtsXVtU-h2cT6a3gAtdcsqGGH_W--w5-GrTnZu3gmI6Ga0WaSTOMKZ_JvGKftF2Lv9Pt4FODPRisf",
      alt: "A man with a classic pompadour hairstyle, shot in a high-contrast, warm, and slightly desaturated style.",
      title: "Classic Pompadour"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfB_403hxvZhlYEM4vduBxzL5Zte7dii5vRunJdWamQF_rsbWmB-UdieDaOTS_sH0yUBG2AyyiabsFBC3IbpRdYGoJr2vmzYv0F2wOgrjHdvCLfVJYyIByyhTUz-iWFLNVMnXoB70cJd6i40SoVNmRzFh64N_mesyqS9Cb421PXNkwefdnvWN7H4wrpXLhB5asfdZH5mavixZbXjsS30TQC_gexGHzKLnUmZShidN3rLzhez51Xpd0QRZFUtnXtuStBTdcwjRFFj8r",
      alt: "A man with a skin fade and a neatly trimmed beard, captured in a high-contrast, warm, and slightly desaturated style.",
      title: "Skin Fade with Beard Trim"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR61gWlXDT8f2u_qobCWkLJGkByEloG5ptiV1GB5-QvuDgom9_WooE_fMBrfsW7x0lXI19AAIqk3beV7a7VdI97iyrDaf8w_t1AHNNP7A88teFfWp23x5-xu0c3hRLCDpfN175GwQSKNtrXWJTx3gUJ0sbIf9Ah9WOh1x9A5rAvBQnPPMovuTmrvUtMgtIO70EkddKfn1jjgR1u90f0lHj42UPG2cSIjtWdBDPm-0hc1szdY3HCif1Vo_NVCGnuLL-Cc5R2kUQs-zy",
      alt: "A detailed shot of a textured crop haircut, highlighting the hair's texture in a high-contrast, warm, and slightly desaturated style.",
      title: "Textured Crop"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdfUTMJ6YxRpIBkx9Ysuua_0FUKH_UuDxq4UDZKNcxYfviJSEgTjp5hrLVTD3Ih8Ng4w0FkivWZwjXJaW2fXkkE3yZw_VXKhugb3rF16orW7OlFuBj9MxczBDJvQVTBe2V62E3PhWCM6inUhd0Nu3srS9ZPeWSyGb0MsOoJyF3ILtvNM9RsLqh6P2yQLX1f3NWdJR-_aAe0HgJ5dWNvSb2eI40UKWL6_qCOizuHnTvYomWbF4Z4Vf2oB65W9o6To3k7Zbzg2m1qHRg",
      alt: "A man with a slick back hairstyle, exuding a classic vibe, photographed in a high-contrast, warm, and slightly desaturated style.",
      title: "Slick Back"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-bWdK-oatDXXc6ZHkfoOFVetKkez48aNGBr0qNhrygaRtkqkLnTOz4R4evVT4GDJAciqx8o4dT5HtKOxno6q8v2ZoUFzF6UmOyUVzutU8mFr1ZhGGfNjEds9nCVHL--bZCS3QFL1le98tMh7B2j0iEjtIOzRueRWu49AEJILGyVO3cJUQHq-Ws_7G5_lF-CGil_dvW9KY9xEu87VM2RxJmIgj3qqb6fuu__fBBAQUhJOOGpHU6y-hBVZe24zVbBF4zpvHdHwNXhkM",
      alt: "A modern quiff hairstyle, showcasing volume and style, captured in a high-contrast, warm, and slightly desaturated style.",
      title: "Modern Quiff"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiOLQepPhQ_bkVbzVji_41UDgwVKSpNMDKQMBuxvMytvEh5eZQplsey_cbgg5lN3gTaBmFlBcRSyPWtqVNxlGDXEvm4nAhMyGx0UOAelwci7j9EcVPq1AlIAYChiNfZYnYrCqa1oIsId7lzYjKKnfBTaINVzWUX8UgaCMi717DyCQdEQb660bD-rZ3ghhyqV8KP3wAmOB_PZjsSLWvSFI3kGaiozEqMmC_7uZxLZ-sU_M90pWAa_UCWLQ3vaRe0V7t6Np5FIcToVyh",
      alt: "A clean and sharp high and tight haircut, emphasizing precision, shot in a high-contrast, warm, and slightly desaturated style.",
      title: "High and Tight"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-[#0A192F] relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-premium-texture opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-white mb-12">
          Our Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="relative group rounded-xl aspect-square overflow-hidden shadow-lg border border-[#c8a46e]/20 hover:border-[#c8a46e] transition-all duration-300"
            >
              {/* Premium Texture Placeholder (visible while loading or if image fails) */}
              <div className="absolute inset-0 bg-premium-texture flex items-center justify-center">
                 <span className="text-[#c8a46e]/10 text-6xl font-display font-bold rotate-12 select-none">GS</span>
              </div>

              {/* Actual Image */}
              <img 
                src={image.src} 
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              
              {/* Overlay with Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-display font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {image.title}
                </h3>
                <div className="h-1 w-12 bg-[#c8a46e] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-transparent border border-[#c8a46e] text-[#c8a46e] font-bold rounded-lg hover:bg-[#c8a46e] hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(200,164,110,0.2)] hover:shadow-[0_0_25px_rgba(200,164,110,0.4)]">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}

