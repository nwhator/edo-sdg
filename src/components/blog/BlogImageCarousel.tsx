import React, { useState, useEffect } from 'react';
import type { EventPhoto } from '../../types/database';
import { LightshowModal } from '../gallery/LightshowModal';

interface BlogImageCarouselProps {
  photos: EventPhoto[];
}

export const BlogImageCarousel: React.FC<BlogImageCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightshowOpen, setIsLightshowOpen] = useState(false);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance every 4.5 seconds when playing
  useEffect(() => {
    if (!isPlaying || isLightshowOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isLightshowOpen, photos.length]);

  return (
    <>
      <div 
        className="relative rounded-3xl overflow-hidden bg-black shadow-elevated border border-surface-container select-none group cursor-pointer"
        onClick={() => setIsLightshowOpen(true)}
      >
        {/* Main Image Display */}
        <div className="relative aspect-16/10 sm:aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
          <img
            key={currentPhoto.id}
            src={currentPhoto.image_url}
            alt={currentPhoto.caption || `Plate ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-[1.02]"
          />

          {/* Gradient Overlay for Top Badges & Bottom Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none"></div>

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

            <div className="flex items-center gap-2">
              {/* Fullscreen Lightshow Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightshowOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/90 hover:bg-primary text-white text-xs font-bold backdrop-blur transition-all cursor-pointer shadow-sm"
                title="Launch Auto-moving Lightshow"
              >
                <span className="material-symbols-outlined text-[16px]">slideshow</span>
                <span className="hidden sm:inline">Lightshow (Auto-move)</span>
              </button>

              {/* Play/Pause Inline Slideshow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-all cursor-pointer"
                title={isPlaying ? 'Pause auto-move' : 'Play auto-move'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-md cursor-pointer border border-white/20"
            aria-label="Previous photograph"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[28px]">chevron_left</span>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-md cursor-pointer border border-white/20"
            aria-label="Next photograph"
          >
            <span className="material-symbols-outlined text-[24px] sm:text-[28px]">chevron_right</span>
          </button>

          {/* Bottom Caption & Thumbnails */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white space-y-3 pointer-events-auto">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug drop-shadow-sm line-clamp-1">
                {currentPhoto.caption || `Plate #${currentIndex + 1}: NYSC Egor SDG CDS outreach at Ogida Market, Benin City.`}
              </p>
              <span className="text-[11px] text-gray-300 font-semibold shrink-0 hidden sm:inline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                <span>Click image for auto-moving Lightshow</span>
              </span>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
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
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auto-moving Fullscreen Lightshow Modal */}
      <LightshowModal
        photos={photos}
        initialIndex={currentIndex}
        isOpen={isLightshowOpen}
        onClose={() => setIsLightshowOpen(false)}
      />
    </>
  );
};
