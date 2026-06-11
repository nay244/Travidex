-- Phase 10 content: Japan (9 cities x 8 sights). Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('Japan', 'JP', 'cities');

-- Tokyo (Kanto)
insert into cities (country_id, name, region, center)
select id, 'Tokyo', 'Kanto', st_point(139.6917, 35.6895)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Senso-ji', '{Sacred,Historic,Icon}',
  'Tokyo''s oldest temple, founded in 645 AD in the Asakusa district.',
  'Approach through the Kaminarimon gate and Nakamise shopping lane.',
  'Easy', 'Large', 'Busy', st_point(139.7967, 35.7148)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Meiji Jingu', '{Sacred,Nature,Historic}',
  'Forested Shinto shrine dedicated to Emperor Meiji, set within 70 hectares of woodland in Harajuku.',
  'Arrive at sunrise when the inner sanctum gates open and the forest path is peaceful.',
  'Easy', 'Large', 'Moderate', st_point(139.6993, 35.6764)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Shibuya Crossing', '{Icon,Modern,Culture}',
  'The world''s busiest pedestrian scramble intersection, framed by giant video billboards.',
  'Watch from the Starbucks on the second floor of the Mag''s Park building for the best aerial view.',
  'Easy', 'Large', 'Busy', st_point(139.7006, 35.6595)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Tokyo Skytree', '{Modern,Icon,Scenic}',
  'The world''s tallest tower at 634 m, with two observation decks over the Kanto plain.',
  'Book the Tembo Galleria ticket in advance; weekday mornings have the shortest queues.',
  'Easy', 'Large', 'Busy', st_point(139.8107, 35.7101)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Tsukiji Outer Market', '{Food,Culture,Historic}',
  'Lively street market of sushi stalls, tamagoyaki shops, and seafood vendors surrounding the old wholesale site.',
  'Come before 9 am for the freshest tuna-on-rice breakfast bowls.',
  'Easy', 'Medium', 'Busy', st_point(139.7696, 35.6654)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Shinjuku Gyoen', '{Nature,Scenic,Culture}',
  'Expansive national garden blending French formal, English landscape, and Japanese garden styles.',
  'The cherry blossom peak in late March is spectacular; arrive at opening to secure a lawn spot.',
  'Easy', 'Large', 'Moderate', st_point(139.7100, 35.6852)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'teamLab Borderless', '{Modern,Culture,Icon}',
  'Immersive digital art museum where light and animation flow between rooms without boundaries.',
  'Wear plain dark clothing so the projections show on you rather than competing with prints.',
  'Easy', 'Large', 'Busy', st_point(139.7790, 35.6252)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Ueno Park', '{Nature,Culture,Historic}',
  'Tokyo''s largest public park, home to five major museums, a zoo, and a famous sakura avenue.',
  'The Tokyo National Museum on the north end holds Japan''s finest collection of antiquities.',
  'Easy', 'Large', 'Busy', st_point(139.7714, 35.7155)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Tokyo' and k.code = 'JP';

-- Yokohama (Kanto)
insert into cities (country_id, name, region, center)
select id, 'Yokohama', 'Kanto', st_point(139.6380, 35.4437)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Minato Mirai 21', '{Modern,Scenic,Icon}',
  'Waterfront urban district of glittering towers, a Ferris wheel, and the Yokohama Landmark Tower.',
  'The Sky Garden observation deck on the 69th floor of Landmark Tower opens at 10 am.',
  'Easy', 'Large', 'Busy', st_point(139.6330, 35.4554)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Yokohama Chinatown', '{Food,Culture,Icon}',
  'Japan''s largest Chinatown with over 600 shops and restaurants clustered around ten traditional gates.',
  'The Kantei-byo temple at the centre is free to enter and impressively ornate.',
  'Easy', 'Medium', 'Busy', st_point(139.6488, 35.4431)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Sankeien Garden', '{Nature,Historic,Scenic}',
  'Traditional landscape garden of 175,000 m² with historic buildings transplanted from Kyoto and Kamakura.',
  'The inner garden''s three-storey pagoda is the oldest structure and the best photo subject.',
  'Easy', 'Large', 'Quiet', st_point(139.6497, 35.4192)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Yamashita Park', '{Scenic,Coastal,Historic}',
  'Seaside promenade park facing the port, with the retired ocean liner Hikawa Maru moored alongside.',
  'Walk north along the waterfront at dusk to see the Ferris wheel and Landmark Tower light up.',
  'Easy', 'Medium', 'Moderate', st_point(139.6528, 35.4432)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Yokohama Museum of Art', '{Culture,Modern,Icon}',
  'Major contemporary art museum designed by Fumihiko Maki in the Minato Mirai district.',
  'The grand atrium courtyard is free to enter and worth seeing even without a ticket.',
  'Easy', 'Large', 'Moderate', st_point(139.6307, 35.4570)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Motomachi Shopping Street', '{Culture,Historic,Food}',
  'Elegant European-influenced shopping boulevard that developed around the former foreign settlement.',
  'The boutiques here carry independent Japanese brands rarely found elsewhere in the city.',
  'Easy', 'Medium', 'Moderate', st_point(139.6472, 35.4416)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Cup Noodles Museum', '{Culture,Modern,Icon}',
  'Interactive museum celebrating instant noodles where visitors can create a custom Cup Noodles to take home.',
  'The Chicken Ramen Factory workshop sells out quickly — book the timed slot online.',
  'Easy', 'Medium', 'Busy', st_point(139.6326, 35.4587)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Yokohama Foreign General Cemetery', '{Historic,Scenic,Culture}',
  'Hillside cemetery above Motomachi where 4,000 foreign residents of 40 nationalities are buried.',
  'Open on weekends; the ridge path offers a sweeping view of the bay between old gravestones.',
  'Moderate', 'Medium', 'Quiet', st_point(139.6453, 35.4443)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Yokohama' and k.code = 'JP';

