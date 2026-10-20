-- ==============================================================================
-- EDO STATE NYSC SDG PLATFORM - DATABASE SCHEMA
-- PostgreSQL schema for Supabase
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. IDEAS TABLE (Anonymous Submissions & Upvotes)
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'General',
  target_sdgs integer[] not null default '{}',
  suggested_location text default 'Benin City',
  author_alias text default 'Anonymous Corper',
  upvotes_count integer default 0,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'approved_for_planning', 'completed')),
  created_at timestamptz default now()
);

-- Index for trending/upvote queries
create index if not exists idx_ideas_upvotes on public.ideas(upvotes_count desc);
create index if not exists idx_ideas_created_at on public.ideas(created_at desc);

-- 2. PROJECTS TABLE (Project Planning, Budget, Stakeholders, SDGs)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  description text not null,
  sdg_goals integer[] not null default '{}',
  estimated_cost numeric default 0,
  budget_breakdown jsonb default '[]'::jsonb,
  stakeholders_to_reach text[] default '{}',
  target_location text default 'Benin City, Edo State',
  status text not null default 'planning' check (status in ('concept', 'planning', 'fundraising', 'in_progress', 'completed')),
  target_date text,
  cover_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. PROJECT ATTACHMENTS (Proposals, Pitch Decks, Budgets, Receipts)
create table if not exists public.project_attachments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size text,
  file_type text,
  created_at timestamptz default now()
);

-- 4. EVENTS TABLE (Gallery Events / Outreaches)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  location text not null,
  description text,
  cover_image text,
  sdg_goals integer[] default '{}',
  created_at timestamptz default now()
);

-- 5. EVENT PHOTOS TABLE (Grouped Photos per Event)
create table if not exists public.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_event_photos_event_id on public.event_photos(event_id);

-- 6. FUNDING PARTNERS DIRECTORY (Benin City & Edo State NGOs / Donors)
create table if not exists public.funding_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Pads & Women Health', 'Sanitation & Cleaning', 'Corporate CSR', 'State Government', 'Community & Youth')),
  address text not null,
  phone text,
  email text,
  website text,
  focus_areas text[] default '{}',
  how_to_reach text,
  is_benin_city boolean default true,
  created_at timestamptz default now()
);

-- ==============================================================================
-- STORED FUNCTIONS & RPC
-- ==============================================================================

