import { useEffect, useState } from 'react';
import { getCityWithCountry, CityWithCountry } from '../lib/data/citiesByCountry';

export function useActiveCity(cityId: string) {
  const [city, setCity] = useState<CityWithCountry | null>(null);

  useEffect(() => {
    let live = true;
    getCityWithCountry(cityId)
      .then(c => { if (live) setCity(c); })
      .catch(err => console.warn('useActiveCity failed', err));
    return () => { live = false; };
  }, [cityId]);

  return { city };
}
