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

  // Pick up to 10 photos for the report
  const reportPhotos = activePhotos.slice(0, 10);

  const formattedDate = activeEvent
    ? new Date(activeEvent.event_date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const eventTime = activeEvent?.event_time || '9:00 AM - 11:00 AM';
  const weekLabel = activeEvent?.week || 'Week 3';
  const quarterLabel = activeEvent?.quarter || '4th Quarter';
  const refNumber = activeEvent
    ? `NYSC/ED/EGR/SDG/REP/${new Date(activeEvent.event_date).getFullYear()}/${activeEvent.id.replace('evt-', '').slice(-8).toUpperCase()}`
    : 'NYSC/ED/EGR/SDG/REP/2026/001';

  const defaultAims = [
    'To create awareness among market women and men about Sustainable Development Goal 4 (Quality Education) and its vital role in community development and poverty eradication.',
    'To debunk the widespread narrative that "education is a scam" by highlighting how formal education equips children with critical thinking, literacy, and lifelong opportunities alongside vocational and entrepreneurial skills.',
    'To encourage parents and guardians to pay closer attention to their children\'s academic lives by regularly checking their school notebooks, assisting with or supervising daily assignments, and communicating with their teachers.',
    'To educate traders on the importance of balancing household or market chores with study time, ensuring children are given a conducive environment and adequate time to focus on their studies after school hours.',
  ];

  const aimsList = activeEvent?.aims && activeEvent.aims.length > 0 ? activeEvent.aims : defaultAims;

  const defaultActivities = activeEvent?.activities || activeEvent?.description || `To sensitize market women and men on Sustainable Development Goal 4 (Quality Education), featuring one-on-one and group engagements across market stalls on the foundational value of education. The outreach focused on dismantling the popular misconception that "education is a scam," emphasizing the critical role of active parenting in academic success, and guiding parents and guardians on how to closely monitor their children's schoolwork, daily assignments, and overall educational growth.`;

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

NAME OF THE CDS GROUP: Sustainable Development Goals (SDGs)
TITLE OF THE ACTIVITY: ${activeEvent.title}
COMMUNITY: Benin City
L.G.A: Egor LGA
STATE: Edo State
WEEK: ${weekLabel}
QUARTER: ${quarterLabel}
DATE: ${formattedDate}
TIME: ${eventTime}
VENUE: ${activeEvent.location}
CONTACT: Nil

ACTIVITIES:
${defaultActivities}

AIMS:
${aimsList.map((a, i) => `${i + 1}. ${a}`).join('\n')}

BENEFICIARIES:
${activeEvent.beneficiaries_reached || 'Traders (Market Women and Men) and Shoppers at Ogida Market.'}

SUSTAINABILITY:
${activeEvent.sustainability || "Yes, because it's a continuous process."}

PHOTOGRAPHIC EVIDENCE:
${reportPhotos.length} certified photographic plates attached (of ${activePhotos.length} total captured plates in web archive).

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
            Formatted for submission to the Local Government Inspector at Egor NYSC Secretariat. Showing max 10 photos in print/PDF ({activePhotos.length} total in gallery).
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
            <span>{copied ? 'Copied Memo!' : 'Copy Text Memo'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer shadow-card"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Report / Download PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE DOCUMENT */}
      <div className="bg-white rounded-3xl border border-surface-container shadow-2xl p-6 sm:p-12 print:p-0 print:border-none print:shadow-none print:rounded-none text-gray-900 font-sans space-y-5 text-xs">
        
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
            Secretariat Hub: Egor NYSC Secretariat, Benin City • Meeting Day: Every Wednesday @ 9:00 AM
          </p>
        </div>

        {/* REFERENCE & ROUTING BLOCK */}
        <div className="grid grid-cols-2 text-xs border-b border-gray-300 pb-3 gap-2">
          <div>
            <p><strong className="text-gray-900">REF NO:</strong> <span className="font-mono text-[#004b24] font-bold">{refNumber}</span></p>
            <p><strong className="text-gray-900">DATE:</strong> {formattedDate}</p>
            <p><strong className="text-gray-900">SERVICE YEAR:</strong> 2026/2027</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">ROUTING MEMORANDUM</p>
            <p className="text-gray-700">TO: <strong>The Local Government Inspector (LGI)</strong></p>
            <p className="text-gray-700">THROUGH: <strong>The CDS Schedule Officer</strong></p>
            <p className="text-gray-700">FROM: <strong>Executive President / CDS Exco</strong></p>
          </div>
        </div>

        {/* OFFICIAL TITLE */}
        <div className="bg-gray-100 p-3.5 rounded-xl border-l-4 border-[#004b24]">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            OFFICIAL ACTIVITY / SENSITIZATION REPORT
          </span>
          <h2 className="text-sm sm:text-base font-black text-[#004b24] uppercase tracking-tight">
            {activeEvent.title}
          </h2>
        </div>

        {/* STATUTORY PARAMETERS */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
            1. Statutory Overview & Logistical Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-gray-300 rounded-xl p-3 bg-gray-50/50">
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">CDS Group:</span>
              <span className="font-bold text-gray-900">Sustainable Development Goals (SDGs)</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">Community:</span>
              <span className="font-bold text-gray-900">Benin City</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">L.G.A:</span>
              <span className="font-bold text-gray-900">Egor LGA</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">State:</span>
              <span className="font-bold text-gray-900">Edo State</span>
            </div>

            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">Week & Quarter:</span>
              <span className="font-bold text-[#004b24]">{weekLabel}, {quarterLabel}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">Date of Outreach:</span>
              <span className="font-bold text-gray-900">{formattedDate}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">Time of Event:</span>
              <span className="font-bold text-[#004b24] bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block">{eventTime}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold block text-[10px] uppercase">Venue:</span>
              <span className="font-bold text-gray-900">{activeEvent.location}</span>
            </div>
          </div>
        </div>

        {/* ACTIVITIES */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
            2. Activities Executed
          </h3>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-justify leading-relaxed">
            {defaultActivities}
          </div>
        </div>

        {/* AIMS AND OBJECTIVES */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
            3. Aims and Objectives of the Sensitization
          </h3>
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            {aimsList.map((aim, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-[#004b24] text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-gray-800 text-xs text-justify">{aim}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BENEFICIARIES & SUSTAINABILITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span className="font-bold text-[#004b24] uppercase tracking-wider text-[10px] block">
              Beneficiaries:
            </span>
            <p className="font-semibold text-gray-900 text-xs">
              {activeEvent.beneficiaries_reached || 'Traders (Market Women and Men) and Shoppers at Ogida Market.'}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
            <span className="font-bold text-[#004b24] uppercase tracking-wider text-[10px] block">
              Sustainability:
            </span>
            <p className="font-semibold text-gray-900 text-xs">
              {activeEvent.sustainability || "Yes, because it's a continuous process."}
            </p>
          </div>
        </div>

        {/* PHOTOGRAPHIC EVIDENCE: MAX 10 PICTURES FOR REPORT */}
        {reportPhotos.length > 0 && (
          <div className="space-y-2 pt-2 break-before-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-1">
              <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px]">
                4. Photographic Evidence & Field Documentation (Official Plates 1 to {reportPhotos.length})
              </h3>
              <span className="text-[10px] text-gray-500 italic">
                Max 10 certified plates selected for printout ({activePhotos.length} total captured plates in web archive)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {reportPhotos.map((photo, idx) => (
                <div key={photo.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                  <div className="aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={photo.image_url}
                      alt={`Plate ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1 bg-gray-50 border-t border-gray-200">
                    <p className="text-[9px] font-bold text-gray-900 truncate">
                      Plate #{idx + 1}
                    </p>
                    <p className="text-[8px] text-gray-500 truncate">
                      Ogida Market • 21 Oct 2026
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATUTORY SIGNATURE MATRIX */}
        <div className="pt-4 border-t-2 border-gray-300 space-y-3">
          <h3 className="font-bold text-[#004b24] uppercase tracking-wider text-[11px] text-center">
            5. Statutory Certification & Administrative Attestations
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            {/* General Secretary */}
            <div className="border border-gray-200 p-2.5 rounded-xl flex flex-col justify-between h-28">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">Prepared By:</div>
              <div className="font-script text-xs font-bold text-gray-700 italic border-b border-gray-300 pb-0.5">
                General Secretary
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[10px]">General Secretary</div>
                <div className="text-[8px] text-gray-500">SDG CDS Group, Egor</div>
              </div>
            </div>

            {/* President (Augusta) */}
            <div className="border border-gray-200 p-2.5 rounded-xl flex flex-col justify-between h-28">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">Certified By:</div>
              <div className="font-script text-xs font-bold text-[#004b24] italic border-b border-gray-300 pb-0.5">
                Augusta (President)
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[10px]">Augusta</div>
                <div className="text-[8px] text-gray-500">Executive President, SDG CDS</div>
              </div>
            </div>

            {/* Schedule Officer */}
            <div className="border border-gray-200 p-2.5 rounded-xl flex flex-col justify-between h-28">
              <div className="text-[9px] text-gray-500 uppercase font-semibold">Endorsed By:</div>
              <div className="border-b border-gray-300 pb-0.5 text-gray-400 text-[9px] italic">
                [Sign & Date]
              </div>
              <div>
                <div className="font-bold text-gray-900 text-[10px]">Schedule Officer</div>
                <div className="text-[8px] text-gray-500">NYSC Egor Secretariat</div>
              </div>
            </div>

            {/* Local Government Inspector (LGI) */}
            <div className="border-2 border-[#004b24] bg-green-50/50 p-2.5 rounded-xl flex flex-col justify-between h-28">
              <div className="text-[9px] font-bold text-[#004b24] uppercase">Approved & Received:</div>
              <div className="border-b border-dashed border-[#004b24] pb-0.5 text-gray-400 text-[8px] italic">
                [Official LGI Stamp & Remarks]
              </div>
              <div>
                <div className="font-black text-[#004b24] text-[10px]">Local Government Inspector</div>
                <div className="text-[8px] text-gray-600 font-semibold">NYSC Egor LGA, Edo State</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-gray-200 text-center text-[9px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>NYSC Egor SDG CDS Civic Archive • Document Registry Verified</span>
          <span>Generated from https://edo-sdg.vercel.app/gallery/report</span>
        </div>

      </div>

    </div>
  );
};
