import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, Users, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for any user-uploaded images inside src/assets/hero/<category>/
const heroImageFiles = import.meta.glob<{ default: string }>(
  '../assets/hero/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
  { eager: true }
);

interface Slide {
  id: number;
  category: string;
  folder: string;
  heading: string;
  description: string;
  defaultImage: string;
}

// Exactly matching the 7 categories: WEDDING first, followed by PRE WEDDING, HALDI, MEHENDI, BIRTHDAY, BABY SHOOT, FASHION
const slides: Slide[] = [
  {
    id: 1,
    category: "Wedding",
    folder: "wedding",
    heading: "Capturing Moments, Creating Memories.",
    description: "Every wedding tells a unique story of love, joy, and forever. We craft timeless images that capture every tear, every smile, and every sacred moment with cinematic elegance.",
    defaultImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=2560&q=80"
  },
  {
    id: 2,
    category: "Pre Wedding",
    folder: "pre-wedding",
    heading: "Love Before Forever.",
    description: "Before the vows, there are stolen glances, and playful laughter. We create romantic pre-wedding shoots that celebrate your unique love story in stunning locations.",
    defaultImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=2560&q=80"
  },
  {
    id: 3,
    category: "Haldi",
    folder: "haldi",
    heading: "Confidence In Every Frame.",
    description: "Bold, elegant, and timeless photography. We create stunning editorial shots that showcase style, confidence, and artistic vision.",
    defaultImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=2560&q=80"
  },
  {
    id: 4,
    category: "Mehendi",
    folder: "mehendi",
    heading: "Beautiful Details, Beautiful Memories.",
    description: "Intricate designs, delicate patterns, and beautiful details that tell your story. We focus on the small, precious moments of your Mehendi ceremony with elegance.",
    defaultImage: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=2560&q=80"
  },
  {
    id: 5,
    category: "Birthday",
    folder: "birthday",
    heading: "Celebrate Every Smile.",
    description: "From intimate gatherings to grand celebrations, we capture every laughter, every wish, and every magical moment of your special day.",
    defaultImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=2560&q=80"
  },
  {
    id: 6,
    category: "Baby Shoot",
    folder: "baby-shoot",
    heading: "Pure Joy, Little Smiles.",
    description: "Capturing the purest smiles, tiny giggles, and innocent moments. We create heartwarming memories of your little ones that you will cherish forever.",
    defaultImage: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=2560&q=80"
  },
  {
    id: 7,
    category: "Fashion",
    folder: "fashion",
    heading: "Style & Elegance In Every Pose.",
    description: "Bold, elegant, and timeless fashion photography. We create stunning editorial shots that showcase style, confidence, and artistic vision.",
    defaultImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=2560&q=80"
  }
];

// Exact navigation tab order:
// WEDDING   PRE WEDDING   HALDI   MEHENDI   BIRTHDAY   BABY SHOOT   FASHION
const navCategories = [
  { name: "WEDDING", folder: "wedding" },
  { name: "PRE WEDDING", folder: "pre-wedding" },
  { name: "HALDI", folder: "haldi" },
  { name: "MEHENDI", folder: "mehendi" },
  { name: "BIRTHDAY", folder: "birthday" },
  { name: "BABY SHOOT", folder: "baby-shoot" },
  { name: "FASHION", folder: "fashion" }
];

function getCategoryImage(folderKey: string, fallbackUrl: string, isThumb = false): string {
  const normalizedKey = folderKey.toLowerCase().replace(/\s+/g, '-');
  const targetTag = isThumb ? 'thumb' : 'hero';

  // 1. Look for explicit target file (e.g., thumb.webp or hero.webp)
  for (const [path, module] of Object.entries(heroImageFiles)) {
    const lower = path.toLowerCase().replace(/\\/g, '/');
    if (lower.includes(`/hero/${normalizedKey}/`) && lower.includes(targetTag) && !lower.includes('readme')) {
      return module.default;
    }
  }

  // 2. Fallback to any image in that folder not explicitly designated as the other type
  for (const [path, module] of Object.entries(heroImageFiles)) {
    const lower = path.toLowerCase().replace(/\\/g, '/');
    if (lower.includes(`/hero/${normalizedKey}/`) && !lower.includes('readme')) {
      if (isThumb && lower.includes('hero.')) continue;
      if (!isThumb && lower.includes('thumb.')) continue;
      return module.default;
    }
  }

  return fallbackUrl;
}

