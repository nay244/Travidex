-- Phase 10 content: Thailand. Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('Thailand', 'TH', 'cities');

-- Bangkok (Bangkok)
insert into cities (country_id, name, region, center)
select id, 'Bangkok', 'Bangkok', st_point(100.5018, 13.7563)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Grand Palace', '{Sacred,Historic,Icon}',
  'The opulent royal complex built in 1782 that served as the official residence of the Kings of Siam.',
  'Dress modestly — shoulders and knees must be covered; sarong rentals are available at the gate.',
  'Easy', 'Large', 'Busy', st_point(100.4913, 13.7500)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Wat Pho', '{Sacred,Historic,Culture}',
  'Temple of the Reclining Buddha, home to a 46-metre gold-plated statue and Thailand''s first university.',
  'The traditional massage school inside offers genuine affordable treatments — book on arrival.',
  'Easy', 'Large', 'Busy', st_point(100.4927, 13.7466)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Wat Arun', '{Sacred,Scenic,Icon}',
  'The Temple of Dawn rises 79 metres above the Chao Phraya bank, encrusted with colourful porcelain mosaic.',
  'Cross by the short ferry from Tha Tien pier and climb the steep central prang for city views.',
  'Easy', 'Large', 'Busy', st_point(100.4887, 13.7436)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Chatuchak Market', '{Culture,Food,Icon}',
  'One of the world''s largest weekend markets with over 15,000 stalls selling everything from antiques to street food.',
  'Arrive before 10 am on Saturday or Sunday to beat the heat and the crowds.',
  'Easy', 'Large', 'Busy', st_point(100.5508, 13.7999)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Khao San Road', '{Culture,Food,Icon}',
  'Bangkok''s legendary backpacker street, alive with street food, live music, and a carnival atmosphere.',
  'The action peaks after sunset — the side streets off Khao San are quieter and equally good for food.',
  'Easy', 'Medium', 'Busy', st_point(100.4970, 13.7589)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Jim Thompson House', '{Historic,Culture,Icon}',
  'Elegant compound of six traditional Thai houses assembled by American silk entrepreneur Jim Thompson in 1959.',
  'Guided tours run every 20 minutes; the canal-side garden is freely accessible.',
  'Easy', 'Medium', 'Moderate', st_point(100.5299, 13.7480)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Lumphini Park', '{Nature,Scenic,Culture}',
  'Bangkok''s green lung, a 57-hectare park with a lake, jogging paths, and resident monitor lizards.',
  'Visit at 6 am for free aerobics classes with locals and the best chance of spotting the lizards.',
  'Easy', 'Large', 'Moderate', st_point(100.5418, 13.7312)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'ICONSIAM', '{Modern,Culture,Food}',
  'Landmark riverside mall featuring a 525-metre indoor canal market and MICHELIN-starred dining.',
  'Take the free shuttle boat from Saphan Taksin BTS for the most scenic approach.',
  'Easy', 'Large', 'Busy', st_point(100.5097, 13.7257)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bangkok' and k.code = 'TH';

-- Chiang Mai (Chiang Mai)
insert into cities (country_id, name, region, center)
select id, 'Chiang Mai', 'Chiang Mai', st_point(98.9853, 18.7883)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Doi Suthep Temple (Wat Phra That Doi Suthep)', '{Sacred,Scenic,Icon}',
  'Sacred mountain temple founded in 1383, offering panoramic views over Chiang Mai from 1,073 metres.',
  'Climb the 309-step naga staircase or take the funicular; arrive before 8 am to avoid tour groups.',
  'Moderate', 'Large', 'Busy', st_point(98.9219, 18.8048)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Old City Moat & Walls', '{Historic,Culture,Scenic}',
  'Square medieval moat and remnant walls encircling the original Lanna Kingdom city founded in 1296.',
  'Rent a bicycle to circuit the entire moat — the evening light on the brick gates is exceptional.',
  'Easy', 'Large', 'Moderate', st_point(98.9919, 18.7883)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Sunday Walking Street (Wualai Road)', '{Culture,Food,Icon}',
  'Chiang Mai''s most celebrated night market, transforming Wualai Road into a kilometre of crafts and food.',
  'Start at the Silver Street end and work north — the best silversmith workshops are nearest the gate.',
  'Easy', 'Large', 'Busy', st_point(98.9893, 18.7791)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Wat Chedi Luang', '{Sacred,Historic,Culture}',
  'Ruins of a 15th-century chedi that once stood 86 metres tall, partially destroyed by earthquake in 1545.',
  'The monk chat programme runs daily at 9 am and 6 pm — a rare chance to converse with resident monks.',
  'Easy', 'Large', 'Moderate', st_point(98.9869, 18.7867)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Elephant Nature Park', '{Nature,Culture,Icon}',
  'Ethical elephant sanctuary and rescue centre in the Mae Taeng valley north of the city.',
  'Book at least a week ahead; full-day visits allow closer interaction than half-day options.',
  'Moderate', 'Large', 'Moderate', st_point(98.8527, 19.0499)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Nimman Road (Nimmanhaemin)', '{Modern,Food,Culture}',
  'Chiang Mai''s trendy district of boutique cafes, concept stores, and the Maya shopping complex.',
  'The small sois (lanes) off Nimman 1–17 hide the most interesting independent coffee shops.',
  'Easy', 'Medium', 'Busy', st_point(98.9675, 18.8003)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Doi Inthanon National Park', '{Nature,Scenic,Historic}',
  'Thailand''s highest peak at 2,565 metres, crowned by twin royal chedis and dramatic cloud-forest waterfalls.',
  'Combine the summit, the twin chedis, and the Wachirathan waterfall in a single self-drive day trip.',
  'Hard', 'Large', 'Moderate', st_point(98.5866, 18.5886)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Tha Phae Gate', '{Historic,Icon,Culture}',
  'The best-preserved of Chiang Mai''s original city gates, a hub for festivals and the nightly food market.',
  'The Tha Phae walking street on Sunday evenings extends from here through the moat area.',
  'Easy', 'Medium', 'Busy', st_point(99.0019, 18.7883)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Mai' and k.code = 'TH';

