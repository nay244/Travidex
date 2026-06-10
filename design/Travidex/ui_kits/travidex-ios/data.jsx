// Travidex UI kit — sample data (Kyoto dex + Japan chunk board + feed + badges)

const KYOTO_SIGHTS = [
  { id: 1, dexNo: 1, name: "Fushimi Inari Shrine", found: true, distance: "1.2 km", types: ["Historic", "Icon"], access: "Easy", size: "Large", busy: "Busy",
    about: "A mountain of vermilion torii gates winding up the wooded hillside of Inariyama. The most photographed shrine in Japan.",
    hint: "Enter through the giant romon gate, then follow the right-hand path to the tunnel of gates.", x: 64, y: 28 },
  { id: 2, dexNo: 2, name: "Kinkaku-ji (Golden Pavilion)", found: true, distance: "3.4 km", types: ["Historic", "Scenic"], access: "Easy", size: "Medium", busy: "Busy",
    about: "A Zen temple whose top two floors are completely covered in gold leaf, mirrored in the pond before it.",
    hint: "Best light is mid-morning when the gold reflects in Kyoko-chi pond.", x: 22, y: 18 },
  { id: 3, dexNo: 3, name: "Arashiyama Bamboo Grove", found: true, distance: "5.1 km", types: ["Scenic", "Nature"], access: "Moderate", size: "Large", busy: "Busy",
    about: "Towering stalks of bamboo that sway and creak — a sound officially recognized as part of Japan's soundscape.",
    hint: "Arrive before 8am to walk the main path without crowds.", x: 12, y: 40 },
  { id: 4, dexNo: 4, name: "Nishiki Market", found: false, distance: "0.6 km", types: ["Food"], access: "Easy", size: "Medium", busy: "Busy",
    about: "A narrow, five-block shopping street lined with more than a hundred food stalls and shops.",
    hint: "Try the tako tamago — a baby octopus with a quail egg in the head.", x: 48, y: 52 },
  { id: 5, dexNo: 5, name: "Gion District", found: false, distance: "1.0 km", types: ["Historic"], access: "Easy", size: "Medium", busy: "Moderate",
    about: "Kyoto's most famous geisha district, full of wooden machiya townhouses and lantern-lit lanes.",
    hint: "Hanami-koji at dusk is your best chance to glimpse a geiko or maiko.", x: 58, y: 44 },
  { id: 6, dexNo: 6, name: "Kiyomizu-dera", found: false, distance: "1.8 km", types: ["Historic", "Scenic"], access: "Moderate", size: "Large", busy: "Busy",
    about: "A wooden temple whose vast veranda juts out over the hillside on 13-metre pillars, built without a single nail.",
    hint: "Climb the approach via Sannenzaka for the classic pagoda-and-street view.", x: 72, y: 58 },
  { id: 7, dexNo: 7, name: "Philosopher's Path", found: false, distance: "2.6 km", types: ["Scenic", "Nature"], access: "Easy", size: "Small", busy: "Quiet",
    about: "A stone walkway following a cherry-tree-lined canal between Ginkaku-ji and Nanzen-ji.", hint: "Walk it north-to-south so you finish among the Nanzen-ji aqueducts.", x: 80, y: 30 },
  { id: 8, dexNo: 8, name: "Pontocho Alley", found: false, distance: "0.9 km", types: ["Food", "Historic"], access: "Easy", size: "Small", busy: "Moderate",
    about: "A single lantern-lit lane of restaurants running along the Kamogawa river.", hint: "Look for the plover-bird crest — it marks the alley's entrances.", x: 44, y: 38 },
];

const JAPAN_CHUNKS = [
  { city: "Kyoto", region: "Kansai", found: 8, total: 8 },
  { city: "Osaka", region: "Kansai", found: 12, total: 30 },
  { city: "Kobe", region: "Kansai", found: 0, total: 18 },
  { city: "Tokyo", region: "Kanto", found: 24, total: 24 },
  { city: "Yokohama", region: "Kanto", found: 5, total: 22 },
  { city: "Nagoya", region: "Chubu", found: 0, total: 19 },
  { city: "Sapporo", region: "Hokkaido", found: 3, total: 16 },
  { city: "Fukuoka", region: "Kyushu", found: 0, total: 20 },
  { city: "Hiroshima", region: "Chugoku", found: 7, total: 14 },
];

