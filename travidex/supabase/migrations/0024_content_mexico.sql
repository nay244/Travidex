-- Phase 10 content: Mexico. Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('Mexico', 'MX', 'cities');

-- Mexico City (Mexico City)
insert into cities (country_id, name, region, center)
select id, 'Mexico City', 'Mexico City', st_point(-99.1332, 19.4326)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Zócalo', '{Icon,Historic,Culture}',
  'One of the world''s largest central plazas, flanked by the Metropolitan Cathedral and the National Palace.',
  'Visit on a weekday morning to see the flag-raising ceremony and avoid weekend crowds.',
  'Easy', 'Large', 'Busy', st_point(-99.1332, 19.4326)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Palacio de Bellas Artes', '{Culture,Historic,Icon}',
  'Art Nouveau and Art Deco palace housing Diego Rivera murals and the national opera company.',
  'The rooftop terrace of the Sears building across the street offers the best exterior view.',
  'Easy', 'Large', 'Moderate', st_point(-99.1413, 19.4353)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Chapultepec Castle', '{Historic,Scenic,Icon}',
  'Former imperial residence atop a basalt hill in Chapultepec Park with panoramic city views.',
  'Take the shuttle from the park entrance to save the uphill walk in the thin altitude.',
  'Moderate', 'Large', 'Moderate', st_point(-99.1757, 19.4202)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Frida Kahlo Museum', '{Culture,Historic,Icon}',
  'The Blue House where Frida Kahlo was born and died, preserving her studio, garden, and personal collection.',
  'Book tickets online weeks ahead — timed entries sell out fast, especially on weekends.',
  'Easy', 'Medium', 'Busy', st_point(-99.1627, 19.3554)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Teotihuacán', '{Historic,Scenic,Icon}',
  'Ancient Mesoamerican city 50 km northeast with the Pyramid of the Sun and Pyramid of the Moon.',
  'Arrive at opening (9 am) before heat and crowds peak; bring water and sun protection.',
  'Hard', 'Large', 'Busy', st_point(-98.8431, 19.6925)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Templo Mayor', '{Historic,Culture,Icon}',
  'Excavated Aztec temple at the heart of ancient Tenochtitlán, with an outstanding on-site museum.',
  'The museum collection is as impressive as the ruins — budget two hours for both.',
  'Easy', 'Medium', 'Moderate', st_point(-99.1317, 19.4346)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Coyoacán', '{Historic,Culture,Food}',
  'Bohemian colonial neighbourhood of cobblestone plazas, market stalls, and 16th-century churches.',
  'Sunday afternoon draws live music to the central plaza — arrive by 3 pm for a good spot.',
  'Easy', 'Medium', 'Busy', st_point(-99.1627, 19.3469)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Xochimilco', '{Nature,Culture,Scenic}',
  'Network of ancient Aztec canals where colourful trajineras carry visitors through flower-lined waterways.',
  'Hire a trajinera on a weekday to avoid the party boats that crowd the canals on weekends.',
  'Easy', 'Large', 'Busy', st_point(-99.1025, 19.2573)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mexico City' and k.code = 'MX';

