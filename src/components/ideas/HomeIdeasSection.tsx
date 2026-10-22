import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { IdeaCard } from './IdeaCard';
import { fetchIdeas } from '../../lib/supabase';

interface HomeIdeasSectionProps {
  initialIdeas: Idea[];
  initialTotalCount: number;
}

export const HomeIdeasSection: React.FC<HomeIdeasSectionProps> = ({
  initialIdeas,
  initialTotalCount,
}) => {
  const [topIdeas, setTopIdeas] = useState<Idea[]>(initialIdeas);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);

  const loadLiveIdeas = async () => {
    try {
      const liveIdeas = await fetchIdeas();
      const sorted = [...liveIdeas].sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
      setTopIdeas(sorted.slice(0, 3));
      setTotalCount(liveIdeas.length);
    } catch {
      // Fallback: check localStorage
      try {
        const deletedIds = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
        const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
        const customIdeas = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');

        setTopIdeas((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newOnes = customIdeas.filter((s: Idea) => !existingIds.has(s.id));
          let combined = [...newOnes, ...prev];
          combined = combined.filter((i) => !deletedIds.has(i.id));
          combined = combined.map((i) => (editedMap[i.id] ? { ...i, ...editedMap[i.id] } : i));
          combined.sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
          return combined.slice(0, 3);
        });
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    loadLiveIdeas();

    const handleUpdate = () => {
      loadLiveIdeas();
    };

    window.addEventListener('ideas-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('ideas-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleVoteSuccess = (id: string, newCount: number) => {
    setTopIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes_count: newCount } : item))
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-surface-container-low/70 p-6 sm:p-8 rounded-3xl border border-outline-variant/30 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px]">forum</span>
              <span>Grassroots Proposals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Community Ideas for Egor LGA</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Review and upvote peer proposals to shape upcoming CDS community projects.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/ideas"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline"
            >
              <span>View All Ideas ({totalCount})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Ideas Grid or Empty State */}
        {topIdeas.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center space-y-3 border border-dashed border-outline-variant max-w-md mx-auto shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-surface-container text-primary mx-auto flex items-center justify-center text-xl font-bold">
              💡
            </div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">No Ideas Submitted Yet</h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Be the first corps member to drop an anonymous community proposal for Egor LGA.
            </p>
            <div className="pt-1">
              <a
                href="/ideas#drop"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-all"
              >
                <span>Submit an Idea</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onVoteSuccess={handleVoteSuccess} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
