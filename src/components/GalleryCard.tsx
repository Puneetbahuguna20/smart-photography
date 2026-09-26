import { useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import type { PortfolioItem } from '../types/gallery';

interface GalleryCardProps {
  item: PortfolioItem;
  index?: number;
  onClick: () => void;
  priority?: boolean;
}

export default function GalleryCard({
  item,
  onClick,
  priority = false,
}: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#141414] border border-white/5 rounded-none"
      onClick={onClick}
    >
      {/* Aspect Ratio Skeleton Shimmer placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#1a1a1a] flex flex-col justify-end p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-pulse" />
          <div className="h-3 w-16 bg-gold/20 rounded mb-2" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
      )}

      {/* Optimized Gallery Thumbnail Image */}
      <img
        src={item.thumbnailUrl || item.image}
        alt={item.title}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // @ts-expect-error fetchpriority is a valid HTML attribute
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        }`}
      />

      {/* Hover Overlay with Category & Title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <span className="font-poppins text-xs md:text-sm text-gold mb-1.5 block tracking-wider uppercase font-medium">
            {item.category}
          </span>
          <h3 className="font-playfair text-lg md:text-xl font-bold text-white mb-2 leading-snug line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <ZoomIn className="w-4 h-4 text-gold" />
            <span className="font-poppins text-xs tracking-wide">View Fullscreen</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