-- Cancún (Quintana Roo)
insert into cities (country_id, name, region, center)
select id, 'Cancún', 'Quintana Roo', st_point(-86.8515, 21.1619)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Zona Hotelera Beach', '{Coastal,Scenic,Nature}',
  'The 23-km Hotel Zone barrier island with turquoise Caribbean waters and powdery white sand.',
  'Public beach access points between the hotels are free; look for signs marked "acceso a playa".',
  'Easy', 'Large', 'Busy', st_point(-86.7877, 21.0904)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'El Rey Archaeological Zone', '{Historic,Culture,Icon}',
  'Pre-Columbian Maya ruins scattered along the southern Hotel Zone, including a small pyramid and palace.',
  'Iguanas bask on the ruins at midday — keep a respectful distance and they pose perfectly.',
  'Easy', 'Medium', 'Quiet', st_point(-86.7960, 21.0407)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Isla Mujeres', '{Coastal,Scenic,Nature}',
  'Small Caribbean island a 20-minute ferry ride from Cancún with colourful streets and calm snorkelling bays.',
  'Rent a golf cart at the ferry pier to circle the whole island in under two hours.',
  'Easy', 'Medium', 'Moderate', st_point(-86.8800, 21.2310)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Nichupté Lagoon', '{Nature,Scenic,Coastal}',
  'Mangrove-fringed lagoon behind the Hotel Zone, home to crocodiles, pelicans, and flamingos.',
  'A sunset catamaran cruise crosses the lagoon and reaches open sea in time for golden hour.',
  'Easy', 'Large', 'Quiet', st_point(-86.8252, 21.1262)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Museo Maya de Cancún', '{Culture,Historic,Icon}',
  'The region''s premier Maya archaeology museum with artifacts spanning 3,000 years of civilisation.',
  'The adjacent San Miguelito ruins are included in the ticket and often overlooked.',
  'Easy', 'Medium', 'Moderate', st_point(-86.7974, 21.0553)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Chichén Itzá', '{Historic,Icon,Culture}',
  'UNESCO World Heritage Maya city 200 km inland, anchored by the iconic El Castillo pyramid.',
  'Leave by 7 am from Cancún to arrive at opening and beat tour-bus heat by 10 am.',
  'Hard', 'Large', 'Busy', st_point(-88.5686, 20.6829)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Underwater Museum of Art (MUSA)', '{Culture,Modern,Coastal}',
  'Submerged sculpture park of 500 life-sized figures on the seafloor, best explored by snorkel or dive.',
  'Book a glass-bottom boat if you don''t snorkel — the shallow gallery is visible from above.',
  'Moderate', 'Large', 'Moderate', st_point(-86.7705, 21.1035)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Parque las Palapas', '{Culture,Food,Icon}',
  'Downtown Cancún''s main public square lined with food stalls, artisan markets, and open-air stages.',
  'Thursday evenings bring live traditional music — far from the resort strip and thoroughly local.',
  'Easy', 'Medium', 'Moderate', st_point(-86.8566, 21.1624)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Cancún' and k.code = 'MX';

-- Guadalajara (Jalisco)
insert into cities (country_id, name, region, center)
select id, 'Guadalajara', 'Jalisco', st_point(-103.3496, 20.6597)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Guadalajara Cathedral', '{Sacred,Historic,Icon}',
  'Twin-towered Gothic cathedral dominating the historic centre, rebuilt after an 1818 earthquake.',
  'Climb to the choir loft on guided tours for a close view of the ornate gilded altarpiece.',
  'Easy', 'Large', 'Moderate', st_point(-103.3464, 20.6596)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Instituto Cultural Cabañas', '{Culture,Historic,Icon}',
  'UNESCO-listed 19th-century hospice with José Clemente Orozco''s epic murals in the Tolsa Chapel.',
  'Lie on the viewing platforms below the dome to see the "Man of Fire" mural at full scale.',
  'Easy', 'Large', 'Moderate', st_point(-103.3391, 20.6594)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Mercado San Juan de Dios', '{Food,Culture,Icon}',
  'Latin America''s largest covered market spread across three floors of food, crafts, and leather goods.',
  'Head to the upper food floors early for a traditional birria breakfast before the crowds arrive.',
  'Easy', 'Large', 'Busy', st_point(-103.3357, 20.6573)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Tlaquepaque', '{Culture,Food,Historic}',
  'Historic artisan town absorbed into the city, famous for hand-blown glass, talavera pottery, and mariachi.',
  'El Parián market on Sunday fills with mariachi groups competing for attention — arrive by noon.',
  'Easy', 'Medium', 'Busy', st_point(-103.3126, 20.6451)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Bosque Colomos', '{Nature,Scenic,Culture}',
  'Urban forest park of pine and eucalyptus with Japanese and Chinese gardens and a heron colony.',
  'The Japanese garden is most tranquil at dawn before the joggers and families arrive.',
  'Easy', 'Large', 'Moderate', st_point(-103.3877, 20.6942)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Tequila Town', '{Food,Culture,Icon}',
  'UNESCO-designated agave landscape 60 km west, birthplace of Mexico''s national spirit with distillery tours.',
  'Take the Jose Cuervo Express train from Guadalajara for a scenic round trip with tastings included.',
  'Easy', 'Medium', 'Moderate', st_point(-103.8359, 20.8834)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Lago de Chapala', '{Nature,Scenic,Coastal}',
  'Mexico''s largest freshwater lake 50 km south, ringed by villages popular with expat artists.',
  'The malecon in Ajijic village has the best sunset views and lakefront restaurants.',
  'Easy', 'Large', 'Quiet', st_point(-103.1872, 20.2946)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Rotonda de los Jaliscienses Ilustres', '{Historic,Culture,Scenic}',
  'Circular monument in the historic centre honouring Jalisco''s great artists, scientists, and statesmen.',
  'The surrounding Plaza de Armas hosts free band concerts on Thursday and Sunday evenings.',
  'Easy', 'Medium', 'Moderate', st_point(-103.3458, 20.6600)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Guadalajara' and k.code = 'MX';

