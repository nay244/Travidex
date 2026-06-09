import { useCallback, useEffect, useState } from 'react';
import { getSightById } from '../lib/data/catalog';
import { getFoundSightIds, getRecentFinds, RecentFind } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';
import type { Sight } from '../lib/types';

export function useSight(id: string) {
  const { session } = useAuth();
  const [sight, setSight] = useState<Sight | null>(null);
  const [found, setFound] = useState(false);
  const [recentFinds, setRecentFinds] = useState<RecentFind[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, recent] = await Promise.all([getSightById(id), getRecentFinds(id)]);
    let isFound = false;
    if (session?.user) isFound = (await getFoundSightIds(session.user.id, [id])).has(id);
    setSight(s);
    setRecentFinds(recent);
    setFound(isFound);
    setLoading(false);
  }, [id, session?.user?.id]);

  useEffect(() => { load(); }, [load]);
  return { sight, found, recentFinds, loading, reload: load };
}
