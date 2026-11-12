import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { LightshowModal } from './LightshowModal';

interface EventGalleryProps {
  events: Event[];
  photos: EventPhoto[];
}

export const EventGallery: React.FC<EventGalleryProps> = ({ events: initialEvents, photos: initialPhotos }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEvents[0]?.id || 'evt-nov11-weekly-meeting-biodigester-babyvisit'
  );

  const currentEvent = initialEvents.find((e) => e.id === selectedEventId) || initialEvents[0];
  const currentPhotos = initialPhotos.filter((p) => p.event_id === currentEvent?.id);
  const blogLink = currentEvent?.id === 'evt-nov11-weekly-meeting-biodigester-babyvisit'
    ? '/blog/weekly-meeting-nov-11-2026'
    : '/blog/ogida-market-quality-education';

  const [lightshowIndex, setLightshowIndex] = useState<number | null>(null);

  if (!currentEvent) {
    return (
      <div className="p-12 text-center text-on-surface-variant">
        No event data found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          <span>Verified Field Gallery • Egor LGA, Benin City</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl text-on-surface font-extrabold tracking-tight">
          CDS <span className="text-primary">Photo Archive & Field Gallery</span>
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Official photographic archive of NYSC Egor SDG CDS field sensitizations, clean energy projects, and community welfare events. Showing all {currentPhotos.length} verified plates for the selected event.
        </p>

        {/* Event Switcher Tabs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          {initialEvents.map((evt) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => setSelectedEventId(evt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedEventId === evt.id
                  ? 'bg-primary text-on-primary shadow-sm scale-105'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {evt.title.includes('Biodigester') ? '🌱 Nov 11: Biodigester & Baby Visit (37 Plates)' : '📚 Oct 21: Ogida Market SDG 4 (37 Plates)'}
            </button>
          ))}
        </div>

        {/* Action Pills */}
        <div className="pt-2 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setLightshowIndex(0)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">slideshow</span>
            <span>Launch Lightshow (Auto-move)</span>
          </button>

          <a
            href={blogLink}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface border border-surface-container-high font-bold text-xs shadow-xs hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">article</span>
            <span>Read Outreach Story in Blog</span>
          </a>
        </div>
      </div>

      {/* Verified Event Section */}
      <section
        id={`event-${currentEvent.id}`}
        className="bg-surface-container-lowest rounded-3xl border border-surface-container p-6 sm:p-8 shadow-card space-y-6"
      >
        {/* Event Metadata Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div className="space-y-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="flex items-center gap-1 text-primary font-bold">
                📅 {currentEvent.event_date === '2026-11-11' ? 'Wednesday, 11th November, 2026' : 'Wednesday, 21st October, 2026'}
              </span>
              <span>•</span>
              <span>📍 {currentEvent.location}</span>
              <span>•</span>
              <span className="font-bold text-secondary">{currentPhotos.length} Documented Photos</span>
            </div>
            <h2 className="text-lg sm:text-2xl text-on-surface font-extrabold leading-snug">
              {currentEvent.title}
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
              {currentEvent.activities || currentEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>{currentEvent.event_time || '9:00 AM'}</span>
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-on-surface bg-surface-container px-2.5 py-0.5 rounded-full">
                {currentEvent.week || 'Week 6'} • {currentEvent.quarter || '4th Quarter'}
              </span>
            </div>
          </div>

          {/* SDG Badges */}
          {currentEvent.sdg_goals && currentEvent.sdg_goals.length > 0 && (
            <div className="flex flex-wrap gap-1.5 self-start md:self-center">
              {currentEvent.sdg_goals.map((g) => {
                const meta = SDG_METADATA[g];
                if (!meta) return null;
                return (
                  <span
                    key={g}
                    style={{ backgroundColor: meta.color }}
                    className="px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold shadow-2xs"
                  >
                    SDG {g}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Photos Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
            <div>
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                Documentary Plates (All {currentPhotos.length} Photos)
              </span>
              <span className="text-xs text-on-surface-variant">
                Numbered in sequential chronological order • Click any photo to launch auto-moving lightshow
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightshowIndex(0)}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>Play Lightshow</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {currentPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setLightshowIndex(index)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-surface-container cursor-pointer shadow-2xs hover:shadow-lg transition-all duration-300 border border-surface-container hover:border-primary/50"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `Plate ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold">Plate #{index + 1}</span>
                  <span className="text-[8px] text-gray-300 truncate">{photo.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-moving Fullscreen Lightshow Modal */}
      <LightshowModal
        photos={currentPhotos}
        initialIndex={lightshowIndex ?? 0}
        isOpen={lightshowIndex !== null}
        onClose={() => setLightshowIndex(null)}
      />
    </div>
  );
};
