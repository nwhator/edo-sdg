import React, { useState } from 'react';
import type { Idea } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { submitIdeaClient } from '../../lib/supabase';

interface IdeaDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaCreated: (newIdea: Idea) => void;
}

const CATEGORIES = [
  'Women Health & Hygiene',
  'Sanitation & Environment',
  'Good Health',
  'Quality Education',
  'Zero Hunger',
  'Community Advocacy',
  'Skills Acquisition & Youth',
  'Partnerships & Outreach',
];

export const IdeaDropModal: React.FC<IdeaDropModalProps> = ({ isOpen, onClose, onIdeaCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([3, 5]);
  const [location, setLocation] = useState('Egor LGA, Benin City');
  const [alias, setAlias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleSDG = (num: number) => {
    setSelectedSDGs((prev) =>
      prev.includes(num) ? prev.filter((g) => g !== num) : [...prev, num]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    const newIdea: Idea = {
      id: 'local-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      target_sdgs: selectedSDGs.length > 0 ? selectedSDGs : [3],
      suggested_location: location.trim() || 'Benin City, Edo State',
      author_alias: alias.trim() ? alias.trim() : `Anonymous Corper #${Math.floor(10 + Math.random() * 90)}`,
      upvotes_count: 1, // Author's initial vote
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    try {
      // Send to Supabase if configured
      await submitIdeaClient(newIdea);

      // Save locally
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      stored.unshift(newIdea);
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(stored));

      // Mark vote for own idea
      const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
      votedList.push(newIdea.id);
      localStorage.setItem('edo_sdg_voted_ideas', JSON.stringify(votedList));

      onIdeaCreated(newIdea);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedSDGs([3, 5]);
        setAlias('');
      }, 1500);
    } catch (err) {
      console.error('Error submitting idea:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-on-surface/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border border-outline-variant/30 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed mx-auto flex items-center justify-center text-3xl shadow-xs">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Idea Submitted Anonymously!</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
              Your idea has been added to the community board. Corps members in Egor LGA can now review and upvote it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-space-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold mb-2">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>100% Anonymous & Democratic</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                Pitch an SDG Project for Egor
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Share what Egor LGA communities need. Top-voted ideas get adopted by the CDS executive committee for funding and implementation.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                Idea Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Free Menstrual Pad Bank for Egor Secondary Schools"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div>
                <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                  Target Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Egor Secretariat, Ugbowo, Uwelu, Evbuotubu"
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                Description & Impact *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem, who it helps, what materials or support would be needed (e.g., pads, trash bags, brooms)..."
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* SDG Target Picker */}
            <div>
              <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                Select UN SDGs it Solves (Click to Toggle)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-surface-container-low rounded-xl border border-outline-variant/30">
                {Object.values(SDG_METADATA).map((sdg) => {
                  const isSelected = selectedSDGs.includes(sdg.number);
                  return (
                    <button
                      key={sdg.number}
                      type="button"
                      onClick={() => toggleSDG(sdg.number)}
                      style={{
                        backgroundColor: isSelected ? sdg.color : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        isSelected ? 'shadow-2xs scale-102 ring-1 ring-black/10' : 'hover:bg-surface-container'
                      }`}
                    >
                      <span>{sdg.number}.</span>
                      <span className="truncate max-w-[100px]">{sdg.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Alias */}
            <div>
              <label className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface mb-1">
                Display Name / Tag (Optional)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Leave blank for 'Anonymous Corper' or write e.g., 'Health Corper'"
                className="w-full px-4 py-2 rounded-xl border border-outline-variant bg-surface font-body-sm text-body-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>{isSubmitting ? 'Submitting...' : 'Submit Idea Anonymously'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