-- Atomic upvote function to prevent race conditions
create or replace function public.increment_idea_votes(target_idea_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  update public.ideas
  set upvotes_count = coalesce(upvotes_count, 0) + 1
  where id = target_idea_id
  returning upvotes_count into new_count;
  return new_count;
end;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.ideas enable row level security;
alter table public.projects enable row level security;
alter table public.project_attachments enable row level security;
alter table public.events enable row level security;
alter table public.event_photos enable row level security;
alter table public.funding_partners enable row level security;

-- Public can read all records
create policy "Allow public read on ideas" on public.ideas for select using (true);
create policy "Allow public read on projects" on public.projects for select using (true);
create policy "Allow public read on project_attachments" on public.project_attachments for select using (true);
create policy "Allow public read on events" on public.events for select using (true);
create policy "Allow public read on event_photos" on public.event_photos for select using (true);
create policy "Allow public read on funding_partners" on public.funding_partners for select using (true);

-- Anyone can submit anonymous ideas
create policy "Allow public insert on ideas" on public.ideas for insert with check (true);

-- Authenticated admins can manage everything
create policy "Allow auth admin all on ideas" on public.ideas for all using (auth.role() = 'authenticated');
create policy "Allow auth admin all on projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Allow auth admin all on project_attachments" on public.project_attachments for all using (auth.role() = 'authenticated');
create policy "Allow auth admin all on events" on public.events for all using (auth.role() = 'authenticated');
create policy "Allow auth admin all on event_photos" on public.event_photos for all using (auth.role() = 'authenticated');
create policy "Allow auth admin all on funding_partners" on public.funding_partners for all using (auth.role() = 'authenticated');

-- ==============================================================================
-- STORAGE BUCKETS (Run in Supabase Storage or Dashboard)
-- ==============================================================================
insert into storage.buckets (id, name, public) 
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

create policy "Public Access to gallery-images" on storage.objects for select using (bucket_id = 'gallery-images');
create policy "Public Access to project-files" on storage.objects for select using (bucket_id = 'project-files');
create policy "Admin Upload to gallery-images" on storage.objects for insert with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');
create policy "Admin Upload to project-files" on storage.objects for insert with check (bucket_id = 'project-files' and auth.role() = 'authenticated');

-- ==============================================================================
-- SEED DATA (Benin City NGOs, Initial Projects, Events)
-- ==============================================================================

insert into public.funding_partners (name, category, address, phone, email, website, focus_areas, how_to_reach, is_benin_city) values
(
  'Girls'' Power Initiative (GPI) Nigeria',
  'Pads & Women Health',
  '67 New Road, Off Amadasun Street, Upper Ekewan Road, Ugbiyoko, Benin City',
  '+234 807 304 2499',
  'gpibenin@gpinigeria.org',
  'https://www.gpinigeria.org',
  array['Adolescent Reproductive Health', 'Menstrual Hygiene', 'Pad Distribution', 'Girl-Child Rights'],
  'Write an official NYSC CDS letter requesting joint school sensitization on Menstrual Hygiene Management (MHM) and co-distribution of sanitary pads.',
  true
),
(
  'Edo State SDGs Office',
  'State Government',
  '17A Vincent Agenmonmen Road, G.R.A, Oka, Benin City',
  '+234 800 000 0000',
  'sdg@edostate.gov.ng',
  'https://edostate.gov.ng',
  array['SDG Coordination', 'Youth Development', 'School Outreaches', 'Period Poverty'],
  'Official government focal point for NYSC SDG CDS. Schedule physical courtesy visit with CDS President and LGI intro letter for pad & educational kits.',
  true
),
(
  'Edo State Waste Management Board (ESWMB)',
  'Sanitation & Cleaning',
  'Governor''s Office Complex, P.M.B. 1080, Benin City',
  '08109670790 / 08109670791',
  'ewmb@edostate.gov.ng',
  'https://edostate.gov.ng',
  array['Environmental Sanitation', 'Waste Evacuation', 'Public Hygiene', 'Drainage Cleaning'],
  'Request in-kind assistance: Heavy-duty trash bags, rakes, brooms, safety nose-masks, and waste truck evacuation for monthly community cleanup drives.',
  true
),
(
  'Rotary Club of Benin (District 9141)',
  'Sanitation & Cleaning',
  'Benin City (Weekly Friday Fellowship at GRA)',
  '+234 803 306 2731',
  'info@rotaryclubofbenin.org',
  'https://www.rotaryclubofbenin.org',
  array['Water & Sanitation (WASH)', 'Disease Prevention', 'Community Clean-ups', 'Youth Grants'],
  'Submit grant/sponsorship proposal to the Club President/Service Projects Director 3 weeks prior to environmental campaign.',
  true
),
(
  'African Women Empowerment Guild (AWEG)',
  'Pads & Women Health',
  '29 Airport Road, YWCA Building, Benin City',
  '+234 802 306 0147',
  'aweg95@yahoo.com',
  null,
  array['Women Health', 'Rural Girl-Child Support', 'Menstrual Dignity'],
  'Contact their programs coordinator at Airport Road office for co-sponsoring sanitary towels for girls in suburban Benin City schools.',
  true
),
(
  'Africa Network for Environment and Economic Justice (ANEEJ)',
  'Sanitation & Cleaning',
  '39 Oyaide Avenue, Off Benoni Road, GRA, Benin City',
  '+234 906 972 5955',
  'info@aneej.org',
  'https://www.aneej.org',
  array['Environmental Justice', 'Climate Advocacy', 'Clean Water', 'Civil Society Support'],
  'High-impact advocacy partner for community environmental hygiene, plastic collection initiatives, and policy support.',
  true
),
(
  'Gbolekekro Women Empowerment and Development Org (GWEDO)',
  'Pads & Women Health',
  'No. 22, Aerodrome Close, off Joromi Road, Benin City',
  '+234 805 491 5657',
  'contact@gwedo.org.ng',
  'https://www.gwedo.org.ng',
  array['Community Health', 'Female Hygiene', 'Adolescent Empowerment'],
  'Visit the Aerodrome Close office with CDS proposal for female hygiene kit distribution in Oredo Local Government Area.',
  true
),
(
  'Sanitary Aid Initiative (SANG)',
  'Pads & Women Health',
  'Nigeria Nationwide (Active in Edo State)',
  null,
  'contact@sanitaryaidng.com',
  'https://www.sanitaryaidng.com',
  array['Period Poverty', 'Sanitary Towel Distribution', 'Hygiene Kits'],
  'Apply through their outreach partner intake portal or DM on X/Instagram (@sanitaryaidng) for pad donations to secondary schools in Edo.',
  false
);

-- Seed Starter Projects
insert into public.projects (title, summary, description, sdg_goals, estimated_cost, budget_breakdown, stakeholders_to_reach, target_location, status, target_date, cover_image) values
(
  'Project Flow: Menstrual Dignity & Pad Bank Initiative',
  'Providing 500+ packs of sanitary pads and menstrual health education to young girls in public secondary schools across Benin City.',
  'Period poverty forces thousands of schoolgirls in Edo State to miss school during their monthly cycle. This project combines practical hygiene education workshops with direct distribution of free sanitary towels and reusable hygiene packs. In addition, we aim to install a permanent "Emergency Pad Bank" cabinet in each partner school''s infirmary.',
  array[3, 5, 4],
  385000,
  '[
    {"item": "500 Packs of Ultra-Thin Sanitary Pads", "cost": 250000},
    {"item": "Educational MHM Pamphlets & Booklets (500 copies)", "cost": 45000},
    {"item": "Emergency School First-Aid Pad Cabinets (3 schools)", "cost": 40000},
    {"item": "Logistics & Volunteer Transport (Benin City)", "cost": 30000},
    {"item": "Light Refreshments for Students & Facilitators", "cost": 20000}
  ]'::jsonb,
  array['Girls'' Power Initiative (GPI)', 'Edo State SDGs Office', 'Ministry of Women Affairs', 'School Principals (Emotan College, Idia College)'],
  'Oredo & Ikpoba Okha LGAs, Benin City',
  'fundraising',
  '2026-11-28',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
),
(
  'CleanEdo: Oba Market & Ring Road Sanitation Drive',
  'Mobilizing 120+ NYSC corps members for a comprehensive market cleanup, drainage clearance, and waste-sorting awareness drive.',
  'Marketplaces are vital community economic centers, yet often suffer from overflowing organic waste and clogged storm drains that pose severe cholera and malaria risks. Project CleanEdo brings together corps members, market trader associations, and environmental officials to clear key drainage paths, distribute waste bins, and educate shop owners on proper disposal.',
  array[3, 6, 11, 13],
  210000,
  '[
    {"item": "50 Heavy-Duty Brooms & 25 Metal Rakes", "cost": 65000},
    {"item": "200 Heavy-Duty Industrial Waste Bags", "cost": 30000},
    {"item": "Safety Gear (Gloves, Nose Masks, Hand Sanitizers)", "cost": 45000},
    {"item": "Community Advocacy Banners & Public Address Megaphones", "cost": 35000},
    {"item": "Logistics, Water & Refreshments for Corpers", "cost": 35000}
  ]'::jsonb,
  array['Edo State Waste Management Board (ESWMB)', 'Rotary Club of Benin', 'Oba Market Traders Association', 'Edo Ministry of Environment'],
  'Ring Road & Oba Market, Benin City',
  'planning',
  '2026-12-05',
  'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80'
);

