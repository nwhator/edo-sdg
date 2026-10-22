import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { IdeaCard } from './IdeaCard';
import { IdeaDropModal } from './IdeaDropModal';
import { fetchIdeas } from '../../lib/supabase';

interface IdeasExplorerProps {
  initialIdeas: Idea[];
}

export const IdeasExplorer: React.FC<IdeasExplorerProps> = ({ initialIdeas }) => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [search, setSearch] = useState('');
  const [selectedLga, setSelectedLga] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'upvotes' | 'newest'>('upvotes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLiveIdeas = async () => {
      try {
        const live = await fetchIdeas();
        if (isMounted && live.length > 0) {
          setIdeas(live);
          return;
        }
      } catch {
        // ignore
      }

      // Fallback to local storage if offline or error
      try {
        const deletedIds = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
        const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
        const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');

        if (isMounted) {
          setIdeas((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newOnes = stored.filter((s: Idea) => !existingIds.has(s.id));
            let combined = [...newOnes, ...prev];
            combined = combined.filter((i) => !deletedIds.has(i.id));
            combined = combined.map((i) => (editedMap[i.id] ? { ...i, ...editedMap[i.id] } : i));
            return combined;
          });
        }
      } catch {
        // Ignore localStorage error
      }
    };

    loadLiveIdeas();

    const handleUpdate = () => {
      loadLiveIdeas();
    };

    window.addEventListener('ideas-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('ideas-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleVoteSuccess = (id: string, newCount: number) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes_count: newCount } : item))
    );
  };

  const handleIdeaCreated = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const egorLocations = [
    'All',
    'Egor Secretariat',
    'Ugbowo / UNIBEN',
    'Uwelu / Market Axis',
    'Evbuotubu',
    'Textile Mill Road',
    'Okhoro / Medical Stores',
  ];

  const categories = [
    'All',
    'Good Health',
    'Women Health & Hygiene',
    'Sanitation & Environment',
    'Quality Education',
    'Clean Energy',
    'Youth Empowerment',
  ];

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesLga = selectedLga === 'All' || (idea.suggested_location && idea.suggested_location.toLowerCase().includes(selectedLga.toLowerCase().split(' ')[0]));
      const matchesCat = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesSearch =
        idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.description.toLowerCase().includes(search.toLowerCase()) ||
        (idea.suggested_location && idea.suggested_location.toLowerCase().includes(search.toLowerCase()));
      return matchesLga && matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') {
        return (b.upvotes_count || 0) - (a.upvotes_count || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Clean Search & Filter Nexus */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-subtle border border-outline-variant/30 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community proposals across Egor LGA..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* Filters Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Egor Ward/Location Filter */}
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <select
                value={selectedLga}
                onChange={(e) => setSelectedLga(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                {egorLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Egor Areas' : loc}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[150px] flex-1 sm:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {/* Sort By */}
            <div className="relative min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                <option value="upvotes">Most Upvoted</option>
                <option value="newest">Newest First</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                sort
              </span>
            </div>

            {/* Understandable CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all w-full sm:w-auto shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>Submit an Idea</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs text-on-surface-variant font-medium">
          <span>Showing <strong>{filteredIdeas.length}</strong> community proposals for Egor</span>
          <span className="text-secondary font-bold">100% Anonymous</span>
        </div>
      </div>

      {/* Ideas Cards Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant p-8 text-center space-y-3 max-w-md mx-auto shadow-subtle">
          <div className="w-12 h-12 rounded-xl bg-surface-container text-primary mx-auto flex items-center justify-center text-2xl font-bold">
            💡
          </div>
          <h3 className="font-headline-sm text-base font-bold text-on-surface">No Ideas Found</h3>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Be the first corps member to pitch a community intervention for this category in Egor.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-sm hover:bg-primary-container transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Submit an Idea for Egor</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onVoteSuccess={handleVoteSuccess} />
          ))}
        </div>
      )}

      {/* Drop Idea Modal */}
      <IdeaDropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  );
};