-- Oaxaca (Oaxaca)
insert into cities (country_id, name, region, center)
select id, 'Oaxaca', 'Oaxaca', st_point(-96.7266, 17.0732)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Monte Albán', '{Historic,Scenic,Icon}',
  'Zapotec hilltop city from 500 BC with pyramids, a ball court, and sweeping valley panoramas.',
  'The first colectivo to Monte Albán leaves from 2nd class bus station at 8:30 am — take it.',
  'Moderate', 'Large', 'Moderate', st_point(-96.7671, 17.0453)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Santo Domingo Church and Cultural Centre', '{Sacred,Historic,Icon}',
  'Magnificent Baroque church with an elaborately stuccoed interior and a world-class archaeological museum.',
  'The museum''s Mixtec gold treasure room requires a timed entry — book at the door on arrival.',
  'Easy', 'Large', 'Moderate', st_point(-96.7259, 17.0657)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Mercado Benito Juárez', '{Food,Culture,Icon}',
  'The city''s most storied market selling mole pastes, chapulines, mezcal, and hand-woven textiles.',
  'Ask vendors to grind fresh mole paste to order — fresher and cheaper than jarred versions.',
  'Easy', 'Medium', 'Busy', st_point(-96.7247, 17.0639)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Árbol del Tule', '{Nature,Icon,Historic}',
  'A Montezuma cypress tree in Santa María del Tule with the world''s widest trunk, over 2,000 years old.',
  'Locals point out animal and human faces hidden in the bark — ask a child to show you.',
  'Easy', 'Small', 'Moderate', st_point(-96.6357, 17.0468)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Hierve el Agua', '{Nature,Scenic,Icon}',
  'Petrified waterfall formations and mineral spring infinity pools on a cliffside above the valley.',
  'Bring water shoes — the rocky pools are slippery and sandals won''t give enough grip.',
  'Moderate', 'Medium', 'Moderate', st_point(-96.2760, 16.8656)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Oaxaca Cathedral', '{Sacred,Historic,Culture}',
  '18th-century Baroque cathedral facing the main zócalo with a carved stone facade of local green quarried stone.',
  'The interior is most atmospheric during the late-afternoon when light streams through the windows.',
  'Easy', 'Large', 'Moderate', st_point(-96.7264, 17.0668)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Teotitlán del Valle', '{Culture,Historic,Food}',
  'Zapotec weaving village 30 km from Oaxaca where families produce wool rugs using pre-Hispanic designs.',
  'Visit family workshops in the morning and negotiate directly — market stalls are marked up.',
  'Easy', 'Small', 'Quiet', st_point(-96.5108, 17.0354)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Macedonio Alcalá Theatre', '{Culture,Historic,Icon}',
  'Ornate French Rococo theatre from 1909, one of Mexico''s finest, staging opera, ballet, and festivals.',
  'The lobby is open to the public on non-performance days — ask at the door.',
  'Easy', 'Medium', 'Quiet', st_point(-96.7240, 17.0659)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Oaxaca' and k.code = 'MX';

