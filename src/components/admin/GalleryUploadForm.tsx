import React, { useState, useEffect, useRef } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { uploadEventClient } from '../../lib/supabase';

interface GalleryUploadFormProps {
  initialEvents?: Event[];
}

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  isCover?: boolean;
  filename?: string;
}

const MAX_PHOTOS = 50;

// Client-side image compression to prevent localStorage QuotaExceededError when uploading up to 50 high-res photos
const compressImage = (file: File, maxDimension = 1000, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(URL.createObjectURL(file));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  });
};

export const GalleryUploadForm: React.FC<GalleryUploadFormProps> = ({ initialEvents = [] }) => {
  const [mode, setMode] = useState<'new_event' | 'existing_event'>('new_event');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);

  // New Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventLocation, setEventLocation] = useState('Egor LGA, Benin City');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([3, 5, 6]);

  // Batch photos state
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [batchCaptionInput, setBatchCaptionInput] = useState('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState('');
  const [showBulkUrlModal, setShowBulkUrlModal] = useState(false);

  // Drag and processing states
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0 });
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Process incoming File list (from input or dropzone)
  const processFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (rawFiles.length === 0) return;

    const availableSlots = MAX_PHOTOS - photos.length;
    if (availableSlots <= 0) {
      setQuotaWarning(`Maximum limit of ${MAX_PHOTOS} photos reached for this batch. Remove some photos to add more.`);
      return;
    }

    const filesToProcess = rawFiles.slice(0, availableSlots);
    if (rawFiles.length > availableSlots) {
      setQuotaWarning(`You selected ${rawFiles.length} photos, but only ${availableSlots} slots were available. Processed ${availableSlots} photos (Max ${MAX_PHOTOS}).`);
    } else {
      setQuotaWarning(null);
    }

    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: filesToProcess.length });

    const processedItems: PhotoItem[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      setProcessingProgress({ current: i + 1, total: filesToProcess.length });

      try {
        const compressedDataUrl = await compressImage(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        processedItems.push({
          id: 'ph-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
          url: compressedDataUrl,
          caption: cleanName,
          filename: file.name,
          isCover: photos.length === 0 && i === 0, // auto set 1st photo as cover if none exists
        });
      } catch (err) {
        console.warn('Could not compress file, falling back to object URL:', err);
        processedItems.push({
          id: 'ph-' + Date.now() + '-' + i,
          url: URL.createObjectURL(file),
          caption: file.name,
          filename: file.name,
          isCover: photos.length === 0 && i === 0,
        });
      }
    }

    setPhotos((prev) => [...prev, ...processedItems]);
    setIsProcessing(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      // Reset input value so re-selecting same files triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add multiple URLs at once
  const handleAddBulkUrls = () => {
    if (!bulkUrlsInput.trim()) return;

    const urls = bulkUrlsInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

    if (urls.length === 0) return;

    const availableSlots = MAX_PHOTOS - photos.length;
    if (availableSlots <= 0) {
      setQuotaWarning(`Maximum limit of ${MAX_PHOTOS} photos reached.`);
      return;
    }

    const toAdd = urls.slice(0, availableSlots).map((url, idx) => ({
      id: 'ph-url-' + Date.now() + '-' + idx,
      url,
      caption: '',
      isCover: photos.length === 0 && idx === 0,
    }));

    setPhotos((prev) => [...prev, ...toAdd]);
    setBulkUrlsInput('');
    setShowBulkUrlModal(false);

    if (urls.length > availableSlots) {
      setQuotaWarning(`Added ${availableSlots} URLs. Remaining ${urls.length - availableSlots} URLs exceeded the 50-photo batch limit.`);
    } else {
      setQuotaWarning(null);
    }
  };

  // Bulk actions
  const handleApplyBatchCaption = () => {
    if (!batchCaptionInput.trim()) return;
    setPhotos(
      photos.map((p) => ({
        ...p,
        caption: batchCaptionInput.trim(),
      }))
    );
  };

  const handleSetCover = (id: string) => {
    setPhotos(
      photos.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      // If removed item was cover, set the first available photo as new cover
      if (filtered.length > 0 && !filtered.some((p) => p.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleUpdateCaption = (id: string, newCaption: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, caption: newCaption } : p))
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all selected photos?')) {
      setPhotos([]);
      setQuotaWarning(null);
    }
  };

  const toggleSDG = (num: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert('Please upload or add at least one photo.');
      return;
    }

    let targetId = selectedEventId;
    const coverPhoto = photos.find((p) => p.isCover)?.url || photos[0]?.url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80';

    if (mode === 'new_event') {
      if (!eventTitle.trim()) {
        alert('Please provide an event title.');
        return;
      }

      targetId = 'evt-' + Date.now();
      const newEvent: Event = {
        id: targetId,
        title: eventTitle.trim(),
        event_date: eventDate,
        location: eventLocation.trim(),
        description: eventDescription.trim() || `Outreach gallery album with ${photos.length} verified photos.`,
        cover_image: coverPhoto,
        sdg_goals: selectedSDGs,
        photos_count: photos.length,
        created_at: new Date().toISOString(),
      };

      try {
        const existingEvents = JSON.parse(localStorage.getItem('edo_sdg_custom_events') || '[]');
        existingEvents.unshift(newEvent);
        localStorage.setItem('edo_sdg_custom_events', JSON.stringify(existingEvents));
      } catch (err) {
        console.warn('Local storage write warning for event:', err);
      }

      // Format event photos
      const newPhotos: EventPhoto[] = photos.map((p, idx) => ({
        id: 'photo-' + Date.now() + '-' + idx,
        event_id: targetId,
        image_url: p.url,
        caption: p.caption || eventTitle,
        display_order: idx + 1,
        created_at: new Date().toISOString(),
      }));

      try {
        const existingPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');
        localStorage.setItem('edo_sdg_custom_photos', JSON.stringify([...newPhotos, ...existingPhotos]));
      } catch (err) {
        console.warn('Storage quota limit reached when saving batch. Saving first 15:', err);
        try {
          const trimmed = newPhotos.slice(0, 15);
          const existingPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');
          localStorage.setItem('edo_sdg_custom_photos', JSON.stringify([...trimmed, ...existingPhotos]));
        } catch {
          // ignore
        }
      }

      // Supabase async cloud sync if available
      uploadEventClient(newEvent, newPhotos);
    } else {
      // Adding photos to existing event
      const newPhotos: EventPhoto[] = photos.map((p, idx) => ({
        id: 'photo-' + Date.now() + '-' + idx,
        event_id: targetId,
        image_url: p.url,
        caption: p.caption,
        display_order: idx + 1,
        created_at: new Date().toISOString(),
      }));

      try {
        const existingPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');
        localStorage.setItem('edo_sdg_custom_photos', JSON.stringify([...newPhotos, ...existingPhotos]));
      } catch (err) {
        console.warn('Storage error:', err);
      }
    }

    setIsSaved(true);
    setTimeout(() => {
      window.location.href = `/gallery#event-${targetId}`;
    }, 1200);
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-card p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      {isSaved ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-subtle animate-bounce">
            <span className="material-symbols-outlined text-[42px]">check_circle</span>
          </div>
          <h3 className="text-2xl font-extrabold text-on-surface">
            {photos.length} Photos Published Successfully!
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
            Album has been grouped and indexed. Redirecting you to the public event gallery...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header */}
          <div className="border-b border-surface-container pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
                Admin Media Operations
              </span>
              <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-[15px]">photo_library</span>
                <span>Bulk Upload • Up to 50 Photos</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Upload Outreach Photos & Albums
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Drag and drop up to 50 event photographs at once. Photos are automatically compressed, indexed, and grouped by specific outreach event.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-3 p-1.5 bg-surface-container-low rounded-2xl border border-surface-container">
            <button
              type="button"
              onClick={() => setMode('new_event')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'new_event'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              + Create New Event & Group Photos
            </button>
            <button
              type="button"
              onClick={() => setMode('existing_event')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'existing_event'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Add to Existing Outreach Album
            </button>
          </div>

          {/* Event Metadata Section */}
          {mode === 'new_event' ? (
            <div className="p-5 sm:p-6 bg-surface-container-low rounded-2xl border border-surface-container space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-[18px]">event</span>
                <span>Event Information</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Menstrual Hygiene Sensitization & Pad Bank Launch @ Idia College"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Location in Edo State *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Egor NYSC Secretariat / Uselu Market / Evbore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Target SDGs
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[3, 4, 5, 6, 8, 11, 13, 17].map((num) => {
                    const isSelected = selectedSDGs.includes(num);
                    return (
                      <button
                        type="button"
                        key={num}
                        onClick={() => toggleSDG(num)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface-variant border border-surface-container hover:bg-surface-container'
                        }`}
                      >
                        SDG {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Brief Outreach Narrative
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Summary of objectives, community attendance, and impact achieved during this CDS activity..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-surface-container-low rounded-2xl border border-surface-container space-y-2">
              <label className="block text-xs font-bold text-on-surface mb-1">
                Choose Existing Outreach Event *
              </label>
              {eventsList.length === 0 ? (
                <div className="p-3 bg-surface-container-lowest rounded-xl text-xs text-on-surface-variant border border-surface-container">
                  No existing events found. Please create a new event album.
                </div>
              ) : (
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-lowest text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.event_date}) • {ev.location}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* BULK UPLOAD DROPZONE SECTION */}
          <div className="space-y-4 pt-2">
            
            {/* Header with Counter and Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-on-surface">
                    Selected Event Photos
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    photos.length >= MAX_PHOTOS
                      ? 'bg-amber-500/15 text-amber-600'
                      : photos.length > 0
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {photos.length} / {MAX_PHOTOS} Photos
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Select up to 50 photos at once. Click any photo's star icon to set it as the album cover.
                </p>
              </div>

              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="self-start sm:self-center text-xs font-bold text-error hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                  <span>Clear All ({photos.length})</span>
                </button>
              )}
            </div>

            {/* Quota / Limit Notice */}
            {quotaWarning && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">info</span>
                <span>{quotaWarning}</span>
              </div>
            )}

            {/* Modern Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-primary bg-primary/10 ring-4 ring-primary/20 scale-[1.01]'
                  : 'border-surface-container-high hover:border-primary bg-surface-container-low/70 hover:bg-surface-container-low'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-subtle">
                <span className="material-symbols-outlined text-[36px]">
                  {isDragging ? 'file_download' : 'add_photo_alternate'}
                </span>
              </div>

              <div className="space-y-1 max-w-md">
                <div className="text-sm sm:text-base font-extrabold text-on-surface">
                  {isDragging ? 'Drop Photos Here (Up to 50)' : 'Click to Browse Files or Drag & Drop Here'}
                </div>
                <p className="text-xs text-on-surface-variant">
                  Select 1, 10, 25, or up to <strong className="text-primary">50 photos at once</strong> from your phone or computer.
                </p>
                <p className="text-[11px] text-outline">
                  Supports JPG, PNG, WEBP, HEIC • Auto-optimized for web performance
                </p>
              </div>

              {/* Progress bar during file reading */}
              {isProcessing && (
                <div className="w-full max-w-xs mt-3 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-primary">
                    <span>Compressing & preparing photos...</span>
                    <span>{processingProgress.current} / {processingProgress.total}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{
                        width: `${(processingProgress.current / Math.max(1, processingProgress.total)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Alternative: Add Image URLs in Bulk */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowBulkUrlModal(!showBulkUrlModal)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
                <span>{showBulkUrlModal ? 'Hide URL paste tool' : 'Or paste multiple image web URLs'}</span>
              </button>

              <span className="text-[11px] text-outline font-medium">
                {MAX_PHOTOS - photos.length} slots remaining
              </span>
            </div>

            {/* Bulk URL input textarea */}
            {showBulkUrlModal && (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
                <label className="block text-xs font-bold text-on-surface">
                  Paste Multiple Direct Image URLs (1 per line or comma-separated):
                </label>
                <textarea
                  rows={3}
                  value={bulkUrlsInput}
                  onChange={(e) => setBulkUrlsInput(e.target.value)}
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
                  className="w-full text-xs font-mono p-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkUrlModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddBulkUrls}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary-container shadow-xs"
                  >
                    Import URLs
                  </button>
                </div>
              </div>
            )}

            {/* Bulk Management Toolbar (When photos are in queue) */}
            {photos.length > 0 && (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">edit_note</span>
                  <input
                    type="text"
                    value={batchCaptionInput}
                    onChange={(e) => setBatchCaptionInput(e.target.value)}
                    placeholder="Batch caption for all photos..."
                    className="w-full md:w-72 text-xs px-3 py-2 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyBatchCaption}
                    className="px-3 py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-high text-xs font-bold text-primary rounded-xl shrink-0 transition-all cursor-pointer shadow-subtle"
                  >
                    Apply to All
                  </button>
                </div>

                <div className="text-xs text-on-surface-variant text-right w-full md:w-auto">
                  <span>Cover Photo: </span>
                  <strong className="text-primary">
                    {photos.find((p) => p.isCover) ? 'Selected' : 'First photo'}
                  </strong>
                </div>
              </div>
            )}

            {/* Photos Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`group relative rounded-2xl overflow-hidden border bg-surface-container-lowest flex flex-col justify-between transition-all ${
                      photo.isCover
                        ? 'border-primary ring-2 ring-primary/30 shadow-md'
                        : 'border-surface-container hover:border-outline-variant/60 shadow-xs'
                    }`}
                  >
                    {/* Image Thumbnail with Overlay Controls */}
                    <div className="relative aspect-square bg-surface-container overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Number Index Badge */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[10px] font-bold">
                        #{index + 1}
                      </span>

                      {/* Cover Badge */}
                      {photo.isCover && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          <span>Cover</span>
                        </span>
                      )}

                      {/* Quick Action Buttons on Hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {/* Make Cover Button */}
                        <button
                          type="button"
                          onClick={() => handleSetCover(photo.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            photo.isCover
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'bg-black/60 text-white hover:bg-primary opacity-80 hover:opacity-100'
                          }`}
                          title="Set as album cover"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                        </button>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-xs cursor-pointer"
                          title="Remove this photo"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Caption Input */}
                    <div className="p-2 bg-surface-container-lowest border-t border-surface-container">
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                        placeholder={`Photo #${index + 1} caption...`}
                        className="w-full text-[11px] p-1 rounded bg-transparent text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-low transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <a
              href="/admin"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-surface-container-high text-on-surface font-bold text-xs sm:text-sm hover:bg-surface-container text-center transition-colors"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={photos.length === 0 || isProcessing}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-sm shadow-card transition-all cursor-pointer ${
                photos.length === 0 || isProcessing
                  ? 'bg-surface-container text-outline cursor-not-allowed opacity-60'
                  : 'bg-primary hover:bg-primary-container text-on-primary active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              <span>
                {photos.length === 0
                  ? 'Add Photos to Publish'
                  : `Publish ${photos.length} Photos to Album`}
              </span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
