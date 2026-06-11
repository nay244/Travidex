-- Phase 10 content: South Korea (6 cities x 8 sights). Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('South Korea', 'KR', 'cities');

-- Seoul (Seoul Capital Region)
insert into cities (country_id, name, region, center)
select id, 'Seoul', 'Seoul Capital', st_point(126.9780, 37.5665)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Gyeongbokgung Palace', '{Historic,Sacred,Icon}',
  'Joseon dynasty''s grandest royal palace, rebuilt after Japanese colonial destruction, with the iconic Gwanghwamun gate.',
  'Arrive for the 10 am or 2 pm gate-changing ceremony to photograph guards in full regalia.',
  'Easy', 'Large', 'Busy', st_point(126.9770, 37.5796)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'N Seoul Tower', '{Scenic,Modern,Icon}',
  '480-metre broadcast tower atop Namsan mountain offering a 360-degree panorama of the city.',
  'Take the cable car up from Myeongdong and time your visit for sunset.',
  'Easy', 'Medium', 'Busy', st_point(126.9882, 37.5512)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Bukchon Hanok Village', '{Historic,Culture,Scenic}',
  'Hillside neighbourhood of 600 preserved hanok traditional houses winding between Gyeongbokgung and Changdeokgung.',
  'Enter from the northern alley (Gahoe-ro 11-gil) early morning before tour groups arrive.',
  'Moderate', 'Medium', 'Busy', st_point(126.9850, 37.5826)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Myeongdong', '{Culture,Food,Modern}',
  'Seoul''s most famous shopping and street-food district, packed with K-beauty boutiques and night-market stalls.',
  'The side alleys off the main pedestrian strip have the best tteokbokki and hotteok stalls.',
  'Easy', 'Large', 'Busy', st_point(126.9851, 37.5635)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Changdeokgung Palace & Secret Garden', '{Historic,Nature,Sacred}',
  'UNESCO-listed Joseon palace with a 78-acre rear garden of lotus ponds and forest pavilions.',
  'Book the Secret Garden guided tour online — capacity is strictly capped and it sells out fast.',
  'Easy', 'Large', 'Moderate', st_point(126.9910, 37.5794)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Hongdae', '{Culture,Food,Modern}',
  'Vibrant university district famed for indie music, street performers, and the densest cluster of cafes in the city.',
  'Arrive on Friday evening when buskers take over the park stage with free live sets.',
  'Easy', 'Medium', 'Busy', st_point(126.9235, 37.5563)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Dongdaemun Design Plaza', '{Modern,Culture,Icon}',
  'Zaha Hadid''s futuristic curvilinear events complex housing design museums and a rooftop meadow park.',
  'Explore the underground History & Culture Park — free and open 24 hours — for excavated city-wall ruins.',
  'Easy', 'Large', 'Moderate', st_point(127.0095, 37.5671)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Han River Banpo Bridge', '{Scenic,Modern,Nature}',
  'Double-deck bridge with the world''s longest bridge fountain, shooting 190 jets of illuminated water each night.',
  'Watch the fountain show from Banpo Hangang Park at 9 pm; the south lawn fills early on weekends.',
  'Easy', 'Large', 'Moderate', st_point(126.9972, 37.5128)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seoul' and k.code = 'KR';

-- Incheon (Seoul Capital Region)
insert into cities (country_id, name, region, center)
select id, 'Incheon', 'Seoul Capital', st_point(126.7052, 37.4563)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Incheon Chinatown', '{Culture,Food,Historic}',
  'Korea''s only official Chinatown, established in 1884, famous for jajangmyeon noodles and red-gate arches.',
  'Cross the nearby Jayu Park stairs and look back for the best photo of the Chinese gate with the sea behind.',
  'Easy', 'Medium', 'Moderate', st_point(126.6268, 37.4753)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Songdo Central Park', '{Modern,Scenic,Nature}',
  'Urban waterway park at the heart of the futuristic Songdo smart city, modelled on New York''s Central Park.',
  'Rent a kayak from the dock beside the POSCO Tower for a water-level view of the skyscrapers.',
  'Easy', 'Large', 'Moderate', st_point(126.6389, 37.3861)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Incheon Bridge', '{Modern,Scenic,Icon}',
  'Korea''s longest cable-stayed bridge (21.4 km) connecting the city to Incheon International Airport over the Yellow Sea.',
  'View it from Eurwangni Beach at dusk when the tower lights come on over the water.',
  'Easy', 'Large', 'Quiet', st_point(126.5516, 37.4063)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Wolmido Island', '{Coastal,Food,Culture}',
  'Former military island turned seaside amusement and seafood district, connected to the city by a causeway.',
  'Walk the western shore past the fishing boats for raw sea-urchin bibimbap straight from the dock stalls.',
  'Easy', 'Medium', 'Moderate', st_point(126.5985, 37.4742)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Ganghwa Island', '{Historic,Nature,Sacred}',
  'Fortified island off the coast with dolmen UNESCO sites, Bronze Age tombs, and Korea''s oldest Buddhist temple Jeondeungsa.',
  'Hire a bicycle at the ferry terminal — the island circuit passes all three major fortresses.',
  'Moderate', 'Large', 'Quiet', st_point(126.4816, 37.7139)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Open Port Modern Architecture Street', '{Historic,Culture,Icon}',
  'Cluster of early 20th-century colonial-era consulate and customs buildings from Incheon''s treaty-port days.',
  'Pick up a free walking-map leaflet at the Incheon Open Port Museum to link all the numbered buildings.',
  'Easy', 'Medium', 'Quiet', st_point(126.6290, 37.4746)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Sorae Wetland Ecology Park', '{Nature,Scenic,Culture}',
  'Coastal reed-marsh park on the south shore with a 2-km raised walkway and migratory bird hides.',
  'Visit at low tide in autumn when thousands of shorebirds gather on the mudflats.',
  'Easy', 'Medium', 'Quiet', st_point(126.6875, 37.3969)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Tri-Bowl', '{Modern,Culture,Icon}',
  'Iconic triple-bowl cultural complex on the Songdo waterfront designed to resemble three floating bowls.',
  'The rooftop walkway between the bowls is free and offers the best skyline shot of Songdo.',
  'Easy', 'Medium', 'Moderate', st_point(126.6393, 37.3868)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Incheon' and k.code = 'KR';

