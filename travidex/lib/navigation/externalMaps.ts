export type MapProvider = 'apple' | 'google' | 'waze';
export type LatLng = { lat: number; lng: number };

export function buildDirectionsUrl(provider: MapProvider, d: LatLng): string {
  switch (provider) {
    case 'apple':  return `http://maps.apple.com/?daddr=${d.lat},${d.lng}&dirflg=d`;
    case 'google': return `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}&travelmode=driving`;
    case 'waze':   return `https://waze.com/ul?ll=${d.lat},${d.lng}&navigate=yes`;
  }
}
