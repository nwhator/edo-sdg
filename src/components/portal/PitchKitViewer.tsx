import React, { useState } from 'react';

const TEMPLATE_SANITARY = `NATIONAL YOUTH SERVICE CORPS
EDO STATE SECRETARIAT • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
NYSC Secretariat, 2 Benin-Agbor Road, Ikpoba Hill, P.M.B. 1384, Benin City, Edo State

Ref No: NYSC/ED/SDG/2026/08
Batch: 2024 Stream B / 2025-2026 Service Year
Date: 24th October, 2026
Jurisdiction: Oredo / Ikpoba-Okha Local Government Area

The Managing Director / CSR Coordinator,
[Target Corporate Donor / Foundation / Pharmaceutical Company],
Benin City Metropolis,
Edo State, Nigeria.

REQUISITION FOR CORPORATE CSR PARTNERSHIP: DONATION OF 2,500 SANITARY HYGIENE PACKS FOR PUBLIC SECONDARY SCHOOL GIRLS IN BENIN METROPOLIS (SDG 3 & 5)

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Edo State Sustainable Development Goals (SDGs) Community Development Service (CDS) Group respectfully presents this urgent requisition for community partnership under our flagship "Dignity for the Girl-Child Project".

Our grassroots baseline assessment conducted across municipal schools in Ikpoba-Okha and Oredo LGAs revealed that over 43% of teenage adolescent girls experience periodic absenteeism due to lack of access to hygienic menstrual protection products and adequate reproductive wellness guidance.

PROJECT IMPACT TARGETS:
1. Direct distribution of 2,500 sanitary pad packages across 10 municipal secondary schools (including Emotan College and Idia College, Benin City).
2. Free adolescent reproductive hygiene and peer empowerment workshops facilitated alongside qualified NYSC medical doctors and local CSO facilitators.
3. Establishment of permanent sanitary emergency cabinets in recipient school guidance and counseling offices.

SUPPORT REQUESTED:
We formally request your esteemed organization to donate in-kind sanitary packages (or grant financial support of NGN 1,850,000) toward product procurement and logistical deployment. Corporate sponsors will receive prime brand placement on all campaign media, state NYSC press releases, and a certificate of social investment issued by the NYSC State Coordinator.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

Thank you for your continuous dedication to communal upliftment and human capital development within Edo State. We look forward to an impactful collaborative outreach.

Yours in National Service,

____________________________                  ____________________________
Corps Member Osagie E. Donald                 Mrs. A. M. Okojie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Oredo Secretariat
State Code: ED/24B/1209                       NYSC Edo State Secretariat`;

const TEMPLATE_EQUIPMENT = `NATIONAL YOUTH SERVICE CORPS • EDO STATE
SUSTAINABLE DEVELOPMENT GOALS CDS • ENVIRONMENTAL SANITATION SUB-COMMITTEE
Secretariat Hub, Benin City • Ref: NYSC/ED/SDG/ESWMB/2026/03

Date: 24th October, 2026

The Managing Director,
Edo State Waste Management Board (ESWMB),
Sapele Road Secretariat Complex, Benin City, Edo State.

REQUEST FOR LOGISTICAL ASSISTANCE AND DEPLOYMENT OF HEAVY MACHINERY: CDS THURSDAY MEGA CLEARING AT OBA MARKET & RING ROAD DRAINAGES

Respected Sir,

The NYSC SDGs CDS Group, in alignment with SDG 11 (Sustainable Cities & Communities) and SDG 12 (Responsible Consumption & Sanitation), has scheduled an intensive communal cleanup drive at the historic Oba Market perimeter and adjacent storm drain networks on Thursday, 14th November 2026 from 07:00 AM to 12:00 PM.

Over 120 Corps Members have been deployed for manual evacuation, desilting of blocked conduits, and market-stall sanitization. To guarantee safe transit and disposal of excavated heavy silt to the designated state dumpsite, we formally requisition the following fleet deployment:

REQUESTED MACHINERY & REQUISITION SCHEDULE:
1. 15-Tonne Tipper Trucks (2 Units) - Transport of excavated silt to Ikhueniro Dumpsite.
2. Rear-Loading Waste Compactor (1 Unit) - Compacting organic market food waste and discarded single-use plastics.
3. Heavy Work Gloves, Rubber Boots & Rakes (40 Sets) - Corps member personal occupational safety equipment.
4. Fumigation / Disinfectant Spray Kits (4 Units) - Gutter perimeter sanitization.

Corps logistics liaisons will ensure prompt refueling verification and full security accompaniment by the Nigerian Police Force throughout the Thursday operational hours.

Anticipating your usual proactive administrative cooperation.

Yours in National Service,

____________________________                  ____________________________
Corps Member Osagie E. Donald                 Dr. (Mrs.) N. Ighodaro
CDS President • ED/24B/1209                   NYSC State SDGs Desk Officer
Edo State Secretariat                         NYSC Edo State Secretariat`;