-- Busan (South Gyeongsang)
insert into cities (country_id, name, region, center)
select id, 'Busan', 'South Gyeongsang', st_point(129.0756, 35.1796)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Haeundae Beach', '{Coastal,Scenic,Icon}',
  'Korea''s most famous beach — a 1.5-km arc of white sand flanked by skyscrapers and the Marine City skyline.',
  'Walk the APEC Naru Promenade east of the main beach for a quieter stretch with mountain views.',
  'Easy', 'Large', 'Busy', st_point(129.1600, 35.1588)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Gamcheon Culture Village', '{Culture,Scenic,Icon}',
  'Hillside labyrinth of pastel houses nicknamed the ''Machu Picchu of Busan'', now a public art trail.',
  'Follow the fish-and-butterfly stamps on the pavements — each leads to a hidden courtyard installation.',
  'Moderate', 'Medium', 'Busy', st_point(129.0103, 35.0975)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Haedong Yonggungsa Temple', '{Sacred,Coastal,Scenic}',
  'Rare seaside Buddhist temple perched on craggy rocks above the East Sea, founded in 1376.',
  'Arrive at sunrise before tour buses to experience the monks'' morning chanting over the crashing waves.',
  'Easy', 'Medium', 'Busy', st_point(129.2253, 35.1854)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Jagalchi Fish Market', '{Food,Culture,Icon}',
  'Korea''s largest seafood market where vendors sell live fish from outdoor stalls and the upstairs restaurant floors.',
  'Point at any live tank creature; staff will prepare and serve it at a table upstairs within minutes.',
  'Easy', 'Large', 'Busy', st_point(129.0302, 35.0972)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Beomeosa Temple', '{Sacred,Nature,Historic}',
  'Serene 7th-century mountain temple complex in the forest at the foot of Geumjeongsan, a national mountain.',
  'Enter through the four guardian gates on foot from Beomeosa station — the 20-min forest walk sets the mood.',
  'Moderate', 'Large', 'Moderate', st_point(129.0582, 35.2863)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Gwangalli Beach & Diamond Bridge', '{Coastal,Scenic,Modern}',
  'Trendy urban beach facing the twin-span Gwangan Bridge, which lights up in elaborate LED shows at night.',
  'Find a spot on the beach with a clear view of the bridge for the 9 pm and 10 pm light display.',
  'Easy', 'Large', 'Busy', st_point(129.1185, 35.1530)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'UN Memorial Cemetery', '{Historic,Culture,Sacred}',
  'The only UN-managed military cemetery in the world, honouring soldiers from 16 countries who died in the Korean War.',
  'The main ceremony at 11 am on Memorial Day (June 6) draws huge crowds — visit the morning before for silence.',
  'Easy', 'Medium', 'Quiet', st_point(129.0728, 35.1325)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Taejongdae Park', '{Nature,Scenic,Coastal}',
  'Dramatic coastal cliff park at the southern tip of Yeongdo island with 200-metre sea cliffs and a lighthouse.',
  'Take the Danubi train around the 4-km loop if you don''t want to walk, then descend the cliff stairs to the rocks.',
  'Easy', 'Large', 'Moderate', st_point(129.0793, 35.0507)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Busan' and k.code = 'KR';