-- Kawasaki (Kanto)
insert into cities (country_id, name, region, center)
select id, 'Kawasaki', 'Kanto', st_point(139.7029, 35.5308)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Kawasaki Daishi (Heiken-ji)', '{Sacred,Historic,Icon}',
  'One of Japan''s most visited Buddhist temples, famous for amulets warding off evil.',
  'Visit on the first three days of the New Year to join millions of worshippers at hatsumōde.',
  'Easy', 'Large', 'Busy', st_point(139.7248, 35.5257)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Fujiko F. Fujio Museum', '{Culture,Modern,Icon}',
  'Dedicated museum celebrating the creator of Doraemon with original manuscripts and themed exhibits.',
  'Entry is by advance lottery ticket only — book through the Lawson convenience store website.',
  'Easy', 'Medium', 'Busy', st_point(139.5673, 35.5929)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ikuta Ryokuchi Park', '{Nature,Scenic,Culture}',
  'Forested 180-hectare park with an open-air folk museum of traditional farmhouses from across Japan.',
  'The thatched gassho-zukuri houses from the Shirakawa region are the most impressive buildings.',
  'Easy', 'Large', 'Quiet', st_point(139.5611, 35.5962)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Kawasaki Municipal Museum', '{Culture,Historic,Icon}',
  'City history and media arts museum covering local industry and broadcasting heritage.',
  'The section on Kawasaki''s steel and industrial past is unexpectedly fascinating.',
  'Easy', 'Medium', 'Quiet', st_point(139.5607, 35.5948)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Kawasakishi Tama Ward Waterfront', '{Scenic,Nature,Coastal}',
  'Tama River embankment park with multi-use paths running between Tokyo and Yokohama.',
  'Rent a city-share bicycle and follow the riverbank path south to Yokohama Bay.',
  'Easy', 'Large', 'Moderate', st_point(139.6540, 35.5440)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'La Cittadella', '{Modern,Food,Culture}',
  'Italian-themed entertainment complex with restaurants, a cinema, and a wedding chapel in Shin-Yurigaoka.',
  'The cobblestone piazza hosts free outdoor concerts most weekend evenings in summer.',
  'Easy', 'Medium', 'Moderate', st_point(139.5431, 35.6012)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Kanagawa Prefectural Citizen''s Hall', '{Culture,Modern,Icon}',
  'Major performing arts venue hosting orchestral concerts, opera, and international touring productions.',
  'Standing tickets for same-day performances are often available at the box office at noon.',
  'Easy', 'Large', 'Moderate', st_point(139.6406, 35.4477)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Todoroki Valley', '{Nature,Scenic,Historic}',
  'Rare natural ravine in the Tokyo suburbs with a stream, shrine, and mossy walking path.',
  'Enter from the Todoroki station side and walk the full length to exit near Tamagawa.',
  'Easy', 'Medium', 'Quiet', st_point(139.6531, 35.6027)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kawasaki' and k.code = 'JP';