-- Seed Starter Events
insert into public.events (title, event_date, location, description, cover_image, sdg_goals) values
(
  'World Menstrual Hygiene Day Outreach at Emotan Girls',
  '2026-05-28',
  'Emotan College, Wire Road, Benin City',
  'A flagship outreach reaching over 350 female secondary school students with menstrual hygiene management training, breaking stigmas, and free sanitary pad packs.',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
  array[3, 5, 4]
),
(
  'Edo SDG CDS Environmental Action Day',
  '2026-07-25',
  'King''s Square (Ring Road), Benin City',
  'Joint sanitation campaign with local shop owners, clearing over 800kg of plastic waste and unblocking storm drains along Oba Market perimeter.',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  array[3, 6, 11]
);

-- Seed Starter Ideas
insert into public.ideas (title, description, category, target_sdgs, suggested_location, author_alias, upvotes_count, status) values
(
  'Sanitary Pad Vending / Emergency Dispensary in Public Schools',
  'Install simple wall-mounted emergency sanitary pad dispensers in female rest rooms across 5 public schools in Benin City so no girl goes home during unexpected periods.',
  'Women Health & Hygiene',
  array[3, 5, 4],
  'Oredo & Egor LGAs',
  'Anonymous Corper #42',
  28,
  'approved_for_planning'
),
(
  'Plastic Bottle Buy-Back / School Stationery Swap',
  'Partner with plastic recyclers in Benin City to allow students to exchange clean PET plastic bottles for school notebooks and pens. Fights litter and supports education.',
  'Sanitation & Environment',
  array[4, 11, 12, 13],
  'Ikpoba Okha, Benin City',
  'Anonymous Corper #19',
  19,
  'under_review'
),
(
  'Market Women Health Screening & Blood Pressure Check',
  'Organize free non-communicable disease screenings (blood pressure, blood sugar) alongside our market cleaning day at New Benin Market.',
  'Good Health',
  array[3, 10],
  'New Benin Market',
  'Anonymous Corper #88',
  14,
  'submitted'
);
