import React, { useState, useEffect, useRef } from 'react';
import type { EventPhoto } from '../../types/database';

interface LightshowModalProps {
  photos: EventPhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const LightshowModal: React.FC<LightshowModalProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const slideDurationMs = 4500; // 4.5 seconds per slide in lightshow mode
  const progressIntervalRef = useRef<number | null>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [isOpen, initialIndex]);

  // Handle auto-move lightshow
  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length === 0) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / slideDurationMs) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr === photos.length - 1 ? 0 : curr + 1));
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPlaying, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, photos.length]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleSelectPhoto = (idx: number) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between text-white select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Controls Bar */}
      <div
        className="w-full p-4 sm:px-8 flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Lightshow Slideshow</span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-300">
            Plate #{currentIndex + 1} of {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Play/Pause Auto-move Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all cursor-pointer"
            title={isPlaying ? 'Pause auto-move lightshow' : 'Resume auto-move lightshow'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlaying ? 'pause_circle' : 'play_circle'}
            </span>
            <span className="hidden sm:inline">
              {isPlaying ? 'Auto-moving (Pause)' : 'Paused (Auto-move)'}
            </span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close lightshow"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Image View with Next/Prev Arrows */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-lg cursor-pointer border border-white/20"
          aria-label="Previous plate"
        >
          <span className="material-symbols-outlined text-[28px] sm:text-[34px]">chevron_left</span>
        </button>

        {/* Current Image */}
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl">
          <img
            key={currentPhoto.id}
            src={currentPhoto.image_url}
            alt={currentPhoto.caption || `Plate ${currentIndex + 1}`}
            className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-[94vw] object-contain transition-opacity duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur transition-all active:scale-95 shadow-lg cursor-pointer border border-white/20"
          aria-label="Next plate"
        >
          <span className="material-symbols-outlined text-[28px] sm:text-[34px]">chevron_right</span>
        </button>
      </div>

      {/* Bottom Area: Caption, Animated Progress Bar, and Thumbnails Strip */}
      <div
        className="w-full bg-gradient-to-t from-black via-black/90 to-transparent p-4 sm:px-8 space-y-3 z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Progress Bar for Auto-move */}
        {isPlaying && (
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Caption */}
        <div className="text-center max-w-3xl mx-auto space-y-0.5">
          <p className="text-xs sm:text-sm font-semibold text-white drop-shadow-sm">
            Plate #{currentIndex + 1}: {currentPhoto.caption || 'Ogida Market Sensitization on Quality Education (SDG 4)'}
          </p>
          <p className="text-[11px] text-gray-400">
            NYSC Egor SDG CDS Group • Wednesday, 21st October, 2026 • Benin City
          </p>
        </div>

        {/* Thumbnails Strip */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 scrollbar-thin max-w-5xl mx-auto">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => handleSelectPhoto(idx)}
              className={`relative shrink-0 w-11 h-8 sm:w-14 sm:h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-primary scale-110 shadow-md ring-2 ring-primary'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
              title={`Jump to Plate #${idx + 1}`}
            >
              <img
                src={photo.image_url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