-- Osaka (Kansai)
insert into cities (country_id, name, region, center)
select id, 'Osaka', 'Kansai', st_point(135.5023, 34.6937)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Osaka Castle', '{Historic,Icon,Scenic}',
  'Reconstructed 16th-century fortress on a moat, once the largest castle in Japan under Toyotomi Hideyoshi.',
  'The grounds are free; buy the main tower ticket to access the museum and rooftop.',
  'Easy', 'Large', 'Busy', st_point(135.5259, 34.6873)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Dotonbori', '{Food,Icon,Culture}',
  'Neon-lit canal strip and the heart of Osaka''s street-food culture, home of takoyaki and kushikatsu.',
  'Walk the canal both sides — the north bank has the famous Glico running man sign.',
  'Easy', 'Medium', 'Busy', st_point(135.5006, 34.6687)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Universal Studios Japan', '{Modern,Icon,Culture}',
  'Major theme park featuring The Wizarding World of Harry Potter and Super Nintendo World.',
  'Book Express Passes for Nintendo World at least a month ahead — they sell out fast.',
  'Easy', 'Large', 'Busy', st_point(135.4326, 34.6654)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Shinsaibashi-suji', '{Culture,Food,Icon}',
  'Osaka''s longest covered shopping arcade, stretching nearly a kilometre from Shinsaibashi to Namba.',
  'Side streets off the southern end lead to the dense izakaya alleys of Amerika-Mura.',
  'Easy', 'Large', 'Busy', st_point(135.5016, 34.6740)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Sumiyoshi Taisha', '{Sacred,Historic,Icon}',
  'One of Japan''s oldest shrines, founded before the 3rd century, with distinctive non-Chinese architecture.',
  'Cross the arched stone bridge to the main shrine complex — the steep camber is intentional.',
  'Easy', 'Large', 'Moderate', st_point(135.4930, 34.6127)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Tennoji Zoo and Park', '{Nature,Culture,Historic}',
  'Japan''s third-oldest zoo set within a park that includes a medieval Buddhist temple complex.',
  'Shitenno-ji temple inside the park charges a separate entry and is often overlooked by visitors.',
  'Easy', 'Large', 'Moderate', st_point(135.5157, 34.6487)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Kuromon Ichiba Market', '{Food,Culture,Icon}',
  'Osaka''s "kitchen" market — 580 m of fresh seafood, wagyu beef, and seasonal produce stalls.',
  'Most stalls close by 2 pm; arrive at 10 am for the widest selection and freshest bites.',
  'Easy', 'Medium', 'Busy', st_point(135.5071, 34.6683)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Umeda Sky Building', '{Modern,Scenic,Icon}',
  'Futuristic twin-tower skyscraper connected at the top by a floating garden observatory at 170 m.',
  'The open-air circular deck is one of the few truly outdoor observatories in Japan.',
  'Easy', 'Large', 'Moderate', st_point(135.4895, 34.7054)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Osaka' and k.code = 'JP';

-- Kyoto (Kansai)
insert into cities (country_id, name, region, center)
select id, 'Kyoto', 'Kansai', st_point(135.7681, 35.0116)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Fushimi Inari Taisha', '{Sacred,Scenic,Icon}',
  'Shinto shrine famous for thousands of vermilion torii gates winding up the forested Mount Inari.',
  'Start before 7 am or after 5 pm when the lower gates are empty for photography.',
  'Moderate', 'Large', 'Busy', st_point(135.7727, 34.9671)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Kinkaku-ji', '{Sacred,Scenic,Historic}',
  'The Golden Pavilion — a Zen Buddhist temple whose top two floors are covered in gold leaf, set on a reflecting pond.',
  'Visit on a clear morning when the pavilion and its reflection are both sharp.',
  'Easy', 'Medium', 'Busy', st_point(135.7292, 35.0394)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Arashiyama Bamboo Grove', '{Nature,Scenic,Icon}',
  'Dense corridor of towering bamboo stalks on the western outskirts of Kyoto.',
  'The grove is most atmospheric at dawn — arrive by 6 am before the first tour groups.',
  'Easy', 'Medium', 'Busy', st_point(135.6727, 35.0170)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Kiyomizu-dera', '{Sacred,Scenic,Historic}',
  'UNESCO-listed hilltop temple with a wooden stage projecting over a forested ravine since 1633.',
  'Circle round to Jishu Shrine behind the main hall — it enshrines the deity of love.',
  'Moderate', 'Large', 'Busy', st_point(135.7850, 34.9948)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Gion', '{Historic,Culture,Icon}',
  'Kyoto''s most famous geisha district of preserved machiya townhouses and lantern-lit teahouses.',
  'Station yourself on Hanamikoji Street between 5 pm and 6 pm to spot geiko and maiko.',
  'Easy', 'Medium', 'Busy', st_point(135.7753, 35.0037)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Nishiki Market', '{Food,Culture,Historic}',
  'A narrow five-block covered market nicknamed "Kyoto''s Kitchen," lined with 100+ food stalls.',
  'Try tofu doughnuts and pickled vegetables before noon when stocks are freshest.',
  'Easy', 'Small', 'Busy', st_point(135.7654, 35.0049)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Nijo Castle', '{Historic,Culture,Icon}',
  'Tokugawa shogunate palace complex with "nightingale floors" that squeak to alert against intruders.',
  'Walk slowly and quietly inside to hear the floor sounds most clearly.',
  'Easy', 'Large', 'Moderate', st_point(135.7481, 35.0142)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Philosopher''s Path', '{Nature,Scenic,Historic}',
  'A stone-paved canal walkway lined with cherry trees, named after philosopher Nishida Kitaro''s daily stroll.',
  'Walk south to north ending at Ginkaku-ji; the final stretch under the tree canopy is the best.',
  'Easy', 'Medium', 'Moderate', st_point(135.7949, 35.0270)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kyoto' and k.code = 'JP';

