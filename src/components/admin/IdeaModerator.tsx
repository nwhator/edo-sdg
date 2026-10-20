import React, { useState } from 'react';
import type { Idea } from '../../types/database';
import { SDG_METADATA } from '../../types/database';

interface IdeaModeratorProps {
  initialIdeas: Idea[];
}

export const IdeaModerator: React.FC<IdeaModeratorProps> = ({ initialIdeas }) => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

  const updateStatus = (id: string, newStatus: Idea['status']) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Anonymous Idea Review & Moderation
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Review community submissions from Benin City corps members, audit vote counts, and update project pipeline stage.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-label-sm text-label-sm font-bold shrink-0 self-start sm:self-center">
          {ideas.length} Total Proposals
        </div>
      </div>

      <div className="divide-y divide-surface-variant">
        {ideas.map((idea) => (
          <div key={idea.id} className="py-5 space-y-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                  {idea.category}
                </span>
                <span className="font-label-sm text-label-sm font-bold text-secondary bg-secondary-fixed/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                  {idea.upvotes_count || 0} Votes
                </span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm font-bold text-outline uppercase tracking-wider">Status:</span>
                <select
                  value={idea.status}
                  onChange={(e) => updateStatus(idea.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-outline-variant font-label-sm text-label-sm font-semibold bg-surface text-on-surface focus:ring-1 focus:ring-primary"
                >
                  <option value="submitted">Submitted (In Voting)</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved_for_planning">Approved for Planning</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">{idea.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{idea.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between font-label-sm text-label-sm text-on-surface-variant gap-2 pt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  {idea.suggested_location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                  {idea.author_alias || 'Anonymous Corper'}
                </span>
              </div>

              {/* Target SDGs */}
              <div className="flex gap-1 items-center">
                {idea.target_sdgs?.map((g) => (
                  <span
                    key={g}
                    style={{ backgroundColor: SDG_METADATA[g]?.color || '#004b24' }}
                    className="w-5 h-5 rounded-md text-white text-[10px] font-bold flex items-center justify-center shadow-2xs"
                    title={`SDG ${g}`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
