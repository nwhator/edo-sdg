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
  const [location, setLocation] = useState('Benin City, Edo State');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 text-nysc-green mx-auto flex items-center justify-center text-3xl shadow-xs">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">Idea Submitted Anonymously!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your idea has been added to the community board. Corps members can now review and upvote it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nysc-gold/15 text-nysc-green-dark text-xs font-bold mb-2">
                <span>🛡️ 100% Anonymous</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Pitch an SDG Project Idea
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Share what Edo State communities need. Top-voted ideas get adopted by the CDS executive committee for funding and implementation.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Idea Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Free Menstrual Pad Bank for Egor Secondary Schools"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green"
              />
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Oredo, Ring Road, Ekewan"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description & Impact *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem, who it helps, what materials or support would be needed (e.g., pads, trash bags, brooms)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green resize-none"
              />
            </div>

            {/* SDG Target Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Select UN SDGs it Solves (Click to Toggle)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
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
                        isSelected ? 'shadow-xs scale-102 ring-1 ring-black/10' : 'hover:bg-slate-200'
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Display Name / Tag (Optional)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Leave blank for 'Anonymous Corper' or write e.g., 'Health Corper'"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-nysc-green text-white text-sm font-bold shadow-md shadow-nysc-green/30 hover:bg-nysc-green-dark transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Drop Anonymous Idea'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
