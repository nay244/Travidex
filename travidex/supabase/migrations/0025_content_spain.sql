-- Phase 10 content: Spain. Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('Spain', 'ES', 'cities');

-- Madrid (Community of Madrid)
insert into cities (country_id, name, region, center)
select id, 'Madrid', 'Community of Madrid', st_point(-3.7038, 40.4168)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Museo del Prado', '{Culture,Historic,Icon}',
  'Spain''s national art museum holding masterworks by Velázquez, Goya, and El Greco.',
  'Book timed-entry tickets online and arrive early; the queues grow fast after 10 am.',
  'Easy', 'Large', 'Busy', st_point(-3.6920, 40.4138)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Puerta del Sol', '{Icon,Historic,Culture}',
  'Madrid''s central pedestrian plaza and the symbolic kilometre-zero point of Spain''s road network.',
  'Look for the bronze bear and strawberry tree statue — the traditional meeting spot.',
  'Easy', 'Large', 'Busy', st_point(-3.7035, 40.4167)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Royal Palace of Madrid', '{Historic,Culture,Icon}',
  'Europe''s largest royal palace by floor area, with 3,418 rooms of lavish Baroque interiors.',
  'Visit on Wednesday or Thursday afternoon for free admission for EU citizens.',
  'Easy', 'Large', 'Busy', st_point(-3.7143, 40.4179)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Retiro Park', '{Nature,Scenic,Culture}',
  'Vast 140-hectare royal park with a boating lake, crystal palace, and shaded promenades.',
  'Rent a rowboat on the estanque pond on Sunday morning before the crowds arrive.',
  'Easy', 'Large', 'Busy', st_point(-3.6845, 40.4151)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Plaza Mayor', '{Historic,Icon,Food}',
  'Grand 17th-century arcaded square that served as the stage for royal ceremonies, bullfights, and markets.',
  'Explore the side streets off the square for traditional mesones serving Madrid cocido.',
  'Easy', 'Large', 'Busy', st_point(-3.7074, 40.4154)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Museo Reina Sofía', '{Culture,Modern,Icon}',
  'Spain''s national museum of 20th-century art, home to Picasso''s Guernica.',
  'Guernica is on the second floor; arrive at opening to see it without crowds around it.',
  'Easy', 'Large', 'Moderate', st_point(-3.6932, 40.4085)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Gran Vía', '{Modern,Culture,Icon}',
  'Madrid''s grand early-20th-century boulevard lined with Beaux-Arts and Art Deco architecture.',
  'Walk the full length from Calle de Alcalá to Plaza de España at night for the best lights.',
  'Easy', 'Large', 'Busy', st_point(-3.7057, 40.4201)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Mercado de San Miguel', '{Food,Culture,Historic}',
  'Ornate 1916 cast-iron market hall packed with tapas stalls, vermouth bars, and fresh produce.',
  'Come between noon and 1 pm on weekdays to avoid the tourist rush while everything is freshest.',
  'Easy', 'Medium', 'Busy', st_point(-3.7087, 40.4153)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Madrid' and k.code = 'ES';