const TEMPLATE_INNOVATION = `NYSC EDO STATE COMMUNITY DEVELOPMENT SERVICE
SUSTAINABLE DEVELOPMENT GOALS GROUP • TECH FOR GOOD INITIATIVE
Strategic Public-Private Partnership Prospectus • Ref: ED/NYSC/CDS/PROPOSAL/2026-V4

Date: 24th October, 2026

To the Chief Technology Officer / Foundation Director,
Private Enterprise / Tech Ecosystem Partners,
Benin City Innovation Corridor, Edo State.

EXECUTIVE SUMMARY: STEM & DIGITAL FABRICATION LAB FOR PUBLIC SECONDARY SCHOOLS (SDG 4, 8 & 9)

In partnership with local educational hubs, the Edo State NYSC SDGs CDS Group is establishing a decentralized computer coding, data literacy, and renewable solar engineering workshop within the Benin City Youth Center to equip 400 underprivileged public school teenagers with digital economy skills.

KEY PARTNERSHIP TIERS:
- TIER 1 • HARDWARE DONOR: Donation of 15-20 refurbished laptops or desktop workstations + solar inverter battery bank.
- TIER 2 • CONNECTIVITY & CLOUD: Sponsorship of 12-month high-speed fiber internet subscription and cloud hosting student licenses.
- TIER 3 • BOOTCAMP GRANTS & PRIZES: Micro-scholarships covering student hardware kits, graduation hackathon awards, and project exhibition prizes.

CORPS MEMBER VOLUNTEER CADRE:
The program will be instructed full-time on Thursday mornings and Saturday afternoons by serving NYSC corps members holding specialized degrees in Computer Engineering, Data Science, and Electrical Technology, guaranteeing zero labor overhead and complete technical execution.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

Yours in National Service,

____________________________                  ____________________________
Corps Member Osagie E. Donald                 Engr. P. E. Osawaru
CDS President • ED/24B/1209                   Director of Youth Development & CDS
Edo State Secretariat                         Edo State Ministry of Youth and Sports`;

