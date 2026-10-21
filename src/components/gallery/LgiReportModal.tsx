import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';

interface LgiReportModalProps {
  event: Event;
  photos: EventPhoto[];
  isOpen: boolean;
  onClose: () => void;
}

export const LgiReportModal: React.FC<LgiReportModalProps> = ({
  event,
  photos,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetGoals = event.sdg_goals && event.sdg_goals.length > 0
    ? event.sdg_goals.map((g) => `SDG ${g} (${SDG_METADATA[g]?.name || 'Global Goal'})`).join(', ')
    : 'SDG 3 (Good Health), SDG 5 (Gender Equality), SDG 6 (Clean Water & Sanitation)';

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const eventTime = event.event_time || '10:00 AM – 1:30 PM';
  const refNumber = `NYSC/ED/EGR/SDG/REP/${new Date(event.event_date).getFullYear()}/${event.id.replace('evt-', '').slice(-6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    const memo = `NATIONAL YOUTH SERVICE CORPS (NYSC)
EGOR LOCAL GOVERNMENT AREA SECRETARIAT, BENIN CITY, EDO STATE
SDG COMMUNITY DEVELOPMENT SERVICE (CDS) GROUP

OFFICIAL REPORT TO LOCAL GOVERNMENT INSPECTOR (LGI)
Reference: ${refNumber}
Date: ${formattedDate}

TO: The Local Government Inspector (LGI), NYSC Egor LGA, Edo State.
THROUGH: The CDS Schedule Officer, SDG CDS Group.
FROM: CDS Executive Council, NYSC Egor SDG CDS Group.

SUBJECT: SENSITIZATION & COMMUNITY OUTREACH REPORT: "${event.title.toUpperCase()}"

1. LOGISTICAL OVERVIEW:
- Event Title: ${event.title}
- Date: ${formattedDate}
- Time: ${eventTime}
- Location: ${event.location}
- Target SDGs: ${targetGoals}
- Beneficiaries Reached: ${event.beneficiaries_reached || 'Students, teachers, and local community members'}
- Corps Members Present: ${event.corps_members_present || '35 serving corps members and CDS Executives'}

2. EXECUTIVE BRIEF & OBJECTIVES:
${event.description || 'Successful community sensitization and empowerment drive executed in line with the UN 2030 Sustainable Development Agenda.'}

3. PHOTOS & DOCUMENTARY EVIDENCE:
${photos.length} verified photographic plates captured and archived.

CERTIFICATION:
Augusta / Executive President
NYSC Egor SDG CDS Group
Egor NYSC Secretariat, Benin City, Edo State.`;

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed-none print:static">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-surface-container overflow-hidden my-4 print:m-0 print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* ACTION BAR (Hidden when printing) */}
        <div className="print:hidden sticky top-0 z-10 bg-surface-container-lowest/95 backdrop-blur-md px-6 py-4 border-b border-surface-container flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">description</span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-on-surface">
                Official Sensitization Report for LGI
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Formatted according to statutory NYSC Directorate standards for A4 printout or PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all cursor-pointer shadow-subtle"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied Memo!' : 'Copy Text Memo'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer shadow-card"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Official Report / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              title="Close Report"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
        <div id="lgi-printable-document" className="p-6 sm:p-12 print:p-8 space-y-6 text-on-surface font-serif bg-white">
          
          {/* STATUTORY NYSC OFFICIAL LETTERHEAD */}
          <div className="border-b-2 border-primary pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-4">
              {/* National Emblem / NYSC Insignia Badge */}
              <div className="w-14 h-14 rounded-full bg-[#004b24] text-[#fccc38] flex items-center justify-center font-extrabold text-sm border-2 border-[#fccc38] shadow-sm shrink-0">
                <span>NYSC</span>
              </div>
              <div className="text-center">
                <h1 className="text-lg sm:text-xl font-black text-[#004b24] tracking-tight uppercase font-sans">
                  National Youth Service Corps (NYSC)
                </h1>
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 tracking-wider uppercase font-sans">
                  Egor Local Government Area Secretariat • Benin City, Edo State
                </h2>
                <h3 className="text-xs font-extrabold text-[#fccc38] bg-[#004b24] inline-block px-3 py-0.5 rounded-full mt-1 uppercase tracking-wide font-sans">
                  Sustainable Development Goals (SDG) CDS Group
                </h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-sans pt-1">
              Secretariat Hub: Egor NYSC Secretariat, Benin City • Statutory Meeting: Every Wednesday @ 9:00 AM
            </p>
          </div>

          {/* REFERENCE & ROUTING BLOCK */}
          <div className="grid grid-cols-2 text-xs font-sans border-b border-gray-300 pb-4 gap-2">
            <div>
              <p><strong className="text-gray-900">REF NO:</strong> <span className="font-mono text-[#004b24] font-bold">{refNumber}</span></p>
              <p><strong className="text-gray-900">DATE:</strong> {formattedDate}</p>
              <p><strong className="text-gray-900">CDS BATCH:</strong> 2026/2027 Service Year</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">ROUTING MEMORANDUM</p>
              <p className="text-gray-700">TO: <strong>The Local Government Inspector (LGI)</strong></p>
              <p className="text-gray-700">THROUGH: <strong>The CDS Schedule Officer</strong></p>
              <p className="text-gray-700">FROM: <strong>Executive President / CDS Exco</strong></p>
            </div>
          </div>

          {/* FORMAL SUBJECT LINE */}
          <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-[#004b24] font-sans">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">SUBJECT:</span>
            <h2 className="text-sm sm:text-base font-black text-[#004b24] uppercase tracking-tight">
              CLOSEOUT ACTIVITY & SENSITIZATION REPORT: {event.title}
            </h2>
          </div>

          {/* LOGISTICAL & EVENT PARAMETERS TABLE */}
          <div className="font-sans text-xs space-y-2">
            <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
              1. Event Logistics & Operational Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-300 rounded-lg overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
              <div className="p-3 space-y-2">
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Activity Title:</span>
                  <span className="font-bold text-gray-900 text-xs">{event.title}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Date of Outreach:</span>
                  <span className="font-semibold text-gray-900">{formattedDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Time of Event:</span>
                  <span className="font-bold text-[#004b24] bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">{eventTime}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Location / Venue:</span>
                  <span className="font-semibold text-gray-900">{event.location}</span>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Target Global Goals:</span>
                  <span className="font-bold text-gray-900">{targetGoals}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Direct Beneficiaries Reached:</span>
                  <span className="font-semibold text-gray-900">{event.beneficiaries_reached || 'Students, school management, and local community members'}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Corps Members Deployed:</span>
                  <span className="font-semibold text-gray-900">{event.corps_members_present || '35 serving corps members and CDS executive committee'}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block text-[10px] uppercase">Materials / Kits Distributed:</span>
                  <span className="font-semibold text-gray-900">{event.materials_distributed || 'Information pamphlets, sanitary essentials, and sanitation kits'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NARRATIVE & SENSITIZATION BRIEF */}
          <div className="font-sans space-y-2 text-xs text-gray-800 leading-relaxed">
            <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
              2. Executive Outreach Brief & Community Impact Narrative
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-justify whitespace-pre-line">
              {event.description || `The NYSC Egor SDG Community Development Service (CDS) group conducted a major community sensitization in line with the mandate of the United Nations Sustainable Development Goals. 

During the session, corps members delivered practical educational presentations, held interactive demonstration clinics, and addressed critical community challenges. The outreach recorded enthusiastic reception from community leaders, teachers, and student beneficiaries. All interventions were carried out under voluntary corps labor with strict adherence to NYSC community development service bye-laws.`}
            </div>
          </div>

          {/* PHOTOGRAPHIC EVIDENCE PLATE APPENDIX */}
          {photos.length > 0 && (
            <div className="font-sans space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
                  3. Photographic Evidence & Field Documentation ({photos.length} Captured Plates)
                </h3>
                <span className="text-[10px] text-gray-500 italic">Plate certification verified at Egor LGA</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {photos.slice(0, 6).map((photo, idx) => (
                  <div key={photo.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="aspect-4/3 overflow-hidden bg-gray-100">
                      <img
                        src={photo.image_url}
                        alt={photo.caption || `Plate ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-1.5 bg-gray-50 border-t border-gray-200">
                      <p className="text-[9px] font-bold text-gray-900 line-clamp-1">
                        Plate {idx + 1}: {photo.caption || event.title}
                      </p>
                      <p className="text-[8px] text-gray-500">
                        {event.location} • {formattedDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {photos.length > 6 && (
                <p className="text-[10px] text-gray-500 italic text-center pt-1">
                  (Showing 6 representative documentary plates of {photos.length} total captured photos stored in the official registry archive).
                </p>
              )}
            </div>
          )}

          {/* OFFICIAL STATUTORY ENDORSEMENT & SIGNATURE MATRIX */}
          <div className="font-sans pt-6 border-t-2 border-gray-300 space-y-4">
            <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px] text-center">
              4. Statutory Certification & Administrative Attestations
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              {/* Officer 1: General Secretary */}
              <div className="border border-gray-200 p-3 rounded-lg flex flex-col justify-between h-32">
                <div className="text-[10px] text-gray-500 uppercase font-medium">Prepared By:</div>
                <div className="font-script text-sm font-bold text-gray-700 italic border-b border-gray-300 pb-1">
                  General Secretary
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-[11px]">General Secretary</div>
                  <div className="text-[9px] text-gray-500">SDG CDS Group, Egor</div>
                </div>
              </div>

              {/* Officer 2: President (Augusta) */}
              <div className="border border-gray-200 p-3 rounded-lg flex flex-col justify-between h-32">
                <div className="text-[10px] text-gray-500 uppercase font-medium">Certified By:</div>
                <div className="font-script text-sm font-bold text-[#004b24] italic border-b border-gray-300 pb-1">
                  Augusta (President)
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-[11px]">Augusta</div>
                  <div className="text-[9px] text-gray-500">Executive President, SDG CDS</div>
                </div>
              </div>

              {/* Officer 3: Schedule Officer */}
              <div className="border border-gray-200 p-3 rounded-lg flex flex-col justify-between h-32">
                <div className="text-[10px] text-gray-500 uppercase font-medium">Endorsed By:</div>
                <div className="border-b border-gray-300 pb-1 text-gray-400 text-[10px] italic">
                  [Sign & Date]
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-[11px]">Schedule Officer</div>
                  <div className="text-[9px] text-gray-500">NYSC Egor Secretariat</div>
                </div>
              </div>

              {/* Officer 4: Local Government Inspector (LGI) */}
              <div className="border-2 border-[#004b24] bg-green-50/50 p-3 rounded-lg flex flex-col justify-between h-32">
                <div className="text-[10px] font-bold text-[#004b24] uppercase">Approved & Received:</div>
                <div className="border-b border-dashed border-[#004b24] pb-1 text-gray-400 text-[9px] italic">
                  [Official LGI Stamp & Remarks]
                </div>
                <div>
                  <div className="font-black text-[#004b24] text-[11px]">Local Government Inspector</div>
                  <div className="text-[9px] text-gray-600 font-semibold">NYSC Egor LGA, Edo State</div>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL FOOTER STRIP */}
          <div className="pt-4 border-t border-gray-200 text-center font-sans text-[9px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-1">
            <span>NYSC Egor SDG CDS Civic Archive • Document Registry Verified</span>
            <span>Generated from https://edo-sdg.vercel.app/gallery</span>
          </div>

        </div>

      </div>
    </div>
  );
};
