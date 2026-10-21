import React, { useState } from 'react';
import type { Event, EventPhoto } from '../../types/database';

interface LgiReportViewProps {
  initialEvents: Event[];
  initialPhotos: EventPhoto[];
}

export const LgiReportView: React.FC<LgiReportViewProps> = ({
  initialEvents,
  initialPhotos,
}) => {
  const [copied, setCopied] = useState(false);

  // Strictly Ogida Market Sensitization only
  const activeEvent = initialEvents.find((e) => e.id === 'evt-ogida-education-sensitization') || initialEvents[0];
  const activePhotos = initialPhotos.filter(
    (p) => p.event_id === activeEvent?.id || p.event_id === 'evt-ogida-education-sensitization'
  );

  // Exactly 10 max pictures for the printable/downloadable report
  const reportPhotos = activePhotos.slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    const memo = `Sustainable Development Goals, SDGs Community Development Service Group
Egor LGA Edo State - Quality Education Sensitization at Ogida Market.

TITLE OF THE ACTIVITY:
Sensitization on the Importance of Quality Education (SDG 4) and Parental Involvement at Ogida Market, Benin City.

NAME OF THE CDS GROUP: Sustainable Development Goals, SDGs
COMMUNITY: Benin City
L.G.A: Egor LGA
STATE: Edo
WEEK: 3
QUARTER: 4th
DATE: Wednesday, 21st October, 2026.
TIME: 9:00 AM - 11:00 AM
VENUE: Ogida Market, Benin City
CONTACT: Nil

ACTIVITIES:
To sensitize market women and men on Sustainable Development Goal 4 (Quality Education), featuring one-on-one and group engagements across market stalls on the foundational value of education. The outreach focused on dismantling the popular misconception that "education is a scam," emphasizing the critical role of active parenting in academic success, and guiding parents and guardians on how to closely monitor their children's schoolwork, daily assignments, and overall educational growth.

AIM:
* To create awareness among market women and men about Sustainable Development Goal 4 (Quality Education) and its vital role in community development and poverty eradication.
* To debunk the widespread narrative that "education is a scam" by highlighting how formal education equips children with critical thinking, literacy, and lifelong opportunities alongside vocational and entrepreneurial skills.
* To encourage parents and guardians to pay closer attention to their children's academic lives by regularly checking their school notebooks, assisting with or supervising daily assignments, and communicating with their teachers.
* To educate traders on the importance of balancing household or market chores with study time, ensuring children are given a conducive environment and adequate time to focus on their studies after school hours.

BENEFICIARIES:
Traders (Market Women and Men) and Shoppers at Ogida Market.

SUSTAINABILITY:
Yes, because it's a continuous process.`;

    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* SCREEN TOOLBAR (Hidden completely on print) */}
      <div className="print:hidden bg-white p-4 sm:p-5 rounded-2xl border border-gray-300 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">
            LGI Sensitization Report • Ogida Market
          </h1>
          <p className="text-xs text-gray-600">
            Simple black-and-white typed format in paragraphs. Exactly 10 selected photos included.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* PRINTABLE BLACK AND WHITE REPORT IN PARAGRAPHS */}
      <div className="bg-white p-8 sm:p-12 print:p-0 border border-gray-300 print:border-none shadow-sm print:shadow-none text-black font-serif leading-relaxed text-sm max-w-4xl mx-auto space-y-4">
        
        {/* HEADER */}
        <div className="border-b border-black pb-3 space-y-0.5">
          <p className="font-bold text-base sm:text-lg uppercase">
            Sustainable Development Goals, SDGs Community Development Service Group
          </p>
          <p className="font-semibold text-xs sm:text-sm">
            Egor LGA Edo State - Quality Education Sensitization at Ogida Market.
          </p>
        </div>

        {/* METADATA FIELDS */}
        <div className="text-xs sm:text-sm space-y-1.5 pt-1">
          <p>
            <strong>TITLE OF THE ACTIVITY:</strong> Sensitization on the Importance of Quality Education (SDG 4) and Parental Involvement at Ogida Market, Benin City.
          </p>
          <p>
            <strong>NAME OF THE CDS GROUP:</strong> Sustainable Development Goals, SDGs
          </p>
          <p>
            <strong>COMMUNITY:</strong> Benin City
          </p>
          <p>
            <strong>L.G.A:</strong> Egor LGA
          </p>
          <p>
            <strong>STATE:</strong> Edo
          </p>
          <p>
            <strong>WEEK:</strong> 3
          </p>
          <p>
            <strong>QUARTER:</strong> 4th
          </p>
          <p>
            <strong>DATE:</strong> Wednesday, 21st October, 2026.
          </p>
          <p>
            <strong>TIME:</strong> 9:00 AM - 11:00 AM
          </p>
          <p>
            <strong>VENUE:</strong> Ogida Market, Benin City
          </p>
          <p>
            <strong>CONTACT:</strong> Nil
          </p>
        </div>

        {/* ACTIVITIES PARAGRAPH */}
        <div className="space-y-1 pt-2">
          <p className="font-bold uppercase text-xs">ACTIVITIES:</p>
          <p className="text-justify leading-relaxed">
            To sensitize market women and men on Sustainable Development Goal 4 (Quality Education), featuring one-on-one and group engagements across market stalls on the foundational value of education. The outreach focused on dismantling the popular misconception that "education is a scam," emphasizing the critical role of active parenting in academic success, and guiding parents and guardians on how to closely monitor their children's schoolwork, daily assignments, and overall educational growth.
          </p>
        </div>

        {/* AIM IN BULLETS */}
        <div className="space-y-1 pt-2">
          <p className="font-bold uppercase text-xs">AIM:</p>
          <ul className="list-disc pl-6 space-y-1.5 leading-relaxed text-justify">
            <li>
              To create awareness among market women and men about Sustainable Development Goal 4 (Quality Education) and its vital role in community development and poverty eradication.
            </li>
            <li>
              To debunk the widespread narrative that "education is a scam" by highlighting how formal education equips children with critical thinking, literacy, and lifelong opportunities alongside vocational and entrepreneurial skills.
            </li>
            <li>
              To encourage parents and guardians to pay closer attention to their children's academic lives by regularly checking their school notebooks, assisting with or supervising daily assignments, and communicating with their teachers.
            </li>
            <li>
              To educate traders on the importance of balancing household or market chores with study time, ensuring children are given a conducive environment and adequate time to focus on their studies after school hours.
            </li>
          </ul>
        </div>

        {/* BENEFICIARIES */}
        <div className="space-y-1 pt-2">
          <p className="font-bold uppercase text-xs">BENEFICIARIES:</p>
          <p className="leading-relaxed">
            Traders (Market Women and Men) and Shoppers at Ogida Market.
          </p>
        </div>

        {/* SUSTAINABILITY */}
        <div className="space-y-1 pt-2">
          <p className="font-bold uppercase text-xs">SUSTAINABILITY:</p>
          <p className="leading-relaxed">
            Yes, because it's a continuous process.
          </p>
        </div>

        {/* ATTACHED 10 PICTURES FOR THE REPORT PDF */}
        {reportPhotos.length > 0 && (
          <div className="pt-4 space-y-2 border-t border-black break-inside-avoid">
            <p className="font-bold text-xs uppercase tracking-wider text-center">
              Photographic Plates (10 Selected Photos for Report Printout)
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

      </div>

    </div>
  );
};