-- Barcelona (Catalonia)
insert into cities (country_id, name, region, center)
select id, 'Barcelona', 'Catalonia', st_point(2.1734, 41.3851)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Sagrada Família', '{Sacred,Modern,Icon}',
  'Gaudí''s unfinished Modernista basilica, under continuous construction since 1882.',
  'Book skip-the-line tickets with tower access weeks ahead — the view from the towers is unmissable.',
  'Easy', 'Large', 'Busy', st_point(2.1744, 41.4036)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Park Güell', '{Scenic,Modern,Icon}',
  'Gaudí''s whimsical hilltop park of mosaic terraces, gingerbread gatehouses, and city panoramas.',
  'The monumental zone requires a timed ticket; buy online as same-day tickets sell out early.',
  'Moderate', 'Large', 'Busy', st_point(2.1528, 41.4145)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'La Rambla', '{Icon,Culture,Food}',
  'Barcelona''s famous 1.2 km tree-lined promenade from Plaça de Catalunya to the port.',
  'Keep valuables secure — pickpockets target tourists here; use a front-facing bag.',
  'Easy', 'Large', 'Busy', st_point(2.1730, 41.3800)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Casa Batlló', '{Modern,Historic,Icon}',
  'Gaudí''s dragon-spine masterpiece on Passeig de Gràcia, clad in iridescent ceramic scales.',
  'The Magic Nights evening visit includes a multimedia show on the rooftop terrace.',
  'Easy', 'Medium', 'Busy', st_point(2.1650, 41.3916)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Gothic Quarter', '{Historic,Culture,Food}',
  'Barcelona''s medieval core of Roman walls, cathedral cloisters, and narrow lamp-lit lanes.',
  'The Roman temple of Augustus hidden inside a medieval courtyard on Carrer del Paradís is free.',
  'Easy', 'Medium', 'Busy', st_point(2.1763, 41.3833)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Camp Nou', '{Culture,Modern,Icon}',
  'Home of FC Barcelona and Europe''s largest football stadium, seating nearly 100,000 spectators.',
  'The museum tour includes the pitch-side tunnel; book the immersive experience for the full effect.',
  'Easy', 'Large', 'Busy', st_point(2.1228, 41.3809)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Barceloneta Beach', '{Coastal,Scenic,Food}',
  'The city''s main urban beach stretching 1.1 km below the Olympic port, backed by seafood restaurants.',
  'Arrive by 9 am in summer to claim a spot; the sands fill completely by midday.',
  'Easy', 'Large', 'Busy', st_point(2.1917, 41.3790)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Montjuïc', '{Scenic,Historic,Culture}',
  'Hilltop park complex with a castle, Olympic stadium, Miró Foundation, and panoramic city views.',
  'Take the cable car from Barceloneta for the most dramatic ascent and aerial view of the port.',
  'Moderate', 'Large', 'Moderate', st_point(2.1555, 41.3639)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Barcelona' and k.code = 'ES';

-- Seville (Andalusia)
insert into cities (country_id, name, region, center)
select id, 'Seville', 'Andalusia', st_point(-5.9845, 37.3891)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Seville Cathedral', '{Sacred,Historic,Icon}',
  'The world''s largest Gothic cathedral and UNESCO site, housing Columbus''s tomb.',
  'Climb the Giralda bell tower via its ramp — designed for horses — for a view over the old town.',
  'Easy', 'Large', 'Busy', st_point(-5.9928, 37.3857)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Real Alcázar', '{Historic,Scenic,Icon}',
  'Living royal palace and UNESCO World Heritage site with Mudéjar architecture and lush garden mazes.',
  'Book tickets online — the palace still hosts royals and can close at short notice.',
  'Easy', 'Large', 'Busy', st_point(-5.9901, 37.3833)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Plaza de España', '{Icon,Historic,Scenic}',
  'Monumental 1929 semi-circular pavilion of tilework alcoves representing every Spanish province.',
  'Rent a rowboat on the canal encircling the plaza for a unique low-angle perspective.',
  'Easy', 'Large', 'Busy', st_point(-5.9869, 37.3774)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Barrio Santa Cruz', '{Historic,Culture,Food}',
  'Seville''s old Jewish quarter, a labyrinth of whitewashed alleys, orange trees, and flamenco bars.',
  'Wander at night when the alleys are lit and the tapas bars spill onto the street.',
  'Easy', 'Medium', 'Busy', st_point(-5.9883, 37.3853)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Metropol Parasol', '{Modern,Culture,Icon}',
  'The world''s largest wooden structure — a waffle-canopy plaza providing shade over a Roman ruin.',
  'Climb to the walkway on top at sunset; the view over the old town is spectacular.',
  'Easy', 'Large', 'Moderate', st_point(-5.9921, 37.3926)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Torre del Oro', '{Historic,Scenic,Icon}',
  '13th-century Moorish watchtower on the Guadalquivir riverbank, now a small naval museum.',
  'Walk along the river promenade at dusk for the best light on the tower''s golden stone.',
  'Easy', 'Small', 'Moderate', st_point(-5.9965, 37.3826)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Triana', '{Culture,Food,Historic}',
  'The potters'' and flamenco quarter across the Guadalquivir, famous for its ceramics and tapas bars.',
  'Visit the Mercado de Triana for local produce and stop at a ceramic workshop on Calle Alfarería.',
  'Easy', 'Medium', 'Moderate', st_point(-6.0046, 37.3849)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Casa de Pilatos', '{Historic,Culture,Scenic}',
  'A private Renaissance-Mudéjar palace with one of Spain''s finest collections of Roman sculpture.',
  'The upper floor is only open on guided tours — book ahead for access to the private apartments.',
  'Easy', 'Medium', 'Quiet', st_point(-5.9869, 37.3878)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seville' and k.code = 'ES';