-- Daegu (North Gyeongsang)
insert into cities (country_id, name, region, center)
select id, 'Daegu', 'North Gyeongsang', st_point(128.6014, 35.8714)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Donghwasa Temple', '{Sacred,Nature,Historic}',
  '9th-century Buddhist mountain temple in Palgongsan provincial park, dominated by a 28-metre stone Buddha.',
  'Hike 30 minutes beyond the main temple to the Gatbawi seated Buddha for sweeping valley views.',
  'Moderate', 'Large', 'Moderate', st_point(128.7028, 35.9894)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Seomun Market', '{Food,Culture,Historic}',
  'One of Korea''s three great traditional markets, operating since the 1920s and famous for dried goods and dakgalbi.',
  'The night market inside the parking building opens at 7 pm with dozens of bingtteok and jeon stalls.',
  'Easy', 'Large', 'Busy', st_point(128.5855, 35.8706)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Dalseong Park', '{Historic,Nature,Culture}',
  'Ancient earthwork fortress from the삼한 period (2nd century BC) now a city park with a small zoo.',
  'The zelkova trees inside the old ramparts are over 400 years old — find them near the north gate.',
  'Easy', 'Medium', 'Moderate', st_point(128.5858, 35.8675)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Kim Gwangseok Street', '{Culture,Historic,Icon}',
  'Mural-lined alley in the Bangcheon-dong district honouring legendary singer Kim Gwangseok, a Daegu native.',
  'Look for the life-sized bronze statue of Kim mid-walk — it marks the spot where he once busked.',
  'Easy', 'Small', 'Moderate', st_point(128.6023, 35.8692)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Daegu National Museum', '{Culture,Historic,Icon}',
  'Regional museum with outstanding collections of Goryeo celadon, Joseon folk art, and Buddhist metalwork.',
  'The outdoor sculpture garden at the rear is free to enter even when the galleries are closed.',
  'Easy', 'Large', 'Quiet', st_point(128.6319, 35.8372)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Palgongsan Cable Car', '{Scenic,Nature,Icon}',
  'Cable car climbing to the Palgongsan ridge summit with panoramic views of the Daegu basin and mountains.',
  'Take the extra 15-minute ridge walk east to Sinseonbong peak for a view of the valley on both sides.',
  'Easy', 'Medium', 'Moderate', st_point(128.7217, 35.9978)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Suseong Lake', '{Scenic,Nature,Culture}',
  'Lakeside recreation park on the south side of the city ringed by restaurants, pedal boats, and night food stalls.',
  'Walk the full 4-km lakeside path at dusk when the fountain show starts in the middle of the lake.',
  'Easy', 'Large', 'Moderate', st_point(128.6378, 35.8493)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Gyeongsang Gamyeong Park', '{Historic,Culture,Scenic}',
  'Site of the former Joseon-era provincial governor''s office, now a downtown park with preserved pavilions.',
  'The Seonhwadang pavilion in the centre is one of the few original government buildings to survive intact.',
  'Easy', 'Medium', 'Quiet', st_point(128.5982, 35.8701)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Daegu' and k.code = 'KR';

-- Gyeongju (North Gyeongsang)
insert into cities (country_id, name, region, center)
select id, 'Gyeongju', 'North Gyeongsang', st_point(129.2114, 35.8562)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Bulguksa Temple', '{Sacred,Historic,Icon}',
  'UNESCO-listed Silla-dynasty masterpiece of Buddhist architecture with iconic stone staircases and pagodas.',
  'Come on a weekday morning — the entry courtyard before 9 am is almost empty and the pagodas are stunning.',
  'Easy', 'Large', 'Busy', st_point(129.3317, 35.7900)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Seokguram Grotto', '{Sacred,Historic,Scenic}',
  'UNESCO-listed 8th-century granite rotunda sheltering a 3.5-metre stone Buddha above the East Sea.',
  'Take the shuttle bus from Bulguksa — the 4-km uphill forest walk back down is worthwhile.',
  'Moderate', 'Small', 'Moderate', st_point(129.3462, 35.7948)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Tumuli Park (Daereungwon)', '{Historic,Nature,Icon}',
  'Wooded park of 23 massive royal burial mounds from the Silla kingdom, one open for interior exploration.',
  'Descend into the Cheonmachong mound — the original gold crown and painted bark saddle are on display inside.',
  'Easy', 'Large', 'Moderate', st_point(129.2167, 35.8388)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Cheomseongdae Observatory', '{Historic,Culture,Icon}',
  'The oldest surviving astronomical observatory in East Asia, a 7th-century stone tower of 362 granite blocks.',
  'The nearby Wolseong Palace ruins and Anapji Pond make a logical half-day circuit starting here.',
  'Easy', 'Small', 'Moderate', st_point(129.2194, 35.8348)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Anapji Pond (Donggung Palace)', '{Historic,Scenic,Sacred}',
  'Restored Silla pleasure garden and palace complex whose moonlit reflections are among Korea''s most photographed.',
  'Buy a ticket for the evening session (after 9 pm) — the illuminated pond reflection is the key image.',
  'Easy', 'Medium', 'Moderate', st_point(129.2297, 35.8342)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Gyeongju National Museum', '{Culture,Historic,Icon}',
  'Korea''s most important regional museum displaying the gold crowns, earrings, and relics of the Silla kingdom.',
  'The outdoor Divine Bell of King Seongdeok (771 AD) is the largest surviving bell in Korea — ring time is 5 pm.',
  'Easy', 'Large', 'Moderate', st_point(129.2282, 35.8336)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Yangdong Folk Village', '{Historic,Culture,Nature}',
  'UNESCO-listed Joseon aristocratic village of 500-year-old clan houses nestled in a valley of forested ridges.',
  'Hire a free audio guide at the visitor centre — it explains which families still live in which houses.',
  'Easy', 'Large', 'Quiet', st_point(129.2736, 35.9258)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Namsan Mountain Trails', '{Nature,Sacred,Historic}',
  'Sacred mountain south of the city peppered with 100+ stone Buddhas, pagodas, and carvings carved into cliff faces.',
  'Start the Samneung Valley trail at 7 am to see the rock-relief Buddhas in raking morning light.',
  'Moderate', 'Large', 'Quiet', st_point(129.2100, 35.8120)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Gyeongju' and k.code = 'KR';

