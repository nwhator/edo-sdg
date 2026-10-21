export interface SDGInfo {
  number: number;
  name: string;
  color: string;
  shortDescription: string;
}

export const SDG_METADATA: Record<number, SDGInfo> = {
  1: { number: 1, name: "No Poverty", color: "#E5243B", shortDescription: "End poverty in all its forms everywhere." },
  2: { number: 2, name: "Zero Hunger", color: "#DDA63A", shortDescription: "End hunger, achieve food security and improved nutrition." },
  3: { number: 3, name: "Good Health and Well-being", color: "#4C9F38", shortDescription: "Ensure healthy lives and promote well-being for all at all ages." },
  4: { number: 4, name: "Quality Education", color: "#C5192D", shortDescription: "Ensure inclusive and equitable quality education." },
  5: { number: 5, name: "Gender Equality", color: "#FF3A21", shortDescription: "Achieve gender equality and empower all women and girls." },
  6: { number: 6, name: "Clean Water and Sanitation", color: "#26BDE2", shortDescription: "Ensure availability and sustainable management of water and sanitation." },
  7: { number: 7, name: "Affordable and Clean Energy", color: "#FCC30B", shortDescription: "Ensure access to affordable, reliable, and sustainable energy." },
  8: { number: 8, name: "Decent Work and Economic Growth", color: "#A21942", shortDescription: "Promote sustained, inclusive and sustainable economic growth." },
  9: { number: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925", shortDescription: "Build resilient infrastructure, foster innovation." },
  10: { number: 10, name: "Reduced Inequalities", color: "#DD1367", shortDescription: "Reduce inequality within and among countries." },
  11: { number: 11, name: "Sustainable Cities and Communities", color: "#FD9D24", shortDescription: "Make cities and human settlements inclusive, safe, resilient." },
  12: { number: 12, name: "Responsible Consumption and Production", color: "#BF8B2E", shortDescription: "Ensure sustainable consumption and production patterns." },
  13: { number: 13, name: "Climate Action", color: "#3F7E44", shortDescription: "Take urgent action to combat climate change and its impacts." },
  14: { number: 14, name: "Life Below Water", color: "#0A97D9", shortDescription: "Conserve and sustainably use oceans, seas and marine resources." },
  15: { number: 15, name: "Life on Land", color: "#56C02B", shortDescription: "Protect, restore and promote sustainable use of terrestrial ecosystems." },
  16: { number: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D", shortDescription: "Promote peaceful and inclusive societies for sustainable development." },
  17: { number: 17, name: "Partnerships for the Goals", color: "#19486A", shortDescription: "Strengthen the means of implementation and revitalize partnerships." },
};

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  target_sdgs: number[];
  suggested_location: string;
  author_alias?: string;
  upvotes_count: number;
  status: 'submitted' | 'under_review' | 'approved_for_planning' | 'completed';
  created_at: string;
}

export interface BudgetItem {
  item: string;
  cost: number;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  sdg_goals: number[];
  estimated_cost: number;
  budget_breakdown: BudgetItem[];
  stakeholders_to_reach: string[];
  target_location: string;
  status: 'concept' | 'planning' | 'fundraising' | 'in_progress' | 'completed';
  target_date?: string;
  cover_image?: string;
  created_at: string;
  updated_at?: string;
  attachments?: ProjectAttachment[];
}

export interface ProjectAttachment {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_size?: string;
  file_type?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time?: string;
  location: string;
  description?: string;
  cover_image?: string;
  sdg_goals?: number[];
  photos_count?: number;
  beneficiaries_reached?: string;
  corps_members_present?: string;
  officials_present?: string;
  materials_distributed?: string;
  created_at: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export interface FundingPartner {
  id: string;
  name: string;
  category: 'Pads & Women Health' | 'Sanitation & Cleaning' | 'Corporate CSR' | 'State Government' | 'Community & Youth';
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  focus_areas: string[];
  how_to_reach: string;
  is_benin_city: boolean;
  created_at: string;
}

export interface CrawledNgo {
  id: string;
  name: string;
  category: string;
  sdg_goals: number[];
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  focus_areas: string[];
  how_to_reach: string;
  is_benin_city: boolean;
  lga_scope: string;
  partnership_types: string[];
  verified: boolean;
  source: string;
  contact_person?: string;
  impact_summary?: string;
}