-- Valencia (Valencian Community)
insert into cities (country_id, name, region, center)
select id, 'Valencia', 'Valencian Community', st_point(-0.3763, 39.4699)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'City of Arts and Sciences', '{Modern,Culture,Icon}',
  'Santiago Calatrava''s futuristic cultural complex of bone-white structures along the old Turia riverbed.',
  'Walk the complex at night when the buildings reflect in the surrounding shallow pools.',
  'Easy', 'Large', 'Moderate', st_point(-0.3502, 39.4546)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Valencia Cathedral', '{Sacred,Historic,Icon}',
  'Gothic-Baroque cathedral housing the Holy Grail and a Romanesque bell tower called El Miguelete.',
  'Climb El Miguelete for a 360-degree view of the old town and Mediterranean horizon.',
  'Easy', 'Large', 'Moderate', st_point(-0.3751, 39.4754)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Mercado Central', '{Food,Historic,Culture}',
  'One of Europe''s largest covered markets, a 1928 Art Nouveau hall selling fresh paella ingredients.',
  'Try a glass of horchata and a fartón pastry at the traditional stall inside the market.',
  'Easy', 'Large', 'Busy', st_point(-0.3787, 39.4741)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Turia Gardens', '{Nature,Scenic,Culture}',
  '9-km linear park threading through the city along the diverted Turia riverbed.',
  'Rent a bike and cycle the full length from the City of Arts to the Jardí del Túria entrance.',
  'Easy', 'Large', 'Moderate', st_point(-0.3700, 39.4680)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'La Lonja de la Seda', '{Historic,Culture,Icon}',
  'UNESCO-listed 15th-century Gothic silk exchange hall, with twisted columns and gilded trading rooms.',
  'The sala de contratación is free on Sunday mornings — check the opening hours before visiting.',
  'Easy', 'Medium', 'Moderate', st_point(-0.3784, 39.4736)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Malvarrosa Beach', '{Coastal,Scenic,Food}',
  'Valencia''s broad urban beach backed by paella restaurants in the Cabanyal neighbourhood.',
  'The Cabanyal neighbourhood behind the beach has colourful tiled houses worth a wander.',
  'Easy', 'Large', 'Busy', st_point(-0.3285, 39.4741)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Bioparc Valencia', '{Nature,Culture,Modern}',
  'Immersive zoo recreating African savannah habitats with no visible barriers between animals and visitors.',
  'Arrive at opening for feeding times and the best chance to see the gorillas active.',
  'Easy', 'Large', 'Moderate', st_point(-0.4087, 39.4741)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'L''Oceanogràfic', '{Modern,Culture,Nature}',
  'Europe''s largest aquarium, designed by Félix Candela, with an underwater restaurant in a glass tunnel.',
  'Book the shark-tank dive experience if certified — daily slots fill up quickly.',
  'Easy', 'Large', 'Busy', st_point(-0.3541, 39.4530)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Valencia' and k.code = 'ES';

