import React, { useState } from 'react';

interface PresetTier {
  amount: number;
  label: string;
  badge: string;
  impactSummary: string;
  primarySDG: string;
}

const PRESET_TIERS: PresetTier[] = [
  {
    amount: 25000,
    label: '₦25,000',
    badge: 'Micro Action',
    impactSummary: 'Sanitary First-Aid & Classroom Disinfection',
    primarySDG: 'SDG 3 & 6',
  },
  {
    amount: 50000,
    label: '₦50,000',
    badge: 'High Impact',
    impactSummary: '50 Girls 3-Month Sanitary Pad Dignity Supply',
    primarySDG: 'SDG 5',
  },
  {
    amount: 100000,
    label: '₦100,000',
    badge: 'WASH Unit',
    impactSummary: 'School Clean Water Point & Hygiene Station',
    primarySDG: 'SDG 6',
  },
  {
    amount: 350000,
    label: '₦350,000',
    badge: 'Drainage & Eco',
    impactSummary: '400m Public Drain Clearing & Waste Collection',
    primarySDG: 'SDG 11 & 13',
  },
  {
    amount: 1000000,
    label: '₦1,000,000',
    badge: 'Flagship Partner',
    impactSummary: 'Youth Digital Skills Hub / Solar Study Lab',
    primarySDG: 'SDG 4 & 8',
  },
];