-- Mérida (Yucatán)
insert into cities (country_id, name, region, center)
select id, 'Mérida', 'Yucatán', st_point(-89.6230, 20.9674)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Plaza Grande', '{Historic,Culture,Icon}',
  'Mérida''s spacious main plaza flanked by the Cathedral, the Governor''s Palace, and the Casa de Montejo.',
  'Sunday mornings the plaza closes to traffic for free cultural performances and street food.',
  'Easy', 'Large', 'Busy', st_point(-89.6236, 20.9674)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Mérida Cathedral', '{Sacred,Historic,Icon}',
  'One of the oldest cathedrals in the Americas (1598), built partly from stones of the demolished Maya city Ichkanzihóo.',
  'Note the Baroque facade''s lack of ornamentation — stones were reused from destroyed Maya temples.',
  'Easy', 'Large', 'Moderate', st_point(-89.6231, 20.9676)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Uxmal', '{Historic,Scenic,Icon}',
  'Puuc-style Maya city 80 km south with the oval Pyramid of the Magician and ornate stone mosaics.',
  'The sound-and-light show at dusk is theatrical but the ruins at sunrise are far more atmospheric.',
  'Moderate', 'Large', 'Moderate', st_point(-89.7712, 20.3594)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Paseo de Montejo', '{Historic,Scenic,Culture}',
  'Tree-lined 19th-century boulevard of French-influenced hacienda mansions, the city''s elegant promenade.',
  'Sunday afternoons close the road to traffic and locals roll out for a ciclopaseo bike ride.',
  'Easy', 'Large', 'Moderate', st_point(-89.6210, 20.9760)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Gran Museo del Mundo Maya', '{Culture,Modern,Icon}',
  'State-of-the-art museum tracing Maya civilisation from its origins to the present in a leaf-shaped building.',
  'The ground-floor contemporary Maya community exhibit is the most overlooked and most moving section.',
  'Easy', 'Large', 'Moderate', st_point(-89.6416, 21.0052)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Cenote Yokdzonot', '{Nature,Scenic,Coastal}',
  'Community-managed cenote in a village south of Chichén Itzá with emerald water and minimal tourist crowds.',
  'Combine with a Chichén Itzá morning visit — it''s 20 minutes away and rarely on tour itineraries.',
  'Moderate', 'Small', 'Quiet', st_point(-88.6516, 20.6228)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Mercado Lucas de Gálvez', '{Food,Culture,Icon}',
  'Mérida''s central market overflowing with sopa de lima, cochinita pibil, and Yucatecan hammocks.',
  'The upstairs food court serves the cheapest and most authentic comida corrida in the city.',
  'Easy', 'Large', 'Busy', st_point(-89.6214, 20.9648)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Dzibilchaltún', '{Historic,Nature,Icon}',
  'Maya city 14 km north of Mérida with a temple aligned to the equinox sunrise and a swimming cenote.',
  'Visit on the spring equinox (21 March) at dawn to see sunlight beam through the Temple of the Seven Dolls.',
  'Easy', 'Medium', 'Quiet', st_point(-89.5958, 21.1003)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Mérida' and k.code = 'MX';

-- Puebla (Puebla)
insert into cities (country_id, name, region, center)
select id, 'Puebla', 'Puebla', st_point(-98.2063, 19.0414)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Puebla Cathedral', '{Sacred,Historic,Icon}',
  'UNESCO-listed cathedral with Mexico''s tallest towers and a lavishly gilded interior on the main zócalo.',
  'Climb the north tower on weekend mornings for views of Popocatépetl and the city roofscape.',
  'Moderate', 'Large', 'Moderate', st_point(-98.2042, 19.0431)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Barrio del Artista', '{Culture,Historic,Scenic}',
  'Open-air artists'' quarter of colourful studios and easels set around a pedestrian square in the historic centre.',
  'Painters work at their easels in the mornings — watching the process is free and fascinating.',
  'Easy', 'Small', 'Moderate', st_point(-98.2016, 19.0454)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Cholula Great Pyramid', '{Historic,Scenic,Icon}',
  'The world''s largest pyramid by volume, topped by a colonial church and tunnelled with 8 km of excavated passages.',
  'The tunnel tour departs every 30 minutes; arrive before 10 am to join the first groups.',
  'Easy', 'Large', 'Moderate', st_point(-98.3014, 19.0583)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Talavera Workshops', '{Culture,Historic,Food}',
  'Puebla is Mexico''s talavera capital; certified workshops in the barrio offer tours showing hand-painted ceramics made since the 16th century.',
  'Uriarte Talavera on 4 Poniente offers free factory tours on weekday mornings.',
  'Easy', 'Small', 'Quiet', st_point(-98.2072, 19.0428)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Mercado de Sabores Poblanos', '{Food,Culture,Icon}',
  'Covered food market dedicated to Puebla''s renowned gastronomy — mole poblano, chiles en nogada, and cemitas.',
  'Order chiles en nogada in season (August–September) when pomegranate seeds are at their peak.',
  'Easy', 'Medium', 'Busy', st_point(-98.2000, 19.0420)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Biblioteca Palafoxiana', '{Culture,Historic,Icon}',
  'The oldest public library in the Americas (1646), housing 45,000 colonial texts in carved baroque shelving.',
  'Photography is permitted but tripods are not — use the reading-room windows for natural light.',
  'Easy', 'Medium', 'Moderate', st_point(-98.2033, 19.0440)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Fuerte de Loreto', '{Historic,Scenic,Icon}',
  'Fort above the city where Mexican forces defeated the French on 5 May 1862, celebrated as Cinco de Mayo.',
  'The Cerro de Guadalupe park behind the fort has the clearest Popocatépetl views on clear winter mornings.',
  'Easy', 'Medium', 'Quiet', st_point(-98.1960, 19.0487)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Africam Safari', '{Nature,Culture,Modern}',
  'Drive-through wildlife park 20 km east of Puebla housing over 3,000 animals in open enclosures.',
  'The early-morning nocturnal animal feeding session runs before the park officially opens — book online.',
  'Easy', 'Large', 'Moderate', st_point(-98.0581, 19.0013)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Puebla' and k.code = 'MX';