const FEED = [
  { id: 1, user: "Mira", sight: "Fushimi Inari Shrine", city: "Kyoto", date: "2h ago", likes: 12, comments: 3, liked: true },
  { id: 2, user: "Devon", sight: "Tokyo Tower", city: "Tokyo", date: "5h ago", likes: 28, comments: 6, liked: false },
  { id: 3, user: "Aiko", sight: "Dotonbori", city: "Osaka", date: "Yesterday", likes: 9, comments: 1, liked: false },
];

/* Friends — for the Community friends list */
const FRIENDS = [
  { id: 1, name: "Mira Vale", handle: "@miravale", sights: 142, cities: 6, recent: "Fushimi Inari · 2h ago" },
  { id: 2, name: "Devon Park", handle: "@devontrek", sights: 98, cities: 4, recent: "Tokyo Tower · 5h ago" },
  { id: 3, name: "Aiko Tan", handle: "@aikowanders", sights: 67, cities: 3, recent: "Dotonbori · yesterday" },
  { id: 4, name: "Lena Brandt", handle: "@lenab", sights: 51, cities: 3, recent: "Kinkaku-ji · 2d ago" },
  { id: 5, name: "Sam Otieno", handle: "@samgoes", sights: 33, cities: 2, recent: "Nishiki Market · 4d ago" },
  { id: 6, name: "Noor Haddad", handle: "@noorhad", sights: 21, cities: 1, recent: "Gion District · 1w ago" },
];

/* Hidden gems — user-shared sights NOT in the dex (community submissions, region-specific).
   Kyoto's set is hand-authored; other cities synthesize via hiddenGems(). */
const KYOTO_GEMS = [
  { id: 1, name: "Hidden torii path behind Yoshida Hill", by: "Mira Vale", distance: 0.8, date: "2h ago", days: 0, favs: 47, faved: true,
    note: "A quiet line of mossy gates locals use as a shortcut. No crowds, best in morning fog." },
  { id: 2, name: "Rooftop garden over Teramachi arcade", by: "Sam Otieno", distance: 1.4, date: "Yesterday", days: 1, favs: 31, faved: false,
    note: "Take the unmarked stairs by the bookshop — small garden with a view over the arcade glass." },
  { id: 3, name: "Riverside cat shrine near Demachiyanagi", by: "Aiko Tan", distance: 2.2, date: "3d ago", days: 3, favs: 58, faved: false,
    note: "Tiny shrine covered in cat figurines left by river walkers. The resident cat poses." },
  { id: 4, name: "Sunset bench at Shogunzuka mound", by: "Lena Brandt", distance: 3.6, date: "5d ago", days: 5, favs: 24, faved: false,
    note: "Skip the paid deck — this free bench 50m east has the same skyline view." },
  { id: 5, name: "Night noodle stand under Sanjo bridge", by: "Devon Park", distance: 1.1, date: "1w ago", days: 7, favs: 19, faved: false,
    note: "Appears after 9pm. Cash only, six seats, the owner stamps your hand like a dex entry." },
];

const GEM_TEMPLATES = [
  { name: "Hidden viewpoint above {ref}", note: "A quiet overlook locals keep to themselves — best light an hour before sunset." },
  { name: "Back-alley mural lane off {ref}", note: "A narrow lane of rotating street art. New pieces appear monthly." },
  { name: "Tiny standing bar behind {ref}", note: "Six seats, no sign — look for the amber lantern. The owner loves travelers." },
  { name: "Rooftop garden over {ref}", note: "Unmarked stairs by the flower shop lead to a small public terrace." },
  { name: "Riverside reading bench near {ref}", note: "A shaded bench with the city's best people-watching. Free, always open." },
];
const GEM_REFS = ["the old market", "the station underpass", "the harbor steps", "the museum quarter", "the cathedral square", "the botanic gate"];
const GEM_USERS = ["Mira Vale", "Devon Park", "Aiko Tan", "Lena Brandt", "Sam Otieno", "Noor Haddad"];

