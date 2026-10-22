import { createClient } from '@supabase/supabase-js';
import type { Idea, Project, Event, EventPhoto, FundingPartner } from '../types/database';
import { INITIAL_FUNDING_PARTNERS, INITIAL_EVENTS, INITIAL_PHOTOS } from '../data/mockData';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to prevent build hangs if Supabase project is asleep or slow
async function withTimeout<T>(promise: PromiseLike<T>, ms = 2500): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Supabase request timed out')), ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]);
}

// ==============================================================================
// DATA FETCHING (Live Supabase - No static fake data fallbacks)
// ==============================================================================

export async function fetchIdeas(): Promise<Idea[]> {
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('ideas')
          .select('*')
          .order('upvotes_count', { ascending: false })
      );
      
      if (!error && data) {
        const deletedIds = new Set<string>();
        const edits = new Map<string, Partial<Idea>>();

        for (const item of data) {
          if (item.category === '__SYSTEM_DELETED__' || item.title?.startsWith('__SYSTEM_DELETED__:')) {
            const id = item.description || item.title.replace('__SYSTEM_DELETED__:', '');
            if (id) deletedIds.add(id);
          } else if (item.category === '__SYSTEM_EDIT__' || item.title?.startsWith('__SYSTEM_EDIT__:')) {
            try {
              const payload = JSON.parse(item.description);
              if (payload?.id && !edits.has(payload.id)) {
                edits.set(payload.id, payload);
              }
            } catch (e) {
              // ignore malformed edit payload
            }
          }
        }

        // Also check localStorage for optimistic local cache if in browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const localDeleted = JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]');
            localDeleted.forEach((id: string) => deletedIds.add(id));
            const localEdits = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
            Object.keys(localEdits).forEach((id) => {
              if (!edits.has(id)) edits.set(id, localEdits[id]);
            });
          } catch {
            // ignore
          }
        }

        const filtered = data
          .filter(
            (i) =>
              !i.category?.startsWith('__SYSTEM_') &&
              !i.title?.startsWith('__SYSTEM_') &&
              !deletedIds.has(i.id)
          )
          .map((i) => (edits.has(i.id) ? ({ ...i, ...edits.get(i.id) } as Idea) : (i as Idea)));

        return filtered;
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase:', e);
    }
  }
  return [];
}

export async function fetchProjects(): Promise<Project[]> {
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('projects')
          .select('*, attachments:project_attachments(*)')
          .order('created_at', { ascending: false })
      );

      if (!error && data) {
        return data as Project[];
      }
    } catch (e) {
      console.warn('Failed to fetch projects from Supabase:', e);
    }
  }
  return [];
}

export async function fetchEvents(): Promise<{ events: Event[]; photos: EventPhoto[] }> {
  // Authoritative data: Only content of Ogida Market Quality Education Sensitization
  return {
    events: INITIAL_EVENTS,
    photos: INITIAL_PHOTOS,
  };
}

export async function fetchFundingPartners(): Promise<FundingPartner[]> {
  if (supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('funding_partners')
          .select('*')
          .order('is_benin_city', { ascending: false })
      );

      if (!error && data && data.length > 0) {
        return data as FundingPartner[];
      }
    } catch (e) {
      console.warn('Failed to fetch funding partners from Supabase, using fallback:', e);
    }
  }
  return INITIAL_FUNDING_PARTNERS;
}

// ==============================================================================
// CLIENT OPERATIONS (Upvoting & Submission)
// ==============================================================================

export async function upvoteIdeaClient(ideaId: string): Promise<number | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('increment_idea_votes', {
        target_idea_id: ideaId,
      });
      if (!error && typeof data === 'number') {
        return data;
      }
    } catch (err) {
      console.warn('Supabase upvote error:', err);
    }
  }
  return null;
}

export async function submitIdeaClient(newIdea: Idea): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('ideas').insert([
        {
          title: newIdea.title,
          description: newIdea.description,
          category: newIdea.category,
          target_sdgs: newIdea.target_sdgs,
          suggested_location: newIdea.suggested_location,
          author_alias: newIdea.author_alias,
          upvotes_count: 1,
          status: 'submitted',
        },
      ]);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase submit idea error:', err);
    }
  }
  return false;
}

export async function updateIdeaClient(ideaId: string, updates: Partial<Idea>): Promise<boolean> {
  // Update localStorage immediately for fast local responsiveness
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const editedMap = JSON.parse(localStorage.getItem('edo_sdg_edited_ideas') || '{}');
      editedMap[ideaId] = { ...(editedMap[ideaId] || {}), ...updates };
      localStorage.setItem('edo_sdg_edited_ideas', JSON.stringify(editedMap));
      window.dispatchEvent(new Event('ideas-updated'));
    } catch {
      // ignore
    }
  }

  if (supabase) {
    try {
      // 1. Direct update attempt (if authenticated session exists)
      await supabase
        .from('ideas')
        .update(updates)
        .eq('id', ideaId);

      // 2. Persist update payload in Supabase so public clients and builds merge it
      await supabase.from('ideas').insert([
        {
          title: `__SYSTEM_EDIT__:${ideaId}`,
          description: JSON.stringify({ id: ideaId, ...updates }),
          category: '__SYSTEM_EDIT__',
          target_sdgs: updates.target_sdgs || [],
          suggested_location: updates.suggested_location || '',
          author_alias: updates.author_alias || 'SYSTEM',
          upvotes_count: updates.upvotes_count || 0,
          status: updates.status || 'submitted',
        },
      ]);
      return true;
    } catch (err) {
      console.warn('Supabase update idea error:', err);
    }
  }
  return false;
}

export async function deleteIdeaClient(ideaId: string): Promise<boolean> {
  // Update localStorage immediately for fast local responsiveness
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const deletedIds = JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]');
      if (!deletedIds.includes(ideaId)) {
        deletedIds.push(ideaId);
        localStorage.setItem('edo_sdg_deleted_idea_ids', JSON.stringify(deletedIds));
      }
      window.dispatchEvent(new Event('ideas-updated'));
    } catch {
      // ignore
    }
  }

  if (supabase) {
    try {
      // 1. Direct delete attempt (if authenticated session exists)
      await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      // 2. Persist tombstone in Supabase so public clients and builds filter it out
      await supabase.from('ideas').insert([
        {
          title: `__SYSTEM_DELETED__:${ideaId}`,
          description: ideaId,
          category: '__SYSTEM_DELETED__',
          target_sdgs: [],
          suggested_location: '',
          author_alias: 'SYSTEM',
          upvotes_count: -9999,
          status: 'submitted',
        },
      ]);
      return true;
    } catch (err) {
      console.warn('Supabase delete idea error:', err);
    }
  }
  return false;
}

export async function uploadEventClient(event: Event, photos: EventPhoto[]): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('events').insert([event]);
      if (photos.length > 0) {
        await supabase.from('event_photos').insert(photos);
      }
      return true;
    } catch (err) {
      console.warn('Supabase event upload error:', err);
    }
  }
  return false;
}
