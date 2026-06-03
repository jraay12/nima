import { useEffect, useRef } from "react";
import heroBg from "../assets/herosection.png"; // 👈 swap with your actual local asset path


const HeroSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      contentRef.current?.classList.add("opacity-100", "translate-y-0");
      contentRef.current?.classList.remove("opacity-0", "translate-y-5");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleImgLoad = () => {
    imgRef.current?.classList.add("scale-100");
    imgRef.current?.classList.remove("scale-105");
  };

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden flex flex-col items-center justify-center">
      {/* ── Background image ── */}
      <img
        ref={imgRef}
        src={heroBg}
        alt=""
        aria-hidden="true"
        onLoad={handleImgLoad}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out"
      />

      {/* ── Dark gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/65" />

      {/* ── Center content ── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-5 max-w-4xl mx-auto
                   opacity-0 translate-y-5 transition-all duration-700 ease-out"
      >
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 bg-[#2d8a4e]/25 border border-[#2d8a4e]/50 text-green-300 text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Serving Nevada's Medical Community
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5 drop-shadow-lg">
          Nevada Iranian-American Medical Association
        </h1>

        {/* Subtext */}
        <p className="text-[15px] sm:text-base text-white/75 leading-relaxed max-w-lg mb-8">
          A non-profit professional organization dedicated to fostering a strong
          and supportive community for Iranian-American physicians and
          healthcare professionals in Nevada.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a
            href="#join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-[#2d8a4e] text-white text-[14px] font-semibold
                       shadow-[0_4px_20px_rgba(45,138,78,0.45)]
                       hover:bg-[#248542] hover:shadow-[0_6px_28px_rgba(45,138,78,0.55)]
                       hover:-translate-y-px active:scale-[0.97]
                       transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Explore Membership
          </a>

          <a
            href="#about"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full
                       bg-white/10 border border-white/30 text-white text-[14px] font-medium
                       backdrop-blur-md
                       hover:bg-white/18 hover:border-white/50 hover:-translate-y-px
                       active:scale-[0.97]
                       transition-all duration-200"
          >
            View Events
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50">
        <span className="text-[10px] text-white uppercase tracking-widest font-medium">
          Scroll
        </span>
        <div className="w-4 h-4 border-r-2 border-b-2 border-white rotate-45 animate-bounce" />
      </div>
    </div>
  );
};

export default HeroSection;
