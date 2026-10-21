import React, { useState, useEffect } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { LgiReportModal } from './LgiReportModal';

interface EventGalleryProps {
  events: Event[];
  photos: EventPhoto[];
}

export const EventGallery: React.FC<EventGalleryProps> = ({ events: initialEvents, photos: initialPhotos }) => {
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [photosList, setPhotosList] = useState<EventPhoto[]>(initialPhotos);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<EventPhoto | null>(null);
  const [reportingEvent, setReportingEvent] = useState<{ event: Event; photos: EventPhoto[] } | null>(null);

  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('edo_sdg_custom_events') || '[]');
      const storedPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');

      const mergedEvents = [
        ...storedEvents,
        ...initialEvents.filter((ie) => !storedEvents.some((se: Event) => se.id === ie.id)),
      ];
      const mergedPhotos = [
        ...storedPhotos,
        ...initialPhotos.filter((ip) => !storedPhotos.some((sp: EventPhoto) => sp.id === ip.id)),
      ];

      setEventsList(mergedEvents);
      setPhotosList(mergedPhotos);
    } catch {
      // ignore
    }
  }, [initialEvents, initialPhotos]);

  // Group photos by event
  const photosByEvent = photosList.reduce((acc, photo) => {
    if (!acc[photo.event_id]) acc[photo.event_id] = [];
    acc[photo.event_id].push(photo);
    return acc;
  }, {} as Record<string, EventPhoto[]>);

  const displayedEvents = selectedEventId === 'all'
    ? eventsList
    : eventsList.filter((e) => e.id === selectedEventId);

  return (
    <div className="space-y-space-2xl">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-space-xs">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          <span>Visual Impact & Community Archive</span>
        </div>
        <h1 className="font-display text-display text-on-surface tracking-tight leading-tight">
          Edo SDG <span className="text-primary">Community Gallery</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Photographic records of NYSC SDG CDS outreaches, school programs, and community initiatives across Edo State. All photos are organized strictly by specific outreach events.
        </p>

        {/* Event Filter Pills */}
        {eventsList.length > 0 && (
          <div className="pt-space-md flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedEventId('all')}
              className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-all ${
                selectedEventId === 'all'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface border border-surface-container-high hover:bg-surface-container'
              }`}
            >
              All Events ({eventsList.length})
            </button>
            {eventsList.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-all max-w-[260px] truncate ${
                  selectedEventId === ev.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface border border-surface-container-high hover:bg-surface-container'
                }`}
              >
                {ev.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Events Stream (Grouped strictly by Event) */}
      <div className="space-y-space-2xl">
        {eventsList.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant p-space-2xl text-center space-y-space-sm max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-surface-container text-primary mx-auto flex items-center justify-center text-3xl font-bold">
              <span className="material-symbols-outlined text-[36px]">photo_library</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              No Event Albums Uploaded Yet
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              Visual records of upcoming CDS outreach programs, school visits, and community initiatives across Edo State will be documented and published here by the media team.
            </p>
          </div>
        ) : (
          displayedEvents.map((event) => {
            const eventPhotos = photosByEvent[event.id] || [];

            return (
              <section
                key={event.id}
                id={`event-${event.id}`}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-space-xl shadow-xs"
              >
                {/* Event Metadata Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-md border-b border-surface-container-high">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-1 text-primary font-bold">
                        📅 {new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>📍 {event.location}</span>
                      <span>•</span>
                      <span className="font-bold text-secondary">{eventPhotos.length} Photos</span>
                    </div>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {event.title}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {event.description}
                    </p>

                    {/* Operational Time & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{event.event_time || '9:00 AM - 11:00 AM'}</span>
                      </span>

                      <a
                        href="/blog/ogida-market-quality-education"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-container transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">article</span>
                        <span>Read in Blog</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setReportingEvent({ event, photos: eventPhotos })}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-gray-400 bg-white hover:bg-gray-100 text-black font-bold text-xs shadow-subtle transition-all cursor-pointer"
                        title="Generate official B&W closeout report for the Local Government Inspector"
                      >
                        <span className="material-symbols-outlined text-[15px]">print</span>
                        <span>Print B&W LGI Report</span>
                      </button>

                      <a
                        href={`/gallery/report?id=${event.id}`}
                        className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary text-[11px] font-medium"
                        title="View printable standalone report"
                      >
                        <span>Full Report View ↗</span>
                      </a>
                    </div>
                  </div>

                  {/* SDG Badges */}
                  {event.sdg_goals && event.sdg_goals.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 self-start md:self-center">
                      {event.sdg_goals.map((g) => {
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
                <div className="mt-space-lg">
                  {eventPhotos.length === 0 ? (
                    <div className="p-space-lg text-center bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Photos for this event will be uploaded shortly by the CDS Media Committee.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
                      {eventPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setActivePhoto(photo)}
                          className="group relative aspect-4/3 rounded-xl overflow-hidden bg-surface-container cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
                        >
                          <img
                            src={photo.image_url}
                            alt={photo.caption || event.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-space-md flex flex-col justify-end">
                            <p className="font-label-sm text-label-sm text-surface-container-lowest line-clamp-2">
                              {photo.caption || 'Click to view full photo'}
                            </p>
                            <span className="font-label-sm text-[10px] text-secondary-fixed font-bold mt-1 uppercase tracking-wider">
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
          })
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-on-surface/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl border border-surface-container-high flex flex-col"
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.caption || 'Outreach photo'}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
            {activePhoto.caption && (
              <div className="p-space-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm border-t border-surface-container-high">
                <p className="text-on-surface-variant leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official LGI Sensitization Report Modal */}
      {reportingEvent && (
        <LgiReportModal
          event={reportingEvent.event}
          photos={reportingEvent.photos}
          isOpen={Boolean(reportingEvent)}
          onClose={() => setReportingEvent(null)}
        />
      )}
    </div>
  );
};
