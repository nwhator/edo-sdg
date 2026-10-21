import React, { useState, useEffect } from 'react';
import type { Event, EventPhoto } from '../../types/database';

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
    : 'Wednesday, 21st October, 2026';

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
SUSTAINABLE DEVELOPMENT GOALS (SDGs) COMMUNITY DEVELOPMENT SERVICE (CDS) GROUP

OFFICIAL ACTIVITY REPORT TO THE LOCAL GOVERNMENT INSPECTOR (LGI)

REF NO: ${refNumber}
TO: The Local Government Inspector (LGI), NYSC Egor LGA, Edo State
THROUGH: The CDS Schedule Officer, NYSC Egor LGA
FROM: The Executive President, SDGs CDS Group, Egor LGA
DATE: ${formattedDate}
TIME: ${eventTime}
VENUE: ${activeEvent.location}
WEEK & QUARTER: ${weekLabel}, ${quarterLabel}
NAME OF CDS GROUP: Sustainable Development Goals (SDGs)
TITLE OF ACTIVITY: ${activeEvent.title}

1. BACKGROUND AND PREAMBLE:
On ${formattedDate}, corps members of the Sustainable Development Goals (SDGs) Community Development Service (CDS) Group in Egor Local Government Area conducted an official grassroots community sensitization exercise at ${activeEvent.location}. The outreach commenced at ${eventTime.split('-')[0].trim()} and concluded at ${eventTime.split('-')[1]?.trim() || '11:00 AM'} as scheduled for ${weekLabel} of the ${quarterLabel}.

2. ACTIVITIES CONDUCTED:
${defaultActivities}

3. SPECIFIC AIMS AND OBJECTIVES:
${aimsList.map((aim, idx) => `(${String.fromCharCode(97 + idx)}) ${aim}`).join('\n')}

4. TARGET BENEFICIARIES:
${activeEvent.beneficiaries_reached || 'Traders (Market Women and Men) and Shoppers at Ogida Market.'}

5. SUSTAINABILITY:
${activeEvent.sustainability || "Yes, because it's a continuous process."}

6. PHOTOGRAPHIC EVIDENCE:
Ten (10) selected field photographs attached (Plates 1 to 10). Complete archive of ${activePhotos.length} photos on file.

