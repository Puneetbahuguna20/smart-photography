import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Keyboard } from 'swiper/modules';
import { useRouter } from '../context/RouterContext';
import { useGallery } from '../hooks/useGallery';
import GalleryCard from '../components/GalleryCard';
import Footer from '../components/Footer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface GalleryPageProps {
  slug: string;
}

export default function GalleryPage({ slug }: GalleryPageProps) {
  const { navigate } = useRouter();
  const { categories, getPhotosForSlug, isLoading, error, refetch } = useGallery();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { categoryName, items } = getPhotosForSlug(slug);

  // Animate header and grid on category switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }

    if (gridRef.current && items.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [slug, items.length]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setActiveSlideIndex(index);
    setLightboxOpen(true);
  };

  const currentSlug = slug.toLowerCase();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors font-poppins text-xs sm:text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <span className="font-playfair text-base md:text-xl font-bold tracking-wider text-gold">
            SMART PHOTOGRAPHY
          </span>

          <button
            onClick={() => navigate('/#booking')}
            className="rounded-full bg-gold hover:bg-[#ffb52b] text-black font-poppins text-xs font-bold px-4 py-2 transition-all shadow-[0_0_15px_rgba(250,179,60,0.3)]"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* Category Header */}
        <div ref={titleRef} className="text-center mb-10 md:mb-14">
          <p className="font-poppins text-xs md:text-sm text-gold tracking-widest uppercase mb-2">
            Curated Collection
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight mb-3">
            {slug === 'all' ? 'All Photos' : categoryName}
          </h1>
          <p className="font-poppins text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-2">
            Featured Photos
          </p>
          {!isLoading && items.length > 0 && (
            <span className="inline-block mt-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-poppins text-xs text-gold">
              Showing {items.length} Curated Photos
            </span>
          )}
        </div>

        {/* Category Buttons Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16">
          {categories.map((cat) => {
            const isActive = currentSlug === cat.slug.toLowerCase();
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/gallery/${cat.slug}`)}
                className={`font-poppins text-xs md:text-sm px-4 py-2 border transition-all duration-300 ${
                  isActive
                    ? 'border-gold bg-gold text-black font-semibold shadow-[0_0_15px_rgba(250,179,60,0.4)]'
                    : 'border-silver/40 text-text-secondary hover:border-gold hover:text-gold'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
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
            <h3 className="font-playfair text-xl text-white mb-2">Unable to Load Gallery</h3>
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

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-20 px-4">
            <p className="font-playfair text-2xl text-white/80 mb-2">
              No photos found for {categoryName}.
            </p>
            <p className="font-poppins text-sm text-text-secondary mb-6">
              Photos uploaded to this Google Drive folder will appear here automatically.
            </p>
            <button
              onClick={() => navigate('/gallery/all')}
              className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black font-poppins text-sm transition-all"
            >
              Explore All Photos
            </button>
          </div>
        )}

        {/* High-Performance Photography Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {items.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                priority={index < 6}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal with On-Demand Full-Resolution Loading */}
      {lightboxOpen && items.length > 0 && (
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
            {items.map((item, index) => {
              // Only load full-resolution image for the active or immediately adjacent slide
              const shouldLoadFull = Math.abs(index - activeSlideIndex) <= 1;
              const displaySrc = shouldLoadFull ? item.image : (item.thumbnailUrl || item.image);

              return (
                <SwiperSlide key={item.id}>
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
                    <img
                      src={displaySrc}
                      alt={item.title}
                      loading="lazy"
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