// Region-specific hidden gems for the Community tab. Kyoto returns the authored
// set; other cities synthesize a deterministic set seeded by the city name.
function hiddenGems(code, cityName) {
  if (code === "JP" && cityName === "Kyoto") return KYOTO_GEMS.map((g) => ({ ...g }));
  let seed = 0; for (const ch of cityName) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
  return GEM_TEMPLATES.map((t, i) => ({
    id: i + 1,
    name: t.name.replace("{ref}", GEM_REFS[(seed + i) % GEM_REFS.length]),
    by: GEM_USERS[(seed + i * 2) % GEM_USERS.length],
    distance: +(0.4 + ((seed + i * 37) % 48) / 10).toFixed(1),
    date: ["2h ago", "Yesterday", "3d ago", "5d ago", "1w ago"][i % 5],
    days: [0, 1, 3, 5, 7][i % 5],
    favs: 5 + ((seed + i * 61) % 60),
    faved: false,
    note: t.note,
  }));
}

/* ---- Countries ----
   tier 'cities'  → board tiles are cities (small/medium countries).
   tier 'states'  → board tiles are states; tapping a state drills into its
                    cities (large countries: Country › State › City › Sight). */
const FRANCE_CITIES = [
  { city: "Paris", region: "Île-de-France", found: 12, total: 40 },
  { city: "Marseille", region: "Provence", found: 3, total: 20 },
  { city: "Lyon", region: "Auvergne-Rhône", found: 0, total: 18 },
  { city: "Nice", region: "Côte d'Azur", found: 0, total: 15 },
  { city: "Bordeaux", region: "Nouvelle-Aquitaine", found: 0, total: 14 },
  { city: "Strasbourg", region: "Grand Est", found: 0, total: 11 },
];

const USA_STATES = [
  { state: "California", region: "West", cities: [
    { city: "San Francisco", region: "California", found: 18, total: 18 },
    { city: "Los Angeles", region: "California", found: 9, total: 26 },
    { city: "San Diego", region: "California", found: 0, total: 16 },
    { city: "Sacramento", region: "California", found: 0, total: 10 },
  ] },
  { state: "New York", region: "Northeast", cities: [
    { city: "New York City", region: "New York", found: 31, total: 31 },
    { city: "Buffalo", region: "New York", found: 0, total: 12 },
    { city: "Albany", region: "New York", found: 2, total: 8 },
  ] },
  { state: "Texas", region: "South", cities: [
    { city: "Austin", region: "Texas", found: 7, total: 15 },
    { city: "Houston", region: "Texas", found: 0, total: 20 },
    { city: "Dallas", region: "Texas", found: 0, total: 18 },
    { city: "San Antonio", region: "Texas", found: 0, total: 14 },
  ] },
  { state: "Florida", region: "Southeast", cities: [
    { city: "Miami", region: "Florida", found: 4, total: 17 },
    { city: "Orlando", region: "Florida", found: 0, total: 22 },
    { city: "Tampa", region: "Florida", found: 0, total: 12 },
  ] },
  { state: "Illinois", region: "Midwest", cities: [
    { city: "Chicago", region: "Illinois", found: 12, total: 28 },
    { city: "Springfield", region: "Illinois", found: 0, total: 8 },
  ] },
  { state: "Washington", region: "Pacific NW", cities: [
    { city: "Seattle", region: "Washington", found: 9, total: 20 },
    { city: "Spokane", region: "Washington", found: 0, total: 9 },
  ] },
];

const COUNTRIES = [
  { code: "JP", name: "Japan", flag: "🇯🇵", tier: "cities", cities: JAPAN_CHUNKS },
  { code: "US", name: "United States", flag: "🇺🇸", tier: "states", states: USA_STATES },
  { code: "FR", name: "France", flag: "🇫🇷", tier: "cities", cities: FRANCE_CITIES },
];

/* Leveled achievements — earned have level>=1; locked have level 0 + howTo.
   tone drives accent; current/target track progress to the NEXT level. */
