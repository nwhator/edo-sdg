import React, { useState, useEffect } from 'react';
import type { FundingPartner } from '../../types/database';

interface FundingDirectoryProps {
  initialPartners: FundingPartner[];
}

export const FundingDirectory: React.FC<FundingDirectoryProps> = ({ initialPartners }) => {
  const [partners, setPartners] = useState<FundingPartner[]>(initialPartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyBeninCity, setOnlyBeninCity] = useState(false);
  const [selectedForPitch, setSelectedForPitch] = useState<FundingPartner | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_partners') || '[]');
      if (stored.length > 0) {
        setPartners((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = stored.filter((s: FundingPartner) => !existingIds.has(s.id));
          return [...prev, ...newOnes];
        });
      }
    } catch {
      // Ignore
    }
  }, []);

  const categories = [
    'All',
    'Pads & Women Health',
    'Sanitation & Cleaning',
    'State Government',
    'Corporate CSR',
    'Community & Youth',
  ];

  const filteredPartners = partners.filter((partner) => {
    const matchesCat = selectedCategory === 'All' || partner.category === selectedCategory;
    const matchesBenin = !onlyBeninCity || partner.is_benin_city;
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.focus_areas.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesBenin && matchesSearch;
  });

  const generateLetterContent = (p: FundingPartner) => {
    return `NATIONAL YOUTH SERVICE CORPS
EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
Egor NYSC Secretariat, Benin City, Edo State
Ref: NYSC/ED/EGOR/SDG/${new Date().getFullYear()}/${p.id.substring(0, 6).toUpperCase()}
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

To: The Managing Director / CSR Coordinator,
${p.name},
${p.address}.

REQUISITION FOR STRATEGIC CSR PARTNERSHIP: YOUTH-LED COMMUNITY INTERVENTIONS IN EGOR LGA

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Egor Local Government Area Sustainable Development Goals (SDGs) Community Development Service (CDS) Group respectfully presents this formal partnership proposal to ${p.name}.

Our grassroots assessment across public secondary schools and community corridors in Egor Local Government Area revealed pressing developmental priorities that align directly with your institutional mission.

KEY PROJECT TARGETS (EGOR LOCAL GOVERNMENT AREA):
1. Grassroots community intervention aligned with your priority areas [${p.focus_areas.join(', ')}].
2. Deployment of qualified, serving NYSC corps members with zero administrative overhead.
3. Full transparency, official reporting, and high-visibility corporate recognition across all media and state NYSC reports.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

We look forward to an opportunity to brief your team at your ${p.is_benin_city ? 'Benin City office' : 'secretariat'} at your earliest convenience.

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="space-y-space-lg">
      
      {/* Discovery Radar Launcher Ribbon */}
      <div className="bg-gradient-to-r from-primary/10 via-surface-container to-secondary/10 p-5 rounded-3xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">radar</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
              Need to Discover More Edo Partners & NGOs?
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Launch our automated Civil Society Crawler with 25+ verified entities across Benin City and Egor LGA.
            </p>
          </div>
        </div>

        <a
          href="/admin/radar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
          <span>Launch NGO Radar (25+) →</span>
        </a>
      </div>

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

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface cursor-pointer self-start sm:self-auto font-label-md">
              <input
                type="checkbox"
                checked={onlyBeninCity}
                onChange={(e) => setOnlyBeninCity(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
              />
              <span>Show Only Benin City Offices</span>
            </label>

            <span className="text-xs text-outline font-semibold">
              ({filteredPartners.length} Active in Directory)
            </span>
          </div>
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

            {/* Direct Contact Links & Pitch Generator */}
            <div className="mt-space-md pt-space-sm border-t border-surface-container flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {partner.phone && (
                  <a
                    href={`tel:${partner.phone}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container text-primary font-bold hover:bg-primary hover:text-on-primary transition-colors font-label-sm text-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    <span>{partner.phone}</span>
                  </a>
                )}
                {partner.email && (
                  <a
                    href={`mailto:${partner.email}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container text-secondary font-bold hover:bg-secondary hover:text-on-secondary transition-colors font-label-sm text-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>Email</span>
                  </a>
                )}
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors font-label-sm text-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">language</span>
                    <span>Site</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedForPitch(partner)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary-container shadow-2xs active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">edit_document</span>
                <span>Draft Letter</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal for Pitch Letter */}
      {selectedForPitch && (
        <div
          onClick={() => setSelectedForPitch(null)}
          className="fixed inset-0 z-50 bg-on-surface/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-3xl w-full rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">drafts</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-on-surface leading-tight">
                    Outreach Letter: {selectedForPitch.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Official Requisition • NYSC Egor LGA Sustainable Development Goals CDS
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedForPitch(null)}
                className="p-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto font-mono text-xs text-on-surface bg-surface-container-lowest leading-relaxed whitespace-pre-wrap select-all">
              {generateLetterContent(selectedForPitch)}
            </div>

            <div className="p-4 sm:p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
              <button
                onClick={() => handleCopy(generateLetterContent(selectedForPitch))}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 ${
                  copiedPitch ? 'bg-tertiary text-white' : 'bg-primary hover:bg-primary-container text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedPitch ? 'check_circle' : 'content_copy'}
                </span>
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
