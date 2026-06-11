-- Phase 10 content: China (8 cities x 8 sights). Add a city: copy a city block. Add a sight: copy a sight block.

-- Country
insert into countries (name, code, tier) values ('China', 'CN', 'cities');

-- Beijing (Beijing)
insert into cities (country_id, name, region, center)
select id, 'Beijing', 'Beijing', st_point(116.4074, 39.9042)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Forbidden City', '{Historic,Culture,Icon}',
  'The imperial palace complex of 24 Ming and Qing emperors, enclosing 980 buildings within 72 hectares.',
  'Enter through the south Meridian Gate and exit north via the Gate of Divine Might to avoid backtracking.',
  'Easy', 'Large', 'Busy', st_point(116.3972, 39.9163)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Great Wall at Mutianyu', '{Historic,Scenic,Icon}',
  'The best-restored stretch of the Great Wall, 73 km north of Beijing, with watchtowers and ridge-top views.',
  'Take the cable car up and the toboggan run down — buy the combined ticket at the base.',
  'Moderate', 'Large', 'Busy', st_point(116.5640, 40.4320)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Temple of Heaven', '{Sacred,Historic,Icon}',
  'Ceremonial altar complex where emperors performed annual solstice rituals; the circular Hall of Prayer is the centrepiece.',
  'Arrive early morning to watch locals practising tai chi and playing erhu in the cypress groves.',
  'Easy', 'Large', 'Moderate', st_point(116.3912, 39.8822)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Summer Palace', '{Historic,Scenic,Nature}',
  'Imperial garden retreat of 290 hectares centred on Kunming Lake, with the Long Corridor painted with thousands of scenes.',
  'Walk the Long Corridor along the lakefront at dawn before tour groups arrive.',
  'Easy', 'Large', 'Busy', st_point(116.2755, 39.9999)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Tiananmen Square', '{Historic,Culture,Icon}',
  'The world''s largest public square flanked by the Great Hall of the People and the National Museum of China.',
  'Watch the flag-raising ceremony at sunrise — time varies by season; check the official schedule.',
  'Easy', 'Large', 'Busy', st_point(116.3913, 39.9055)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Lama Temple (Yonghe Gong)', '{Sacred,Historic,Culture}',
  'The largest and most lavishly decorated Tibetan Buddhist monastery outside Tibet, housing an 18-metre sandalwood Buddha.',
  'Buy incense at the entrance shop; the rear hall with the giant Buddha is the final courtyard.',
  'Easy', 'Large', 'Busy', st_point(116.4107, 39.9470)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Nanluoguxiang Hutong', '{Historic,Culture,Food}',
  'A preserved 740-metre hutong alley dating to the Yuan dynasty, lined with courtyard homes, cafes, and craft shops.',
  'Explore the dozen side alleys branching off both ends — far quieter than the main lane.',
  'Easy', 'Medium', 'Busy', st_point(116.4036, 39.9381)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Jingshan Park', '{Scenic,Historic,Nature}',
  'Coal Hill garden directly north of the Forbidden City; its summit pavilion frames the best rooftop view of the palace.',
  'Climb before 8 am on a clear day for a fog-free panorama with no crowds.',
  'Easy', 'Medium', 'Moderate', st_point(116.3912, 39.9249)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Beijing' and k.code = 'CN';

