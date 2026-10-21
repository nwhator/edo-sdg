import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { LgiReportModal } from './LgiReportModal';

interface EventGalleryProps {
  events: Event[];
  photos: EventPhoto[];
}

export const EventGallery: React.FC<EventGalleryProps> = ({ events: initialEvents, photos: initialPhotos }) => {
  // Only content of Ogida Market and nothing else
  const ogidaEvent = initialEvents.find(
    (e) => e.id === 'evt-ogida-education-sensitization' || e.title.includes('Ogida')
  ) || initialEvents[0];

  const ogidaPhotos = initialPhotos.filter(
    (p) => p.event_id === ogidaEvent?.id || p.event_id === 'evt-ogida-education-sensitization' || p.image_url.includes('ogida')
  );

  const [activePhoto, setActivePhoto] = useState<EventPhoto | null>(null);
  const [reportingEvent, setReportingEvent] = useState<{ event: Event; photos: EventPhoto[] } | null>(null);

  if (!ogidaEvent) {
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
          <span>Verified Field Gallery • Ogida Market, Benin City</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl text-on-surface font-extrabold tracking-tight">
          Ogida Market <span className="text-primary">Sensitization Gallery</span>
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          Official photographic archive of the NYSC Egor SDG CDS Quality Education (SDG 4) outreach at Ogida Market, Benin City. Showing all {ogidaPhotos.length} verified documentary plates.
        </p>

        {/* Action Pills */}
        <div className="pt-2 flex flex-wrap justify-center gap-2.5">
          <a
            href="/blog/ogida-market-quality-education"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">article</span>
            <span>Read in Blog Section</span>
          </a>

          <button
            type="button"
            onClick={() => setReportingEvent({ event: ogidaEvent, photos: ogidaPhotos })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-400 bg-white hover:bg-gray-100 text-black font-bold text-xs shadow-subtle transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print B&W LGI Report (10 Selected Photos)</span>
          </button>

          <a
            href={`/gallery/report?id=${ogidaEvent.id}`}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold"
          >
            <span>Full Report Page ↗</span>
          </a>
        </div>
      </div>

      {/* Single Verified Event Section: Ogida Market */}
      <section
        id={`event-${ogidaEvent.id}`}
        className="bg-surface-container-lowest rounded-3xl border border-surface-container p-6 sm:p-8 shadow-card space-y-6"
      >
        {/* Event Metadata Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div className="space-y-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant font-medium">
              <span className="flex items-center gap-1 text-primary font-bold">
                📅 Wednesday, 21st October, 2026
              </span>
              <span>•</span>
              <span>📍 {ogidaEvent.location}</span>
              <span>•</span>
              <span className="font-bold text-secondary">{ogidaPhotos.length} Documented Photos</span>
            </div>
            <h2 className="text-lg sm:text-2xl text-on-surface font-extrabold leading-snug">
              {ogidaEvent.title}
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
              {ogidaEvent.activities || ogidaEvent.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>{ogidaEvent.event_time || '9:00 AM - 11:00 AM'}</span>
              </span>
              <span className="inline-flex items-center text-[11px] font-bold text-on-surface bg-surface-container px-2.5 py-0.5 rounded-full">
                Week 3 • 4th Quarter
              </span>
            </div>
          </div>

          {/* SDG Badges */}
          {ogidaEvent.sdg_goals && ogidaEvent.sdg_goals.length > 0 && (
            <div className="flex flex-wrap gap-1.5 self-start md:self-center">
              {ogidaEvent.sdg_goals.map((g) => {
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

        {/* Photos Grid (All 28 Photos of Ogida Market) */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Documentary Plates (All {ogidaPhotos.length} Photos)
            </span>
            <span className="text-xs text-on-surface-variant">
              Click any photo to view full size
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {ogidaPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
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
                  <span className="text-[8px] text-gray-300 truncate">Ogida Market</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.caption || 'Field photo'}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close photo preview"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-lowest">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-primary uppercase">
                  Plate #{ogidaPhotos.findIndex((p) => p.id === activePhoto.id) + 1} of {ogidaPhotos.length}
                </p>
                <p className="text-sm font-semibold text-on-surface">
                  {activePhoto.caption || 'Ogida Market Sensitization on Quality Education (SDG 4)'}
                </p>
              </div>

              <a
                href={activePhoto.image_url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Open Full Image</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* B&W LGI Report Modal */}
      {reportingEvent && (
        <LgiReportModal
          event={reportingEvent.event}
          photos={reportingEvent.photos}
          isOpen={true}
          onClose={() => setReportingEvent(null)}
        />
      )}
    </div>
  );
};