-- Phuket (Phuket)
insert into cities (country_id, name, region, center)
select id, 'Phuket', 'Phuket', st_point(98.3923, 7.8804)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Patong Beach', '{Coastal,Scenic,Icon}',
  'Phuket''s most famous 3-km crescent beach lined with resorts, watersports, and the vibrant Bangla Road strip.',
  'The northern end near the rocks is far quieter than the central tourist strip.',
  'Easy', 'Large', 'Busy', st_point(98.2976, 7.8966)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Big Buddha (Phuket)', '{Sacred,Scenic,Icon}',
  'A 45-metre white marble Maravija Buddha on Nakkerd Hill, visible from across the island.',
  'Visit at dusk — the statue is illuminated after dark and the hillside breeze is a relief from the heat.',
  'Easy', 'Large', 'Busy', st_point(98.3119, 7.8273)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Phuket Old Town', '{Historic,Culture,Food}',
  'Sino-Portuguese heritage district of colourful shophouses, street art, and celebrated local cuisine.',
  'The Sunday Walking Street on Thalang Road is the best single event in the old town.',
  'Easy', 'Medium', 'Moderate', st_point(98.3873, 7.8847)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Phang Nga Bay', '{Scenic,Nature,Coastal}',
  'Dramatic limestone karst islands rising from jade-green water, made famous as the James Bond island.',
  'Long-tail boats from Ban Tha Lane pier reach the bay faster and cheaper than tour operators.',
  'Moderate', 'Large', 'Busy', st_point(98.5020, 8.2770)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Kata Noi Beach', '{Coastal,Scenic,Nature}',
  'A compact, sheltered cove regarded as one of Phuket''s most beautiful and least crowded beaches.',
  'The viewpoint above Kata Noi on the hill road to Rawai gives the classic three-beach panorama.',
  'Easy', 'Medium', 'Moderate', st_point(98.2948, 7.8193)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Wat Chalong', '{Sacred,Historic,Culture}',
  'Phuket''s most important Buddhist temple complex with a multi-tiered chedi said to contain a bone fragment of the Buddha.',
  'The inner sanctum is most atmospheric on Buddhist holidays when incense and candles fill the air.',
  'Easy', 'Large', 'Moderate', st_point(98.3377, 7.8451)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Promthep Cape', '{Scenic,Coastal,Nature}',
  'Phuket''s southernmost headland, renowned as the best sunset viewpoint on the island.',
  'Arrive 45 minutes before sunset to claim a spot — the car park fills entirely by then.',
  'Easy', 'Medium', 'Busy', st_point(98.2997, 7.7636)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Similan Islands National Park', '{Nature,Coastal,Scenic}',
  'Nine granite islands with world-class snorkelling and diving in pristine marine national park waters.',
  'The park is open only November to May; live-aboard dive boats are the most efficient way to visit.',
  'Hard', 'Large', 'Moderate', st_point(97.6434, 8.6509)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Phuket' and k.code = 'TH';