-- Granada (Andalusia)
insert into cities (country_id, name, region, center)
select id, 'Granada', 'Andalusia', st_point(-3.5986, 37.1773)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Alhambra', '{Historic,Scenic,Icon}',
  'Moorish palace and fortress complex on a forested hill, one of the world''s finest examples of Islamic art.',
  'Book Nasrid Palaces tickets months in advance; they release at midnight and sell out instantly.',
  'Moderate', 'Large', 'Busy', st_point(-3.5889, 37.1761)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Generalife Gardens', '{Scenic,Nature,Historic}',
  'The Alhambra''s summer palace and terraced gardens of fountains and rose hedges above the palace complex.',
  'Walk through the cypress avenue at the upper garden for the best framed view of the Alhambra walls.',
  'Moderate', 'Large', 'Moderate', st_point(-3.5828, 37.1778)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Albaicín', '{Historic,Scenic,Culture}',
  'UNESCO-listed Moorish quarter of whitewashed houses climbing the hill opposite the Alhambra.',
  'Reach the Mirador de San Nicolás at sunset for the classic view of the Alhambra and Sierra Nevada.',
  'Moderate', 'Medium', 'Busy', st_point(-3.5953, 37.1808)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Granada Cathedral', '{Sacred,Historic,Icon}',
  'Renaissance cathedral begun in 1523 on the site of the Great Mosque, with the Royal Chapel beside it.',
  'The Royal Chapel houses the tombs of Ferdinand and Isabella — a separate ticket is needed.',
  'Easy', 'Large', 'Moderate', st_point(-3.5987, 37.1764)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Sacromonte', '{Culture,Historic,Scenic}',
  'Hillside cave district traditionally home to Romani flamenco artists and hand-carved cave dwellings.',
  'Book a zambra flamenco show in a cave taverna — far more authentic than stage shows elsewhere.',
  'Moderate', 'Medium', 'Moderate', st_point(-3.5849, 37.1830)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Corral del Carbón', '{Historic,Culture,Icon}',
  'Andalusia''s oldest Moorish monument, a 14th-century caravanserai that became a theatre and coal store.',
  'Free to enter and rarely crowded — the horseshoe arch of the gate is exceptionally preserved.',
  'Easy', 'Small', 'Quiet', st_point(-3.5998, 37.1754)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Alcaicería', '{Culture,Historic,Food}',
  'Reconstructed Moorish silk market of tiny lanes selling spices, ceramics, and leatherwork.',
  'Prices are fixed and higher here; use it for the atmosphere and buy from potters in Albaicín.',
  'Easy', 'Small', 'Busy', st_point(-3.5993, 37.1762)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Sierra Nevada', '{Nature,Scenic,Culture}',
  'Spain''s highest mountain range rising to 3,479 m, offering skiing in winter and hiking in summer.',
  'The ski resort road is only 30 km from Granada — a day trip is easy from the city centre.',
  'Hard', 'Large', 'Moderate', st_point(-3.3925, 37.0999)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Granada' and k.code = 'ES';

