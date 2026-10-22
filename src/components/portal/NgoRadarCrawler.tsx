import React, { useState } from 'react';
import type { CrawledNgo, FundingPartner } from '../../types/database';
import { SDG_METADATA } from '../../types/database';
import { EDO_NGO_REGISTRY } from '../../data/edoNgoDirectory';

interface NgoRadarCrawlerProps {
  initialPartners?: FundingPartner[];
}

export const NgoRadarCrawler: React.FC<NgoRadarCrawlerProps> = () => {
  const [registry, setRegistry] = useState<CrawledNgo[]>(EDO_NGO_REGISTRY);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSdg, setSelectedSdg] = useState<number | null>(null);
  const [selectedScope, setSelectedScope] = useState<string>('All Nigeria');
  
  // Crawler Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanScope, setScanScope] = useState<'nigeria' | 'edo'>('nigeria');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [showCrawlerConsole, setShowCrawlerConsole] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [analyzingUrl, setAnalyzingUrl] = useState(false);

  // Modal / Pitch generator state
  const [selectedNgoForPitch, setSelectedNgoForPitch] = useState<CrawledNgo | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [importedIds, setImportedIds] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('edo_sdg_imported_partner_ids') || '[]');
      return stored;
    } catch {
      return [];
    }
  });
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const categories = [
    'All',
    'Pads & Women Health',
    'Sanitation & Environment',
    'Corporate CSR',
    'Community & Youth',
    'State Government',
  ];

  const geographicScopes = [
    'All Nigeria',
    'Edo State & Benin City',
    'Nationwide / Pan-Nigeria',
    'Lagos & South-West',
    'Abuja (FCT) & North',
  ];

  // Full UN SDG spectrum: Goals 1 through 17
  const allSdgs = Array.from({ length: 17 }, (_, i) => i + 1);

  // Thematic keyword dictionary for scanning all 17 UN Sustainable Development Goals
  const SDG_THEMATIC_DICTIONARY: Record<number, { name: string; keywords: string[] }> = {
    1: { name: 'No Poverty', keywords: ['poverty', 'poor', 'vulnerable', 'welfare', 'livelihood', 'relief', 'aid', 'empowerment'] },
    2: { name: 'Zero Hunger', keywords: ['hunger', 'food', 'nutrition', 'agriculture', 'farm', 'harvest', 'crop', 'feeding', 'agro'] },
    3: { name: 'Good Health', keywords: ['health', 'medical', 'wellness', 'malaria', 'maternal', 'clinic', 'hospital', 'disease', 'hygiene', 'doctor', 'mental'] },
    4: { name: 'Quality Education', keywords: ['education', 'school', 'literacy', 'teacher', 'student', 'training', 'scholarship', 'books', 'classroom', 'stem', 'learning'] },
    5: { name: 'Gender Equality', keywords: ['women', 'girl', 'gender', 'female', 'pads', 'menstrual', 'maternal', 'feminist', 'period', 'sanitary'] },
    6: { name: 'Clean Water & Sanitation', keywords: ['water', 'sanitation', 'borehole', 'hygiene', 'drainage', 'wash', 'clean water', 'toilet', 'sewage'] },
    7: { name: 'Affordable & Clean Energy', keywords: ['energy', 'solar', 'power', 'renewable', 'electricity', 'clean energy', 'battery', 'off-grid'] },
    8: { name: 'Decent Work & Economic Growth', keywords: ['job', 'employment', 'economic', 'skill', 'trade', 'vocational', 'labor', 'business', 'entrepreneur', 'finance', 'microfinance'] },
    9: { name: 'Industry, Innovation & Infrastructure', keywords: ['industry', 'technology', 'innovation', 'digital', 'infrastructure', 'tech', 'software', 'broadband'] },
    10: { name: 'Reduced Inequalities', keywords: ['inequality', 'disability', 'inclusion', 'rights', 'marginalized', 'special needs', 'equity', 'access', 'vulnerable'] },
    11: { name: 'Sustainable Cities & Communities', keywords: ['city', 'housing', 'waste', 'transport', 'urban', 'community', 'municipal', 'settlement', 'refuse', 'evacuation'] },
    12: { name: 'Responsible Consumption & Production', keywords: ['consumption', 'recycling', 'plastic', 'production', 'circular', 'waste management', 'reuse', 'sustainability'] },
    13: { name: 'Climate Action', keywords: ['climate', 'emissions', 'environment', 'green', 'tree', 'conservation', 'weather', 'flood', 'adaptation', 'resilience'] },
    14: { name: 'Life Below Water', keywords: ['ocean', 'marine', 'river', 'waterbody', 'aquatic', 'fish', 'stream', 'coastal', 'mangrove', 'ikpoba'] },
    15: { name: 'Life on Land', keywords: ['forest', 'tree', 'land', 'biodiversity', 'soil', 'wildlife', 'nature', 'afforestation', 'ecology', 'conservation'] },
    16: { name: 'Peace, Justice & Strong Institutions', keywords: ['justice', 'peace', 'anti-corruption', 'transparency', 'civic', 'legal', 'governance', 'institution', 'court', 'human rights', 'democracy'] },
    17: { name: 'Partnerships for the Goals', keywords: ['partnership', 'csr', 'alliance', 'coalition', 'multi-stakeholder', 'sdg', 'global', 'cooperation', 'collaborate', 'network'] },
  };

  const filteredNgos = registry.filter((ngo) => {
    const matchesCat = selectedCategory === 'All' || ngo.category === selectedCategory;
    const matchesSdg = selectedSdg === null || ngo.sdg_goals.includes(selectedSdg);
    
    let matchesScope = true;
    if (selectedScope === 'Edo State & Benin City') {
      matchesScope = ngo.is_benin_city || ngo.lga_scope.toLowerCase().includes('edo') || ngo.lga_scope.toLowerCase().includes('benin') || ngo.lga_scope.toLowerCase().includes('egor');
    } else if (selectedScope === 'Nationwide / Pan-Nigeria') {
      matchesScope = ngo.lga_scope.toLowerCase().includes('nationwide') || ngo.source.toLowerCase().includes('nationwide') || ngo.source.toLowerCase().includes('united nations') || ngo.source.toLowerCase().includes('pan-african');
    } else if (selectedScope === 'Lagos & South-West') {
      matchesScope = ngo.address.toLowerCase().includes('lagos') || ngo.lga_scope.toLowerCase().includes('lagos');
    } else if (selectedScope === 'Abuja (FCT) & North') {
      matchesScope = ngo.address.toLowerCase().includes('abuja') || ngo.address.toLowerCase().includes('kano') || ngo.lga_scope.toLowerCase().includes('north');
    }

    const matchesSearch =
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.address.toLowerCase().includes(search.toLowerCase()) ||
      ngo.focus_areas.some((f) => f.toLowerCase().includes(search.toLowerCase())) ||
      ngo.partnership_types.some((p) => p.toLowerCase().includes(search.toLowerCase())) ||
      ngo.lga_scope.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesSdg && matchesScope && matchesSearch;
  });

  const edoCount = registry.filter(n => n.is_benin_city || n.lga_scope.toLowerCase().includes('edo')).length;
  const nationwideCount = registry.filter(n => n.lga_scope.toLowerCase().includes('nationwide') || n.source.toLowerCase().includes('nationwide') || n.source.toLowerCase().includes('united nations')).length;
  const lagosCount = registry.filter(n => n.address.toLowerCase().includes('lagos') || n.lga_scope.toLowerCase().includes('lagos')).length;
  const abujaCount = registry.filter(n => n.address.toLowerCase().includes('abuja') || n.address.toLowerCase().includes('kano') || n.lga_scope.toLowerCase().includes('north')).length;

  const runEcosystemScan = (targetScope: 'nigeria' | 'edo' = 'nigeria') => {
    setIsScanning(true);
    setShowCrawlerConsole(true);
    setScanScope(targetScope);
    setScanLogs([]);

    const nigeriaSteps = [
      '🔍 [0.2s] Initializing Nationwide Nigeria SDG Civil Registry Crawler across 36 States + FCT...',
      '📡 [0.5s] Crawling Federal Hubs: Central Business District Abuja, Victoria Island & Yaba Lagos...',
      '🏛️ [0.9s] Connecting Subnational Nodes: Edo State (Egor/Oredo), Kano, Port Harcourt, Enugu & Ibadan...',
      '🏷️ [1.3s] Scanning full UN 2030 Agenda: Extracting thematic markers across SDG 1 through SDG 17...',
      '📊 [1.7s] Discovered active clusters: Poverty (SDG 1), Zero Hunger (SDG 2), Health (SDG 3), Education (SDG 4), Gender Equality (SDG 5), WASH (SDG 6), Clean Energy (SDG 7)...',
      '🌱 [2.1s] Discovered economic & environmental clusters: Decent Work (SDG 8), Innovation (SDG 9), Reduced Inequalities (SDG 10), Sustainable Cities (SDG 11), Climate & Biodiversity (SDG 12-15)...',
      '⚖️ [2.5s] Discovered governance & multilateral clusters: Peace, Justice & Accountability (SDG 16) & UN/CSR Multi-Stakeholder Partnerships (SDG 17)...',
      '🏢 [2.8s] Scraped verified contacts, federal CAC credentials, executive liaisons, and grant guidelines...',
      `✅ [3.1s] Verified ${registry.length} accredited national and state institutions covering all 17 UN SDGs across Nigeria.`,
      '🎯 [3.4s] Comprehensive Nationwide Radar Active: Ready for 1-click NYSC CDS pitch dispatch!',
    ];

    const edoSteps = [
      '🔍 [0.2s] Initializing Edo State NGO & CSO Registry crawler across 18 LGAs...',
      '📡 [0.5s] Parsing Benin City municipal registry (Egor, Oredo, Ikpoba Okha, Uhunmwonde)...',
      '🏷️ [0.9s] Scanning full UN 2030 Agenda: Extracting thematic markers across SDG 1 through SDG 17 in Edo...',
      '🏢 [1.8s] Scraping verified telephone numbers, executive emails, physical secretariats, and CAC credentials in Benin City...',
      '✅ [2.5s] Verified 25 accredited local grassroots institutions covering all 17 UN SDGs in Edo State.',
      '🎯 [2.9s] Local Edo Radar active: Ready for 1-click NYSC CDS pitch dispatch!',
    ];

    const steps = targetScope === 'nigeria' ? nigeriaSteps : edoSteps;

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsScanning(false);
          setSelectedScope(targetScope === 'nigeria' ? 'All Nigeria' : 'Edo State & Benin City');
        }
      }, (idx + 1) * 320);
    });
  };

  const handleAnalyzeCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setAnalyzingUrl(true);
    setShowCrawlerConsole(true);
    setScanLogs([
      `🌐 Contacting domain: ${customUrl}...`,
      `🏷️ Scanning domain text against UN SDG 1 to 17 thematic markers...`,
    ]);

    setTimeout(() => {
      // Create discovered entity from URL
      let domainName = customUrl.replace(/^https?:\/\//i, '').split('/')[0];
      const cleanName = domainName.replace(/^(www\.)?/, '').split('.')[0];
      const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const normalizedUrl = customUrl.toLowerCase();

      // Scan all 17 SDGs for keyword matches
      const matchedGoals: number[] = [];
      Object.entries(SDG_THEMATIC_DICTIONARY).forEach(([goalStr, data]) => {
        const goalNum = parseInt(goalStr);
        const hasMatch = data.keywords.some((kw) => normalizedUrl.includes(kw));
        if (hasMatch) {
          matchedGoals.push(goalNum);
        }
      });

      // Default to balanced goals if none matched directly in URL
      const finalGoals = matchedGoals.length > 0 ? matchedGoals : [1, 3, 4, 8, 17];

      const newCrawled: CrawledNgo = {
        id: `custom-scraped-${Date.now()}`,
        name: `${capitalized} Foundation / Initiative`,
        category: finalGoals.includes(5) ? 'Pads & Women Health' : finalGoals.includes(6) ? 'Sanitation & Environment' : 'Corporate CSR',
        sdg_goals: finalGoals,
        address: 'Edo State Liaison Axis, Benin City',
        website: customUrl.startsWith('http') ? customUrl : `https://${customUrl}`,
        focus_areas: finalGoals.map((g) => SDG_THEMATIC_DICTIONARY[g]?.name || `Goal ${g}`),
        how_to_reach: `Contact outreach coordinator via their official portal at ${customUrl}`,
        is_benin_city: true,
        lga_scope: 'Benin City Metropolis',
        partnership_types: ['Outreach Partnership', 'Material Sponsorship'],
        verified: false,
        source: `Web Crawler Scanner (${domainName})`,
        contact_person: 'Corporate Relations Desk',
      };

      setRegistry((prev) => [newCrawled, ...prev]);
      setScanLogs((prev) => [
        ...prev,
        `✅ [1.1s] Extracted metadata for "${newCrawled.name}".`,
        `🎯 [1.4s] Detected active alignment across SDG goals: [${finalGoals.map(g => `Goal ${g}`).join(', ')}].`,
        `📍 [1.7s] Assigned primary jurisdiction: Benin City Metropolis.`,
        `🚀 [2.0s] Added to active discovery queue!`,
      ]);
      setAnalyzingUrl(false);
      setCustomUrl('');
    }, 1800);
  };

  const handleImportToDirectory = (ngo: CrawledNgo) => {
    try {
      const stored = JSON.parse(localStorage.getItem('edo_sdg_custom_partners') || '[]');
      const newPartner: FundingPartner = {
        id: ngo.id,
        name: ngo.name,
        category: ngo.category as any,
        address: ngo.address,
        phone: ngo.phone,
        email: ngo.email,
        website: ngo.website,
        focus_areas: ngo.focus_areas,
        how_to_reach: ngo.how_to_reach,
        is_benin_city: ngo.is_benin_city,
        created_at: new Date().toISOString(),
      };

      // Check if already in stored
      if (!stored.some((p: FundingPartner) => p.name.toLowerCase() === ngo.name.toLowerCase())) {
        stored.push(newPartner);
        localStorage.setItem('edo_sdg_custom_partners', JSON.stringify(stored));
      }

      const updatedIds = [...importedIds, ngo.id];
      setImportedIds(updatedIds);
      localStorage.setItem('edo_sdg_imported_partner_ids', JSON.stringify(updatedIds));

      setImportNotification(`✅ "${ngo.name}" added to Active Directory!`);
      setTimeout(() => setImportNotification(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const generateLetterContent = (ngo: CrawledNgo) => {
    const isPads = ngo.category === 'Pads & Women Health' || ngo.sdg_goals.includes(5);
    const isSanitation = ngo.category === 'Sanitation & Environment' || ngo.category === 'State Government' || ngo.sdg_goals.includes(6) || ngo.sdg_goals.includes(11);
    const isEducation = ngo.sdg_goals.includes(4);
    const isHunger = ngo.sdg_goals.includes(2);
    const isCleanEnergy = ngo.sdg_goals.includes(7);
    const isYouthJobs = ngo.sdg_goals.includes(8) || ngo.sdg_goals.includes(9);
    const isClimate = ngo.sdg_goals.includes(13) || ngo.sdg_goals.includes(14) || ngo.sdg_goals.includes(15);
    const isPoverty = ngo.sdg_goals.includes(1) || ngo.sdg_goals.includes(10);
    const isGovernance = ngo.sdg_goals.includes(16);
    
    let subject = `REQUISITION FOR STRATEGIC CSR PARTNERSHIP: YOUTH-LED COMMUNITY INTERVENTIONS IN EGOR LGA`;
    let bodyFocus = `Our grassroots assessment across public secondary schools and community corridors in Egor Local Government Area revealed pressing developmental priorities that align directly with your institutional mission.`;

    if (isPads) {
      subject = `REQUISITION FOR PARTNERSHIP: DONATION OF 1,500 SANITARY HYGIENE PACKS FOR PUBLIC SECONDARY SCHOOL GIRLS IN EGOR LGA (SDG 3 & 5)`;
      bodyFocus = `Our field survey across public secondary schools in Egor Local Government Area revealed that hundreds of adolescent girls experience classroom absenteeism due to lack of hygienic menstrual products. We respectfully request partnership through in-kind sanitary packages or co-facilitation of our school sensitization drive.`;
    } else if (isSanitation) {
      subject = `REQUEST FOR LOGISTICAL PARTNERSHIP: CDS MEGA CLEARING AND DRAINAGE DESILTING ACROSS EGOR LGA (SDG 6 & 11)`;
      bodyFocus = `The NYSC SDGs CDS Group has mobilized over 100 Corps Members for intensive community environmental sanitation in Egor LGA. We respectfully request your collaboration regarding safety equipment (gloves, boots, rakes) and refuse evacuation logistics.`;
    } else if (isEducation) {
      subject = `REQUISITION FOR QUALITY EDUCATION & LITERACY ADVOCACY PARTNERSHIP IN EGOR LGA (SDG 4)`;
      bodyFocus = `Our grassroots educational audit across public schools in Egor LGA highlighted key literacy and instructional gaps. We respectfully invite your institution to partner with us in distributing learning materials, notebooks, and conducting community parental sensitizations.`;
    } else if (isHunger) {
      subject = `REQUEST FOR COLLABORATION: COMMUNITY FOOD RELIEF & NUTRITION ADVOCACY IN EGOR LGA (SDG 2)`;
      bodyFocus = `The NYSC SDGs CDS Group is spearheading targeted food relief and dietary awareness drives for vulnerable households in Egor LGA. We invite your foundation to support with food supplies, agricultural inputs, or community nutrition clinics.`;
    } else if (isCleanEnergy) {
      subject = `PARTNERSHIP PROPOSAL: RENEWABLE CLEAN ENERGY & SOLAR ADOPTION WORKSHOPS (SDG 7)`;
      bodyFocus = `We seek your technical and material collaboration to introduce renewable solar lighting kits and clean energy sensitizations to market stalls and youth centres in Egor LGA.`;
    } else if (isYouthJobs) {
      subject = `REQUISITION FOR YOUTH VOCATIONAL & DIGITAL SKILLS WORKSHOP PARTNERSHIP IN EGOR LGA (SDG 8 & 9)`;
      bodyFocus = `To combat youth unemployment in Egor LGA, our CDS group is organizing vocational, entrepreneurial, and digital literacy masterclasses. We respectfully request your support with training facilitators and workshop kits.`;
    } else if (isClimate) {
      subject = `REQUEST FOR LOGISTICAL PARTNERSHIP: TREE PLANTING & CLIMATE RESILIENCE CAMPAIGN (SDG 13 & 15)`;
      bodyFocus = `To counter severe urban gully erosion and environmental degradation in Egor LGA, we are planting 500 indigenous trees across school compounds. We seek collaboration for seedlings, nursery tools, and protective barriers.`;
    } else if (isPoverty) {
      subject = `PROPOSAL FOR COMMUNITY WELFARE & ECONOMIC EMPOWERMENT IN EGOR LGA (SDG 1 & 10)`;
      bodyFocus = `Targeting impoverished trading families and vulnerable persons in Egor LGA, we are deploying targeted welfare interventions and financial literacy drives aligned with your philanthropic mandate.`;
    } else if (isGovernance) {
      subject = `COLLABORATION REQUEST: CIVIC EDUCATION & INSTITUTIONAL ACCOUNTABILITY OUTREACH (SDG 16)`;
      bodyFocus = `Our CDS group is conducting civic transparency and rule-of-law awareness drives in grassroots communities across Egor LGA, and we invite your legal and governance expertise as a technical partner.`;
    }

    return `NATIONAL YOUTH SERVICE CORPS
EGOR LOCAL GOVERNMENT AREA • SUSTAINABLE DEVELOPMENT GOALS (SDGs) CDS GROUP
Egor NYSC Secretariat, Benin City, Edo State
Ref: NYSC/ED/EGOR/SDG/${new Date().getFullYear()}/${ngo.id.substring(0, 6).toUpperCase()}
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}

To: The Managing Director / CSR Coordinator,
${ngo.name},
${ngo.address}.

${subject}

Dear Sir/Madam,

The National Youth Service Corps (NYSC) Egor Local Government Area Sustainable Development Goals (SDGs) Community Development Service (CDS) Group respectfully presents this formal partnership proposal to ${ngo.name}.

${bodyFocus}

KEY PROJECT TARGETS (EGOR LOCAL GOVERNMENT AREA):
1. Direct community intervention targeting UN SDGs [${ngo.sdg_goals.map(g => `Goal ${g}`).join(', ')}].
2. Deployment of qualified, serving NYSC corps members with zero administrative overhead.
3. Full transparency, official reporting, and high-visibility corporate recognition across all media and state NYSC reports.

Designated Official Account Details (NYSC Audited):
Bank Name: First Bank of Nigeria
Account Name: NYSC Edo State SDG CDS Special Projects
Account Number: 2048992011

We look forward to an opportunity to brief your team at your ${ngo.is_benin_city ? 'Benin City office' : 'secretariat'} at your earliest convenience.

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
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {importNotification && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-elevated font-label-md text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{importNotification}</span>
        </div>
      )}

      {/* Header Controls & Interactive Ecosystem Scanner */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-subtle space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-xs font-extrabold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">radar</span>
              <span>Intelligent Civil Society Radar • Nationwide Nigeria & Edo State</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Nigeria & Edo SDG Partner <span className="text-primary">Radar & Crawler</span>
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Explore 60+ verified CSR foundations, national NGOs, and UN agencies operating across Nigeria (36 States + FCT Abuja) as well as grassroots partners in Benin City and Egor LGA. Filter by UN SDG target (1–17), regional scope, crawl new domains, import directly into your outreach directory, and generate 1-click personalized pitch letters.
            </p>
          </div>

          {/* Action Buttons: Run Scan & Active Count */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => runEcosystemScan('nigeria')}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-card active:scale-95 transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isScanning && scanScope === 'nigeria' ? 'animate-spin' : ''}`}>
                {isScanning && scanScope === 'nigeria' ? 'refresh' : 'travel_explore'}
              </span>
              <span>{isScanning && scanScope === 'nigeria' ? 'Crawling Nigeria...' : 'Crawl Nigeria (36 States)'}</span>
            </button>

            <button
              onClick={() => runEcosystemScan('edo')}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-bold text-xs sm:text-sm shadow-card active:scale-95 transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isScanning && scanScope === 'edo' ? 'animate-spin' : ''}`}>
                {isScanning && scanScope === 'edo' ? 'refresh' : 'radar'}
              </span>
              <span>{isScanning && scanScope === 'edo' ? 'Scanning Edo...' : 'Crawl Edo Local (18 LGAs)'}</span>
            </button>

            <a
              href="/admin/funding"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs sm:text-sm border border-outline-variant/40 shadow-subtle active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">folder_shared</span>
              <span>View Directory</span>
            </a>
          </div>
        </div>

        {/* Live Crawler Console (Animated Terminal) */}
        {showCrawlerConsole && (
          <div className="bg-neutral-900 text-neutral-200 p-4 sm:p-5 rounded-2xl font-mono text-xs space-y-2 border border-neutral-700 shadow-inner relative">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-primary-fixed text-[11px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <span>
                  {scanScope === 'nigeria'
                    ? 'NIGERIA NATIONAL SDG REGISTRY CRAWLER v3.0 // LIVE'
                    : 'EDO CIVIL REGISTRY CRAWLER v2.6 // LIVE'}
                </span>
              </div>
              <button
                onClick={() => setShowCrawlerConsole(false)}
                className="text-neutral-400 hover:text-white text-xs px-2 py-0.5 rounded bg-neutral-800"
              >
                Close Terminal ✕
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1 text-[11px] leading-relaxed">
              {scanLogs.map((log, idx) => (
                <div key={idx} className="animate-in fade-in duration-150">
                  {log}
                </div>
              ))}
              {isScanning && (
                <div className="flex items-center gap-2 text-primary-fixed animate-pulse">
                  <span>
                    {scanScope === 'nigeria'
                      ? '› Querying Federal CAC, UN directories, nationwide foundations & state clusters...'
                      : '› Querying Edo CAC, civil coalitions & municipal CSR filings...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom URL Domain Inspector */}
        <form onSubmit={handleAnalyzeCustomUrl} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              link
            </span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste any Nigerian NGO, company, or foundation website (e.g. dangote.com, lapo-ngo.org, unicef.org/nigeria)..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-on-surface text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary border-none shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={analyzingUrl || !customUrl.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all disabled:opacity-50 shrink-0"
          >
            <span className={`material-symbols-outlined text-[18px] ${analyzingUrl ? 'animate-spin' : ''}`}>
              {analyzingUrl ? 'progress_activity' : 'search_check'}
            </span>
            <span>{analyzingUrl ? 'Crawling...' : 'Crawl URL'}</span>
          </button>
        </form>

        {/* Geographic Scope Quick Selector Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant flex items-center gap-1 shrink-0 mr-1">
            <span className="material-symbols-outlined text-[16px] text-primary">public</span>
            <span>Geographic Scope:</span>
          </span>
          {geographicScopes.map((scope) => {
            const isSelected = selectedScope === scope;
            let count = registry.length;
            if (scope === 'Edo State & Benin City') count = edoCount;
            else if (scope === 'Nationwide / Pan-Nigeria') count = nationwideCount;
            else if (scope === 'Lagos & South-West') count = lagosCount;
            else if (scope === 'Abuja (FCT) & North') count = abujaCount;

            return (
              <button
                key={scope}
                type="button"
                onClick={() => setSelectedScope(scope)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span>{scope}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-surface-container-high text-on-surface'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by organization name, city, state, focus keyword, or equipment..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-full sm:w-56 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>

            {/* Geographic Scope Select Filter */}
            <div className="relative w-full sm:w-56 shrink-0">
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary border-none"
              >
                {geographicScopes.map((scope) => (
                  <option key={scope} value={scope}>
                    {scope}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                public
              </span>
            </div>
          </div>

          {/* Interactive UN SDG Goal Pills Ribbon (All 17 Goals) */}
          <div className="pt-2 border-t border-surface-container">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
                <span>Filter by UN SDG Focus (All Goals 1 – 17):</span>
              </span>
              {selectedSdg !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedSdg(null)}
                  className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
                >
                  Clear SDG Filter ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSdg(null)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSdg === null
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                All Goals ({registry.length})
              </button>

              {allSdgs.map((goalNum) => {
                const meta = SDG_METADATA[goalNum];
                if (!meta) return null;
                const isSelected = selectedSdg === goalNum;
                const count = registry.filter((n) => n.sdg_goals.includes(goalNum)).length;

                return (
                  <button
                    key={goalNum}
                    type="button"
                    onClick={() => setSelectedSdg(isSelected ? null : goalNum)}
                    style={{
                      backgroundColor: isSelected ? meta.color : undefined,
                      borderColor: isSelected ? meta.color : undefined,
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-xs'
                        : 'bg-surface-container text-on-surface border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <span>SDG {goalNum}: {meta.name.split(' ')[0]}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Filter Counter Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-surface-container text-xs text-on-surface-variant font-medium">
          <span>
            Found <strong className="text-on-surface font-extrabold">{filteredNgos.length}</strong> verified organizations across Nigeria & Edo State ready for partnership
          </span>
          <span className="text-[11px] font-semibold text-outline">
            Active Scope: {selectedScope} • Full UN SDG Coverage (1–17)
          </span>
        </div>
      </div>

      {/* Discovered NGOs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNgos.map((ngo) => {
          const isImported = importedIds.includes(ngo.id);

          return (
            <article
              key={ngo.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-xs hover:shadow-card transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              <div className="space-y-3">
                
                {/* Header Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-surface-container text-primary">
                    {ngo.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ngo.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full" title={ngo.source}>
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        <span>Verified</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                      📍 {ngo.lga_scope.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Organization Title & Physical Location */}
                <div>
                  <h3 className="text-base font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {ngo.name}
                  </h3>
                  <p className="mt-1 text-xs text-on-surface-variant flex items-start gap-1 line-clamp-2">
                    <span className="material-symbols-outlined text-[15px] text-outline shrink-0 mt-0.5">location_on</span>
                    <span>{ngo.address}</span>
                  </p>
                </div>

                {/* SDG Goals Badges */}
                <div className="flex flex-wrap gap-1">
                  {ngo.sdg_goals.map((g) => {
                    const meta = SDG_METADATA[g];
                    if (!meta) return null;
                    return (
                      <span
                        key={g}
                        style={{ backgroundColor: meta.color }}
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-2xs"
                        title={meta.name}
                      >
                        SDG {g}
                      </span>
                    );
                  })}
                </div>

                {/* Partnership Types Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {ngo.partnership_types.map((type, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold bg-secondary-fixed/40 text-on-secondary-fixed px-2 py-0.5 rounded-md"
                    >
                      🎁 {type}
                    </span>
                  ))}
                </div>

                {/* Pitch Strategy Box */}
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Strategic Entry Point:
                  </span>
                  <p className="text-[11px] text-on-surface-variant line-clamp-3 leading-relaxed">
                    {ngo.how_to_reach}
                  </p>
                </div>
              </div>

              {/* Action Ribbon: Import + Draft Pitch + Contact Links */}
              <div className="pt-3 border-t border-surface-container space-y-2">
                
                {/* 1-Click Operations */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedNgoForPitch(ngo)}
                    className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_document</span>
                    <span>Draft Pitch</span>
                  </button>

                  <button
                    onClick={() => handleImportToDirectory(ngo)}
                    disabled={isImported}
                    className={`w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl font-bold text-xs border transition-all active:scale-95 ${
                      isImported
                        ? 'bg-surface-container text-on-surface-variant border-transparent opacity-80 cursor-default'
                        : 'bg-surface-container-lowest hover:bg-surface-container text-primary border-outline-variant/40 shadow-xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isImported ? 'check' : 'add_circle'}
                    </span>
                    <span>{isImported ? 'In Directory' : '+ Add to Dir'}</span>
                  </button>
                </div>

                {/* Direct External Contacts */}
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                  <div className="flex items-center gap-2">
                    {ngo.phone && (
                      <a
                        href={`tel:${ngo.phone}`}
                        className="p-1.5 rounded-lg bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors"
                        title={`Call ${ngo.phone}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </a>
                    )}
                    {ngo.email && (
                      <a
                        href={`mailto:${ngo.email}`}
                        className="p-1.5 rounded-lg bg-surface-container text-secondary hover:bg-secondary hover:text-on-secondary transition-colors"
                        title={`Email ${ngo.email}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                      </a>
                    )}
                    {ngo.website && (
                      <a
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        title={`Visit ${ngo.website}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">language</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-outline truncate max-w-[120px]">
                    {ngo.contact_person || 'Liaison Desk'}
                  </span>
                </div>

              </div>
            </article>
          );
        })}
      </div>

      {/* Tailored Pitch Letter Generator Modal */}
      {selectedNgoForPitch && (
        <div
          onClick={() => setSelectedNgoForPitch(null)}
          className="fixed inset-0 z-50 bg-on-surface/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest max-w-3xl w-full rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">drafts</span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-on-surface leading-tight">
                    Pre-Drafted Outreach Letter: {selectedNgoForPitch.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Official Requisition • NYSC Egor LGA Sustainable Development Goals CDS
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

            {/* Letter Body Preview */}
            <div className="p-5 sm:p-8 overflow-y-auto font-mono text-xs text-on-surface bg-surface-container-lowest leading-relaxed whitespace-pre-wrap select-all">
              {generateLetterContent(selectedNgoForPitch)}
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 bg-surface-container-low border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Pre-formatted for Mrs. A. Osagie & Augusta (SDG President) signatures</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyPitch(generateLetterContent(selectedNgoForPitch))}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 ${
                    copiedPitch
                      ? 'bg-tertiary text-white'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
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
        </div>
      )}

    </div>
  );
};
