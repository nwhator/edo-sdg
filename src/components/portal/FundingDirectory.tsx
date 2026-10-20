import React, { useState } from 'react';
import type { FundingPartner } from '../../types/database';

interface FundingDirectoryProps {
  initialPartners: FundingPartner[];
}

export const FundingDirectory: React.FC<FundingDirectoryProps> = ({ initialPartners }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyBeninCity, setOnlyBeninCity] = useState(false);

  const categories = [
    'All',
    'Pads & Women Health',
    'Sanitation & Cleaning',
    'State Government',
    'Corporate CSR',
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
    <div className="space-y-space-lg">
      {/* Search and Filters Nexus */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high p-space-lg shadow-xs space-y-space-md">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by NGO name, address, or focus..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm focus:outline-hidden focus:ring-2 focus:ring-primary border-none placeholder:text-outline"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer self-start sm:self-auto font-label-md">
            <input
              type="checkbox"
              checked={onlyBeninCity}
              onChange={(e) => setOnlyBeninCity(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
            />
            <span>Show Only Benin City Offices</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-container">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {filteredPartners.map((partner) => (
          <article
            key={partner.id}
            className="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow relative overflow-hidden border border-surface-container-high"
          >
            <div className="space-y-space-sm">
              {/* Top Indicators */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-label-sm text-label-sm font-bold text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-md">
                  {partner.category}
                </span>
                {partner.is_benin_city && (
                  <span className="font-label-sm text-[11px] font-extrabold text-on-secondary-fixed bg-secondary-fixed px-2.5 py-0.5 rounded-full">
                    📍 Benin City Office
                  </span>
                )}
              </div>

              {/* Title & Address */}
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                  {partner.name}
                </h3>
                <p className="mt-1 font-body-sm text-xs text-on-surface-variant flex items-start gap-1.5">
                  <span className="shrink-0 text-outline">🏢</span>
                  <span>{partner.address}</span>
                </p>
              </div>

              {/* Focus Areas */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {partner.focus_areas.map((focus, idx) => (
                  <span
                    key={idx}
                    className="font-label-sm text-[10px] font-semibold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-md"
                  >
                    #{focus}
                  </span>
                ))}
              </div>

              {/* How to Pitch Box */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container text-xs text-on-surface space-y-1">
                <span className="font-label-sm text-[11px] font-bold block uppercase tracking-wider text-primary">
                  💡 How to Reach & Pitch for NYSC:
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {partner.how_to_reach}
                </p>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="mt-space-md pt-space-sm border-t border-surface-container flex flex-wrap items-center gap-2 text-xs">
              {partner.phone && (
                <a
                  href={`tel:${partner.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold hover:bg-primary hover:text-on-primary transition-colors font-label-sm text-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  <span>{partner.phone}</span>
                </a>
              )}
              {partner.email && (
                <a
                  href={`mailto:${partner.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-secondary font-bold hover:bg-secondary hover:text-on-secondary transition-colors font-label-sm text-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">mail</span>
                  <span>Email Partner</span>
                </a>
              )}
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors font-label-sm text-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">language</span>
                  <span>Official Site</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
