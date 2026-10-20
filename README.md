# Edo State NYSC Sustainable Development Goals (SDG) CDS Platform

A modern, lightweight web application built with **Astro**, **Tailwind CSS**, **React**, and **Supabase** for the **National Youth Service Corps (NYSC) - Edo State SDG Community Development Service (CDS)** group in Benin City, Edo State, Nigeria.

---

## 🌟 Core Features

1. **Anonymous Idea Drop & Community Upvoting Hub (`/ideas`)**:
   - Corps members can propose project ideas completely anonymously without bias or fear.
   - Categorize by SDG themes (Menstrual Health, Sanitation, Education, etc.) and specific local government areas in Edo State (Oredo, Ikpoba Okha, Egor, etc.).
   - Interactive, one-click upvoting with client-side anti-duplicate protection and atomic database counters.

2. **Project Planning & Transparent Budgets (`/projects`)**:
   - Detailed project records specifying:
     - Exact estimated cost and itemized budget lines in Naira (₦).
     - Target UN SDGs solved (with official color-coded badges).
     - Key stakeholders & partners to reach out to (e.g. Girls' Power Initiative, ESWMB, Ministry of Health).
     - Attached proposal documents, pitch decks, and spreadsheets.

3. **Event-Grouped Photo Gallery (`/gallery`)**:
   - Outreach photos are **grouped strictly by event** (e.g., *World Menstrual Hygiene Day Outreach at Emotan College*, *Benin City Ring Road Environmental Sanitation*).
   - High-resolution interactive lightbox viewer with captions and event metadata.

4. **Benin City NGO Funding Directory (`/portal/funding`)**:
   - In-depth, verified research prioritizing non-governmental organizations and agencies physically located in **Benin City, Edo State**.
   - Direct contact channels (phone numbers, email addresses, physical office addresses, official websites).
   - Tailored advice on how to pitch each partner specifically for our two first-need priorities:
     - **Priority #1: Sanitary Pads for Women & Girls** (Girls' Power Initiative, Edo State SDGs Office, African Women Empowerment Guild, GWEDO, Sanitary Aid Initiative).
     - **Priority #2: Cleaning Materials & Environmental Sanitation** (Edo State Waste Management Board, Rotary Club of Benin District 9141, ANEEJ).

5. **Sponsorship & Pitch Kit (`/portal/pitch-kit`)**:
   - Copyable official NYSC CDS solicitation letter templates tailored for sanitary pad drives and equipment requisitions to the Edo State Waste Management Board.
   - 5 field-tested rules for securing sponsorships in Benin City.

6. **Executive Admin Management Portal (`/admin`)**:
   - Secure login for CDS executives.
   - **Project Planner**: Create new projects with dynamic budget calculators and stakeholder tags.
   - **Gallery Manager**: Create events and batch-upload outreach photos.
   - **Idea Moderation Panel**: Review community submissions, approve top-voted ideas, and advance them into the planning pipeline.

7. **Design & Brand Identity**:
   - Official NYSC Green (`#006633`) and Gold (`#F4C430`) with clean modern typography.
   - Strict adherence to **at most 4 main top-level navigation links** with contextual sub-links (`Home`, `Projects & Gallery`, `Ideas Hub`, `SDG Portal`).

---

## 🚀 Quick Start Guide

### 1. Run Locally (Offline / Demo Fallback Mode)
The project comes pre-configured with built-in mock seed data. You can test every page, upvote ideas, create projects, and browse the gallery immediately:

```bash
# Start local development server
npm run dev

# Or compile static production build
npm run build
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

---

### 2. Connect to Supabase

1. Create a free project on [Supabase](https://supabase.com).
2. Open your Supabase Project Dashboard and go to the **SQL Editor**.
3. Copy the entire contents of [`supabase_schema.sql`](file:///c:/laragon/www/edo-sdg/supabase_schema.sql) and click **Run**.
   - This sets up all 6 tables (`ideas`, `projects`, `project_attachments`, `events`, `event_photos`, `funding_partners`), the atomic `increment_idea_votes` RPC function, Row Level Security (RLS) policies, and storage buckets.
4. Copy your project credentials from **Project Settings → API** and add them to your `.env` file:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Restart the development server (`npm run dev`). The application will now read and write directly to your Supabase PostgreSQL database!

---

## 🏛️ Benin City NGO & Partner Contacts Summary

| Partner | Address | Phone / Reachability | Focus Area |
| :--- | :--- | :--- | :--- |
| **Girls' Power Initiative (GPI)** | 67 New Road, Off Amadasun St, Upper Ekewan Rd, Ugbiyoko, Benin City | +234 807 304 2499 / gpibenin@gpinigeria.org | Menstrual Hygiene Management & Pad Distribution |
| **Edo State SDGs Office** | 17A Vincent Agenmonmen Road, G.R.A, Oka, Benin City | Direct visit with LGI introductory letter | Official Government NYSC SDG Counterpart |
| **Edo State Waste Management Board (ESWMB)** | Governor's Office Complex, P.M.B. 1080, Benin City | 08109670790 / 08109670791 / ewmb@edostate.gov.ng | Trash bags, brooms, rakes & refuse evacuation trucks |
| **Rotary Club of Benin (Dist. 9141)** | Weekly Meetings in GRA, Benin City | +234 803 306 2731 / info@rotaryclubofbenin.org | Clean-up campaigns & community grants |
| **African Women Empowerment Guild (AWEG)** | 29 Airport Road, YWCA Building, Benin City | +234 802 306 0147 / aweg95@yahoo.com | Girl-child health & pad drives |
| **ANEEJ** | 39 Oyaide Avenue, Off Benoni Road, GRA, Benin City | +234 906 972 5955 / info@aneej.org | Environmental sanitation & advocacy |
| **GWEDO** | No. 22, Aerodrome Close, off Joromi Road, Benin City | +234 805 491 5657 / contact@gwedo.org.ng | Grassroots female hygiene |

---

## 📄 License
Developed for the National Youth Service Corps (NYSC) Edo State SDG Community Development Service (CDS) Group.
Under the motto: *Service and Humility*.
