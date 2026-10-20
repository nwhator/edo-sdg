import React, { useState } from 'react';

const TEMPLATE_SANITARY = `NATIONAL YOUTH SERVICE CORPS
EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
Egor NYSC Secretariat, Benin City, Edo State

Ref No: NYSC/ED/EGOR/SDG/2026/01
Batch: 2025/2026 Service Year
Date: 24th October, 2026
Jurisdiction: Egor Local Government Area, Edo State

The Managing Director / CSR Coordinator,
[Target Corporate Donor / Foundation / Pharmaceutical Company],
Benin City Metropolis, Edo State.

REQUISITION FOR CORPORATE CSR PARTNERSHIP: DONATION OF 1,500 SANITARY HYGIENE PACKS FOR PUBLIC SECONDARY SCHOOL GIRLS IN EGOR LGA (SDG 3 & 5)

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Egor Local Government Area Sustainable Development Goals (SDGs) Community Development Service (CDS) Group respectfully presents this urgent requisition for community partnership under our flagship "Dignity for the Girl-Child Project".

Our grassroots assessment across public secondary schools in Egor Local Government Area revealed that a significant percentage of adolescent girls experience periodic absenteeism due to lack of access to hygienic menstrual protection products and basic reproductive wellness guidance.

PROJECT IMPACT TARGETS (EGOR LGA):
1. Direct distribution of 1,500 sanitary pad packages across secondary schools in Egor LGA.
2. Free adolescent reproductive hygiene and peer empowerment workshops facilitated alongside qualified NYSC medical corps members.
3. Establishment of permanent sanitary emergency cabinets in school guidance and counseling offices across Egor.

SUPPORT REQUESTED:
We formally request your esteemed organization to support with in-kind sanitary packages (or grant financial support) toward product procurement and logistical deployment. Corporate sponsors will receive prominent brand recognition, official appreciation, and inclusion in our verified project reports.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

Thank you for your continuous dedication to communal upliftment and human capital development within Egor LGA and Edo State.

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;

const TEMPLATE_EQUIPMENT = `NATIONAL YOUTH SERVICE CORPS • EGOR LGA
SUSTAINABLE DEVELOPMENT GOALS CDS • ENVIRONMENTAL SANITATION SUB-COMMITTEE
Egor NYSC Secretariat Hub, Benin City • Ref: NYSC/ED/EGOR/ESWMB/2026/02

Date: 24th October, 2026

The Managing Director,
Edo State Waste Management Board (ESWMB),
Sapele Road Secretariat Complex, Benin City, Edo State.

REQUEST FOR LOGISTICAL ASSISTANCE AND DEPLOYMENT OF SANITATION MACHINERY: CDS WEDNESDAY MEGA CLEARING ACROSS EGOR LGA COMMERCE AXIS

Respected Sir,

The NYSC SDGs CDS Group of Egor Local Government Area, in alignment with SDG 11 (Sustainable Communities) and SDG 12 (Responsible Consumption & Sanitation), has scheduled an intensive communal cleanup drive within Egor LGA on Wednesday, 18th November 2026 from 07:30 AM to 12:00 PM.

Over 100 Corps Members deployed to Egor LGA will participate in manual drainage desilting, conduit clearance, and market perimeter sanitization. To guarantee safe transit and disposal of excavated refuse, we formally requisition the following fleet deployment:

REQUESTED MACHINERY & LOGISTICS SCHEDULE:
1. 15-Tonne Tipper Truck (1 Unit) - Evacuation of excavated silt to the approved government dumpsite.
2. Refuse Compactor Vehicle (1 Unit) - Packing organic commercial market waste and discarded plastics.
3. Heavy Work Gloves, Rubber Boots & Rakes (35 Sets) - Corps member occupational safety equipment.
4. Fumigation / Disinfectant Spray Kits (2 Units) - Gutter perimeter sanitization.

Corps logistics liaisons will verify fueling and ensure orderly operations throughout the Wednesday community exercise.

Anticipating your usual proactive administrative cooperation.

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;

const TEMPLATE_INNOVATION = `NYSC EGOR LOCAL GOVERNMENT AREA CDS
SUSTAINABLE DEVELOPMENT GOALS GROUP • TECH FOR GOOD INITIATIVE
Egor NYSC Secretariat • Strategic Community Prospectus

Date: 24th October, 2026

To the Managing Director / CSR Coordinator,
Private Enterprise / Tech Ecosystem Partners,
Benin City Innovation Corridor, Edo State.

COMMUNITY PROPOSAL: STEM & DIGITAL SKILLS WORKSHOP FOR EGOR PUBLIC SECONDARY SCHOOLS (SDG 4, 8 & 9)

In partnership with local educational stakeholders, the NYSC Egor SDG CDS Group is organizing a digital literacy and computer skills workshop at the Egor Secretariat Hub to equip public secondary school students with foundational digital skills.

PARTNERSHIP TIERS:
- TIER 1 • HARDWARE SUPPORT: Refurbished laptops or desktop monitors for hands-on student practice.
- TIER 2 • CONNECTIVITY: 12-month community internet router subscription for student access.
- TIER 3 • EDUCATIONAL KITS: Notebooks, writing materials, and student participation awards.

CORPS MEMBER VOLUNTEER CADRE:
Instruction will be delivered directly by serving NYSC corps members holding university degrees in Computer Science, Engineering, and Education serving in Egor LGA, guaranteeing zero labor overhead and dedicated execution.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

Yours in National Service,

____________________________                  ____________________________
Corps Member Augusta                          Mrs. A. Osagie
President, NYSC SDGs CDS Group                Schedule Officer / LGI Egor Secretariat
Egor LGA Chapter                              NYSC Edo State Secretariat`;

