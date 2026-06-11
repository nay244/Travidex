# Travidex Phase 10 — Content: Nine Launch Countries

**Goal:** Populate the live catalog with the launch country set — United States, Japan, South Korea, France (extend), China, Italy, Thailand, Mexico, Spain — each with curated major cities and **8 real sights per city**.

**Format (copy-paste extensibility — the whole point):** one data migration per country, `0017–0025`, every file identical in shape. Adding the 10th country later = copy a file, rename, fill rows. Cities/sights reference parents by **name-based subselects** (no UUID bookkeeping):

```sql
-- supabase/migrations/00NN_content_<country>.sql
insert into countries (name, code, tier) values ('Japan', 'JP', 'cities');

insert into cities (country_id, name, region, center)
select id, 'Tokyo', 'Kanto', st_point(139.6917, 35.6895)::geography from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Senso-ji', '{Sacred,Historic,Icon}',
  'Tokyo''s oldest temple, founded 645 AD in Asakusa.',
  'Approach through the Kaminarimon gate and Nakamise lane.',
  'Easy', 'Large', 'Busy', st_point(139.7967, 35.7148)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';
```

**Field vocabulary (fixed):** `access` Easy|Moderate|Hard · `size` Small|Medium|Large · `busyness` Quiet|Moderate|Busy · `type_tags` from {Historic, Scenic, Icon, Culture, Nature, Food, Sacred, Coastal, Modern} (2–3 per sight) · `reference_photo` omitted (null) until imagery lands.

**Hard rules:** `st_point(LNG, LAT)` — longitude first; dex_no 1–8 unique per city; SQL apostrophes escaped (`''`); real landmarks with real ~4-decimal coordinates; every city gets exactly 8 sights.

**City rosters (fixed — tasks don't renegotiate):**
- **US** (tier `states`, region = state): New York City/NY, Los Angeles/CA, San Francisco/CA, Chicago/IL, Miami/FL, Seattle/WA, Boston/MA, Washington/District of Columbia, Las Vegas/NV, New Orleans/LA, Austin/TX, Denver/CO, Honolulu/HI, Nashville/TN, Philadelphia/PA, San Diego/CA, Portland/OR, Atlanta/GA
- **Japan**: Tokyo, Yokohama, Osaka, Kyoto, Kobe, Nagoya, Sapporo, Fukuoka, Kawasaki (regions: Kanto/Kansai/etc.)
- **South Korea**: Seoul, Busan, Incheon, Daegu, Gyeongju, Jeju City
- **France** (extend; Paris exists w/ 3 sights → top up to 8): Lyon, Marseille, Nice, Bordeaux, Strasbourg, Toulouse, Lille
- **China**: Beijing, Shanghai, Xi'an, Chengdu, Guangzhou, Hangzhou, Shenzhen, Guilin
- **Italy**: Rome, Florence, Venice, Milan, Naples, Turin, Bologna, Palermo
- **Thailand**: Bangkok, Chiang Mai, Phuket, Ayutthaya, Krabi, Chiang Rai
- **Mexico**: Mexico City, Cancún, Guadalajara, Oaxaca, Mérida, Puebla, San Miguel de Allende
- **Spain**: Madrid, Barcelona, Seville, Valencia, Granada, Bilbao, Córdoba, Málaga

**Per-task pipeline:** author migration → static QA (lng/lat order, dex uniqueness, escapes) → `npx supabase db push` → live REST verification (city count, sights=8×cities, coords inside the country's bounding box).

**App-side:** add KR/CN/MX specs to `Flag.tsx` FLAGS (KR/CN emblems simplified — DEVIATIONS rows); no other app changes. OTA at the end.

**Tasks:** T1 France extension + flags (template task) · T2 US · T3 Japan · T4 South Korea · T5 China · T6 Italy · T7 Thailand · T8 Mexico · T9 Spain · T10 full-catalog verification + review + merge + OTA.
