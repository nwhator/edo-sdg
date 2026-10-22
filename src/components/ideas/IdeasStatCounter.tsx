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
        if (isMounted) {
          setCount(live.length);
        }
      } catch (e) {
        // Fallback to local storage count
        try {
          const deleted = new Set(JSON.parse(localStorage.getItem('edo_sdg_deleted_idea_ids') || '[]'));
          const custom = JSON.parse(localStorage.getItem('edo_sdg_custom_ideas') || '[]');
          if (isMounted) {
            setCount(Math.max(0, initialCount - deleted.size + custom.length));
          }
        } catch {
          // ignore
        }
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