-- Shanghai (Shanghai)
insert into cities (country_id, name, region, center)
select id, 'Shanghai', 'Shanghai', st_point(121.4737, 31.2304)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'The Bund', '{Historic,Scenic,Icon}',
  'Shanghai''s famous colonial waterfront of 52 neoclassical facades facing the Pudong skyline across the Huangpu River.',
  'Cross to Pudong by the free pedestrian tunnel to photograph the Bund from the east bank.',
  'Easy', 'Large', 'Busy', st_point(121.4875, 31.2397)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Yu Garden', '{Historic,Culture,Sacred}',
  'Classical Ming-dynasty garden of 2 hectares in the Old City, with rockeries, ponds, pavilions, and intricate lattice walls.',
  'Visit on a weekday morning; the adjacent bazaar is lively but the garden itself quiets quickly.',
  'Easy', 'Medium', 'Busy', st_point(121.4927, 31.2274)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Shanghai Tower Observation Deck', '{Modern,Scenic,Icon}',
  'The 118th-floor sky deck of China''s tallest building at 632 m, with views across Pudong and the river delta.',
  'Book tickets online in advance and go on a clear weekday afternoon for the sharpest visibility.',
  'Easy', 'Large', 'Moderate', st_point(121.5010, 31.2356)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'French Concession', '{Historic,Culture,Food}',
  'Tree-lined streets of art deco villas, lane houses, and boutique cafes in the former French colonial quarter.',
  'Wander Wukang Road and Anfu Road on foot — most of the best facades are set back from the pavement.',
  'Easy', 'Large', 'Moderate', st_point(121.4472, 31.2154)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Shanghai Museum', '{Culture,Historic,Icon}',
  'World-class collection of ancient Chinese bronzes, ceramics, paintings, and calligraphy in People''s Square.',
  'The bronze gallery on floor one is the most significant — allow at least an hour there alone.',
  'Easy', 'Large', 'Moderate', st_point(121.4732, 31.2296)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Tianzifang', '{Culture,Food,Historic}',
  'A labyrinth of 1930s shikumen lane houses converted into independent galleries, studios, and restaurants.',
  'Duck into the innermost alleys off Taikang Road — the deeper you go, the quieter and more atmospheric.',
  'Easy', 'Medium', 'Busy', st_point(121.4672, 31.2107)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Jade Buddha Temple', '{Sacred,Culture,Historic}',
  'Active Chan Buddhist monastery housing two white jade Buddhas brought from Burma in 1882.',
  'Visit during morning prayer around 7 am to hear the monks chanting in the main hall.',
  'Easy', 'Medium', 'Busy', st_point(121.4479, 31.2490)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Zhujiajiao Water Town', '{Historic,Scenic,Culture}',
  'Ancient water town 48 km west of the city with 36 stone bridges and Ming-dynasty canal-side architecture.',
  'Take the first morning bus from People''s Square to arrive before tour groups; walk the back canals.',
  'Easy', 'Medium', 'Moderate', st_point(121.0676, 31.1121)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shanghai' and k.code = 'CN';

-- Xi'an (Shaanxi)
insert into cities (country_id, name, region, center)
select id, 'Xi''an', 'Shaanxi', st_point(108.9402, 34.3416)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Terracotta Army', '{Historic,Culture,Icon}',
  'The 2,200-year-old burial army of Emperor Qin Shi Huang — over 8,000 unique clay soldiers discovered since 1974.',
  'Pit 1 is the largest; visit Pit 2 for the cavalry and archers, often overlooked by tour groups.',
  'Easy', 'Large', 'Busy', st_point(109.2784, 34.3848)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Xi''an City Wall', '{Historic,Icon,Scenic}',
  'The most complete ancient city wall in China — a 13.7-km Ming-dynasty rampart 12 m high encircling the old city.',
  'Rent a bike at the South Gate and cycle the full circuit in about two hours.',
  'Easy', 'Large', 'Moderate', st_point(108.9402, 34.2583)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Muslim Quarter', '{Culture,Food,Historic}',
  'A vibrant Hui neighbourhood of lanes radiating from the Great Mosque, famous for street food and spice markets.',
  'Try roujiamo (meat burger) and yangrou paomo (lamb bread soup) from stalls on Beiyuanmen Street.',
  'Easy', 'Medium', 'Busy', st_point(108.9394, 34.2663)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Great Mosque of Xi''an', '{Sacred,Historic,Culture}',
  'One of China''s oldest and largest mosques, built in Tang-dynasty style with Chinese pavilions and Arabic calligraphy.',
  'Enter through the Great Mosque''s four courtyards — non-Muslims may visit all but the prayer hall.',
  'Easy', 'Medium', 'Moderate', st_point(108.9371, 34.2668)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Big Wild Goose Pagoda', '{Sacred,Historic,Icon}',
  'Tang-dynasty 64-metre Buddhist pagoda built in 652 to house scriptures brought from India by the monk Xuanzang.',
  'Climb to the 7th floor for rooftop views; the musical fountain in the south plaza runs nightly.',
  'Easy', 'Large', 'Busy', st_point(108.9604, 34.2229)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Shaanxi History Museum', '{Culture,Historic,Icon}',
  'The premier museum of Silk Road civilisation, with 370,000 artefacts spanning the Zhou through Tang dynasties.',
  'Pre-book free tickets online; the Tang gold and silver gallery requires a separate paid ticket.',
  'Easy', 'Large', 'Moderate', st_point(108.9556, 34.2298)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Bell Tower', '{Historic,Icon,Culture}',
  'Ming-dynasty wooden tower at the exact centre of the old city, housing the giant bell that once marked each hour.',
  'Visit at night when the tower is illuminated and the surrounding plaza is at its most atmospheric.',
  'Easy', 'Medium', 'Busy', st_point(108.9402, 34.2597)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Huaqing Hot Springs', '{Historic,Scenic,Culture}',
  'Imperial hot-spring palace where Tang Emperor Xuanzong famously brought concubine Yang Guifei; pools still flow.',
  'The evening Tang Dynasty music-and-dance show on the lake is worth staying late for.',
  'Easy', 'Large', 'Moderate', st_point(109.2132, 34.3603)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Xi''an' and k.code = 'CN';

