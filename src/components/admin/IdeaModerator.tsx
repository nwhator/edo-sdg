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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Anonymous Idea Review & Moderation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review community submissions, filter by upvote popularity, and update their pipeline stage.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {ideas.map((idea) => (
          <div key={idea.id} className="py-5 space-y-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-nysc-green bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                  {idea.category}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  🔥 {idea.upvotes_count || 0} Votes
                </span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={idea.status}
                  onChange={(e) => updateStatus(idea.id, e.target.value as any)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:ring-1 focus:ring-nysc-green"
                >
                  <option value="submitted">Submitted (In Voting)</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved_for_planning">Approved for Planning</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{idea.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{idea.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span>📍 {idea.suggested_location}</span>
                <span>•</span>
                <span>👤 {idea.author_alias || 'Anonymous Corper'}</span>
              </div>

              {/* Target SDGs */}
              <div className="flex gap-1">
                {idea.target_sdgs?.map((g) => (
                  <span
                    key={g}
                    style={{ backgroundColor: SDG_METADATA[g]?.color || '#006633' }}
                    className="w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
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
