import React, { useState, useEffect } from 'react';
import { fetchIdeas } from '../../lib/supabase';

interface IdeasStatCounterProps {
  initialCount: number;
}

export const IdeasStatCounter: React.FC<IdeasStatCounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    let isMounted = true;

    const loadLiveCount = async () => {
      try {
        const live = await fetchIdeas();
        if (isMounted && live.length > 0) {
          setCount(live.length);
          return;
        }
      } catch (e) {
        console.warn('Live ideas count fetch fallback:', e);
      }

      // Fallback to local storage count
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const deleted = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
          const custom = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
          if (isMounted) {
            const computed = Math.max(0, (initialCount || 5) - deleted.size + custom.length);
            if (computed > 0) {
              setCount(computed);
            }
          }
        }
      } catch {
        // ignore
      }
    };

    loadLiveCount();

    const handleUpdate = () => {
      loadLiveCount();
    };

    window.addEventListener('ideas-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('ideas-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialCount]);

  return (
    <div className="text-2xl sm:text-3xl font-extrabold text-secondary font-display transition-all">
      {count}
    </div>
  );
};
