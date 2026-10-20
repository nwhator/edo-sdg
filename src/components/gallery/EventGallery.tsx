import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';

interface EventGalleryProps {
  events: Event[];
  photos: EventPhoto[];
}

export const EventGallery: React.FC<EventGalleryProps> = ({ events, photos }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<EventPhoto | null>(null);

  // Group photos by event
  const photosByEvent = photos.reduce((acc, photo) => {
    if (!acc[photo.event_id]) acc[photo.event_id] = [];
    acc[photo.event_id].push(photo);
    return acc;
  }, {} as Record<string, EventPhoto[]>);

  const displayedEvents = selectedEventId === 'all'
    ? events
    : events.filter((e) => e.id === selectedEventId);

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nysc-green/10 text-nysc-green-dark text-xs font-bold border border-nysc-green/20">
          📸 Visual Impact & Outreaches
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Edo SDG Community Gallery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Explore photographic records of our past outreaches across Edo State, from secondary school menstrual hygiene drives to environmental drainage cleanups. All photos are organized by specific outreach event.
        </p>

        {/* Event Filter Pills */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedEventId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedEventId === 'all'
                ? 'bg-nysc-green text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Events ({events.length})
          </button>
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all max-w-[260px] truncate ${
                selectedEventId === ev.id
                  ? 'bg-nysc-green text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {ev.title}
            </button>
          ))}
        </div>
      </div>

      {/* Events Stream (Grouped strictly by Event) */}
      <div className="space-y-16">
        {displayedEvents.map((event) => {
          const eventPhotos = photosByEvent[event.id] || [];

          return (
            <section
              key={event.id}
              id={`event-${event.id}`}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm"
            >
              {/* Event Metadata Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-nysc-green font-bold">
                      📅 {new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      📍 {event.location}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {event.title}
                  </h2>
                  {event.description && (
                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* SDG Goals for this event */}
                {event.sdg_goals && event.sdg_goals.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 self-start md:self-center">
                    {event.sdg_goals.map((g) => {
                      const meta = SDG_METADATA[g];
                      if (!meta) return null;
                      return (
                        <span
                          key={g}
                          style={{ backgroundColor: meta.color }}
                          className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                          title={meta.name}
                        >
                          SDG {g}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Photos Grid */}
              <div className="mt-8">
                {eventPhotos.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">
                      Photos for this event will be uploaded shortly by the CDS Media Committee.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {eventPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setActivePhoto(photo)}
                        className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.caption || event.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                          <p className="text-xs text-white font-medium line-clamp-2">
                            {photo.caption || 'Click to view full photo'}
                          </p>
                          <span className="text-[10px] text-nysc-gold font-bold mt-1 uppercase tracking-wider">
                            🔍 View Full Image
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.caption || 'Outreach photo'}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            {activePhoto.caption && (
              <div className="p-5 bg-slate-900 text-white text-sm font-medium border-t border-white/10">
                <p className="text-slate-200 leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
