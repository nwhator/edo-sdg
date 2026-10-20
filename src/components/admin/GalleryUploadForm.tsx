import React, { useState, useEffect } from 'react';
import type { Event, EventPhoto } from '../../types/database';

interface GalleryUploadFormProps {
  initialEvents?: Event[];
}

export const GalleryUploadForm: React.FC<GalleryUploadFormProps> = ({ initialEvents = [] }) => {
  const [mode, setMode] = useState<'new_event' | 'existing_event'>('new_event');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);

  // New Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventLocation, setEventLocation] = useState('Benin City, Edo State');
  const [eventDescription, setEventDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Photos to upload
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_events') || '[]');
      const combined = [...initialEvents, ...stored.filter((s: Event) => !initialEvents.some((i) => i.id === s.id))];
      setEventsList(combined);
      if (combined.length > 0 && !selectedEventId) {
        setSelectedEventId(combined[0].id);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos([...photos, { url: newPhotoUrl.trim(), caption: newPhotoCaption.trim() }]);
      setNewPhotoUrl('');
      setNewPhotoCaption('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setNewPhotoUrl(fakeUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetId = selectedEventId;

    if (mode === 'new_event') {
      if (!eventTitle.trim()) return;
      targetId = 'evt-' + Date.now();
      const newEvent: Event = {
        id: targetId,
        title: eventTitle.trim(),
        event_date: eventDate,
        location: eventLocation.trim(),
        description: eventDescription.trim(),
        cover_image: coverImageUrl || photos[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        sdg_goals: [3, 5, 6],
        photos_count: photos.length,
        created_at: new Date().toISOString(),
      };

      const existingEvents = JSON.parse(localStorage.getItem('edo_sdg_custom_events') || '[]');
      existingEvents.unshift(newEvent);
      localStorage.setItem('edo_sdg_custom_events', JSON.stringify(existingEvents));
    }

    // Save photos
    const newPhotos: EventPhoto[] = photos.map((p, idx) => ({
      id: 'photo-' + Date.now() + '-' + idx,
      event_id: targetId,
      image_url: p.url,
      caption: p.caption,
      display_order: idx + 1,
      created_at: new Date().toISOString(),
    }));

    const existingPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');
    localStorage.setItem('edo_sdg_custom_photos', JSON.stringify([...newPhotos, ...existingPhotos]));

    setIsSaved(true);
    setTimeout(() => {
      window.location.href = '/gallery';
    }, 1500);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sm:p-10 shadow-xs max-w-3xl mx-auto">
      {isSaved ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed mx-auto flex items-center justify-center text-3xl shadow-xs">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Photos Published by Event!</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Redirecting to public event gallery...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-space-xl">
          <div>
            <span className="font-label-sm text-label-sm font-bold text-secondary bg-secondary-fixed/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Admin Media Management
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight mt-2">
              Upload Event Photos
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Photos on the public gallery are always grouped strictly by specific outreach event.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-4 p-1.5 bg-surface-container-low rounded-xl">
            <button
              type="button"
              onClick={() => setMode('new_event')}
              className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-bold transition-all ${
                mode === 'new_event'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              + Create New Event & Group Photos
            </button>
            <button
              type="button"
              onClick={() => setMode('existing_event')}
              className={`flex-1 py-2 rounded-lg font-label-md text-label-md font-bold transition-all ${
                mode === 'existing_event'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Add Photos to Existing Event
            </button>
          </div>

          {mode === 'new_event' ? (
            /* New Event Details */
            <div className="space-y-space-md p-space-md bg-surface-container-low rounded-xl border border-outline-variant/30">
              <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                Event Information
              </h3>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Sanitary Pad Distribution Outreach at Idia College"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                    Location in Edo State *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Emotan College, Wire Road, Benin City"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                  Brief Event Summary
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Summary of what was achieved during this outreach..."
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden resize-none"
                />
              </div>
            </div>
          ) : (
            /* Select Existing Event */
            <div>
              <label className="block font-label-sm text-label-sm font-bold text-on-surface mb-1">
                Choose Existing Event *
              </label>
              {eventsList.length === 0 ? (
                <div className="p-3 bg-surface-container rounded-xl text-xs text-on-surface-variant">
                  No existing events found. Please create a new event first.
                </div>
              ) : (
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-hidden"
                >
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.event_date})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Photos to Attach */}
          <div className="space-y-space-md pt-space-md border-t border-surface-variant">
            <h3 className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
              Photos to Publish for this Event ({photos.length})
            </h3>

            {/* List of Photos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-4/3 bg-surface-container group border border-outline-variant/30">
                    <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center text-xs opacity-80 hover:opacity-100 shadow-xs"
                      title="Remove photo"
                    >
                      ✕
                    </button>
                    {p.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[10px] text-white truncate">
                        {p.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Photo Input */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="font-label-sm text-label-sm font-bold text-on-surface block">
                + Add Photo to Album:
              </span>

              <div className="space-y-2">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Paste direct Image URL (or upload local file below)"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary"
                />

                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Photo caption (e.g., Corps members sensitizing market traders)"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="font-label-sm text-label-sm font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                    <span>Or Choose Local Image File</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-bold transition-colors"
                  >
                    Add to Album
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3 border-t border-surface-variant">
            <a
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Publish Event Photos</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
