import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { upvoteIdeaClient } from '../../lib/supabase';

interface IdeaCardProps {
  idea: Idea;
  onVoteSuccess?: (id: string, newCount: number) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onVoteSuccess }) => {
  const [upvotes, setUpvotes] = useState(idea.upvotes_count || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
      if (votedList.includes(idea.id)) {
        setHasVoted(true);
      }
    } catch {
      // ignore
    }
  }, [idea.id]);

  const handleVote = async () => {
    if (hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    const newCount = upvotes + 1;
    setUpvotes(newCount);
    setHasVoted(true);

    try {
      const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
      votedList.push(idea.id);
      localStorage.setItem('edo_sdg_voted_ideas', JSON.stringify(votedList));

      // Attempt Supabase RPC
      await upvoteIdeaClient(idea.id);

      // Local fallback sync
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      const updated = stored.map((item: Idea) =>
        item.id === idea.id ? { ...item, upvotes_count: newCount } : item
      );
      localStorage.setItem('edo_sdg_custom_ideas', JSON.stringify(updated));

      onVoteSuccess?.(idea.id, newCount);
    } catch (err) {
      console.warn('Vote registered locally:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/ideas` : 'https://edo-sdg.vercel.app/ideas';
    const message = `💡 *NYSC Egor SDG Community Proposal:*\n"${idea.title}"\n\nHelp upvote this civic project for Egor LGA on the NYSC SDG portal:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
    submitted: { label: 'In Voting', bg: 'bg-surface-container', text: 'text-on-surface-variant' },
    under_review: { label: 'Under Review', bg: 'bg-secondary-fixed/50', text: 'text-secondary' },
    approved_for_planning: { label: 'Approved', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed' },
    completed: { label: 'Executed', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  };

  const currentStatus = statusBadges[idea.status] || statusBadges.submitted;

  return (
    <article className="idea-card group flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-xs hover:shadow-md transition-all duration-200 border border-surface-container-high overflow-hidden">
      <div>
        {/* Top Action & Meta Row */}
        <div className="flex items-center justify-between gap-space-xs mb-space-md">
          {/* Upvote Pill Button */}
          <button
            onClick={handleVote}
            disabled={hasVoted || isSubmitting}
            className={`upvote-btn inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-sm text-label-sm font-extrabold tracking-wide transition-all cursor-pointer shadow-xs ${
              hasVoted
                ? 'bg-primary text-on-primary'
                : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-on-primary'
            }`}
            title={hasVoted ? 'You have upvoted this idea' : 'Click to upvote anonymously'}
          >
            <span className="material-symbols-outlined text-[16px] font-bold">arrow_upward</span>
            <span>{upvotes} Upvotes</span>
          </button>

          {/* Actions & Location Pill */}
          <div className="flex items-center gap-1.5">
            {/* 1-Click WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-label-sm font-bold cursor-pointer"
              title="Share proposal to WhatsApp CDS group"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Share</span>
            </button>

            {/* Location Badge */}
            <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">pin_drop</span>
              <span>{idea.suggested_location || 'Egor LGA'}</span>
            </span>
          </div>
        </div>

        {/* Category & Status Row */}
        <div className="flex items-center justify-between gap-2 mb-space-sm">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[14px]">label</span>
            <span>{idea.category}</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug mb-space-xs group-hover:text-primary transition-colors">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md line-clamp-3">
          {idea.description}
        </p>

        {/* SDG Indicators */}
        {idea.target_sdgs && idea.target_sdgs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-space-md">
            {idea.target_sdgs.map((goalNum) => {
              const meta = SDG_METADATA[goalNum];
              if (!meta) return null;
              return (
                <span
                  key={goalNum}
                  style={{ backgroundColor: meta.color }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs"
                  title={`SDG ${goalNum}: ${meta.name}`}
                >
                  <span>SDG {goalNum}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Bottom Section: State Code Identifier Badge */}
      <div className="pt-space-md bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-2xl flex items-center justify-between gap-space-xs border-t border-surface-container">
        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded font-bold">
          <span className="material-symbols-outlined text-[13px]">fingerprint</span>
          <span>{idea.author_alias || 'Anonymous Corper'}</span>
        </span>
        <span className="font-label-sm text-label-sm text-outline">
          {new Date(idea.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </article>
  );
};