-- Chengdu (Sichuan)
insert into cities (country_id, name, region, center)
select id, 'Chengdu', 'Sichuan', st_point(104.0668, 30.5728)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Chengdu Research Base of Giant Panda Breeding', '{Nature,Culture,Icon}',
  'The world''s leading giant panda conservation centre, home to over 200 pandas in a bamboo-forest setting.',
  'Arrive by 8 am when pandas are fed and most active; they nap by midday.',
  'Easy', 'Large', 'Busy', st_point(104.1395, 30.7373)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Jinli Ancient Street', '{Historic,Food,Culture}',
  'A recreation of a Han-dynasty commercial street next to the Wuhou Shrine, packed with snacks and Sichuan crafts.',
  'Try the glutinous rice dumplings (tangyuan) and spicy rabbit head from vendors near the entrance gate.',
  'Easy', 'Medium', 'Busy', st_point(104.0476, 30.6445)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Wuhou Shrine', '{Historic,Sacred,Culture}',
  'A temple complex honouring the heroes of the Three Kingdoms era, particularly Zhuge Liang, set in cypress gardens.',
  'Combine with Jinli Street next door — a single ticket covers both sites.',
  'Easy', 'Large', 'Moderate', st_point(104.0470, 30.6426)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Kuanzhai Alley', '{Historic,Food,Culture}',
  'Three restored Qing-dynasty lane compounds — Wide Alley, Narrow Alley, and Well Alley — buzzing with teahouses.',
  'Sit in a traditional teahouse in Wide Alley and order a pot of Mengding Mountain green tea.',
  'Easy', 'Medium', 'Busy', st_point(104.0555, 30.6706)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Leshan Giant Buddha', '{Sacred,Historic,Scenic}',
  'The world''s largest stone Buddha, carved from a Sichuan cliff in the Tang dynasty, 71 m tall above the river confluence.',
  'Take the boat for the full-height view; the cliff staircase descends close to the feet but the queue is long.',
  'Moderate', 'Large', 'Busy', st_point(103.7712, 29.5455)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Renmin Park', '{Nature,Culture,Scenic}',
  'Chengdu''s beloved central park where locals gather for mahjong, ballroom dancing, and the legendary open-air teahouse.',
  'Settle into a bamboo chair at the Heming teahouse and order an ear-cleaning — a uniquely local experience.',
  'Easy', 'Large', 'Moderate', st_point(104.0567, 30.6667)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Du Fu Thatched Cottage', '{Historic,Culture,Scenic}',
  'A museum park on the site where Tang poet Du Fu lived in exile and wrote over 240 poems amid bamboo groves.',
  'The reconstructed thatched house is modest but the surrounding bamboo garden is one of Chengdu''s most tranquil spots.',
  'Easy', 'Medium', 'Quiet', st_point(104.0422, 30.6724)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Qingyang Palace', '{Sacred,Historic,Culture}',
  'Chengdu''s oldest Taoist temple, founded in the Tang dynasty and home to the legendary Bronze Ram statues.',
  'Visit on the 1st and 15th of each lunar month for the busiest temple fair atmosphere.',
  'Easy', 'Medium', 'Moderate', st_point(104.0479, 30.6654)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chengdu' and k.code = 'CN';

