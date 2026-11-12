import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { upvoteIdeaClient } from '../../lib/supabase';

interface IdeaOverviewModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteSuccess?: (id: string, newCount: number) => void;
}

export const IdeaOverviewModal: React.FC<IdeaOverviewModalProps> = ({
  idea,
  isOpen,
  onClose,
  onVoteSuccess,
}) => {
  const [upvotes, setUpvotes] = useState<number>(idea?.upvotes_count ?? 0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState<boolean>(false);

  useEffect(() => {
    if (idea) {
      setUpvotes(idea.upvotes_count ?? 0);
      try {
        const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
        setHasVoted(votedList.includes(idea.id));
      } catch {
        setHasVoted(false);
      }
    }
  }, [idea]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !idea) return null;

  const handleVote = async () => {
    if (hasVoted || isSubmittingVote) return;

    setIsSubmittingVote(true);
    const newCount = upvotes + 1;
    setUpvotes(newCount);
    setHasVoted(true);

    try {
      const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
      votedList.push(idea.id);
      localStorage.setItem('edo_sdg_voted_ideas', JSON.stringify(votedList));

      await upvoteIdeaClient(idea.id);

      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      const updated = stored.map((item: Idea) =>
        item.id === idea.id ? { ...item, upvotes_count: newCount } : item
      );
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(updated));

      onVoteSuccess?.(idea.id, newCount);
      window.dispatchEvent(new Event('ideas-updated'));
    } catch (err) {
      console.warn('Vote registered locally:', err);
    } finally {
      setIsSubmittingVote(false);
    }
  };

  const handleShareWhatsApp = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/ideas` : 'https://edo-sdg.vercel.app/ideas';
    const message = `💡 *NYSC Egor SDG Proposal Overview:*\n"${idea.title}"\n\n📌 Category: ${idea.category}\n📍 Target Location: ${idea.suggested_location || 'Egor LGA'}\n\nHelp review and upvote this civic proposal for Egor LGA on the NYSC SDG portal:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
    submitted: { label: 'In Voting', bg: 'bg-surface-container', text: 'text-on-surface-variant' },
    under_review: { label: 'Under Review', bg: 'bg-secondary-fixed/50', text: 'text-secondary' },
    approved_for_planning: { label: 'Approved for Planning', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' },
    completed: { label: 'Executed', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  };

  const currentStatus = statusBadges[idea.status] || statusBadges.submitted;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/30 relative max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close overview"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header Tags */}
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
            <span className="material-symbols-outlined text-[15px]">label</span>
            <span>{idea.category}</span>
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">pin_drop</span>
            <span>{idea.suggested_location || 'Egor LGA, Benin City'}</span>
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>NYSC Egor Community Proposal</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight leading-snug">
            {idea.title}
          </h2>
        </div>

        {/* Meta Bar: Author & Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary font-bold">
              <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Proposed By</p>
              <p className="font-bold text-on-surface">{idea.author_alias || 'Anonymous Corper'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-secondary font-bold">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Submitted Date</p>
              <p className="font-bold text-on-surface">
                {new Date(idea.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Full Overview / Description */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">description</span>
            <span>Project Overview & Community Justification</span>
          </h4>
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xs">
            <p className="text-sm sm:text-base text-on-surface leading-relaxed whitespace-pre-line text-justify">
              {idea.description}
            </p>
          </div>
        </div>

        {/* Target UN Sustainable Development Goals */}
        {idea.target_sdgs && idea.target_sdgs.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">public</span>
              <span>Target Global Goals (UN SDGs)</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {idea.target_sdgs.map((goalNum) => {
                const meta = SDG_METADATA[goalNum];
                if (!meta) return null;
                return (
                  <div
                    key={goalNum}
                    style={{ backgroundColor: meta.color }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-white shadow-xs text-xs font-bold"
                  >
                    <span className="bg-white/20 px-1.5 py-0.5 rounded font-extrabold text-[11px]">
                      SDG {goalNum}
                    </span>
                    <span>{meta.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Upvote Pill */}
            <button
              onClick={handleVote}
              disabled={hasVoted || isSubmittingVote}
              type="button"
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer shadow-sm active:scale-95 ${
                hasVoted
                  ? 'bg-primary text-on-primary'
                  : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-on-primary'
              }`}
              title={hasVoted ? 'You have upvoted this proposal' : 'Click to upvote anonymously'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {hasVoted ? 'thumb_up' : 'arrow_upward'}
              </span>
              <span>{hasVoted ? 'Upvoted' : 'Upvote Idea'} ({upvotes})</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-xs sm:text-sm font-bold cursor-pointer"
              title="Share proposal to WhatsApp CDS group"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