export const ImpactCalculator: React.FC = () => {
  const [budget, setBudget] = useState<number>(50000);
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false);
  const [donorCompany, setDonorCompany] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inKindCategory, setInKindCategory] = useState<string>('Sanitary Pads & Hygiene Items');

  // Computed metrics
  const girlsSupported = Math.floor(budget / 1000);
  const schoolsEquipped = Math.max(1, Math.floor(budget / 35000));
  const drainMeters = Math.floor(budget / 800);
  const volunteerHours = Math.round((budget / 1000) * 1.5);

  const formatNaira = (num: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getLetterBody = () => {
    const org = donorCompany.trim() || '[Company / Foundation / Philanthropist Name]';
    return `THE MANAGING DIRECTOR / CSR DIRECTORATE
${org}
Edo State, Nigeria.

Dear Sir / Madam,

RE: INVITATION FOR CORPORATE CITIZENSHIP PARTNERSHIP - NYSC EGOR SDG CDS GROUP

We write on behalf of the National Youth Service Corps (NYSC) Sustainable Development Goals (SDG) Community Development Service (CDS) Group, Egor Local Government Area, Edo State.

Our mandate unites graduates serving across Egor LGA in grassroots interventions that advance the UN 2030 Agenda. We are soliciting partnership and sponsorship support budgeted at ${formatNaira(
      budget
    )} to execute verified, high-impact civic deliverables:

ESTIMATED PROGRAM DELIVERABLES:
1. Direct Dignity Beneficiaries: ~${girlsSupported} secondary school students provided certified hygiene & menstrual care materials.
2. Target Beneficiary Facilities: ~${schoolsEquipped} public primary/secondary schools or local health centers in Egor LGA.
3. Environmental Footprint: ~${drainMeters}m community drainage desilted or community waste bins stationed.
4. Corps Volunteer Labor: ${volunteerHours} hours of active, selfless youth service.

THE ZERO ADMINISTRATIVE OVERHEAD ADVANTAGE:
Because all serving corps members are salaried through the Federal Government NYSC scheme, 100.00% of your sponsored funding goes directly towards physical materials, logistics, and student beneficiaries with zero overhead deduction.

OFFICIAL CLEARANCE & MONITORING:
All CDS projects are vetted and supervised by the NYSC Local Government Inspector (LGI) and SDG Schedule Officer at the Egor NYSC Secretariat. An audited photographic closeout report and Certificate of Corporate Citizenship will be presented to your organization upon project completion.

We look forward to scheduling a 15-minute briefing or formal letter submission at your office.

Yours faithfully,

Augusta / Executive President
NYSC Egor SDG CDS Group
Meeting Secretariat: Egor NYSC Secretariat, Benin City, Edo State
Website: https://edo-sdg.vercel.app/partner`;
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(getLetterBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Hello NYSC Egor SDG CDS Executive Council, my organization (${donorCompany || 'Corporate Partner'}) is interested in co-sponsoring a ${formatNaira(
        budget
      )} community project in Egor LGA. Let us discuss modalities.`
    );
    window.open(`https://api.whatsapp.com/send?phone=2348000000000&text=${text}`, '_blank');
  };

  const handleInKindPledge = () => {
    const text = encodeURIComponent(
      `Hello NYSC Egor SDG CDS Executive, I want to pledge in-kind material donation (${inKindCategory}) to support SDG community outreach at Egor NYSC Secretariat.`
    );
    window.open(`https://api.whatsapp.com/send?phone=2348000000000&text=${text}`, '_blank');
  };

  return (
    <div id="calculator" className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container shadow-card p-6 sm:p-10 space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-container pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">calculate</span>
            <span>Interactive Impact Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Calculate Your CSR & Donor Reach in <span className="text-primary">Egor LGA</span>
          </h2>
          <p className="text-sm text-on-surface-variant max-w-2xl mt-1">
            See exactly how many schoolgirls, classrooms, or community drains your sponsorship will transform through certified youth volunteer labor.
          </p>
        </div>

        {/* 100% Direct Impact Guarantee */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div>
            <div className="text-xs font-bold text-primary">100% Direct Impact Guarantee</div>
            <div className="text-[11px] text-on-surface-variant">Zero admin fees • Salaried NYSC labor</div>
          </div>
        </div>
      </div>

      {/* Preset Tiers */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Select a Standard Sponsorship Tier or Move Slider
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PRESET_TIERS.map((tier) => {
            const isSelected = budget === tier.amount;
            return (
              <button
                key={tier.amount}
                type="button"
                onClick={() => setBudget(tier.amount)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                    : 'border-surface-container-high bg-surface-container-low hover:bg-surface-container hover:border-outline-variant/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-primary' : 'text-on-surface-variant'}>
                    {tier.badge}
                  </span>
                  <span className="text-[10px] text-outline font-semibold">{tier.primarySDG}</span>
                </div>
                <div className="text-lg font-black text-on-surface mt-1">{tier.label}</div>
                <div className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                  {tier.impactSummary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider Control */}
      <div className="bg-surface-container-low p-5 sm:p-6 rounded-2xl border border-surface-container space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Custom Sponsorship Amount
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {formatNaira(budget)}
            </div>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Min ₦15,000 • Max ₦1,500,000+
          </span>
        </div>

        <input
          type="range"
          min="15000"
          max="1500000"
          step="5000"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex justify-between text-[11px] font-bold text-outline">
          <span>₦15k</span>
          <span>₦250k</span>
          <span>₦500k</span>
          <span>₦1M</span>
          <span>₦1.5M</span>
        </div>
      </div>

      {/* Real-time Computed Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="material-symbols-outlined text-[24px]">female</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded-full">
              SDG 5
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-on-surface">{girlsSupported}</div>
            <div className="text-xs font-bold text-on-surface mt-0.5">Secondary School Girls</div>
            <div className="text-[11px] text-on-surface-variant leading-snug mt-1">
              Equipped with a certified 3-month supply of sanitary pads and menstrual health guides.
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between text-primary">
            <span className="material-symbols-outlined text-[24px]">water_drop</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
              SDG 6
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-on-surface">{schoolsEquipped}</div>
            <div className="text-xs font-bold text-on-surface mt-0.5">Public Facilities Reached</div>
            <div className="text-[11px] text-on-surface-variant leading-snug mt-1">
              Provided with verifiable handwashing setups, germicidal detergents, and clean drinking stations.
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between text-tertiary">
            <span className="material-symbols-outlined text-[24px]">cleaning_services</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 px-2 py-0.5 rounded-full">
              SDG 11 & 13
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-on-surface">{drainMeters}m</div>
            <div className="text-xs font-bold text-on-surface mt-0.5">Drainage Clearances</div>
            <div className="text-[11px] text-on-surface-variant leading-snug mt-1">
              Length of flood-risk drainage cleared or community refuse bags cleared and disposed properly.
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface">
            <span className="material-symbols-outlined text-[24px]">groups</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-high px-2 py-0.5 rounded-full">
              Civic Force
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-on-surface">{volunteerHours} hrs</div>
            <div className="text-xs font-bold text-on-surface mt-0.5">NYSC Volunteer Labor</div>
            <div className="text-[11px] text-on-surface-variant leading-snug mt-1">
              Zero administrative charges to your CSR budget. Serving graduates handle 100% of execution.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => setShowLetterModal(true)}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-card active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span>Generate Official Requisition Letter</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppContact}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-card active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Connect via WhatsApp</span>
        </button>
      </div>

      {/* In-Kind Donation Strip */}
      <div className="mt-6 pt-6 border-t border-surface-container bg-surface-container-low/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
            <span>Prefer donating physical items & supplies instead of cash?</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            We directly receive sanitary pads, school bags, exercise books, trash bins, water dispensers, and solar kits at Egor NYSC Secretariat.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={inKindCategory}
            onChange={(e) => setInKindCategory(e.target.value)}
            className="text-xs bg-surface-container-lowest border border-surface-container-high rounded-xl px-3 py-2 text-on-surface font-medium focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Sanitary Pads & Hygiene Items">Sanitary Pads & Hygiene Items</option>
            <option value="School Books, Pens & Uniforms">School Books, Pens & Uniforms</option>
            <option value="Waste Bins, Shovels & Rakes">Waste Bins, Shovels & Rakes</option>
            <option value="Water Dispensers & Purifiers">Water Dispensers & Purifiers</option>
            <option value="Solar Lighting & Computer Kits">Solar Lighting & Computer Kits</option>
          </select>

          <button
            type="button"
            onClick={handleInKindPledge}
            className="shrink-0 px-4 py-2 bg-surface-container-lowest hover:bg-surface-container border border-surface-container-high text-xs font-bold text-primary rounded-xl transition-all cursor-pointer shadow-subtle"
          >
            Pledge Item
          </button>
        </div>
      </div>

      {/* Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto border border-surface-container shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">mark_email_read</span>
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  Pre-drafted Sponsorship Proposal Letter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLetterModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant">
                Your Organization Name (Optional):
              </label>
              <input
                type="text"
                value={donorCompany}
                onChange={(e) => setDonorCompany(e.target.value)}
                placeholder="e.g. Okomu Oil Palm Plc / Zenith Bank / Local Foundation"
                className="w-full text-xs p-3 rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant">
                Letter Text (Formatted with calculated impact for {formatNaira(budget)}):
              </label>
              <pre className="text-xs font-mono bg-surface-container-low p-4 rounded-xl border border-surface-container whitespace-pre-wrap leading-relaxed text-on-surface overflow-x-auto max-h-72">
                {getLetterBody()}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-on-surface-variant">
                Ready to submit to your CSR board or print on official letterhead.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container cursor-pointer transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter Draft'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLetterModal(false)}
                  className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