-- Guangzhou (Guangdong)
insert into cities (country_id, name, region, center)
select id, 'Guangzhou', 'Guangdong', st_point(113.2644, 23.1291)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Canton Tower', '{Modern,Scenic,Icon}',
  'The 600-metre twisted skyscraper defining the Pearl River skyline, with a bubble tram ride around the rooftop.',
  'Visit at dusk to catch the Pearl River illuminations from the observation deck.',
  'Easy', 'Large', 'Busy', st_point(113.3242, 23.1059)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Chen Clan Ancestral Hall', '{Historic,Culture,Icon}',
  'A magnificent 1894 compound of nine connected halls decorated with the most elaborate ceramic roof friezes in Guangdong.',
  'Study the roof ridges from the courtyard — each of the 9 halls has a different ceramic tableau.',
  'Easy', 'Large', 'Moderate', st_point(113.2456, 23.1270)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Shamian Island', '{Historic,Scenic,Culture}',
  'A tree-lined island of colonial European architecture from the former British and French concession era.',
  'Stroll the south promenade at golden hour when the banyan-shaded buildings glow warmly.',
  'Easy', 'Medium', 'Quiet', st_point(113.2401, 23.1107)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Yuexiu Park', '{Historic,Nature,Culture}',
  'The city''s largest park, home to the Five Rams Statue symbol of Guangzhou and the Ming-dynasty Zhenhai Tower.',
  'Climb Zhenhai Tower for free after touring the Guangzhou Museum inside and a view over the park.',
  'Easy', 'Large', 'Moderate', st_point(113.2641, 23.1397)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Temple of the Six Banyan Trees', '{Sacred,Historic,Culture}',
  'A 1,500-year-old Chan Buddhist temple named by Su Shi for its courtyard banyans, with an 11th-century pagoda.',
  'The octagonal Flower Pagoda has been closed to climbers — admire the tiers from the courtyard.',
  'Easy', 'Medium', 'Moderate', st_point(113.2628, 23.1330)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Dim Sum at Guangzhou Restaurant', '{Food,Culture,Icon}',
  'The most celebrated yum cha institution in Guangzhou, serving traditional Cantonese dim sum since 1935.',
  'Arrive before 9 am on weekdays for a table without queuing; order har gow and cheung fun first.',
  'Easy', 'Large', 'Busy', st_point(113.2562, 23.1265)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Baiyun Mountain', '{Nature,Scenic,Culture}',
  'A 28-peak forested massif rising above the city to 382 m, crisscrossed by hiking trails and cloud-sea viewpoints.',
  'Take the cable car to Moxing Ridge at sunrise to stand above the cloud layer before it lifts.',
  'Moderate', 'Large', 'Moderate', st_point(113.3005, 23.1836)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Guangdong Museum', '{Culture,Modern,Icon}',
  'Award-winning contemporary museum shaped like a lacquerwork box, housing natural history and fine arts collections.',
  'The Lingnan culture gallery on the third floor is the standout — plan at least an hour there.',
  'Easy', 'Large', 'Moderate', st_point(113.3244, 23.1215)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guangzhou' and k.code = 'CN';