-- Kobe (Kansai)
insert into cities (country_id, name, region, center)
select id, 'Kobe', 'Kansai', st_point(135.1830, 34.6901)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Kitano Ijinkan', '{Historic,Culture,Icon}',
  'Hillside district of 19th-century Western-style residences built by foreign merchants after the port opened.',
  'The Weathercock House and the Moegi House are the most photogenic pair; a combo ticket saves money.',
  'Moderate', 'Medium', 'Moderate', st_point(135.1847, 34.6989)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Kobe Harborland', '{Modern,Scenic,Food}',
  'Waterfront shopping and entertainment complex with views of the Akashi Kaikyo Bridge and Awaji Island.',
  'The Mosaic Garden canal-side restaurants are best enjoyed at sunset over the harbour.',
  'Easy', 'Large', 'Moderate', st_point(135.1823, 34.6780)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Nunobiki Herb Garden', '{Nature,Scenic,Culture}',
  'Terraced herb and flower garden on the slopes of Mount Rokko, reached by ropeway from the city.',
  'Take the ropeway up and walk back down the forest trail for a free descent with city views.',
  'Easy', 'Large', 'Moderate', st_point(135.1816, 34.7109)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Ikuta Shrine', '{Sacred,Historic,Culture}',
  'One of Japan''s oldest Shinto shrines, nestled in a small forest in the heart of downtown Kobe.',
  'The shrine forest (Ikuta-no-mori) behind the main hall is a quiet oasis in the city.',
  'Easy', 'Medium', 'Moderate', st_point(135.1939, 34.6967)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Kobe Beef Restaurants, Kitamae', '{Food,Culture,Icon}',
  'The Kitamae district concentrates Kobe''s most renowned wagyu teppanyaki restaurants.',
  'Ask for a seat at the teppan counter to watch the chef work and get the freshest cuts first.',
  'Easy', 'Small', 'Busy', st_point(135.1961, 34.6939)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Akashi Kaikyo Bridge', '{Modern,Icon,Scenic}',
  'The world''s longest suspension bridge at 3,911 m, spanning the Akashi Strait to Awaji Island.',
  'Walk out on the Maiko Marine Promenade beneath the bridge for a vertiginous upward view.',
  'Easy', 'Large', 'Moderate', st_point(135.0138, 34.6267)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Kobe City Museum', '{Historic,Culture,Icon}',
  'Museum tracing Kobe''s history from ancient times through its role as Japan''s gateway to the West.',
  'The Namban art collection — European-influenced screens from the 16th century — is the highlight.',
  'Easy', 'Medium', 'Quiet', st_point(135.1936, 34.6900)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Mount Rokko', '{Nature,Scenic,Moderate}',
  'Mountain range rising behind Kobe to 931 m with hiking trails, gardens, and a night-view observatory.',
  'The Rokko Garden Terrace at the summit is the best spot for Kobe''s famous "10 million dollar view" at night.',
  'Moderate', 'Large', 'Moderate', st_point(135.2569, 34.7656)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Kobe' and k.code = 'JP';

