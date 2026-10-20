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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load custom ideas from localStorage on mount
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

  const categories = ['All', ...Array.from(new Set(ideas.map((i) => i.category)))];

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesCat = selectedCategory === 'All' || idea.category === selectedCategory;
      const matchesSearch =
        idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.description.toLowerCase().includes(search.toLowerCase()) ||
        (idea.suggested_location && idea.suggested_location.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return (b.upvotes_count || 0) - (a.upvotes_count || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div>
      {/* Action Header Banner */}
      <div className="bg-gradient-to-r from-nysc-green-deep via-nysc-green to-nysc-green-dark rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-nysc-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nysc-gold/20 text-nysc-gold text-xs font-bold mb-4 border border-nysc-gold/30">
            <span>✨ Democratic Youth Action</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Anonymous Idea Drop & Community Voting
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Every corps member has valuable perspective on Edo State's most pressing challenges. Propose project ideas anonymously without fear or bias. Upvote the best solutions to advance them into planned CDS interventions!
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-nysc-gold text-nysc-green-deep text-sm font-extrabold hover:bg-white shadow-lg shadow-black/20 transition-all hover:scale-102"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Drop an Anonymous Idea Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filter, and Sort */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ideas, locations, or topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-nysc-green focus:border-nysc-green"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSortBy('votes')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'votes'
                    ? 'bg-white text-nysc-green shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔥 Most Upvoted
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'recent'
                    ? 'bg-white text-nysc-green shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏱️ Latest
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-nysc-green text-white text-xs font-bold hover:bg-nysc-green-dark transition-colors md:hidden"
            >
              <span>+ Pitch Idea</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-nysc-green text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="text-slate-900 font-bold">{filteredIdeas.length}</span> ideas
          {selectedCategory !== 'All' && <span> in <strong className="text-nysc-green">{selectedCategory}</strong></span>}
        </p>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
            💡
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching ideas found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Be the first to propose an intervention for this category or location.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-nysc-green text-white text-xs font-bold shadow-xs hover:bg-nysc-green-dark"
          >
            Submit Anonymous Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onVoteSuccess={handleVoteSuccess} />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      <IdeaDropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  );
};
