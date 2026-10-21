import React, { useState, useEffect } from 'react';
import type { Event, EventPhoto } from '../../types/database';
import { SDG_METADATA } from '../../types/database';

interface LgiReportViewProps {
  initialEvents: Event[];
  initialPhotos: EventPhoto[];
}

export const LgiReportView: React.FC<LgiReportViewProps> = ({
  initialEvents,
  initialPhotos,
}) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [photos, setPhotos] = useState<EventPhoto[]>(initialPhotos);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('edo_sdg_custom_events') || '[]');
      const storedPhotos = JSON.parse(localStorage.getItem('edo_sdg_custom_photos') || '[]');

      const mergedEvents = [
        ...storedEvents,
        ...initialEvents.filter((ie) => !storedEvents.some((se: Event) => se.id === ie.id)),
      ];
      const mergedPhotos = [
        ...storedPhotos,
        ...initialPhotos.filter((ip) => !storedPhotos.some((sp: EventPhoto) => sp.id === ip.id)),
      ];

      setEvents(mergedEvents);
      setPhotos(mergedPhotos);

      // Check URL query param
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get('id');

      if (queryId && mergedEvents.some((e) => e.id === queryId)) {
        setSelectedEventId(queryId);
      } else if (mergedEvents.length > 0) {
        setSelectedEventId(mergedEvents[0].id);
      }
    } catch {
      // ignore
    }
  }, [initialEvents, initialPhotos]);

  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const activePhotos = activeEvent
    ? photos.filter((p) => p.event_id === activeEvent.id)
    : [];

  const formattedDate = activeEvent
    ? new Date(activeEvent.event_date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const eventTime = activeEvent?.event_time || '10:00 AM – 1:30 PM';
  const refNumber = activeEvent
    ? `NYSC/ED/EGR/SDG/REP/${new Date(activeEvent.event_date).getFullYear()}/${activeEvent.id.replace('evt-', '').slice(-6).toUpperCase()}`
    : 'NYSC/ED/EGR/SDG/REP/2026/001';

  const targetGoals = activeEvent?.sdg_goals && activeEvent.sdg_goals.length > 0
    ? activeEvent.sdg_goals.map((g) => `SDG ${g} (${SDG_METADATA[g]?.name || 'Global Goal'})`).join(', ')
    : 'SDG 3 (Good Health), SDG 5 (Gender Equality), SDG 6 (Clean Water & Sanitation)';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    if (!activeEvent) return;
    const memo = `NATIONAL YOUTH SERVICE CORPS (NYSC)
EGOR LOCAL GOVERNMENT AREA SECRETARIAT, BENIN CITY, EDO STATE
SDG COMMUNITY DEVELOPMENT SERVICE (CDS) GROUP

OFFICIAL REPORT TO LOCAL GOVERNMENT INSPECTOR (LGI)
Reference: ${refNumber}
Date: ${formattedDate}

TO: The Local Government Inspector (LGI), NYSC Egor LGA, Edo State.
THROUGH: The CDS Schedule Officer, SDG CDS Group.
FROM: CDS Executive Council, NYSC Egor SDG CDS Group.

SUBJECT: SENSITIZATION & COMMUNITY OUTREACH REPORT: "${activeEvent.title.toUpperCase()}"

1. LOGISTICAL OVERVIEW:
- Event Title: ${activeEvent.title}
- Date: ${formattedDate}
- Time: ${eventTime}
- Location: ${activeEvent.location}
- Target SDGs: ${targetGoals}
- Beneficiaries Reached: ${activeEvent.beneficiaries_reached || 'Students, teachers, and local community members'}
- Corps Members Present: ${activeEvent.corps_members_present || '35 serving corps members and CDS Executives'}

2. EXECUTIVE BRIEF & OBJECTIVES:
${activeEvent.description || 'Successful community sensitization and empowerment drive executed in line with the UN 2030 Sustainable Development Agenda.'}

3. PHOTOS & DOCUMENTARY EVIDENCE:
${activePhotos.length} verified photographic plates captured and archived.

CERTIFICATION:
Augusta / Executive President
NYSC Egor SDG CDS Group
Egor NYSC Secretariat, Benin City, Edo State.`;

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!activeEvent) {
    return (
      <div className="p-12 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant space-y-3">
        <span className="material-symbols-outlined text-[48px] text-primary">description</span>
        <h2 className="text-xl font-bold text-on-surface">No Outreach Events Recorded Yet</h2>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
          Upload an outreach event album with photos, brief, and time to generate official LGI reports.
        </p>
        <a
          href="/admin/gallery/new"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm"
        >
          + Upload First Outreach Event
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* SCREEN TOOLBAR (Hidden on print) */}
      <div className="print:hidden bg-surface-container-lowest p-4 sm:p-6 rounded-3xl border border-surface-container shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Statutory NYSC Egor CDS Report Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-on-surface">
            Official Sensitization Report to LGI
          </h1>
          <p className="text-xs text-on-surface-variant">
            Formatted for submission to the Local Government Inspector at Egor NYSC Secretariat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {events.length > 1 && (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-xs font-bold bg-surface-container-low border border-surface-container-high rounded-xl px-3 py-2 text-on-surface focus:outline-none"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.event_date})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleCopyMemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all cursor-pointer shadow-subtle"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer shadow-card"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Report / Save PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE DOCUMENT (Styled for high quality A4 printing) */}
      <div className="bg-white rounded-3xl border border-surface-container shadow-2xl p-6 sm:p-12 print:p-0 print:border-none print:shadow-none print:rounded-none text-gray-900 font-sans space-y-6">
        
        {/* STATUTORY LETTERHEAD */}
        <div className="border-b-2 border-[#004b24] pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#004b24] text-[#fccc38] flex items-center justify-center font-extrabold text-sm border-2 border-[#fccc38] shadow-sm shrink-0">
              <span>NYSC</span>
            </div>
            <div className="text-center">
              <h1 className="text-lg sm:text-xl font-black text-[#004b24] tracking-tight uppercase">
                National Youth Service Corps (NYSC)
              </h1>
              <h2 className="text-xs sm:text-sm font-bold text-gray-800 tracking-wider uppercase">
                Egor Local Government Area Secretariat • Benin City, Edo State
              </h2>
              <h3 className="text-xs font-extrabold text-[#fccc38] bg-[#004b24] inline-block px-3 py-0.5 rounded-full mt-1 uppercase tracking-wide">
                Sustainable Development Goals (SDG) CDS Group
              </h3>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 pt-1">
            Secretariat Hub: Egor NYSC Secretariat, Benin City • Statutory Meeting: Every Wednesday @ 9:00 AM
          </p>
        </div>

        {/* REFERENCE & ROUTING BLOCK */}
        <div className="grid grid-cols-2 text-xs border-b border-gray-300 pb-4 gap-2">
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

        {/* FORMAL SUBJECT */}
        <div className="bg-gray-100 p-3.5 rounded-xl border-l-4 border-[#004b24]">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">SUBJECT:</span>
          <h2 className="text-sm sm:text-base font-black text-[#004b24] uppercase tracking-tight">
            COMMUNITY SENSITIZATION & OUTREACH REPORT: {activeEvent.title}
          </h2>
        </div>

        {/* LOGISTICAL OVERVIEW GRID */}
        <div className="text-xs space-y-2">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
            1. Event Logistics & Operational Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-300 rounded-xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
            <div className="p-3.5 space-y-2">
              <div>
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Outreach Title:</span>
                <span className="font-bold text-gray-900 text-xs">{activeEvent.title}</span>
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
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Venue / Community:</span>
                <span className="font-semibold text-gray-900">{activeEvent.location}</span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Target Global Goals:</span>
                <span className="font-bold text-gray-900">{targetGoals}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Direct Beneficiaries Reached:</span>
                <span className="font-semibold text-gray-900">{activeEvent.beneficiaries_reached || 'Students, school management, and local community members'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Corps Members Deployed:</span>
                <span className="font-semibold text-gray-900">{activeEvent.corps_members_present || '35 serving corps members and CDS executive council'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block text-[10px] uppercase">Materials / Kits Distributed:</span>
                <span className="font-semibold text-gray-900">{activeEvent.materials_distributed || 'Information pamphlets, sanitary essentials, and clean hygiene kits'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NARRATIVE BRIEF */}
        <div className="space-y-2 text-xs text-gray-800 leading-relaxed">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
            2. Executive Outreach Brief & Community Impact Narrative
          </h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-justify whitespace-pre-line">
            {activeEvent.description || `The NYSC Egor SDG Community Development Service (CDS) group conducted a major community sensitization in line with the mandate of the United Nations Sustainable Development Goals. 

During the session, corps members delivered practical educational presentations, held interactive demonstration clinics, and addressed critical community challenges. The outreach recorded enthusiastic reception from community leaders, teachers, and student beneficiaries. All interventions were carried out under voluntary corps labor with strict adherence to NYSC community development service bye-laws.`}
          </div>
        </div>

        {/* PHOTOGRAPHIC APPENDIX */}
        {activePhotos.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
                3. Photographic Evidence & Field Documentation ({activePhotos.length} Plates)
              </h3>
              <span className="text-[10px] text-gray-500 italic">Plate certification verified at Egor LGA</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activePhotos.slice(0, 6).map((photo, idx) => (
                <div key={photo.id} className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || `Plate ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-gray-900 line-clamp-1">
                      Plate {idx + 1}: {photo.caption || activeEvent.title}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      {activeEvent.location} • {formattedDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {activePhotos.length > 6 && (
              <p className="text-[10px] text-gray-500 italic text-center pt-1">
                (Showing 6 representative documentary plates of {activePhotos.length} total captured photos stored in the official registry archive).
              </p>
            )}
          </div>
        )}

        {/* STATUTORY ATTESTATION & SIGNATURE MATRIX */}
        <div className="pt-6 border-t-2 border-gray-300 space-y-4">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px] text-center">
            4. Statutory Certification & Administrative Attestations
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            {/* Officer 1 */}
            <div className="border border-gray-200 p-3 rounded-xl flex flex-col justify-between h-32">
              <div className="text-[10px] text-gray-500 uppercase font-medium">Prepared By:</div>
              <div className="font-script text-sm font-bold text-gray-700 italic border-b border-gray-300 pb-1">
                General Secretary
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[11px]">General Secretary</div>
                <div className="text-[9px] text-gray-500">SDG CDS Group, Egor</div>
              </div>
            </div>

            {/* Officer 2 */}
            <div className="border border-gray-200 p-3 rounded-xl flex flex-col justify-between h-32">
              <div className="text-[10px] text-gray-500 uppercase font-medium">Certified By:</div>
              <div className="font-script text-sm font-bold text-[#004b24] italic border-b border-gray-300 pb-1">
                Augusta (President)
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[11px]">Augusta</div>
                <div className="text-[9px] text-gray-500">Executive President, SDG CDS</div>
              </div>
            </div>

            {/* Officer 3 */}
            <div className="border border-gray-200 p-3 rounded-xl flex flex-col justify-between h-32">
              <div className="text-[10px] text-gray-500 uppercase font-medium">Endorsed By:</div>
              <div className="border-b border-gray-300 pb-1 text-gray-400 text-[10px] italic">
                [Sign & Date]
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[11px]">Schedule Officer</div>
                <div className="text-[9px] text-gray-500">NYSC Egor Secretariat</div>
              </div>
            </div>

            {/* Officer 4 */}
            <div className="border-2 border-[#004b24] bg-green-50/50 p-3 rounded-xl flex flex-col justify-between h-32">
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

        {/* FOOTER */}
        <div className="pt-4 border-t border-gray-200 text-center text-[9px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>NYSC Egor SDG CDS Civic Archive • Document Registry Verified</span>
          <span>Generated from https://edo-sdg.vercel.app/gallery/report</span>
        </div>

      </div>

    </div>
  );
};
