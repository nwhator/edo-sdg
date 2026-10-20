import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { INITIAL_EVENTS } from '../../data/mockData';

export const GalleryUploadForm: React.FC = () => {
  const [mode, setMode] = useState<'new_event' | 'existing_event'>('new_event');
  const [selectedEventId, setSelectedEventId] = useState<string>(INITIAL_EVENTS[0]?.id || '');

  // New Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventLocation, setEventLocation] = useState('Benin City, Edo State');
  const [eventDescription, setEventDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Photos to upload
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      caption: 'Distribution of sanitary towels and health education brochures.',
    },
  ]);

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
      {isSaved ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 text-nysc-green mx-auto flex items-center justify-center text-3xl shadow-sm">
            ✓
          </div>
          <h3 className="text-2xl font-black text-slate-900">Photos Published by Event!</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Redirecting to public event gallery...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <span className="text-xs font-bold text-nysc-gold-dark bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 uppercase tracking-wider">
              Admin Media Management
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Upload Event Photos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Photos on the public gallery are always grouped by specific outreach event.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('new_event')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'new_event'
                  ? 'bg-white text-nysc-green shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Create New Event & Group Photos
            </button>
            <button
              type="button"
              onClick={() => setMode('existing_event')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'existing_event'
                  ? 'bg-white text-nysc-green shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Add Photos to Existing Event
            </button>
          </div>

          {mode === 'new_event' ? (
            /* New Event Details */
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Event Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Sanitary Pad Distribution Outreach at Idia College"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location in Edo State *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Emotan College, Wire Road, Benin City"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brief Event Summary
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Summary of what was achieved during this outreach..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-nysc-green focus:outline-hidden bg-white resize-none"
                />
              </div>
            </div>
          ) : (
            /* Select Existing Event */
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Existing Event *
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-nysc-green focus:outline-hidden"
              >
                {INITIAL_EVENTS.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.event_date})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Photos to Attach */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Photos to Publish for this Event ({photos.length})
            </h3>

            {/* List of Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 group border border-slate-200">
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-80 hover:opacity-100"
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

            {/* Add Photo Input */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                + Add Another Photo:
              </span>

              <div className="space-y-2">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Paste direct Image URL (or upload local file below)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-nysc-green bg-white"
                />

                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Photo caption (e.g., Corps members sensitizing market traders)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-nysc-green bg-white"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="text-xs font-semibold text-nysc-green hover:underline cursor-pointer">
                    📁 Or Choose Local Image File
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
                  >
                    Add to Album
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-3">
            <a
              href="/admin"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-nysc-green text-white text-sm font-bold shadow-md shadow-nysc-green/30 hover:bg-nysc-green-dark"
            >
              Publish Event Photos
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
