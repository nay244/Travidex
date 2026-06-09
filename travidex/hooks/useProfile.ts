import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { getCityProgress, getCountryProgress } from '../lib/data/progress';
import { getUserFindCount } from '../lib/data/finds';
import { awardBadges, getUserBadges } from '../lib/data/badges';
import { computeStats, Stats } from '../lib/stats';
import { evaluateBadges } from '../lib/badges';

const EMPTY: Stats = { totalFinds: 0, citiesClaimed: 0, countriesExplored: 0 };

export function useProfile() {
  const { session } = useAuth();
  const [stats, setStats] = useState<Stats>(EMPTY);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!session?.user) return;
      const uid = session.user.id;
      const [city, country, count] = await Promise.all([
        getCityProgress(uid), getCountryProgress(uid), getUserFindCount(uid),
      ]);
      const s = computeStats(city, country, count);
      setStats(s);
      await awardBadges(uid, evaluateBadges(s));
      setEarnedBadges(await getUserBadges(uid));
      setLoading(false);
    })();
  }, [session?.user?.id]);

  return { stats, earnedBadges, loading };
}
