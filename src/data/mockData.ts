import type { Idea, Project, Event, EventPhoto, FundingPartner } from '../types/database';

// ==============================================================================
// BENIN CITY & EDO STATE NGO DIRECTORY (For Admin Outreach)
// ==============================================================================
export const INITIAL_FUNDING_PARTNERS: FundingPartner[] = [
  {
    id: 'partner-1',
    name: "Girls' Power Initiative (GPI) Nigeria",
    category: 'Pads & Women Health',
    address: '67 New Road, Off Amadasun Street, Upper Ekewan Road, Ugbiyoko, Benin City',
    phone: '+234 807 304 2499',
    email: 'gpibenin@gpinigeria.org',
    website: 'https://www.gpinigeria.org',
    focus_areas: ['Adolescent Reproductive Health', 'Menstrual Hygiene', 'Pad Distribution', 'Girl-Child Rights'],
    how_to_reach: 'Deliver an official NYSC CDS introductory letter requesting joint school sensitization on Menstrual Hygiene Management (MHM) and co-distribution of sanitary pads.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-2',
    name: 'Edo State SDGs Office',
    category: 'State Government',
    address: '17A Vincent Agenmonmen Road, G.R.A, Oka, Benin City',
    phone: '+234 802 334 5567',
    email: 'sdg@edostate.gov.ng',
    website: 'https://edostate.gov.ng',
    focus_areas: ['SDG Coordination', 'Youth Development', 'School Outreaches', 'Period Poverty'],
    how_to_reach: 'Official government counterpart for NYSC SDG CDS. Schedule physical courtesy visit with CDS President and LGI intro letter for pad & educational kits.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-3',
    name: 'Edo State Waste Management Board (ESWMB)',
    category: 'Sanitation & Cleaning',
    address: "Governor's Office Complex, P.M.B. 1080, Benin City",
    phone: '08109670790 / 08109670791',
    email: 'ewmb@edostate.gov.ng',
    website: 'https://edostate.gov.ng',
    focus_areas: ['Environmental Sanitation', 'Waste Evacuation', 'Public Hygiene', 'Drainage Cleaning'],
    how_to_reach: 'Request in-kind assistance: Heavy-duty trash bags, rakes, brooms, safety nose-masks, and waste truck evacuation for monthly community cleanup drives.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-4',
    name: 'Rotary Club of Benin (District 9141)',
    category: 'Sanitation & Cleaning',
    address: 'Benin City (Weekly Friday Fellowship at GRA)',
    phone: '+234 803 306 2731',
    email: 'info@rotaryclubofbenin.org',
    website: 'https://www.rotaryclubofbenin.org',
    focus_areas: ['Water & Sanitation (WASH)', 'Disease Prevention', 'Community Clean-ups', 'Youth Grants'],
    how_to_reach: 'Submit grant/sponsorship proposal to the Club President/Service Projects Director 3 weeks prior to environmental campaign.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-5',
    name: 'African Women Empowerment Guild (AWEG)',
    category: 'Pads & Women Health',
    address: '29 Airport Road, YWCA Building, Benin City',
    phone: '+234 802 306 0147',
    email: 'aweg95@yahoo.com',
    website: '',
    focus_areas: ['Women Health', 'Rural Girl-Child Support', 'Menstrual Dignity'],
    how_to_reach: 'Contact their programs coordinator at Airport Road office for co-sponsoring sanitary towels for girls in suburban Benin City schools.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-6',
    name: 'Africa Network for Environment and Economic Justice (ANEEJ)',
    category: 'Sanitation & Cleaning',
    address: '39 Oyaide Avenue, Off Benoni Road, GRA, Benin City',
    phone: '+234 906 972 5955 / +234 703 571 8577',
    email: 'info@aneej.org',
    website: 'https://www.aneej.org',
    focus_areas: ['Environmental Justice', 'Climate Advocacy', 'Clean Water', 'Civil Society Support'],
    how_to_reach: 'High-impact advocacy partner for community environmental hygiene, plastic collection initiatives, and policy support.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-7',
    name: 'Gbolekekro Women Empowerment and Development Org (GWEDO)',
    category: 'Pads & Women Health',
    address: 'No. 22, Aerodrome Close, off Joromi Road, Benin City',
    phone: '+234 805 491 5657',
    email: 'contact@gwedo.org.ng',
    website: 'https://www.gwedo.org.ng',
    focus_areas: ['Community Health', 'Female Hygiene', 'Adolescent Empowerment'],
    how_to_reach: 'Visit the Aerodrome Close office with CDS proposal for female hygiene kit distribution in Egor Local Government Area.',
    is_benin_city: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'partner-8',
    name: 'Sanitary Aid Initiative (SANG)',
    category: 'Pads & Women Health',
    address: 'Nigeria Nationwide (Active in Edo State)',
    phone: '',
    email: 'contact@sanitaryaidng.com',
    website: 'https://www.sanitaryaidng.com',
    focus_areas: ['Period Poverty', 'Sanitary Towel Distribution', 'Hygiene Kits'],
    how_to_reach: 'Apply through their outreach partner intake portal or DM on X/Instagram (@sanitaryaidng) for pad donations to secondary schools in Edo.',
    is_benin_city: false,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_IDEAS: Idea[] = [];
export const INITIAL_PROJECTS: Project[] = [];

// ==============================================================================
// VERIFIED COMMUNITY OUTREACH ALBUMS (Egor LGA)
// ==============================================================================
const OGIDA_PHOTO_FILENAMES = [
  'photo_2026-10-21_17-41-10.jpg',
  'photo_2026-10-21_17-41-12.jpg',
  'photo_2026-10-21_17-41-14.jpg',
  'photo_2026-10-21_17-41-15.jpg',
  'photo_2026-10-21_17-41-16.jpg',
  'photo_2026-10-21_17-41-18.jpg',
  'photo_2026-10-21_17-41-19.jpg',
  'photo_2026-10-21_17-41-20.jpg',
  'photo_2026-10-21_17-41-21.jpg',
  'photo_2026-10-21_17-41-23.jpg',
  'photo_2026-10-21_17-41-24.jpg',
  'photo_2026-10-21_17-41-26.jpg',
  'photo_2026-10-21_17-41-28.jpg',
  'photo_2026-10-21_17-41-30.jpg',
  'photo_2026-10-21_17-41-31.jpg',
  'photo_2026-10-21_17-41-33.jpg',
  'photo_2026-10-21_17-41-59.jpg',
  'photo_2026-10-21_17-42-10.jpg',
  'photo_2026-10-21_17-42-11.jpg',
  'photo_2026-10-21_17-42-12.jpg',
  'photo_2026-10-21_17-42-14.jpg',
  'photo_2026-10-21_17-42-15.jpg',
  'photo_2026-10-21_17-42-20.jpg',
  'photo_2026-10-21_17-42-22.jpg',
  'photo_2026-10-21_17-42-26.jpg',
  'photo_2026-10-21_17-42-28.jpg',
  'photo_2026-10-21_17-42-29.jpg',
  'photo_2026-10-21_17-42-31.jpg',
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-ogida-outreach',
    title: 'Ogida Community Sensitization & Environmental Sanitation Outreach',
    event_date: '2026-10-21',
    event_time: '10:00 AM – 1:30 PM',
    location: 'Ogida Market & Surrounding Communities, Egor LGA',
    description: `The NYSC Egor SDG Community Development Service (CDS) group conducted a comprehensive grassroots sensitization and public sanitation outreach across Ogida Market and adjoining streets in Egor Local Government Area.

Corps members actively engaged local traders, market executives, transport operators, and community residents on environmental sustainability (SDG 11 & 13), proper solid waste disposal to eliminate drain blockage and seasonal flooding, and disease prevention through clean water and hygiene practices (SDG 3 & 6). 

The team distributed heavy-duty waste collection bins, public health pamphlets, and demonstrated hygienic waste separation techniques with overwhelming community participation and commendation from local market elders.`,
    cover_image: '/ogida/photo_2026-10-21_17-41-10.jpg',
    sdg_goals: [3, 6, 11, 12, 13],
    photos_count: 28,
    beneficiaries_reached: '250+ Market Traders, Shoppers & Local Residents',
    corps_members_present: '35 Serving Corps Members, CDS President Augusta & CDS Executive Council',
    materials_distributed: '50 Heavy-duty Waste Receptacles, Disinfectants, Hand Sanitizers & Public Health Flyers',
    created_at: '2026-10-21T10:00:00Z',
  },
];

export const INITIAL_PHOTOS: EventPhoto[] = OGIDA_PHOTO_FILENAMES.map((filename, idx) => ({
  id: `ogida-photo-${idx + 1}`,
  event_id: 'evt-ogida-outreach',
  image_url: `/ogida/${filename}`,
  caption: `Ogida Community Outreach Plate #${idx + 1} — NYSC Egor SDG CDS field sensitization`,
  display_order: idx + 1,
  created_at: '2026-10-21T10:00:00Z',
}));