const ACHIEVEMENTS = [
  { id: "pathfinder", name: "Pathfinder", icon: "footprints", tone: "green", level: 3, maxLevel: 5, current: 62, target: 100, unit: "sights found", earned: true,
    howTo: "Find more sights anywhere in the world to level up Pathfinder." },
  { id: "cartographer", name: "Cartographer", icon: "map", tone: "amber", level: 2, maxLevel: 5, current: 2, target: 5, unit: "cities claimed", earned: true,
    howTo: "Find every sight in a city to claim it and level up Cartographer." },
  { id: "globetrotter", name: "Globetrotter", icon: "globe", tone: "blue", level: 1, maxLevel: 5, current: 3, target: 10, unit: "countries explored", earned: true,
    howTo: "Start exploring sights in new countries to level up Globetrotter." },
  { id: "chronicler", name: "Chronicler", icon: "camera", tone: "amber", level: 2, maxLevel: 5, current: 11, target: 20, unit: "photos added", earned: true,
    howTo: "Add photos to your finds to level up Chronicler." },
  { id: "nightowl", name: "Night owl", icon: "moon", tone: "blue", level: 0, maxLevel: 3, current: 1, target: 3, unit: "night finds", earned: false,
    howTo: "Log a find after 10:00pm 3 times to unlock this achievement." },
  { id: "trailblazer", name: "Trailblazer", icon: "flag", tone: "green", level: 0, maxLevel: 3, current: 0, target: 1, unit: "countries completed", earned: false,
    howTo: "Claim every city in a country to unlock Trailblazer." },
  { id: "earlybird", name: "Early bird", icon: "sunrise", tone: "amber", level: 0, maxLevel: 3, current: 2, target: 5, unit: "sunrise finds", earned: false,
    howTo: "Log 5 finds before 8:00am to unlock Early bird." },
  { id: "completionist", name: "Completionist", icon: "trophy", tone: "green", level: 0, maxLevel: 1, current: 62, target: 400, unit: "world sights", earned: false,
    howTo: "Find every sight in the world. The ultimate Travidex achievement." },
];

/* Monthly badges — awarded for completing a month's quota (e.g. 10 photos in a
   month). Grouped by year. earned months show the badge; future/missed = locked. */
const BADGE_YEARS = [
  { year: 2026, months: [
    { month: "January", earned: true, icon: "footprints", tone: "green", task: "Found 15 sights in January" },
    { month: "February", earned: true, icon: "camera", tone: "blue", task: "Added 10 photos in February" },
    { month: "March", earned: true, icon: "map", tone: "amber", task: "Visited 5 new cities in March" },
    { month: "April", earned: true, icon: "flag", tone: "green", task: "Claimed a city in April" },
    { month: "May", earned: true, icon: "compass", tone: "blue", task: "Explored a new country in May" },
    { month: "June", earned: true, icon: "mountain", tone: "amber", task: "Found 25 sights in June" },
    { month: "July", earned: false }, { month: "August", earned: false }, { month: "September", earned: false },
    { month: "October", earned: false }, { month: "November", earned: false }, { month: "December", earned: false },
  ] },
  { year: 2025, months: [
    { month: "January", earned: true, icon: "snowflake", tone: "blue", task: "Found 10 sights in January" },
    { month: "February", earned: true, icon: "heart", tone: "green", task: "Added 12 photos in February" },
    { month: "March", earned: true, icon: "wind", tone: "amber", task: "Visited 4 cities in March" },
    { month: "April", earned: true, icon: "flower", tone: "green", task: "Claimed a city in April" },
    { month: "May", earned: true, icon: "sun", tone: "amber", task: "Found 20 sights in May" },
    { month: "June", earned: true, icon: "umbrella", tone: "blue", task: "Logged 15 finds in June" },
    { month: "July", earned: true, icon: "waves", tone: "blue", task: "Found 18 sights in July" },
    { month: "August", earned: true, icon: "tent", tone: "amber", task: "Visited 6 cities in August" },
    { month: "September", earned: true, icon: "leaf", tone: "green", task: "Added 20 photos in September" },
    { month: "October", earned: true, icon: "ghost", tone: "amber", task: "Found 22 sights in October" },
    { month: "November", earned: false }, { month: "December", earned: false },
  ] },
];

/* Per-city dex entries. Kyoto uses the real sights; other cities synthesize a
   believable list from a name pool so the region-dex screen has content. */