export const PitchKitViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sanitary' | 'equipment' | 'innovation'>('sanitary');
  const [copied, setCopied] = useState(false);

  const getTemplateData = () => {
    switch (activeTab) {
      case 'sanitary':
        return {
          id: 'letter-sanitary-copy',
          title: 'Sanitary Hygiene Outreach Requisition',
          target: 'Corporate CSR, Foundations, Pharmaceutical Distributors',
          text: TEMPLATE_SANITARY,
          icon: 'sanitizer',
          fileName: 'NYSC_Egor_Sanitary_Outreach_Letter.docx',
        };
      case 'equipment':
        return {
          id: 'letter-equipment-copy',
          title: 'Heavy Sanitation Equipment Requisition',
          target: 'Edo State Waste Management Board (ESWMB)',
          text: TEMPLATE_EQUIPMENT,
          icon: 'front_loader',
          fileName: 'NYSC_Egor_ESWMB_Logistics_Requisition.docx',
        };
      case 'innovation':
        return {
          id: 'letter-innovation-copy',
          title: 'Digital Skills & STEM Workshop Proposal',
          target: 'Tech Ecosystem, CSR Foundations, Educational Philanthropists',
          text: TEMPLATE_INNOVATION,
          icon: 'terminal',
          fileName: 'NYSC_Egor_Digital_Skills_Proposal.pdf',
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
    <div className="space-y-6">
      {/* Template Selection Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
        <button
          onClick={() => setActiveTab('sanitary')}
          className={`p-4 rounded-xl text-left transition-all duration-150 flex items-center gap-3 ${
            activeTab === 'sanitary'
              ? 'bg-surface-container-lowest text-primary font-bold shadow-subtle'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-primary">sanitizer</span>
          <div>
            <span className="block text-sm font-bold">Template 01</span>
            <span className="block text-xs opacity-80">Sanitary Pad Outreach (Egor)</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`p-4 rounded-xl text-left transition-all duration-150 flex items-center gap-3 ${
            activeTab === 'equipment'
              ? 'bg-surface-container-lowest text-primary font-bold shadow-subtle'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-tertiary">front_loader</span>
          <div>
            <span className="block text-sm font-bold">Template 02</span>
            <span className="block text-xs opacity-80">ESWMB Sanitation Logistics</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('innovation')}
          className={`p-4 rounded-xl text-left transition-all duration-150 flex items-center gap-3 ${
            activeTab === 'innovation'
              ? 'bg-surface-container-lowest text-primary font-bold shadow-subtle'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-secondary">terminal</span>
          <div>
            <span className="block text-sm font-bold">Template 03</span>
            <span className="block text-xs opacity-80">Youth Digital Skills Lab</span>
          </div>
        </button>
      </div>

      {/* Toolbar & Understandable Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px]">{current.icon}</span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-on-surface">{current.title}</h3>
            <p className="text-xs text-on-surface-variant">Intended for: {current.target}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 ${
              copied
                ? 'bg-tertiary text-white'
                : 'bg-primary hover:bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm font-bold rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-1.5 active:scale-95 shadow-subtle"
            title="Print or Save as PDF"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Letter Paper Simulation */}
      <div className="p-6 sm:p-10 rounded-2xl bg-surface-container-lowest shadow-card border border-outline-variant/30 max-w-4xl mx-auto w-full relative print:shadow-none print:border-none print:p-0">
        {/* Letterhead Banner */}
        <div className="text-center pb-6 mb-6 border-b border-surface-container">
          <div className="inline-block space-y-1">
            <span className="text-sm sm:text-base tracking-widest uppercase font-black text-primary block">
              NATIONAL YOUTH SERVICE CORPS
            </span>
            <span className="text-xs sm:text-sm tracking-wider text-on-surface block uppercase font-bold">
              EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
            </span>
            <span className="text-xs text-on-surface-variant block">
              Egor NYSC Secretariat, Benin City, Edo State
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

      {/* Simple Guidance Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
          <div>
            <h4 className="text-xs font-bold text-on-surface">LGI Endorsement</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Every outreach letter must be officially counter-signed at the Egor NYSC Secretariat before physical delivery.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[22px]">schedule</span>
          <div>
            <h4 className="text-xs font-bold text-on-surface">Submission Window</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Submit requisition requests 7-10 working days prior to your target Wednesday community outreach.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-tertiary text-[22px]">receipt_long</span>
          <div>
            <h4 className="text-xs font-bold text-on-surface">Keep Acknowledged Copy</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Always retrieve a stamped acknowledgment copy from the recipient for the Egor CDS file registry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
