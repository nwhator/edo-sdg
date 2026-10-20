import React, { useState } from 'react';
import type { FundingPartner } from '../../types/database';

interface FundingDirectoryProps {
  initialPartners: FundingPartner[];
}

export const FundingDirectory: React.FC<FundingDirectoryProps> = ({ initialPartners }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBeninCity, setOnlyBeninCity] = useState(false);

  const categories = [
    'All',
    'Pads & Women Health',
    'Sanitation & Cleaning',
    'State Government',
    'Community & Youth',
  ];

  const filteredPartners = initialPartners.filter((partner) => {
    const matchesCat = selectedCategory === 'All' || partner.category === selectedCategory;
    const matchesBenin = !onlyBeninCity || partner.is_benin_city;
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.focus_areas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesBenin && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by NGO name, address, or focus..."
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

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer self-start sm:self-auto">
            <input
              type="checkbox"
              checked={onlyBeninCity}
              onChange={(e) => setOnlyBeninCity(e.target.checked)}
              className="rounded text-nysc-green focus:ring-nysc-green w-4 h-4"
            />
            <span>Show Only Benin City Offices</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-nysc-green text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'Pads & Women Health' && '🩸 '}
              {cat === 'Sanitation & Cleaning' && '🧹 '}
              {cat === 'State Government' && '🏛️ '}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-nysc-green-dark bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  {partner.category}
                </span>
                {partner.is_benin_city && (
                  <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    📍 Benin City Office
                  </span>
                )}
              </div>

              {/* Title & Address */}
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {partner.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="shrink-0 text-slate-400">🏢</span>
                  <span>{partner.address}</span>
                </p>
              </div>

              {/* Focus Areas */}
              <div className="flex flex-wrap gap-1.5">
                {partner.focus_areas.map((focus, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    #{focus}
                  </span>
                ))}
              </div>

              {/* Recommended Pitch Approach Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-nysc-green-dark">
                  💡 How to Reach & Pitch for NYSC:
                </span>
                <p className="leading-relaxed text-slate-600">
                  {partner.how_to_reach}
                </p>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
              {partner.phone && (
                <a
                  href={`tel:${partner.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-nysc-green-dark font-semibold hover:bg-green-100 transition-colors"
                >
                  <span>📞</span>
                  <span>{partner.phone}</span>
                </a>
              )}
              {partner.email && (
                <a
                  href={`mailto:${partner.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 transition-colors"
                >
                  <span>✉️</span>
                  <span>{partner.email}</span>
                </a>
              )}
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors ml-auto"
                >
                  <span>🌐 Website</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