7. ATTESTATION & SIGNATURES:
- General Secretary, SDGs CDS Group
- Augusta, Executive President, SDGs CDS Group
- CDS Schedule Officer, NYSC Egor Secretariat
- Local Government Inspector (LGI), NYSC Egor LGA`;

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!activeEvent) {
    return (
      <div className="p-8 text-center text-gray-500">
        No event data available to generate report.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* SCREEN TOOLBAR (Hidden completely on print) */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-gray-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">
            Official Activity Report (LGI Submission)
          </h1>
          <p className="text-xs text-gray-600">
            Simple black-and-white typed memorandum format in paragraphs. Exactly 10 selected photos included.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {events.length > 1 && (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-2 text-gray-800"
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE BLACK AND WHITE DOCUMENT (Written in clear paragraphs, no colored styling) */}
      <div className="bg-white p-8 sm:p-12 print:p-0 border border-gray-300 print:border-none shadow-sm print:shadow-none text-black font-serif leading-relaxed text-sm max-w-4xl mx-auto">
        
        {/* STATUTORY LETTERHEAD (Clean Black & White) */}
        <div className="text-center pb-3 border-b-2 border-black space-y-1">
          <p className="font-bold text-base sm:text-lg uppercase tracking-wide">
            NATIONAL YOUTH SERVICE CORPS (NYSC)
          </p>
          <p className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
            EGOR LOCAL GOVERNMENT AREA SECRETARIAT, BENIN CITY, EDO STATE
          </p>
          <p className="font-bold text-xs uppercase tracking-wider underline">
            SUSTAINABLE DEVELOPMENT GOALS (SDGs) COMMUNITY DEVELOPMENT SERVICE (CDS) GROUP
          </p>
        </div>

        {/* MEMORANDUM ROUTING DETAILS */}
        <div className="pt-4 pb-3 border-b border-black text-xs space-y-1.5">
          <div className="flex justify-between">
            <span><strong>REF NO:</strong> {refNumber}</span>
            <span><strong>DATE:</strong> {formattedDate}</span>
          </div>
          <div><strong>TO:</strong> The Local Government Inspector (LGI), NYSC Egor LGA, Edo State</div>
          <div><strong>THROUGH:</strong> The CDS Schedule Officer, NYSC Egor LGA</div>
          <div><strong>FROM:</strong> The Executive President, SDGs CDS Group, Egor LGA</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
            <div><strong>TIME:</strong> {eventTime}</div>
            <div><strong>VENUE:</strong> {activeEvent.location}</div>
            <div><strong>PERIOD:</strong> {weekLabel}, {quarterLabel}</div>
            <div><strong>CDS GROUP:</strong> Sustainable Development Goals (SDGs)</div>
          </div>
          <div className="pt-2">
            <p className="font-bold uppercase tracking-tight text-xs sm:text-sm">
              SUBJECT: OFFICIAL ACTIVITY REPORT — {activeEvent.title.toUpperCase()}
            </p>
          </div>
        </div>

        {/* BODY IN NUMBERED PARAGRAPHS */}
        <div className="py-4 space-y-4 text-xs sm:text-sm leading-relaxed text-justify">
          
          {/* Paragraph 1: Background */}
          <div>
            <p>
              <strong>1. Background and Preamble:</strong> On {formattedDate}, corps members of the Sustainable Development Goals (SDGs) Community Development Service (CDS) Group in Egor Local Government Area, Edo State, conducted an official community sensitization outreach at {activeEvent.location}. The activity was carried out between {eventTime} as part of the scheduled {weekLabel} activities for the {quarterLabel}. The outreach was aimed at mobilizing community members on foundational education and parental responsibility.
            </p>
          </div>

          {/* Paragraph 2: Activities Conducted */}
          <div>
            <p>
              <strong>2. Activities Conducted:</strong> {defaultActivities}
            </p>
          </div>

          {/* Paragraph 3: Specific Aims and Objectives */}
          <div>
            <p className="mb-1.5">
              <strong>3. Specific Aims and Objectives:</strong> The sensitization exercise was guided by four key objectives:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              {aimsList.map((aim, idx) => (
                <li key={idx} className="pl-1">
                  {aim}
                </li>
              ))}
            </ol>
          </div>

          {/* Paragraph 4: Beneficiaries */}
          <div>
            <p>
              <strong>4. Beneficiaries Reached:</strong> The beneficiaries of this intervention were {activeEvent.beneficiaries_reached || 'Traders (Market Women and Men) and Shoppers at Ogida Market.'} Corps members directly engaged with market women and men across various trading rows and sheds, emphasizing the critical value of education in poverty eradication.
            </p>
          </div>

          {/* Paragraph 5: Sustainability */}
          <div>
            <p>
              <strong>5. Sustainability:</strong> {activeEvent.sustainability || "Yes, because it's a continuous process."} The SDGs CDS group will continue monitoring and follow-up engagements during subsequent CDS service meetings and community outreaches in Egor LGA to ensure sustained parental attention to schooling.
            </p>
          </div>

          {/* Paragraph 6: Photographic Evidence */}
          <div>
            <p>
              <strong>6. Photographic Documentation (Selected 10 Plates):</strong> In compliance with official reporting requirements, ten (10) selected photographic plates documenting field engagements, market stall dialogues, and corps members at {activeEvent.location} are presented below. (The complete archive of {activePhotos.length} photographs is retained in the CDS group digital registry).
            </p>
          </div>

        </div>

        {/* 10 SELECTED PHOTOS GRID (Clean Black & White Borders) */}
        {reportPhotos.length > 0 && (
          <div className="py-2 space-y-2 break-inside-avoid">
            <p className="font-bold text-xs uppercase tracking-wider text-center border-t border-black pt-2">
              Attached Photographic Evidence (Plates 1 to {reportPhotos.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {reportPhotos.map((photo, idx) => (
                <div key={photo.id} className="border border-black p-1 bg-white">
                  <div className="aspect-4/3 overflow-hidden bg-gray-100 border border-gray-300">
                    <img
                      src={photo.image_url}
                      alt={`Plate ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-1 text-center">
                    <p className="text-[10px] font-bold text-black">
                      Plate #{idx + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTESTATION AND SIGNATURES (Black & White 4-Column Layout) */}
        <div className="pt-6 mt-4 border-t-2 border-black space-y-4 break-inside-avoid">
          <p className="font-bold text-xs uppercase tracking-wider text-center">
            7. Official Attestation and Administrative Endorsements
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs pt-2">
            
            {/* General Secretary */}
            <div className="space-y-6">
              <p className="font-semibold text-[10px] uppercase">Prepared By:</p>
              <div className="border-b border-black h-8 flex items-end justify-center pb-0.5 italic">
                General Secretary
              </div>
              <div>
                <p className="font-bold text-[11px]">General Secretary</p>
                <p className="text-[10px] text-gray-700">SDGs CDS Group, Egor</p>
              </div>
            </div>

            {/* President (Augusta) */}
            <div className="space-y-6">
              <p className="font-semibold text-[10px] uppercase">Submitted By:</p>
              <div className="border-b border-black h-8 flex items-end justify-center pb-0.5 italic font-bold">
                Augusta (President)
              </div>
              <div>
                <p className="font-bold text-[11px]">Augusta</p>
                <p className="text-[10px] text-gray-700">Executive President, SDGs CDS</p>
              </div>
            </div>

            {/* Schedule Officer */}
            <div className="space-y-6">
              <p className="font-semibold text-[10px] uppercase">Endorsed By:</p>
              <div className="border-b border-black h-8 flex items-end justify-center pb-0.5 text-gray-400">
                [Signature & Date]
              </div>
              <div>
                <p className="font-bold text-[11px]">CDS Schedule Officer</p>
                <p className="text-[10px] text-gray-700">NYSC Egor LGA Secretariat</p>
              </div>
            </div>

            {/* Local Government Inspector (LGI) */}
            <div className="space-y-6 border border-black p-2">
              <p className="font-bold text-[10px] uppercase">Approved / Received:</p>
              <div className="border-b border-dashed border-black h-8 flex items-end justify-center pb-0.5 text-gray-400 text-[10px]">
                [Official Stamp & Date]
              </div>
              <div>
                <p className="font-bold text-[11px]">Local Government Inspector</p>
                <p className="text-[10px] text-gray-700">NYSC Egor LGA, Edo State</p>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 mt-4 border-t border-gray-400 text-center text-[10px] text-gray-600">
          <p>National Youth Service Corps (NYSC) • Egor Local Government Area, Edo State • Official CDS Activity Document</p>
        </div>

      </div>

    </div>
  );
};