-- Bilbao (Basque Country)
insert into cities (country_id, name, region, center)
select id, 'Bilbao', 'Basque Country', st_point(-2.9253, 43.2630)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Guggenheim Museum Bilbao', '{Modern,Culture,Icon}',
  'Frank Gehry''s titanium-clad masterpiece on the Nervión riverside, landmark of contemporary architecture.',
  'Jeff Koons''s giant flower-covered Puppy outside is free to see without entering the museum.',
  'Easy', 'Large', 'Busy', st_point(-2.9337, 43.2688)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Casco Viejo', '{Historic,Food,Culture}',
  'Bilbao''s old quarter of medieval lanes — the Siete Calles — packed with pintxos bars and covered markets.',
  'The pintxos crawl is best on Thursday evenings when bars refresh their spreads.',
  'Easy', 'Medium', 'Busy', st_point(-2.9246, 43.2592)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Mercado de la Ribera', '{Food,Historic,Culture}',
  'Europe''s largest covered fresh market in a 1929 Art Deco building on the Nervión waterfront.',
  'The upper pintxos bars open at noon; arrive early for the best selection of Basque bites.',
  'Easy', 'Large', 'Busy', st_point(-2.9232, 43.2579)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Bilbao Fine Arts Museum', '{Culture,Historic,Icon}',
  'Spain''s second most visited art museum with a collection spanning seven centuries of European art.',
  'Admission is free on Wednesday afternoons — the Basque galleries are often overlooked by visitors.',
  'Easy', 'Large', 'Quiet', st_point(-2.9363, 43.2660)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Puente de Vizcaya', '{Historic,Modern,Icon}',
  'UNESCO-listed 1893 transporter bridge — the world''s oldest — suspending a gondola car across the estuary.',
  'Walk the upper catwalk for dizzying views over the Nervión estuary and the Atlantic mouth.',
  'Easy', 'Medium', 'Quiet', st_point(-3.0169, 43.3213)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Artxanda Funicular', '{Scenic,Nature,Icon}',
  'Historic funicular railway climbing to a hilltop park with sweeping panoramas over the whole city.',
  'Come at dusk for a golden view of the Guggenheim and the Ensanche district laid out below.',
  'Easy', 'Small', 'Quiet', st_point(-2.9380, 43.2740)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Basílica de Begoña', '{Sacred,Historic,Scenic}',
  '16th-century Gothic basilica on a hill above the old town, dedicated to Bilbao''s patron saint.',
  'Take the outdoor escalator from the Casco Viejo to reach the basilica and its panoramic terrace.',
  'Easy', 'Medium', 'Quiet', st_point(-2.9228, 43.2629)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Alhóndiga Bilbao', '{Modern,Culture,Icon}',
  'Ricardo Bofill''s 2010 conversion of a wine warehouse into a leisure and culture centre with a rooftop pool.',
  'The ground floor forest of 43 uniquely designed columns is free to walk through at any time.',
  'Easy', 'Large', 'Moderate', st_point(-2.9333, 43.2636)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bilbao' and k.code = 'ES';

-- Córdoba (Andalusia)
insert into cities (country_id, name, region, center)
select id, 'Córdoba', 'Andalusia', st_point(-4.7794, 37.8882)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Mezquita-Catedral', '{Sacred,Historic,Icon}',
  'UNESCO-listed Great Mosque of Córdoba, a forest of 856 striped arches later converted into a cathedral.',
  'Enter through the Puerta del Perdón in the morning when the arches are lit by low sunlight.',
  'Easy', 'Large', 'Busy', st_point(-4.7793, 37.8789)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Judería', '{Historic,Culture,Scenic}',
  'Córdoba''s medieval Jewish quarter of whitewashed flower-filled alleys surrounding a 14th-century synagogue.',
  'The Calleja de las Flores alleyway frames the Mezquita tower perfectly — join the short queue for the photo.',
  'Easy', 'Medium', 'Busy', st_point(-4.7818, 37.8793)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Alcázar de los Reyes Cristianos', '{Historic,Scenic,Icon}',
  'Fortified palace of the Christian monarchs with Roman mosaics and terraced water gardens.',
  'The ramparts offer the best aerial view of the Mezquita — walk the full circuit.',
  'Easy', 'Large', 'Moderate', st_point(-4.7843, 37.8776)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Medina Azahara', '{Historic,Culture,Icon}',
  'Ruined 10th-century Moorish palace-city on the Sierra Morena hillside, UNESCO World Heritage site.',
  'The on-site museum displays the finest carved marble panels before you walk the ruins.',
  'Hard', 'Large', 'Quiet', st_point(-4.8451, 37.8867)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Puente Romano', '{Historic,Scenic,Icon}',
  'Roman bridge of 16 arches spanning the Guadalquivir, built in the 1st century BC and still in use.',
  'Walk to the midpoint at night for a perfectly framed view of the Mezquita glowing across the water.',
  'Easy', 'Large', 'Moderate', st_point(-4.7793, 37.8776)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Patio Festival', '{Culture,Scenic,Icon}',
  'Córdoba''s UNESCO-listed May festival where private courtyards fill with jasmine and geraniums for judging.',
  'Buy the tourist patio map from the tourist office; many owners invite visitors in even outside festival time.',
  'Easy', 'Small', 'Busy', st_point(-4.7818, 37.8830)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Palacio de Viana', '{Historic,Culture,Scenic}',
  'Renaissance palace with twelve themed interior patios and a museum of decorative arts.',
  'The patio ticket is cheaper than the full palace and gives access to all twelve courtyards.',
  'Easy', 'Medium', 'Moderate', st_point(-4.7740, 37.8841)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Museo Arqueológico de Córdoba', '{Culture,Historic,Icon}',
  'Archaeogical museum tracing Córdoba from Prehistory through its caliphate peak, with fine Roman mosaics.',
  'The basement Roman theatre section is accessed via a glass floor — an unexpectedly dramatic reveal.',
  'Easy', 'Medium', 'Quiet', st_point(-4.7788, 37.8808)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Córdoba' and k.code = 'ES';