-- Jeju City (Jeju)
insert into cities (country_id, name, region, center)
select id, 'Jeju City', 'Jeju', st_point(126.5312, 33.4996)::geography
from countries where code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Hallasan National Park', '{Nature,Scenic,Icon}',
  'Dormant shield volcano and South Korea''s highest peak (1,950 m), with a crater lake near the summit.',
  'The Seongpanak trail to the summit (9.6 km) must be started before 9 am to guarantee reaching the crater lake.',
  'Hard', 'Large', 'Moderate', st_point(126.5297, 33.3617)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Manjanggul Lava Tube', '{Nature,Scenic,Icon}',
  'One of the world''s longest lava tube systems (13.4 km), a UNESCO site with a 7.6-metre lava column.',
  'Wear a jacket inside — the tube stays at 11°C year-round regardless of outdoor temperature.',
  'Easy', 'Large', 'Moderate', st_point(126.7709, 33.5281)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Seongsan Ilchulbong (Sunrise Peak)', '{Nature,Scenic,Coastal}',
  'UNESCO-listed tuff cone volcanic crater rising 182 m above the sea, with a grassy caldera on top.',
  'The sunrise ascent (gates open at 5:30 am) fills quickly — arrive 20 minutes before first light.',
  'Moderate', 'Medium', 'Busy', st_point(126.9397, 33.4583)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Jeju Haenyeo Experience', '{Culture,Coastal,Food}',
  'Living UNESCO intangible heritage — female free-divers (haenyeo) who harvest abalone and sea conch without tanks.',
  'Watch the haenyeo demonstration at Hamdeok or Sehwa market and buy abalone sashimi directly from the divers.',
  'Easy', 'Small', 'Moderate', st_point(126.6724, 33.5451)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Jeju Olle Trail (Route 1)', '{Nature,Scenic,Coastal}',
  'Coastal walking path hugging the island''s rugged southern cliffs — one section of the 437-km Olle network.',
  'Route 1 from Siyeong to Gwangchigi is the most scenic 15-km stretch and can be done in a half day.',
  'Moderate', 'Large', 'Quiet', st_point(126.9268, 33.4627)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Cheonjiyeon Waterfall', '{Nature,Scenic,Sacred}',
  'Three-tiered waterfall in a subtropical gorge whose name means ''pond of God and heaven'' in Korean.',
  'Follow the lit evening path (open until 10 pm) for a crowd-free view of the illuminated falls.',
  'Easy', 'Medium', 'Busy', st_point(126.5562, 33.2449)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Jeju Stone Park (Jeju Dolharubang)', '{Culture,Historic,Nature}',
  'Sculpture park of the island''s iconic basalt grandfather-spirit statues amid volcanic stone and forest.',
  'The tallest dolharubang stands 1.87 m and is at the park entrance — most originals are at the Folk Museum.',
  'Easy', 'Large', 'Moderate', st_point(126.5022, 33.4584)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Seopjikoji Cliff', '{Scenic,Coastal,Nature}',
  'Windswept basalt cape on the island''s east tip with yellow canola fields, red lighthouse, and sea stacks.',
  'Walk the 2-km outer loop trail to find the lava shelf at the base of the cliffs at low tide.',
  'Easy', 'Medium', 'Moderate', st_point(126.9363, 33.4291)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Jeju City' and k.code = 'KR';