-- Hangzhou (Zhejiang)
insert into cities (country_id, name, region, center)
select id, 'Hangzhou', 'Zhejiang', st_point(120.1551, 30.2741)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'West Lake', '{Scenic,Nature,Icon}',
  'The UNESCO-listed freshwater lake framed by pagodas, causeways, and mist-shrouded hills that inspired a thousand poets.',
  'Rent a bike and complete the 15-km perimeter loop; the Su Causeway is the most scenic stretch.',
  'Easy', 'Large', 'Busy', st_point(120.1481, 30.2590)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Lingyin Temple', '{Sacred,Historic,Nature}',
  'One of China''s ten most famous Buddhist temples, nestled against a cliff face carved with hundreds of stone Buddhas.',
  'Explore the Feilai Feng cliff carvings before entering the temple — they are included in the same ticket.',
  'Moderate', 'Large', 'Busy', st_point(120.0984, 30.2432)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Longjing Tea Village', '{Culture,Nature,Food}',
  'The origin village of Longjing (Dragon Well) tea, surrounded by terraced tea fields on the hills west of the lake.',
  'Visit in April during the pre-Qingming harvest to watch hand-picking and pan-frying demonstrations.',
  'Easy', 'Medium', 'Moderate', st_point(120.1009, 30.2302)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'China National Silk Museum', '{Culture,Historic,Icon}',
  'The world''s largest textile museum, tracing 4,000 years of Chinese silk from the Neolithic to the present day.',
  'The working weaving demonstration on the ground floor shows Jacquard looms producing brocade in real time.',
  'Easy', 'Large', 'Quiet', st_point(120.1449, 30.2296)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Six Harmonies Pagoda', '{Historic,Sacred,Scenic}',
  'An octagonal 13-storey Song-dynasty pagoda on the Qiantang River bank, built to tame the fearsome tidal bore.',
  'Climb to the top storey for a river view, then descend through the inner wooden structure.',
  'Moderate', 'Large', 'Moderate', st_point(120.1318, 30.2034)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Hefang Street', '{Historic,Food,Culture}',
  'A pedestrianised Qing-dynasty street of traditional pharmacies, snack vendors, and antique shops below Wu Mountain.',
  'Try the Hu Qing Yu Tang pharmacy museum — the historic dispensary has been serving Hangzhou since 1874.',
  'Easy', 'Medium', 'Busy', st_point(120.1677, 30.2405)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Qiantang River Tidal Bore', '{Nature,Scenic,Icon}',
  'The world''s largest tidal bore, surging up the Qiantang estuary as a 9-metre wave around the Mid-Autumn Festival.',
  'Secure a viewing spot along the Qiantang embankment two hours early; the bore arrives precisely on schedule.',
  'Easy', 'Large', 'Busy', st_point(120.2095, 30.2041)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Wuzhen Water Town', '{Historic,Scenic,Culture}',
  'A preserved canal town 80 km north of Hangzhou where stone bridges, dye workshops, and boat rides define daily life.',
  'Stay overnight to experience the town lit by lanterns after day-trippers leave at 5 pm.',
  'Easy', 'Large', 'Busy', st_point(120.4895, 30.7449)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Hangzhou' and k.code = 'CN';

-- Shenzhen (Guangdong)
insert into cities (country_id, name, region, center)
select id, 'Shenzhen', 'Guangdong', st_point(114.0579, 22.5431)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'OCT Loft Creative Culture Park', '{Modern,Culture,Icon}',
  'A post-industrial art district of converted factory warehouses housing galleries, studios, and design shops.',
  'The F518 zone on the eastern side has the densest concentration of independent galleries and is less crowded.',
  'Easy', 'Large', 'Moderate', st_point(113.9951, 22.5558)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Shenzhen Bay Park', '{Nature,Scenic,Coastal}',
  'A 15-km waterfront greenway facing Hong Kong''s mountains across the bay, popular at sunrise with cyclists and herons.',
  'Cycle the full length at low tide when the mudflats fill with migratory shorebirds in winter.',
  'Easy', 'Large', 'Moderate', st_point(113.9738, 22.5099)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ping''an Finance Centre Observation Deck', '{Modern,Scenic,Icon}',
  'The 115th-floor sky deck of the 599-metre Ping''an tower — China''s second tallest building — with 360-degree views.',
  'Book the first slot of the day online; the visibility is clearest before midday haze builds.',
  'Easy', 'Large', 'Moderate', st_point(114.0540, 22.5318)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Dafen Oil Painting Village', '{Culture,Historic,Icon}',
  'The world''s largest mass-production art hub where thousands of painters reproduce masterpieces and sell originals.',
  'Commission a custom portrait or replica — most studios take 3–5 day orders and ship internationally.',
  'Easy', 'Medium', 'Moderate', st_point(114.1352, 22.6005)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Dapeng Ancient City', '{Historic,Culture,Scenic}',
  'A remarkably intact Ming-dynasty walled garrison town 60 km east of the city centre, free to enter.',
  'The ancestral halls of the Lai and Liu families still stand inside the walls — explore beyond the main street.',
  'Easy', 'Medium', 'Quiet', st_point(114.4994, 22.5936)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Lianhua Mountain Park', '{Nature,Scenic,Culture}',
  'A hillside park with a golden statue of Deng Xiaoping overlooking the skyline he transformed, surrounded by lotus ponds.',
  'Climb to the summit at 7 am to catch tai chi practitioners and panoramic views before the haze builds.',
  'Easy', 'Medium', 'Moderate', st_point(114.0579, 22.5554)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Sea World Plaza', '{Modern,Food,Culture}',
  'A waterfront dining and entertainment district anchored by the permanently docked MV Minghua cruise ship.',
  'The ship houses an interactive maritime museum — board for free and explore the original staterooms.',
  'Easy', 'Large', 'Busy', st_point(113.9050, 22.4841)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Huaqiangbei Electronics Market', '{Modern,Culture,Icon}',
  'The world''s largest electronics trading hub — a city block of multi-storey malls selling every component imaginable.',
  'The SEG Plaza floors 2–6 are the best for assembled gadgets; bring a translator app for negotiating.',
  'Easy', 'Large', 'Busy', st_point(114.0862, 22.5492)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Shenzhen' and k.code = 'CN';