export default function Hero() {
  // Start with Wedding (Index 0)
  const [activeSlide, setActiveSlide] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-slide interval: 7.5 seconds for comfortable, cinematic viewing
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Preload the next slide's background image in idle time so transitions are instantaneous
  useEffect(() => {
    const nextSlideIdx = (activeSlide + 1) % slides.length;
    const nextUrl = getCategoryImage(slides[nextSlideIdx].folder, slides[nextSlideIdx].defaultImage, false);
    if (nextUrl) {
      const img = new Image();
      img.src = nextUrl;
    }
  }, [activeSlide]);

  // Keep active thumbnail centered within its horizontal container ONLY
  // (Using container.scrollTo instead of activeEl.scrollIntoView prevents vertical window scrolling)
  const centerActiveThumbnail = (behavior: ScrollBehavior = 'smooth') => {
    const container = thumbnailContainerRef.current;
    if (container) {
      const activeEl = container.children[activeSlide] as HTMLElement;
      if (activeEl) {
        const targetScroll =
          activeEl.offsetLeft - (container.clientWidth / 2) + (activeEl.clientWidth / 2);
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior,
        });
      }
    }
  };

  useEffect(() => {
    // Center thumbnail on slide change
    centerActiveThumbnail('smooth');

    // Also recenter on resize and orientationchange so layout is always exact
    const handleResize = () => {
      centerActiveThumbnail('auto');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [activeSlide]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    resetTimer();
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetTimer();
  };

  const currentSlide = slides[activeSlide];
  const currentHeroImage = getCategoryImage(currentSlide.folder, currentSlide.defaultImage, false);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] lg:h-screen w-full bg-black overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-5 sm:pb-6"
    >
      {/* Background Photography Image with Smooth Cross-fade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img
              src={currentHeroImage}
              alt={currentSlide.category}
              loading="eager"
              decoding={activeSlide === 0 ? 'sync' : 'async'}
              fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-[center_35%]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Gradient Overlays:
          Dark on the LEFT for 100% text readability,
          transitions to bright/clear on the CENTER & RIGHT so photography is vibrant */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 32%, rgba(0,0,0,0.48) 54%, rgba(0,0,0,0.06) 74%, rgba(0,0,0,0.2) 100%)'
        }}
      />

      {/* Top gradient for Header clarity */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 70%, transparent 100%)'
        }}
      />

      {/* Bottom gradient for thumbnail & control bar contrast */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 45%, transparent 100%)'
        }}
      />

      {/* Ambient luxury gold glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gold/10 blur-[150px] pointer-events-none z-15" />

      {/* Center Main Content: FULL VIEWPORT WIDTH (NOT constrained in max-w-7xl) */}
      <div className="relative z-20 w-full px-4 min-[380px]:px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20 my-auto py-2">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Left Side: Starts significantly closer to the left edge with large editorial impact */}
          <div className="w-full lg:w-[58%] xl:w-[55%] flex flex-col items-start text-left">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-xl xl:max-w-2xl"
            >
              {/* Category Overline: HALDI PHOTOGRAPHY — */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
                <span className="text-gold/95 font-poppins text-[11px] sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                  {currentSlide.category} PHOTOGRAPHY
                </span>
                <span className="w-6 sm:w-12 h-[1.5px] bg-gold rounded-full shrink-0" />
              </div>

              {/* Grand Brand Heading - Fluidly sized to perfectly fit mobile screens without cutting off or breaking words */}
              <h1 className="font-playfair text-[clamp(1.45rem,7vw,2.15rem)] sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-black leading-[0.94] tracking-tight mb-3 sm:mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] overflow-visible">
                <span className="text-white block whitespace-nowrap">SMART</span>
                <span className="text-gold bg-gradient-to-r from-gold via-[#FFE29A] to-gold bg-clip-text text-transparent inline-block whitespace-nowrap pr-3 sm:pr-4">
                  PHOTOGRAPHY
                </span>
              </h1>

              {/* Slide Subtitle Tagline */}
              <p className="font-playfair text-lg sm:text-xl md:text-2xl text-white/95 italic font-medium leading-snug mb-3">
                {currentSlide.heading}
              </p>

              {/* Description */}
              <p className="font-poppins text-white/75 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mb-7 sm:mb-8">
                {currentSlide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-7 sm:mb-9 max-w-full">
                <motion.a
                  href="#booking"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center gap-2 rounded-full bg-gold hover:bg-[#ffb52b] text-black font-bold px-5 min-[380px]:px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base shadow-[0_0_35px_rgba(250,179,60,0.45)] transition-all duration-300"
                >
                  <span>Book Your Shoot</span>
                  <span className="text-base sm:text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
                </motion.a>
                <motion.a
                  href="#portfolio"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/40 text-white font-semibold px-5 min-[380px]:px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base backdrop-blur-md hover:bg-white/15 hover:border-gold/60 transition-all duration-300"
                >
                  View Portfolio
                </motion.a>
              </div>

              {/* Statistics Row: Aligned underneath CTA buttons with subtle vertical dividers */}
              <div className="flex items-center gap-3 min-[390px]:gap-5 sm:gap-8 md:gap-10 pt-1 flex-wrap sm:flex-nowrap max-w-full">
                <div>
                  <div className="font-playfair text-2xl min-[360px]:text-3xl sm:text-4xl font-bold text-white leading-none">3500+</div>
                  <div className="text-white/60 text-[11px] sm:text-sm mt-1">Happy Clients</div>
                </div>
                <div className="w-[1px] h-7 sm:h-8 bg-white/20 shrink-0" />
                <div>
                  <div className="font-playfair text-2xl min-[360px]:text-3xl sm:text-4xl font-bold text-white leading-none">500+</div>
                  <div className="text-white/60 text-[11px] sm:text-sm mt-1">Luxury Weddings</div>
                </div>
                <div className="w-[1px] h-7 sm:h-8 bg-white/20 shrink-0" />
                <div>
                  <div className="font-playfair text-2xl min-[360px]:text-3xl sm:text-4xl font-bold text-white leading-none">1999</div>
                  <div className="text-white/60 text-[11px] sm:text-sm mt-1">Since</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side Feature Cards: Pushed to the far right, floating over the brighter photography */}
          <div className="hidden lg:flex flex-col gap-3.5 w-80 xl:w-88 shrink-0">
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md hover:bg-black/80 hover:border-gold/40 transition-all duration-300 shadow-xl">
              <Camera className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-white font-poppins text-sm font-semibold">Professional Equipment</p>
                <p className="text-white/60 text-xs">Top-tier cameras & lenses</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md hover:bg-black/80 hover:border-gold/40 transition-all duration-300 shadow-xl">
              <Users className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-white font-poppins text-sm font-semibold">Expert Team</p>
                <p className="text-white/60 text-xs">Years of experience</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md hover:bg-black/80 hover:border-gold/40 transition-all duration-300 shadow-xl">
              <Award className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-white font-poppins text-sm font-semibold">Award Winning</p>
                <p className="text-white/60 text-xs">Recognized excellence</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md hover:bg-black/80 hover:border-gold/40 transition-all duration-300 shadow-xl">
              <Calendar className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-white font-poppins text-sm font-semibold">Available 24/7</p>
                <p className="text-white/60 text-xs">Flexible scheduling</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Area: Controls & Thumbnail Gallery (FULL VIEWPORT WIDTH) */}
      <div className="relative z-30 w-full px-4 min-[380px]:px-5 sm:px-10 md:px-12 lg:px-16 xl:px-20">
        {/* Category Navigation Bar & Indicators */}
        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10">

          {/* Left: 01 / 04 and circular indicators (1st dot is gold when Wedding) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="font-mono text-white/75 text-xs sm:text-sm tracking-wider">
              {String((activeSlide % 4) + 1).padStart(2, '0')} / 04
            </span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((dotIndex) => {
                const isDotActive = (activeSlide % 4) === dotIndex;
                return (
                  <button
                    key={dotIndex}
                    onClick={() => goToSlide(dotIndex)}
                    aria-label={`Slide ${dotIndex + 1}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${isDotActive
                      ? 'w-2.5 h-2.5 bg-gold shadow-[0_0_8px_rgba(250,179,60,0.8)]'
                      : 'w-2 h-2 border border-white/40 bg-transparent hover:border-white/80'
                      }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: Exact categories order:
              WEDDING   PRE WEDDING   HALDI   MEHENDI   BIRTHDAY   BABY SHOOT   FASHION */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1 ml-3 sm:ml-6">
            {navCategories.map((cat, idx) => {
              const isActive = currentSlide.folder === cat.folder;
              return (
                <button
                  key={cat.folder}
                  onClick={() => goToSlide(idx)}
                  className={`font-poppins text-xs uppercase tracking-[0.15em] transition-all duration-200 whitespace-nowrap cursor-pointer pb-1 ${isActive
                    ? 'text-gold font-bold border-b-2 border-gold'
                    : 'text-white/60 hover:text-white font-medium'
                    }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thumbnail Gallery Row with Left/Right Buttons */}
        <div className="w-full flex items-center gap-3 sm:gap-4">
          {/* Previous Arrow Button */}
          <button
            onClick={handlePrev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-black/60 hover:bg-gold hover:text-black hover:border-gold text-white flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Thumbnails Container: Exact 7 thumbnails matching Target Image 2 */}
          <div
            ref={thumbnailContainerRef}
            className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center justify-between gap-3 sm:gap-4 py-1.5"
          >
            {slides.map((slide, i) => {
              const isActive = i === activeSlide;
              const thumbImg = getCategoryImage(slide.folder, slide.defaultImage, true);
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(i)}
                  className="flex-1 min-w-[95px] max-w-[170px] flex flex-col items-center shrink-0 group cursor-pointer"
                >
                  <div
                    className={`w-full h-14 sm:h-18 md:h-20 rounded-xl overflow-hidden transition-all duration-300 relative ${isActive
                      ? 'ring-2 ring-gold border-2 border-gold shadow-[0_0_18px_rgba(250,179,60,0.6)] scale-105'
                      : 'border border-white/20 opacity-70 hover:opacity-100 hover:border-white/50'
                      }`}
                  >
                    <img
                      src={thumbImg}
                      alt={slide.category}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] md:text-xs font-poppins uppercase tracking-wider mt-1.5 transition-colors duration-200 ${isActive ? 'text-gold font-bold' : 'text-white/60 group-hover:text-white'
                      }`}
                  >
                    {slide.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={handleNext}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 bg-black/60 hover:bg-gold hover:text-black hover:border-gold text-white flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