-- Málaga (Andalusia)
insert into cities (country_id, name, region, center)
select id, 'Málaga', 'Andalusia', st_point(-4.4214, 36.7213)::geography
from countries where code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Alcazaba de Málaga', '{Historic,Scenic,Icon}',
  'Moorish palace-fortress from the 11th century rising above the city with layered defensive walls.',
  'The combined ticket with the Castillo de Gibralfaro above saves money and rewards the full climb.',
  'Moderate', 'Large', 'Moderate', st_point(-4.4184, 36.7208)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Museo Picasso Málaga', '{Culture,Historic,Icon}',
  'Picasso''s birthplace city museum in a 16th-century palace with 233 works donated by his heirs.',
  'The permanent collection is smaller than expected — combine with the Casa Natal Picasso nearby.',
  'Easy', 'Medium', 'Moderate', st_point(-4.4174, 36.7212)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Málaga Cathedral', '{Sacred,Historic,Culture}',
  'Renaissance cathedral nicknamed La Manquita (one-armed lady) for its single completed tower.',
  'Rooftop tours run daily — the terrace walk between the towers is the city''s best-kept viewpoint.',
  'Easy', 'Large', 'Moderate', st_point(-4.4194, 36.7197)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Castillo de Gibralfaro', '{Historic,Scenic,Icon}',
  '14th-century Moorish castle crowning the highest hill with panoramic views of the harbour and coast.',
  'The walled parapet walk around the perimeter gives 360-degree views that the interior alone doesn''t.',
  'Moderate', 'Medium', 'Moderate', st_point(-4.4121, 36.7232)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Málaga Port and Muelle Uno', '{Coastal,Modern,Food}',
  'Revitalised marina promenade of boutiques, restaurants, and the gleaming Centre Pompidou Málaga.',
  'The Centre Pompidou is a satellite of the Paris original — its colourful glass cube is iconic.',
  'Easy', 'Large', 'Moderate', st_point(-4.4153, 36.7162)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Calle Marqués de Larios', '{Culture,Historic,Food}',
  'Málaga''s elegant 19th-century marble pedestrian boulevard lined with palms and terraced cafés.',
  'Carnival and Semana Santa processions fill this street — check the events calendar before visiting.',
  'Easy', 'Medium', 'Busy', st_point(-4.4215, 36.7203)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Teatro Romano de Málaga', '{Historic,Culture,Icon}',
  'Well-preserved 1st-century BC Roman theatre excavated at the foot of the Alcazaba hill.',
  'Entry is free; the interpretation centre beside it gives good context on the excavation history.',
  'Easy', 'Medium', 'Quiet', st_point(-4.4184, 36.7213)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Playa de la Malagueta', '{Coastal,Scenic,Food}',
  'The city''s central urban beach with fine dark sand, a chiringuito strip, and views of the castle hill.',
  'Order espetos — sardines grilled on a bamboo skewer over a beach brazier — from a chiringuito.',
  'Easy', 'Large', 'Busy', st_point(-4.4082, 36.7148)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Málaga' and k.code = 'ES';
