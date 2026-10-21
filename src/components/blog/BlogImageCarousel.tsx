import React, { useState, useEffect } from 'react';
import type { EventPhoto } from '../../types/database';

interface BlogImageCarouselProps {
  photos: EventPhoto[];
}

export const BlogImageCarousel: React.FC<BlogImageCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance every 5 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  return (
    <div 
      className="relative rounded-3xl overflow-hidden bg-black shadow-elevated border border-surface-container select-none group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Main Image Display */}
      <div className="relative aspect-16/10 sm:aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
        <img
          key={currentPhoto.id}
          src={currentPhoto.image_url}
          alt={currentPhoto.caption || `Plate ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Gradient Overlay for Top Badges & Bottom Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-black shadow-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">photo_library</span>
              <span>Plate #{currentIndex + 1} of {photos.length}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-semibold hidden sm:inline-block">
              Ogida Market, Benin City
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-all"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-md cursor-pointer group-hover:scale-100"
          aria-label="Previous photograph"
        >
          <span className="material-symbols-outlined text-[24px] sm:text-[28px]">chevron_left</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-md cursor-pointer group-hover:scale-100"
          aria-label="Next photograph"
        >
          <span className="material-symbols-outlined text-[24px] sm:text-[28px]">chevron_right</span>
        </button>

        {/* Bottom Caption & Thumbnails */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white space-y-3 pointer-events-auto">
          <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug drop-shadow-sm">
            {currentPhoto.caption || `Plate #${currentIndex + 1}: NYSC Egor SDG CDS outreach at Ogida Market, Benin City.`}
          </p>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-10 h-8 sm:w-12 sm:h-9 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#fccc38] scale-105 shadow-md ring-1 ring-[#fccc38]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.image_url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