export const PitchKitViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sanitary' | 'equipment' | 'innovation'>('sanitary');
  const [copied, setCopied] = useState(false);

  const getTemplateData = () => {
    switch (activeTab) {
      case 'sanitary':
        return {
          id: 'letter-sanitary-copy',
          title: 'Letter Requesting Sanitary Pads for Secondary Schools',
          target: 'Corporate Brands, Pharmaceutical Distributors, International Donors',
          text: TEMPLATE_SANITARY,
          icon: 'sanitizer',
          color: 'primary',
          fileName: 'NYSC_ED_Sanitary_Outreach_Pitch.docx',
        };
      case 'equipment':
        return {
          id: 'letter-equipment-copy',
          title: 'Request for Heavy Sanitation Equipment & Tipper Trucks',
          target: 'Edo State Waste Management Board (ESWMB) / Ministry of Environment',
          text: TEMPLATE_EQUIPMENT,
          icon: 'front_loader',
          color: 'tertiary',
          fileName: 'NYSC_ED_ESWMB_Logistics_Requisition.docx',
        };
      case 'innovation':
        return {
          id: 'letter-innovation-copy',
          title: 'Corporate Partnership Proposal: Youth Innovation Labs',
          target: 'Tech Foundations, Edo Innovates Hubs, Telecoms, STEM Philanthropists',
          text: TEMPLATE_INNOVATION,
          icon: 'terminal',
          color: 'secondary',
          fileName: 'NYSC_Edo_Innovation_Labs_2026.pdf',
        };
    }
  };

  const current = getTemplateData();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-space-lg">
      {/* Template Sub-Navigation Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm p-1.5 bg-surface-container-low rounded-xl">
        <button
          onClick={() => setActiveTab('sanitary')}
          className={`p-space-md rounded-lg text-left transition-all duration-150 flex items-center gap-space-sm ${
            activeTab === 'sanitary'
              ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-primary">sanitizer</span>
          <div>
            <span className="block font-label-lg text-label-lg">Template 01</span>
            <span className="block font-label-sm text-label-sm opacity-80">Sanitary Pad Outreach</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`p-space-md rounded-lg text-left transition-all duration-150 flex items-center gap-space-sm ${
            activeTab === 'equipment'
              ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-tertiary">front_loader</span>
          <div>
            <span className="block font-label-lg text-label-lg">Template 02</span>
            <span className="block font-label-sm text-label-sm opacity-80">Heavy Sanitation Logistics</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('innovation')}
          className={`p-space-md rounded-lg text-left transition-all duration-150 flex items-center gap-space-sm ${
            activeTab === 'innovation'
              ? 'bg-surface-container-highest text-primary font-bold shadow-xs'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-secondary">terminal</span>
          <div>
            <span className="block font-label-lg text-label-lg">Template 03</span>
            <span className="block font-label-sm text-label-sm opacity-80">Youth Innovation Lab</span>
          </div>
        </button>
      </div>

      {/* Toolbar & Export Controls */}
      <div className="flex flex-wrap items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-low">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[28px]">{current.icon}</span>
          <div>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">{current.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Recommended for: {current.target}</p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={handleCopy}
            className={`px-space-md py-space-xs font-label-lg text-label-lg rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
              copied
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter Template'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-space-md py-space-xs bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-lg text-label-lg rounded-lg transition-colors flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Letter Paper Simulation */}
      <div className="p-space-xl sm:p-space-2xl rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 max-w-4xl mx-auto w-full relative print:shadow-none print:border-none print:p-0">
        {/* Letterhead Banner */}
        <div className="text-center pb-space-lg mb-space-md border-b border-surface-variant">
          <div className="inline-block mb-space-xs">
            <span className="font-title-md text-title-md tracking-widest uppercase font-black text-primary block">
              NATIONAL YOUTH SERVICE CORPS
            </span>
            <span className="font-label-lg text-label-lg tracking-wider text-on-surface block uppercase font-bold mt-1">
              EDO STATE SECRETARIAT • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">
              NYSC Secretariat, 2 Benin-Agbor Road, Ikpoba Hill, P.M.B. 1384, Benin City, Edo State
            </span>
          </div>
          <div className="w-full h-1 bg-primary rounded-full mt-3"></div>
          <div className="w-full h-0.5 bg-secondary-container rounded-full mt-1"></div>
        </div>

        {/* Formatted Letter Body */}
        <div className="font-mono text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
          {current.text}
        </div>
      </div>

      {/* Educational Resources / Guidelines Strip */}
      <section className="mt-space-xl grid grid-cols-1 md:grid-cols-3 gap-space-lg pt-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
          <div>
            <h4 className="font-title-md text-title-md text-on-surface font-bold">Statutory Compliance</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              All letters must carry the official NYSC Secretariat counter-signature and seal of the CDS Schedule Officer prior to physical delivery.
            </p>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[24px]">schedule</span>
          <div>
            <h4 className="font-title-md text-title-md text-on-surface font-bold">Turnaround Standards</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Government agencies and ministries in Benin City require 10-14 working days for formal clearance. Submit logistics requests early.
            </p>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
          <span className="material-symbols-outlined text-tertiary text-[24px]">receipt_long</span>
          <div>
            <h4 className="font-title-md text-title-md text-on-surface font-bold">Audit Transparency</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Always retain an officially stamped 'Received Copy' in the Executive CDS Archive Registry for the state audit roll.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
