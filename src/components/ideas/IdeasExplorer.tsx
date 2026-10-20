import React, { useState, useEffect } from 'react';
import type { Idea } from '../../types/database';
import { IdeaCard } from './IdeaCard';
import { IdeaDropModal } from './IdeaDropModal';

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
    try {
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
      if (stored.length > 0) {
        setIdeas((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newOnes = stored.filter((s: Idea) => !existingIds.has(s.id));
          return [...newOnes, ...prev];
        });
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const handleVoteSuccess = (id: string, newCount: number) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes_count: newCount } : item))
    );
  };

  const handleIdeaCreated = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const lgas = ['All', 'Oredo LGA', 'Egor LGA', 'Ikpoba Okha', 'Benin City Central', 'Other Edo Areas'];
  const categories = ['All', 'Good Health', 'Women Health & Hygiene', 'Sanitation & Environment', 'Quality Education', 'Clean Energy', 'Youth Empowerment'];

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesLga = selectedLga === 'All' || (idea.suggested_location && idea.suggested_location.toLowerCase().includes(selectedLga.toLowerCase().replace(' lga', '')));
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
    <div className="space-y-space-xl">
      {/* Civic Search & Filter Nexus Block */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xs border border-surface-container-high space-y-space-md">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community proposals, schools, markets, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
            />
          </div>

          {/* Filters Ribbon */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* LGA Filter */}
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <select
                value={selectedLga}
                onChange={(e) => setSelectedLga(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                {lgas.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga === 'All' ? 'All LGAs' : lga}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[160px] flex-1 sm:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
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
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                <option value="upvotes">Most Upvoted</option>
                <option value="newest">Newest First</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                sort
              </span>
            </div>

            {/* Submit CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-space-xs px-space-md py-2.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold rounded-xl shadow-xs transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>+ Drop Idea</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-container font-label-sm text-label-sm text-on-surface-variant">
          <span>Showing <strong>{filteredIdeas.length}</strong> community submissions</span>
          <span className="text-secondary font-bold">100% Anonymous & Secure</span>
        </div>
      </div>

      {/* Bento Cards Grid: 3 Column Modern Layout */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant p-space-2xl text-center space-y-space-sm max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-secondary-container/30 text-secondary mx-auto flex items-center justify-center text-3xl font-bold">
            💡
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">No Matching Ideas Found</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
            Be the first corps member to pitch a community intervention for this category or location.
          </p>
          <div className="pt-space-xs">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-space-xs px-space-xl py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-xl shadow-xs hover:bg-primary-container transition-all"
            >
              <span>+ Submit Anonymous Idea</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
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
