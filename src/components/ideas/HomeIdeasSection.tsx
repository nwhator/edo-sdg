import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { IdeaCard } from './IdeaCard';
import { IdeaOverviewModal } from './IdeaOverviewModal';
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
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount || initialIdeas.length);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const loadLiveIdeas = async () => {
    try {
      const liveIdeas = await fetchIdeas();
      if (liveIdeas && liveIdeas.length > 0) {
        const sorted = [...liveIdeas].sort(
          (a, b) =>
            (b.upvotes_count || 0) - (a.upvotes_count || 0) ||
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTopIdeas(sorted.slice(0, 6));
        setTotalCount(liveIdeas.length);
        return;
      }
    } catch (e) {
      console.warn('Home ideas live load fallback:', e);
    }

    // Fallback: check localStorage & initialIdeas
    try {
      const deletedIds = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      const customIdeas = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');

      setTopIdeas((prev) => {
        const base = prev.length > 0 ? prev : initialIdeas;
        const existingIds = new Set(base.map((i) => i.id));
        const newOnes = customIdeas.filter((s: Idea) => !existingIds.has(s.id));
        let combined = [...newOnes, ...base];
        combined = combined.filter((i) => !deletedIds.has(i.id));
        combined = combined.map((i) => (editedMap[i.id] ? { ...i, ...editedMap[i.id] } : i));
        combined.sort(
          (a, b) =>
            (b.upvotes_count || 0) - (a.upvotes_count || 0) ||
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        if (combined.length > 0) {
          setTotalCount(combined.length);
        }
        return combined.slice(0, 6);
      });
    } catch {
      // ignore
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
    if (selectedIdea && selectedIdea.id === id) {
      setSelectedIdea((prev) => (prev ? { ...prev, upvotes_count: newCount } : null));
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-on-surface/12 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-on-surface/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary font-mono text-[11px] font-bold uppercase tracking-widest mb-1">
              <span className="material-symbols-outlined text-[15px]">forum</span>
              <span>Grassroots Ideation Ledger</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Community Ideas for <span className="font-serif italic font-normal text-primary">Egor LGA</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Review and upvote peer proposals to shape upcoming CDS community projects. Click any card to inspect the full brief.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/ideas"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-lowest border border-on-surface/15 text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-all"
            >
              <span>View All ({totalCount})</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {topIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onVoteSuccess={handleVoteSuccess}
                onSelect={(selected) => setSelectedIdea(selected)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Idea Overview Modal */}
      <IdeaOverviewModal
        idea={selectedIdea}
        isOpen={Boolean(selectedIdea)}
        onClose={() => setSelectedIdea(null)}
        onVoteSuccess={handleVoteSuccess}
      />
    </section>
  );
};