const _SIGHT_POOL = ["Old Town Gate", "Riverside Walk", "Grand Cathedral", "Harbor Lighthouse", "Central Market", "Hilltop Shrine", "Botanical Garden", "National Museum", "Sunset Pier", "Stone Bridge", "Clock Tower", "Artisan Quarter", "Memorial Park", "Observation Deck", "Ancient Walls", "Night Market", "Royal Palace", "Seaside Promenade", "Glass Pavilion", "Spice Bazaar", "Cliff Overlook", "Grand Library", "Lantern Alley", "Founders Square"];
const _SIGHT_TYPES = ["Historic", "Scenic", "Nature", "Food", "Icon", "Coastal", "Modern", "Sacred"];

function cityEntries(city) {
  if (!city) return [];
  if (city.city === "Kyoto") return KYOTO_SIGHTS.map((s) => ({ ...s }));
  const total = city.total || 0, foundN = city.found || 0;
  let seed = 0; for (const ch of (city.city || "")) seed = (seed + ch.charCodeAt(0)) % 89;
  const acc = ["Easy", "Moderate", "Hard"], sz = ["Small", "Medium", "Large"], bz = ["Quiet", "Moderate", "Busy"];
  const out = [];
  for (let i = 0; i < total; i++) {
    const types = [_SIGHT_TYPES[(i + seed) % _SIGHT_TYPES.length]];
    if ((i + seed) % 3 === 0) types.push(_SIGHT_TYPES[(i + seed + 4) % _SIGHT_TYPES.length]);
    const name = _SIGHT_POOL[(i + seed) % _SIGHT_POOL.length];
    out.push({ id: i + 1, dexNo: i + 1, name, types, found: i < foundN, distance: "—",
      access: acc[(i + seed) % 3], size: sz[(i + seed) % 3], busy: bz[(i + seed) % 3],
      about: `A well-known ${types[0].toLowerCase()} spot in ${city.city}, worth seeking out on your visit.`,
      hint: `Ask a local or check the map — ${name} sits near the heart of ${city.city}.` });
  }
  return out;
}

const BADGES = [
  { name: "First find", earned: true, icon: "flag" },
  { name: "Ten sights", earned: true, icon: "star" },
  { name: "City claimer", earned: true, icon: "trophy" },
  { name: "Shutterbug", earned: false, icon: "camera", criteria: "Add 20 photos", progress: { current: 11, total: 20 } },
  { name: "Globetrotter", earned: false, icon: "globe", criteria: "Explore 5 countries", progress: { current: 2, total: 5 } },
  { name: "Night owl", earned: false, icon: "moon", criteria: "Log a find after 10pm" },
];

// Look up a city record ({ city, region, found, total }) inside COUNTRIES,
// flattening states for large countries.
function findCity(code, cityName) {
  const c = COUNTRIES.find((x) => x.code === code);
  if (!c) return null;
  const list = c.tier === "cities" ? c.cities : c.states.flatMap((s) => s.cities);
  return list.find((x) => x.city === cityName) || null;
}

// Sights for the MAP screen of a given location: cityEntries() for the data,
// plus deterministic x/y map positions (and a believable distance) for the pins.
function mapSights(code, cityName) {
  const cityObj = findCity(code, cityName) || { city: cityName, found: 0, total: 0 };
  let seed = 0; for (const ch of cityName) seed = (seed * 31 + ch.charCodeAt(0)) % 997;
  return cityEntries(cityObj).map((e, i) => {
    if (e.x != null && e.y != null) return e; // Kyoto's real sights keep their coords
    const a = (seed + i * 53) % 100, b = (seed + i * 89) % 100;
    return {
      ...e,
      x: 12 + (a / 100) * 76,   // 12–88%
      y: 14 + (b / 100) * 72,   // 14–86%
      distance: e.distance && e.distance !== "\u2014" ? e.distance : `${(0.4 + ((seed + i) % 40) / 10).toFixed(1)} km`,
    };
  });
}

Object.assign(window, { KYOTO_SIGHTS, JAPAN_CHUNKS, FRANCE_CITIES, USA_STATES, COUNTRIES, ACHIEVEMENTS, BADGE_YEARS, cityEntries, findCity, mapSights, hiddenGems, FEED, FRIENDS, BADGES });
