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

          {/* Location Badge */}
          <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[14px]">pin_drop</span>
            <span>{idea.suggested_location || 'Edo State'}</span>
          </span>
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