-- San Miguel de Allende (Guanajuato)
insert into cities (country_id, name, region, center)
select id, 'San Miguel de Allende', 'Guanajuato', st_point(-100.7446, 20.9144)::geography
from countries where code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'La Parroquia de San Miguel Arcángel', '{Sacred,Historic,Icon}',
  'Neo-Gothic parish church with a pink stone facade designed by self-taught indigenous architect Zeferino Gutiérrez.',
  'The church is most photogenic at dawn before tour groups arrive and the light is warm and soft.',
  'Easy', 'Medium', 'Busy', st_point(-100.7442, 20.9141)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Jardín Principal', '{Historic,Culture,Scenic}',
  'The shaded central plaza ringed by cafes, shoe-shiners, and the iconic parroquia church — the heart of town.',
  'Evenings see the jardín fill with locals promenading; grab a bench and watch the scene.',
  'Easy', 'Medium', 'Busy', st_point(-100.7440, 20.9141)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'El Charco del Ingenio', '{Nature,Scenic,Culture}',
  'Botanical garden and nature reserve on the canyon rim northeast of town, Mexico''s largest cacti collection.',
  'Walk the canyon trail in the early morning for birding — over 150 species are recorded here.',
  'Moderate', 'Large', 'Quiet', st_point(-100.7325, 20.9198)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Fabrica La Aurora', '{Culture,Modern,Historic}',
  'Former 19th-century textile mill converted into galleries, design studios, and artisan workshops.',
  'Saturday mornings draw local artists and designers — more authentic than the tourist-facing shops on Recreo.',
  'Easy', 'Medium', 'Quiet', st_point(-100.7410, 20.9211)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Instituto Allende', '{Culture,Historic,Icon}',
  'Renowned art school in an 18th-century hacienda that put San Miguel on the map for expatriate artists in the 1950s.',
  'The hacienda gardens and sculpture courtyard are open to visitors outside class hours.',
  'Easy', 'Medium', 'Quiet', st_point(-100.7490, 20.9108)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Santuario de Atotonilco', '{Sacred,Historic,Icon}',
  'UNESCO-listed 18th-century sanctuary 15 km north covered floor-to-ceiling in elaborate folk murals.',
  'Combine with a soak at the hot spring baths beside the sanctuary road for a half-day trip.',
  'Easy', 'Medium', 'Quiet', st_point(-100.7860, 20.9590)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Mirador Viewpoint', '{Scenic,Nature,Icon}',
  'Hilltop lookout above the historic centre offering a classic panorama of terracotta rooftops and church towers.',
  'The gravel path from Calle Hospicio is the quickest route up; go at sunset for the best colour.',
  'Moderate', 'Small', 'Moderate', st_point(-100.7400, 20.9175)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Mercado de Artesanías', '{Culture,Food,Historic}',
  'Covered craft market on Calle Loreto selling hand-embroidered textiles, silver jewellery, and local sweets.',
  'Prices are negotiable — start at 60% of the asking price and expect to settle around 75%.',
  'Easy', 'Small', 'Moderate', st_point(-100.7437, 20.9133)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Miguel de Allende' and k.code = 'MX';
