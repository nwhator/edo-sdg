-- ==============================================================================
-- Auto-confirm executive admin accounts in Supabase Auth
-- ==============================================================================

update auth.users
set email_confirmed_at = now()
where email in ('edostate.sdg@gmail.com', 'admin@edosdg.org');