-- Ayutthaya (Phra Nakhon Si Ayutthaya)
insert into cities (country_id, name, region, center)
select id, 'Ayutthaya', 'Phra Nakhon Si Ayutthaya', st_point(100.5678, 14.3532)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Wat Mahathat', '{Sacred,Historic,Icon}',
  'Ruins of the 14th-century royal temple famous for the Buddha head entwined in tree roots.',
  'The tree-root Buddha head is in the northwest corner — look for the shaded enclosure.',
  'Easy', 'Large', 'Busy', st_point(100.5608, 14.3560)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Wat Phra Si Sanphet', '{Sacred,Historic,Scenic}',
  'The holiest temple of the former Ayutthaya Kingdom, with three iconic restored chedis in a row.',
  'The three chedis are most photogenic from the lawn directly to their east at golden hour.',
  'Easy', 'Large', 'Moderate', st_point(100.5575, 14.3554)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ayutthaya Historical Park', '{Historic,Culture,Scenic}',
  'UNESCO World Heritage site encompassing the ruins of the ancient capital that fell in 1767.',
  'Rent a bicycle at the park entrance — the entire island complex is best covered by bike.',
  'Easy', 'Large', 'Moderate', st_point(100.5589, 14.3560)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Wat Ratchaburana', '{Sacred,Historic,Culture}',
  'Striking 15th-century temple with a well-preserved Khmer-style prang and underground crypt paintings.',
  'The crypt is open to visitors — bring a torch and descend to see the original murals.',
  'Easy', 'Medium', 'Moderate', st_point(100.5617, 14.3575)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Chao Sam Phraya National Museum', '{Historic,Culture,Icon}',
  'Thailand''s largest regional museum with extensive gold artifacts recovered from Ayutthaya temple crypts.',
  'The treasure room on the ground floor holds the original gold regalia found at Wat Ratchaburana.',
  'Easy', 'Large', 'Quiet', st_point(100.5659, 14.3544)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Wat Yai Chai Mongkhon', '{Sacred,Historic,Scenic}',
  'Tall bell-shaped chedi built by King Naresuan to commemorate his elephant duel victory in 1592.',
  'Climb the accessible base of the chedi for eye-level views of the surrounding Buddha statues.',
  'Easy', 'Large', 'Moderate', st_point(100.5836, 14.3428)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Wat Phu Khao Thong', '{Sacred,Historic,Scenic}',
  'The Golden Mount temple standing on an artificial hill, offering the best panoramic view of the plains.',
  'Climb to the top of the whitewashed chedi for a 360-degree view of Ayutthaya''s flat landscape.',
  'Easy', 'Medium', 'Quiet', st_point(100.5426, 14.3716)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Bang Pa-In Royal Palace', '{Historic,Scenic,Culture}',
  'A summer palace complex blending Thai, Chinese, and European architectural styles beside the Chao Phraya.',
  'The Chinese-style Wehat Chamroon Hall is the most striking building and most photographed.',
  'Easy', 'Large', 'Moderate', st_point(100.5803, 14.2338)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Ayutthaya' and k.code = 'TH';

-- Krabi (Krabi)
insert into cities (country_id, name, region, center)
select id, 'Krabi', 'Krabi', st_point(98.9063, 8.0863)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Railay Beach', '{Coastal,Scenic,Icon}',
  'A stunning limestone-flanked peninsula accessible only by longtail boat, with four distinct beaches.',
  'Railay East pier arrivals: walk the short jungle path to Railay West for the best swimming beach.',
  'Moderate', 'Medium', 'Busy', st_point(98.8360, 8.0098)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Phi Phi Islands', '{Coastal,Scenic,Nature}',
  'Iconic dual islands framing the turquoise Maya Bay, made famous in the film The Beach.',
  'Early-morning speedboat day trips from Ao Nang or Krabi reach Maya Bay before midday crowds arrive.',
  'Moderate', 'Large', 'Busy', st_point(98.7784, 7.7407)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ao Nang Beach', '{Coastal,Food,Culture}',
  'Krabi''s main resort beach and ferry hub, backed by limestone cliffs and lined with restaurants.',
  'The longtail boat taxi rank at the northern end serves Railay and Four Islands all day.',
  'Easy', 'Large', 'Busy', st_point(98.8269, 8.0330)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Tiger Cave Temple (Wat Tham Sua)', '{Sacred,Scenic,Historic}',
  'Forest temple complex where a 1,237-step staircase leads to a hilltop Buddha with panoramic views.',
  'Start the climb before 8 am; monkeys guard the lower steps and shade disappears quickly.',
  'Hard', 'Large', 'Moderate', st_point(98.8794, 8.1260)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Thung Teao Forest Natural Park (Crystal Pool)', '{Nature,Scenic,Coastal}',
  'Jade-green mineral pools fed by a natural spring in a dense lowland forest — among Thailand''s most beautiful swimming spots.',
  'The Emerald Pool is the main pool; a 30-minute boardwalk leads to the smaller, cooler Blue Pool.',
  'Moderate', 'Medium', 'Moderate', st_point(99.0668, 8.1822)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Four Islands Tour', '{Coastal,Nature,Scenic}',
  'Classic longtail boat circuit of Koh Poda, Koh Gai, Koh Tup, and Koh Mor, ending at a sandbar.',
  'Book a private longtail directly at Ao Nang beach for a fraction of the tour operator price.',
  'Easy', 'Large', 'Busy', st_point(98.7744, 7.9980)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Khao Khanab Nam', '{Scenic,Historic,Nature}',
  'Twin limestone peaks rising from the Krabi River at the town centre, accessible by paddleboat.',
  'A short cave walk inside the left cliff reveals prehistoric human skeletal remains.',
  'Easy', 'Small', 'Moderate', st_point(98.9166, 8.0723)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Krabi Town Night Market', '{Food,Culture,Icon}',
  'Bustling riverside weekend market with cheap local Thai food, grilled seafood, and fresh fruit.',
  'The Chao Fah Pier night market on Friday and Saturday evenings is the livelier of the two.',
  'Easy', 'Medium', 'Busy', st_point(98.9141, 8.0761)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Krabi' and k.code = 'TH';

