import { useEffect, useState, useCallback } from 'react';
import { getSightsForCity } from '../lib/data/catalog';
import { getFoundSightIds } from '../lib/data/finds';
import { useAuth } from '../context/AuthProvider';
import { completion } from '../lib/sightList';
import type { SightWithFind } from '../lib/types';

export function useCityCatalog(cityId: string) {
  const { session } = useAuth();
  const [sights, setSights] = useState<SightWithFind[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const base = await getSightsForCity(cityId);
    const ids = base.map(s => s.id);
    const found = session?.user ? await getFoundSightIds(session.user.id, ids) : new Set<string>();
    setSights(base.map(s => ({ ...s, found: found.has(s.id) })));
    setLoading(false);
  }, [cityId, session?.user?.id]);

  useEffect(() => { load(); }, [load]);

  return { sights, completion: completion(sights), loading, reload: load };
}
