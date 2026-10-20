-- ==============================================================================
-- MIGRATION: Clean dummy starter data & enforce fresh platform state
-- Removes all dummy ideas, dummy projects, dummy events, and dummy event photos.
-- Ensures zero fake accomplishments or unapproved projects exist on the platform.
-- ==============================================================================

delete from public.project_attachments;
delete from public.projects;
delete from public.event_photos;
delete from public.events;
delete from public.ideas;

-- Note: public.funding_partners is intentionally preserved for the 
-- internal executive admin Benin City NGO outreach directory.