-- Nagoya (Chubu)
insert into cities (country_id, name, region, center)
select id, 'Nagoya', 'Chubu', st_point(136.9066, 35.1815)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Nagoya Castle', '{Historic,Icon,Culture}',
  'Original Edo-period castle famed for its golden shachi (tiger-fish) ornaments on the roof ridges.',
  'The Honmaru Palace reconstruction next to the keep shows feudal-era interiors in meticulous detail.',
  'Easy', 'Large', 'Moderate', st_point(136.8990, 35.1855)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Toyota Commemorative Museum of Industry and Technology', '{Culture,Modern,Historic}',
  'Vast industrial museum in a former Toyota loom factory covering the evolution from textiles to cars.',
  'The robot-arm weaving demonstration runs hourly and is the most compelling exhibit.',
  'Easy', 'Large', 'Moderate', st_point(136.8833, 35.1983)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Atsuta Jingu', '{Sacred,Historic,Icon}',
  'One of Japan''s most important Shinto shrines, housing the sacred Kusanagi sword of imperial regalia.',
  'Walk the shaded inner paths early morning to experience the shrine''s ancient forest atmosphere.',
  'Easy', 'Large', 'Moderate', st_point(136.9083, 35.1280)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Osu Kannon and Shopping District', '{Sacred,Food,Culture}',
  'Popular Buddhist temple adjacent to a vibrant covered arcade of vintage shops, street food, and subculture.',
  'The flea market at Osu Kannon temple runs on the 18th and 28th of each month.',
  'Easy', 'Medium', 'Busy', st_point(136.9046, 35.1600)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'SCMAGLEV and Railway Park', '{Modern,Culture,Icon}',
  'Toyota Railway museum with real Shinkansen and maglev prototype trains, plus a large layout room.',
  'The N700 Shinkansen driver simulator books out immediately; queue at the machine at opening.',
  'Easy', 'Large', 'Busy', st_point(136.9523, 35.1553)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Nagoya TV Tower', '{Modern,Scenic,Icon}',
  'Japan''s first completed TV tower from 1954, now a retro landmark in the central Hisaya Odori Park.',
  'The Sky Deck at 100 m is the best vantage point for the straight boulevard stretching south.',
  'Easy', 'Medium', 'Moderate', st_point(136.9081, 35.1810)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Nagoya Port Aquarium', '{Modern,Culture,Nature}',
  'One of Japan''s largest aquariums featuring beluga whales, orca shows, and Antarctic penguin displays.',
  'The dolphin and orca performance stadium fills quickly; grab seats 30 minutes before the show.',
  'Easy', 'Large', 'Busy', st_point(136.8852, 35.0875)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Tokugawa Art Museum', '{Historic,Culture,Icon}',
  'Museum housing the Owari Tokugawa family''s heirlooms including armour, tea ceremony utensils, and picture scrolls.',
  'The Genji Monogatari emaki scroll is displayed only in November — plan accordingly.',
  'Easy', 'Medium', 'Quiet', st_point(136.9348, 35.1882)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nagoya' and k.code = 'JP';

-- Sapporo (Hokkaido)
insert into cities (country_id, name, region, center)
select id, 'Sapporo', 'Hokkaido', st_point(141.3544, 43.0618)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Sapporo Snow Festival Site (Odori Park)', '{Culture,Scenic,Icon}',
  'The central park that hosts Japan''s most famous snow sculpture festival every February.',
  'Even outside the festival, Odori Park is the city''s green spine — walk the full 13-block length.',
  'Easy', 'Large', 'Busy', st_point(141.3538, 43.0606)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Sapporo Beer Museum', '{Culture,Historic,Icon}',
  'Free heritage museum inside the original 1890 brewery, with a paid tasting hall for Sapporo Classic draft.',
  'The tasting room serves flagship and limited Hokkaido-only beers not sold elsewhere.',
  'Easy', 'Medium', 'Moderate', st_point(141.3605, 43.0685)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Hokkaido Shrine', '{Sacred,Nature,Scenic}',
  'Principal Shinto shrine of Hokkaido set in a forested park with one of the city''s best cherry blossom displays.',
  'The shrine grounds are free and open at all hours; the cherry trees peak in late April.',
  'Easy', 'Large', 'Moderate', st_point(141.3238, 43.0594)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Mount Moiwa Ropeway', '{Scenic,Nature,Icon}',
  'Twin ropeway ascending to the 531-metre summit with a panoramic night view ranked among Japan''s top three.',
  'Take the last car up at 9:30 pm for the full-city night illumination at its most dramatic.',
  'Easy', 'Medium', 'Moderate', st_point(141.3195, 43.0345)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Nijo Market', '{Food,Culture,Historic}',
  'Lively morning seafood market near central Sapporo, famous for fresh crab, salmon roe, and sea urchin.',
  'Come before 10 am for the full range of stalls; try a kaisendon rice bowl on-site.',
  'Easy', 'Small', 'Busy', st_point(141.3562, 43.0604)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Historic Village of Hokkaido', '{Historic,Culture,Nature}',
  'Open-air museum of 52 relocated Meiji and Taisho-era buildings on a wooded site east of the city.',
  'Horse-drawn sleighs operate in winter; horse-drawn carriages run in summer — both are free with entry.',
  'Easy', 'Large', 'Quiet', st_point(141.4851, 43.0490)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Shiroi Koibito Park', '{Culture,Modern,Food}',
  'Chocolate factory theme park built around the production of Hokkaido''s most iconic souvenir cookie.',
  'Book a chocolate-making workshop online; the Tudor-style building exterior is photogenic year-round.',
  'Easy', 'Medium', 'Moderate', st_point(141.3133, 43.0866)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Sapporo Clock Tower', '{Historic,Icon,Culture}',
  'Hokkaido''s most famous historic building from 1878, a wooden American-style tower in the city centre.',
  'The interior museum on Sapporo''s founding is free and explains the Meiji colonisation of Hokkaido.',
  'Easy', 'Small', 'Moderate', st_point(141.3544, 43.0614)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Sapporo' and k.code = 'JP';

