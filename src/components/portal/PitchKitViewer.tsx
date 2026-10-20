import React, { useState } from 'react';

const PAD_LETTER_TEMPLATE = `NATIONAL YOUTH SERVICE CORPS (NYSC)
EDO STATE SECRETARIAT, BENIN CITY
SUSTAINABLE DEVELOPMENT GOALS (SDG) CDS GROUP

Date: [Insert Date, e.g., 20th October 2026]

To:
The Executive Director / CSR Coordinator,
[Organization Name, e.g., Girls' Power Initiative (GPI) / Corporate Donor],
Benin City, Edo State.

Dear Sir/Madam,

REQUEST FOR PARTNERSHIP / IN-KIND SPONSORSHIP: "PROJECT FLOW" (MENSTRUAL HYGIENE DRIVE & EMERGENCY PAD BANK INITIATIVE)

Warm greetings in the spirit of national service and community empowerment.

We, the members of the NYSC Sustainable Development Goals (SDG) Community Development Service (CDS) group, Edo State Chapter, write to formally solicit your support and partnership for our upcoming grassroots intervention: "Project Flow: Breaking Period Poverty and Restoring Dignity."

BACKGROUND & NEED:
In Edo State, hundreds of adolescent schoolgirls miss up to 5 days of school monthly due to the unaffordability of basic sanitary towels. This exacerbates educational inequality (SDG 4), limits gender empowerment (SDG 5), and poses severe reproductive health risks (SDG 3).

OUR TARGETED INTERVENTION:
On [Insert Target Date], our CDS team of corps doctors, educators, and development advocates will conduct an intensive Menstrual Hygiene Management (MHM) workshop at [Insert Target School, e.g., Emotan College / Idia College, Benin City], directly distributing 500 packs of sanitary pads and installing a permanent Emergency Pad Cabinet in the school's clinic.

SUPPORT REQUESTED:
To ensure the success of this initiative, we respectfully request:
1. In-kind donation of sanitary towels (cartons of sanitary pads) or hygiene soap bars.
2. Educational MHM flyers or co-facilitator support.
3. Co-branding of event banners, press releases, and our official web gallery.

We look forward to an opportunity to meet with your team to discuss how we can execute this high-impact outreach together.

Yours in National Service,

____________________________                  ____________________________
[Name of CDS President]                        [Name of Local Government Inspector]
President, NYSC SDG CDS Group                  Local Government Inspector (LGI)
Edo State Chapter                              NYSC Edo State
Phone: [Your Phone Number]`;

const CLEANING_LETTER_TEMPLATE = `NATIONAL YOUTH SERVICE CORPS (NYSC)
EDO STATE SECRETARIAT, BENIN CITY
SUSTAINABLE DEVELOPMENT GOALS (SDG) CDS GROUP

Date: [Insert Date, e.g., 20th October 2026]

To:
The Managing Director / General Manager,
Edo State Waste Management Board (ESWMB),
Governor's Office Complex, P.M.B. 1080,
Benin City, Edo State.

Through:
The Local Government Inspector (LGI),
NYSC Oredo / Benin City, Edo State.

Dear Sir,

REQUISITION FOR IN-KIND SANITATION MATERIALS & WASTE EVACUATION LOGISTICS: "CLEAN EDO" COMMUNITY MARKET & DRAINAGE CLEARANCE DRIVE

The members of the Edo State NYSC Sustainable Development Goals (SDG) CDS Group present our highest regards to the management of the Edo State Waste Management Board.

In alignment with United Nations SDG 3 (Good Health and Well-being), SDG 6 (Clean Water and Sanitation), and SDG 11 (Sustainable Cities), our CDS group has scheduled a massive environmental sanitation exercise at [Insert Location, e.g., King's Square Ring Road / Oba Market, Benin City] on [Insert Date].

OBJECTIVES:
1. Mobilize 100+ corps members to manually clear silt and unblock clogged storm drainages prone to flood and mosquito breeding.
2. Clear heavy plastic litter and educate shop owners and traders on proper waste containerization.

REQUISITION FOR BOARD ASSISTANCE:
To facilitate the safety and effectiveness of the corps members, we humbly request the assistance of the Board with:
1. 150 Heavy-duty waste bags (refuse sacks).
2. 40 Brooms and 20 metal rakes.
3. Safety equipment: Nose masks and heavy-duty rubber gloves.
4. The deployment of a compactor/tipper truck for final evacuation of the accumulated refuse at the conclusion of the exercise.

We appreciate the tremendous work the Edo State Government and the Waste Management Board are doing to maintain a clean Edo State, and we look forward to contributing our quota through this community service.

Yours in National Service,

____________________________                  ____________________________
[Name of CDS President]                        [Name of Local Government Inspector]
President, NYSC SDG CDS Group                  Local Government Inspector (LGI)
Edo State Chapter                              NYSC Edo State`;

export const PitchKitViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pads' | 'cleaning'>('pads');
  const [copied, setCopied] = useState(false);

  const activeText = activeTab === 'pads' ? PAD_LETTER_TEMPLATE : CLEANING_LETTER_TEMPLATE;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('pads')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'pads'
                ? 'bg-nysc-green text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🩸 Sanitary Pads Solicitation Letter
          </button>
          <button
            onClick={() => setActiveTab('cleaning')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'cleaning'
                ? 'bg-nysc-green text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧹 Sanitation & Waste Board Requisition
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-nysc-gold text-nysc-green-deep text-xs font-extrabold hover:bg-amber-400 transition-colors shadow-xs"
        >
          {copied ? '✓ Copied to Clipboard!' : '📋 Copy Letter Template'}
        </button>
      </div>

      {/* Letter Preview Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap">
        {activeText}
      </div>

      {/* Sponsorship Rules Guide */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-nysc-gold flex items-center gap-2">
          <span>📌</span>
          <span>5 Field-Tested Rules for Securing Sponsorship in Benin City:</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-white block">1. Always Involve the LGI</span>
            <p>Organizations and ministries will discard letters without an official NYSC stamp and Local Government Inspector endorsement.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-white block">2. Ask for Products, Not Cash</span>
            <p>Supermarkets, distributors, and NGOs will gladly give 30 cartons of pads or 50 brooms; monetary requests face heavy audit hurdles.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-white block">3. Deliver Letters by Hand</span>
            <p>Email response rates in Benin City public offices are low. Print 2 copies, deliver in person to their office, and get an "Acknowledged Copy".</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-white block">4. Promise Media & Photo Visibility</span>
            <p>Show them our CDS web gallery and promise to feature their logos on our event banners and press articles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
