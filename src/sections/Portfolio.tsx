import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Keyboard } from 'swiper/modules';
import { useRouter } from '../context/RouterContext';
import { useGallery } from '../hooks/useGallery';
import GalleryCard from '../components/GalleryCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const { navigate } = useRouter();
  const { categories, getPhotosForSlug, isLoading, error, refetch } = useGallery();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // On homepage, showcase the top 6 preview photos from "all"
  const { items: previewItems } = getPhotosForSlug('all');
  const displayItems = previewItems.slice(0, 6);

  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!gridRef.current || isLoading || displayItems.length === 0) return;

    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  }, [isLoading, displayItems.length]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setActiveSlideIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="portfolio" ref={sectionRef} className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div ref={titleRef} className="text-center mb-10 md:mb-14">
          <p className="font-poppins text-xs md:text-sm text-gold tracking-widest mb-2">
            OUR WORK
          </p>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Featured Portfolio
          </h2>
          <p className="font-poppins text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Explore our curated collection of premium photography. Click any category to view its dedicated gallery.
          </p>
        </div>

        {/* Category Buttons Navigation - Clicking navigates to /gallery/:slug */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/gallery/${cat.slug}`)}
              className="font-poppins text-xs md:text-sm px-4 py-2 border border-silver/40 text-text-secondary hover:border-gold hover:text-gold hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="aspect-[4/5] bg-dark-surface/60 border border-white/5 animate-pulse relative overflow-hidden flex flex-col justify-end p-6"
              >
                <div className="h-3 w-20 bg-gold/30 rounded mb-2" />
                <div className="h-5 w-40 bg-white/20 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-red-500/20 bg-red-950/10 rounded-lg max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-gold mb-4" />
            <h3 className="font-playfair text-xl text-white mb-2">Unable to Load Portfolio</h3>
            <p className="font-poppins text-sm text-text-secondary mb-6">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-[#ffb52b] text-black font-poppins text-sm font-semibold transition-all duration-300 rounded shadow-[0_0_20px_rgba(250,179,60,0.3)]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* High-Performance Featured Photos Grid Preview */}
        {!isLoading && !error && displayItems.length > 0 && (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {displayItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  index={index}
                  priority={false}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>

            {/* View All CTA */}
            <div className="mt-12 md:mt-16 text-center">
              <button
                onClick={() => navigate('/gallery/all')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-[#ffb52b] text-black font-poppins text-sm md:text-base font-bold transition-all duration-300 rounded-full shadow-[0_0_25px_rgba(250,179,60,0.4)] hover:shadow-[0_0_35px_rgba(250,179,60,0.7)] hover:scale-105 active:scale-95"
              >
                <span>View All Categories & Photos</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Swiper Lightbox with On-Demand Full-Resolution Loading */}
      {lightboxOpen && displayItems.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 md:top-6 right-4 md:right-6 text-white hover:text-gold transition-colors z-10 p-2"
            aria-label="Close Lightbox"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <Swiper
            initialSlide={selectedIndex}
            onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
            modules={[Navigation, Pagination, EffectFade, Keyboard]}
            slidesPerView={1}
            observer={true}
            observeParents={true}
            resizeObserver={true}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            navigation
            pagination={{ clickable: true }}
            keyboard
            className="w-full h-full max-h-screen"
          >
            {displayItems.map((item, index) => {
              const shouldLoadFull = Math.abs(index - activeSlideIndex) <= 1;
              const displaySrc = shouldLoadFull ? item.image : (item.thumbnailUrl || item.image);

              return (
                <SwiperSlide key={item.id}>
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
                    <img
                      src={displaySrc}
                      alt={item.title}
                      className="max-w-full max-h-[80vh] object-contain transition-opacity duration-300"
                    />
                    <div className="mt-6 text-center">
                      <p className="font-poppins text-xs md:text-sm text-gold mb-2">
                        {item.category}
                      </p>
                      <h3 className="font-playfair text-xl md:text-3xl text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </section>
  );
}