-- Chiang Rai (Chiang Rai)
insert into cities (country_id, name, region, center)
select id, 'Chiang Rai', 'Chiang Rai', st_point(99.8324, 19.9105)::geography
from countries where code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'White Temple (Wat Rong Khun)', '{Sacred,Modern,Icon}',
  'Dazzling contemporary Buddhist temple by artist Chalermchai Kositpipat, built entirely in white and mirrored glass.',
  'The bridge of hands leading to the main hall symbolises the cycle of rebirth — best photographed from the bridge.',
  'Easy', 'Large', 'Busy', st_point(99.7638, 19.8247)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Blue Temple (Wat Rong Suea Ten)', '{Sacred,Culture,Icon}',
  'Spectacular deep-blue and gold Lanna-style temple featuring an enormous white Buddha inside.',
  'The interior murals combining Buddhist cosmology and Lanna patterns are the most detailed in the region.',
  'Easy', 'Large', 'Moderate', st_point(99.8545, 19.8986)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Golden Triangle', '{Historic,Scenic,Culture}',
  'The confluence of Thailand, Laos, and Myanmar at the Mekong, once the heart of the world''s opium trade.',
  'The Hall of Opium museum in the Thai Golden Triangle Park gives the full history in context.',
  'Easy', 'Large', 'Moderate', st_point(100.0849, 20.3552)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Chiang Rai Night Bazaar', '{Food,Culture,Icon}',
  'Chiang Rai''s main evening market with handicrafts, silver jewellery, and a large Lanna food court.',
  'The cultural performance stage in the centre runs hill-tribe dance shows nightly from around 8 pm.',
  'Easy', 'Large', 'Busy', st_point(99.8319, 19.9053)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Doi Mae Salong', '{Scenic,Culture,Food}',
  'A mountain ridge village founded by KMT soldiers in 1961, now famous for Chinese teas and misty views.',
  'The early morning tea ceremony at one of the hilltop plantations is best arranged the evening before.',
  'Moderate', 'Medium', 'Quiet', st_point(99.6406, 20.2749)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Wat Phra Kaew (Chiang Rai)', '{Sacred,Historic,Culture}',
  'The original home of the Emerald Buddha before it was moved to Bangkok, now housing a jade replica.',
  'The nearby museum explains the full history of the Emerald Buddha and its journey south.',
  'Easy', 'Medium', 'Moderate', st_point(99.8319, 19.9108)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Singha Park', '{Nature,Scenic,Culture}',
  'A 12,000-rai tea and crop plantation with a fruit maze, animal zone, and long cycling trails.',
  'The bike trail through the rolling tea fields is the park''s most scenic route, at about 8 km.',
  'Easy', 'Large', 'Moderate', st_point(99.8924, 19.8842)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Black House (Baan Dam Museum)', '{Culture,Modern,Icon}',
  'Artist Thawan Duchanee''s dark-themed compound of 40 black structures filled with bones, skins, and dark art.',
  'The main hall houses a massive carved wooden table with animal hide chairs — the centrepiece.',
  'Easy', 'Large', 'Moderate', st_point(99.8434, 19.9326)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chiang Rai' and k.code = 'TH';