-- Guilin (Guangxi)
insert into cities (country_id, name, region, center)
select id, 'Guilin', 'Guangxi', st_point(110.2990, 25.2742)::geography
from countries where code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Li River Cruise', '{Scenic,Nature,Icon}',
  'The 83-km river journey from Guilin to Yangshuo through a gallery of karst pinnacles reflected in green water.',
  'Book the official tourist boat early; the 9 am departure catches the morning mist on the peaks.',
  'Easy', 'Large', 'Busy', st_point(110.4115, 24.8868)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Reed Flute Cave', '{Nature,Scenic,Icon}',
  'A 240-metre cavern of stalagmites and stalactites lit with coloured lights, nicknamed the Palace of Natural Arts.',
  'Join the last guided tour of the day — the crowds thin out noticeably in the final hour before closing.',
  'Easy', 'Large', 'Busy', st_point(110.2668, 25.3066)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Yangshuo West Street', '{Culture,Food,Scenic}',
  'The lively main street of Yangshuo village, framed by karst peaks and lined with cafes, bars, and bamboo craft shops.',
  'Rent a bike at the west end and cycle the 10-km karst valley loop — far more rewarding than the street itself.',
  'Easy', 'Medium', 'Busy', st_point(110.4866, 24.7771)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Elephant Trunk Hill', '{Scenic,Nature,Icon}',
  'Guilin''s most photographed natural landmark — a karst hill shaped like an elephant drinking from the Li River.',
  'View from the opposite Binjiang Road bank rather than paying to enter; the angle is far better.',
  'Easy', 'Medium', 'Busy', st_point(110.2880, 25.2527)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Longji Rice Terraces', '{Scenic,Nature,Culture}',
  'Dragon''s Backbone terraces cascading 880 m up the hillsides of Longsheng county, shaped by Zhuang farmers since the Yuan dynasty.',
  'Stay overnight in a stilted guesthouse at Ping''an village to photograph the terraces at sunrise.',
  'Hard', 'Large', 'Moderate', st_point(110.0761, 25.7682)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Seven Star Park', '{Nature,Historic,Scenic}',
  'Guilin''s largest urban park with seven karst peaks mirroring the Big Dipper, cave temples, and a resident panda.',
  'The Camel Hill inside the park is an under-visited secondary viewpoint with almost no queues.',
  'Easy', 'Large', 'Moderate', st_point(110.3170, 25.2776)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Impression Sanjie Liu Show', '{Culture,Scenic,Icon}',
  'Zhang Yimou''s open-air spectacle on the Li River using 600 performers and 12 illuminated karst peaks as the backdrop.',
  'The 8 pm show has a darker sky; sit in the rear premium section for the widest mountain panorama.',
  'Easy', 'Large', 'Busy', st_point(110.4868, 24.7776)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Xingping Ancient Town', '{Historic,Scenic,Culture}',
  'A Ming-dynasty river town 27 km upstream of Yangshuo, whose karst backdrop appears on the 20-yuan banknote.',
  'Walk 2 km north from the dock to Fishing Village for the exact 20-yuan viewpoint — bring the note to compare.',
  'Easy', 'Medium', 'Quiet', st_point(110.4588, 24.9178)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guilin' and k.code = 'CN';
