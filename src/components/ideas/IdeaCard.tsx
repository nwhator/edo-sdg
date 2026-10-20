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
      // Ignore localStorage issues
    }
  }, [idea.id]);

  const handleVote = async () => {
    if (hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    const updatedCount = upvotes + 1;
    setUpvotes(updatedCount);
    setHasVoted(true);

    try {
      // Save to localStorage
      const votedList = JSON.parse(localStorage.getItem('edo_sdg_voted_ideas') || '[]');
      if (!votedList.includes(idea.id)) {
        votedList.push(idea.id);
        localStorage.setItem('edo_sdg_voted_ideas', JSON.stringify(votedList));
      }

      // Try direct Supabase RPC if configured
      await upvoteIdeaClient(idea.id);

      if (onVoteSuccess) {
        onVoteSuccess(idea.id, updatedCount);
      }
    } catch (err) {
      console.warn('Vote submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string }> = {
    submitted: { label: 'In Community Voting', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
    under_review: { label: 'Under CDS Review', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
    approved_for_planning: { label: 'Approved for Planning', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
    completed: { label: 'Project Executed', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800' },
  };

  const currentStatus = statusBadges[idea.status] || statusBadges.submitted;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-nysc-green-dark bg-green-50 px-2.5 py-1 rounded-md border border-green-200/60">
            {idea.category}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-nysc-green transition-colors leading-snug">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {idea.description}
        </p>

        {/* SDG Badges */}
        {idea.target_sdgs && idea.target_sdgs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
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
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px]">
                    {goalNum}
                  </span>
                  <span className="max-w-[120px] truncate">{meta.name}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info & Upvote Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-nysc-gold"></span>
            <span>{idea.author_alias || 'Anonymous Corper'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            📍 {idea.suggested_location || 'Edo State'}
          </span>
        </div>

        {/* Upvote Button */}
        <button
          onClick={handleVote}
          disabled={hasVoted}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            hasVoted
              ? 'bg-nysc-green text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-nysc-green hover:text-white hover:shadow-xs active:scale-95'
          }`}
          title={hasVoted ? 'You have upvoted this idea' : 'Click to upvote anonymously'}
        >
          <svg
            className={`w-4 h-4 transition-transform ${hasVoted ? 'scale-110 text-nysc-gold' : 'text-slate-500 group-hover:text-white'}`}
            fill={hasVoted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
          <span>{upvotes}</span>
          <span className="hidden sm:inline font-normal">{hasVoted ? 'Voted' : 'Upvote'}</span>
        </button>
      </div>
    </div>
  );
};