-- Fukuoka (Kyushu)
insert into cities (country_id, name, region, center)
select id, 'Fukuoka', 'Kyushu', st_point(130.4017, 33.5904)::geography
from countries where code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Fukuoka Castle Ruins (Maizuru Park)', '{Historic,Scenic,Nature}',
  'Remains of a vast 17th-century castle on a hill, now a cherry-blossom park with partial stone walls standing.',
  'The east turret is the best-preserved structure; cherry blossoms here peak in late March.',
  'Easy', 'Large', 'Moderate', st_point(130.3880, 33.5865)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Ohori Park', '{Nature,Scenic,Culture}',
  'Expansive lake park in central Fukuoka with a jogging path, teahouse, and Japanese garden.',
  'Rent a swan pedalo on the lake for a relaxed view of the skyline.',
  'Easy', 'Large', 'Moderate', st_point(130.3836, 33.5868)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Kushida Shrine', '{Sacred,Historic,Culture}',
  'Fukuoka''s principal shrine, guardian of the city and home to the spectacular Yamakasa float festival.',
  'The enormous Yamakasa racing float is on permanent display inside — it''s free to view.',
  'Easy', 'Medium', 'Moderate', st_point(130.4097, 33.5985)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Canal City Hakata', '{Modern,Food,Culture}',
  'Postmodern canal-laced shopping complex designed by Jerde Partnership with a curving facade of terraces.',
  'The Ramen Stadium on the 5th floor gathers eight regional ramen styles under one roof.',
  'Easy', 'Large', 'Busy', st_point(130.4125, 33.5898)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Nakasu Yatai', '{Food,Culture,Icon}',
  'Open-air food stall strip on an island between rivers, the most atmospheric of Fukuoka''s famous yatai.',
  'Arrive after 7 pm when the yatai open and the neon reflections are brightest on the water.',
  'Easy', 'Small', 'Busy', st_point(130.4108, 33.5920)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Dazaifu Tenmangu', '{Sacred,Historic,Icon}',
  'Nationally revered shrine dedicated to the deity of learning, set in gardens with a famous arched bridge.',
  'Students visit before exams; the ume (plum) blossoms in February are spectacular.',
  'Easy', 'Large', 'Busy', st_point(130.5344, 33.5183)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Fukuoka Tower', '{Modern,Scenic,Icon}',
  'Japan''s tallest seaside tower at 234 m, clad in half-mirror glass on the waterfront.',
  'The observation deck at 123 m gives the widest view of Hakata Bay and the city grid.',
  'Easy', 'Large', 'Moderate', st_point(130.3623, 33.5939)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Hakata Old Town (Hakata Machiya Folk Museum)', '{Historic,Culture,Food}',
  'Preserved Meiji-era townhouse museum explaining Hakata''s merchant and textile weaving heritage.',
  'The weavers demonstrate hakata-ori silk on working looms daily; free to watch.',
  'Easy', 'Small', 'Quiet', st_point(130.4100, 33.5982)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Fukuoka' and k.code = 'JP';
