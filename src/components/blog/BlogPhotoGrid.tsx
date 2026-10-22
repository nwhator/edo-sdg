import React, { useState } from 'react';
import type { EventPhoto } from '../../types/database';
import { LightshowModal } from '../gallery/LightshowModal';

interface BlogPhotoGridProps {
  photos: EventPhoto[];
}

export const BlogPhotoGrid: React.FC<BlogPhotoGridProps> = ({ photos }) => {
  const [lightshowIndex, setLightshowIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs text-on-surface-variant font-medium">
          Sequential archival plates • Click any photograph to launch auto-moving Lightshow
        </span>
        <button
          type="button"
          onClick={() => setLightshowIndex(0)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">slideshow</span>
          <span>Auto-moving Lightshow</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => setLightshowIndex(index)}
            className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-surface-container border border-surface-container shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <img
              src={photo.image_url}
              alt={photo.caption || `Plate #${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold">Plate #{index + 1}</span>
              <span className="text-[9px] text-gray-300 line-clamp-1">Ogida Market, Benin City</span>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-moving Fullscreen Lightshow Modal */}
      <LightshowModal
        photos={photos}
        initialIndex={lightshowIndex ?? 0}
        isOpen={lightshowIndex !== null}
        onClose={() => setLightshowIndex(null)}
      />
    </div>
  );
};
