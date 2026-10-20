import React, { useState } from 'react';
import type { Idea, CrawledNgo } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { EDO_NGO_REGISTRY } from '../../data/edoNgoDirectory';

interface IdeaModeratorProps {
  initialIdeas: Idea[];
}

export const IdeaModerator: React.FC<IdeaModeratorProps> = ({ initialIdeas }) => {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [selectedNgoForPitch, setSelectedNgoForPitch] = useState<CrawledNgo | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const updateStatus = (id: string, newStatus: Idea['status']) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  const getMatchedNgos = (idea: Idea): CrawledNgo[] => {
    return EDO_NGO_REGISTRY.filter((ngo) => {
      const sharesSdg = idea.target_sdgs?.some((g) => ngo.sdg_goals.includes(g));
      const sharesCategory =
        (idea.category.toLowerCase().includes('health') && ngo.category.includes('Health')) ||
        (idea.category.toLowerCase().includes('hygiene') && ngo.category.includes('Pads')) ||
        (idea.category.toLowerCase().includes('sanitation') && ngo.category.includes('Sanitation')) ||
        (idea.category.toLowerCase().includes('education') && ngo.sdg_goals.includes(4));
      return sharesSdg || sharesCategory;
    }).slice(0, 3);
  };

  const generateLetterContent = (ngo: CrawledNgo, idea?: Idea) => {
    return `NATIONAL YOUTH SERVICE CORPS
EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
Egor NYSC Secretariat, Benin City, Edo State
Ref: NYSC/ED/EGOR/SDG/${new Date().getFullYear()}/${ngo.id.substring(0, 6).toUpperCase()}
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

To: The Managing Director / CSR Coordinator,
${ngo.name},
${ngo.address}.

REQUISITION FOR STRATEGIC CSR SPONSORSHIP: ${idea ? idea.title.toUpperCase() : 'COMMUNITY DEVELOPMENT INITIATIVE'} (EGOR LGA)

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Egor Local Government Area Sustainable Development Goals (SDGs) Community Development Service (CDS) Group presents this community partnership proposal to ${ngo.name}.

Following grassroots crowdsourcing across Egor LGA, corps members and community members prioritized the following intervention:
"${idea?.description || 'Grassroots sustainable development initiative mapped to local community needs.'}"

KEY PROJECT TARGETS (EGOR LOCAL GOVERNMENT AREA):
1. Target SDGs: [${ngo.sdg_goals.map(g => `Goal ${g}`).join(', ')}].
2. Direct community beneficiaries located at ${idea?.suggested_location || 'Egor LGA'}.
3. Deployment of qualified, serving NYSC corps members with zero administrative overhead.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

We request an opportunity to present a 5-minute executive briefing at your convenience.

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;
  };

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant pb-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Anonymous Idea Review & Smart NGO Matching
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Review community proposals from Egor corps members, audit peer vote counts, and match proposals directly with vetted Edo State NGOs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/radar"
            className="px-3.5 py-1.5 rounded-xl bg-secondary-fixed/60 text-on-secondary-fixed font-label-sm text-xs font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Edo NGO Radar →</span>
          </a>
          <div className="px-3 py-1.5 rounded-xl bg-surface-container text-primary font-label-sm text-xs font-bold shrink-0">
            {ideas.length} Total Proposals
          </div>
        </div>
      </div>

      <div className="divide-y divide-surface-variant">
        {ideas.map((idea) => {
          const matchedNgos = getMatchedNgos(idea);

          return (
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

              {/* Matched Edo NGOs Badge & Quick Action */}
              {matchedNgos.length > 0 && (
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-primary flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[16px]">handshake</span>
                      <span>Matched Edo Partners:</span>
                    </span>
                    {matchedNgos.map((ngo) => (
                      <button
                        key={ngo.id}
                        onClick={() => setSelectedNgoForPitch(ngo)}
                        className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-primary hover:text-on-primary font-medium text-[11px] text-on-surface transition-colors"
                        title={`Click to draft letter to ${ngo.name}`}
                      >
                        {ngo.name} ↗
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-outline italic shrink-0">
                    Click partner name to draft pitch
                  </span>
                </div>
              )}

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
          );
        })}
      </div>

      {/* Pitch Letter Modal */}
      {selectedNgoForPitch && (
        <div
          onClick={() => setSelectedNgoForPitch(null)}
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
                    Pitch Letter: {selectedNgoForPitch.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Auto-generated from approved community proposal
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNgoForPitch(null)}
                className="p-2 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto font-mono text-xs text-on-surface bg-surface-container-lowest leading-relaxed whitespace-pre-wrap select-all">
              {generateLetterContent(selectedNgoForPitch)}
            </div>

            <div className="p-4 sm:p-6 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-3">
              <button
                onClick={() => handleCopyPitch(generateLetterContent(selectedNgoForPitch))}
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
