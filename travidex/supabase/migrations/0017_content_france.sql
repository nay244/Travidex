-- Phase 10 content: France (extension). Add a city: copy a city block. Add a sight: copy a sight block.

-- Paris already exists (dex_no 1–3). Top up to 8 sights (dex_no 4–8).
insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Notre-Dame Cathedral', '{Sacred,Historic,Icon}',
  'Medieval Gothic cathedral on the Île de la Cité, rebuilt after the 2019 fire.',
  'Circle the exterior before entering to see the full rose windows.',
  'Easy', 'Large', 'Busy', st_point(2.3499, 48.8530)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Paris' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Arc de Triomphe', '{Historic,Icon,Scenic}',
  'Napoleonic triumphal arch at the western end of the Champs-Élysées.',
  'Take the underpass — never cross the roundabout on foot.',
  'Easy', 'Large', 'Busy', st_point(2.2950, 48.8738)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Paris' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Sacré-Cœur Basilica', '{Sacred,Scenic,Icon}',
  'White Byzantine basilica crowning the Montmartre hill with panoramic city views.',
  'Climb the stairs through the vineyard lane for the best approach.',
  'Moderate', 'Large', 'Busy', st_point(2.3431, 48.8867)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Paris' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Musée d''Orsay', '{Culture,Historic,Icon}',
  'Impressionist and Post-Impressionist masterpieces inside a converted Beaux-Arts rail station.',
  'Visit on Thursday evening for fewer crowds and extended hours.',
  'Easy', 'Large', 'Moderate', st_point(2.3266, 48.8600)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Paris' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Panthéon', '{Historic,Culture,Sacred}',
  'Neoclassical mausoleum on the Left Bank housing the remains of French luminaries.',
  'Climb to the colonnade for a rooftop view rivalling Sacré-Cœur.',
  'Easy', 'Large', 'Moderate', st_point(2.3462, 48.8462)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Paris' and k.code = 'FR';

-- Lyon (Auvergne-Rhône-Alpes)
insert into cities (country_id, name, region, center)
select id, 'Lyon', 'Auvergne-Rhône-Alpes', st_point(4.8357, 45.7640)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Basilique Notre-Dame de Fourvière', '{Sacred,Scenic,Icon}',
  'Ornate 19th-century basilica perched on Fourvière hill overlooking Lyon.',
  'Take the funicular from Vieux-Lyon for the classic approach.',
  'Easy', 'Large', 'Moderate', st_point(4.8218, 45.7624)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Vieux-Lyon', '{Historic,Culture,Food}',
  'Renaissance old town and UNESCO heritage site threaded with hidden traboule passageways.',
  'Find a traboule entrance on Rue Saint-Jean — doors are often unlocked.',
  'Easy', 'Large', 'Busy', st_point(4.8272, 45.7618)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Théâtres Romains de Fourvière', '{Historic,Culture,Scenic}',
  'Two Roman theatres built in the 1st century BC with sweeping city panoramas.',
  'Visit during the Nuits de Fourvière festival for open-air performances.',
  'Moderate', 'Large', 'Moderate', st_point(4.8200, 45.7605)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Musée des Confluences', '{Culture,Modern,Icon}',
  'Science and anthropology museum in a striking deconstructivist building where the Rhône meets the Saône.',
  'The permanent collection is free on Sundays for under-26s.',
  'Easy', 'Large', 'Moderate', st_point(4.8178, 45.7339)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Place Bellecour', '{Icon,Historic,Scenic}',
  'One of Europe''s largest pedestrian squares, anchored by an equestrian statue of Louis XIV.',
  'The giant Christmas Ferris wheel here is the city''s festive centrepiece.',
  'Easy', 'Large', 'Busy', st_point(4.8323, 45.7576)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Les Halles Paul Bocuse', '{Food,Culture,Icon}',
  'Lyon''s legendary covered market showcasing bouchon delicacies and the city''s gastronomic identity.',
  'Arrive before 11 am to get a seat at the oyster bar without queuing.',
  'Easy', 'Medium', 'Busy', st_point(4.8580, 45.7671)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Parc de la Tête d''Or', '{Nature,Scenic,Culture}',
  'Vast urban park with a free zoo, botanical garden, and lake in the city''s northeast.',
  'Rent a rowing boat on the lake in summer for a relaxed afternoon.',
  'Easy', 'Large', 'Moderate', st_point(4.8567, 45.7762)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Musée des Beaux-Arts de Lyon', '{Culture,Historic,Icon}',
  'One of France''s largest fine arts museums housed in a 17th-century Benedictine abbey.',
  'The cloister garden is open to all and perfect for a quiet break.',
  'Easy', 'Large', 'Moderate', st_point(4.8339, 45.7676)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lyon' and k.code = 'FR';

-- Marseille (Provence-Alpes-Côte d'Azur)
insert into cities (country_id, name, region, center)
select id, 'Marseille', 'Provence-Alpes-Côte d''Azur', st_point(5.3698, 43.2965)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Vieux-Port', '{Icon,Historic,Scenic}',
  'Marseille''s ancient harbour where fishermen still sell the morning catch at quayside stalls.',
  'Be at the fish market by 8 am to see it at its liveliest.',
  'Easy', 'Large', 'Busy', st_point(5.3698, 43.2951)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Basilique Notre-Dame de la Garde', '{Sacred,Scenic,Icon}',
  'Gilded Byzantine-Romanesque basilica on the city''s highest hill, visible from far out to sea.',
  'Climb on foot from the Rue du Fort du Sanctuaire for the best views.',
  'Moderate', 'Large', 'Busy', st_point(5.3702, 43.2842)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Calanques National Park', '{Nature,Scenic,Coastal}',
  'Dramatic limestone fjords and turquoise creeks stretching along the coast east of the city.',
  'Book the shuttle bus in summer — the access road is often closed to cars.',
  'Hard', 'Large', 'Moderate', st_point(5.4542, 43.2152)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'MuCEM', '{Culture,Modern,Icon}',
  'Museum of European and Mediterranean Civilisations in a latticed concrete cube on the sea.',
  'Cross the footbridge to Fort Saint-Jean for free after 5 pm.',
  'Easy', 'Large', 'Moderate', st_point(5.3609, 43.2968)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Le Panier', '{Historic,Culture,Food}',
  'Marseille''s oldest neighbourhood, a labyrinth of pastel alleys above the Vieux-Port.',
  'Seek out the street art murals on Rue du Panier — they change each year.',
  'Moderate', 'Medium', 'Moderate', st_point(5.3679, 43.2997)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Château d''If', '{Historic,Icon,Scenic}',
  'Island fortress-prison immortalised in The Count of Monte Cristo, 20 min by ferry.',
  'Take the last ferry of the day for golden-hour views of the Marseille skyline.',
  'Easy', 'Medium', 'Moderate', st_point(5.3248, 43.2797)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Palais Longchamp', '{Historic,Culture,Scenic}',
  'Monumental 19th-century fountain-palace housing the city''s Fine Arts and Natural History museums.',
  'The cascading fountains are best lit in the late-afternoon sun.',
  'Easy', 'Large', 'Quiet', st_point(5.3940, 43.3051)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Abbaye Saint-Victor', '{Sacred,Historic,Culture}',
  'Romanesque abbey-fortress founded in the 5th century, with catacombs and early Christian sarcophagi.',
  'Descend into the crypt for the best-preserved section of the original abbey.',
  'Easy', 'Medium', 'Quiet', st_point(5.3643, 43.2904)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Marseille' and k.code = 'FR';

-- Nice (Provence-Alpes-Côte d'Azur)
insert into cities (country_id, name, region, center)
select id, 'Nice', 'Provence-Alpes-Côte d''Azur', st_point(7.2620, 43.7102)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Promenade des Anglais', '{Scenic,Coastal,Icon}',
  'The iconic palm-lined seafront boulevard stretching 7 km along the Bay of Angels.',
  'Rent a bike from one of the Vélo Bleu stations for the fastest end-to-end run.',
  'Easy', 'Large', 'Busy', st_point(7.2551, 43.6963)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Vieux-Nice', '{Historic,Food,Culture}',
  'Baroque old town of ochre and sienna facades lining narrow pedestrian lanes.',
  'Stop at the Cours Saleya flower market on any morning except Monday.',
  'Easy', 'Medium', 'Busy', st_point(7.2754, 43.6956)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Castle Hill (Colline du Château)', '{Scenic,Historic,Nature}',
  'Ruined medieval citadel turned public park offering the finest panorama over the city and coastline.',
  'Take the free elevator from the Quai des États-Unis to save the climb.',
  'Easy', 'Medium', 'Moderate', st_point(7.2817, 43.6951)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Musée Matisse', '{Culture,Historic,Icon}',
  'Dedicated collection of Matisse''s life work in a Genoese villa in the Cimiez olive grove.',
  'The Roman Arena next door is free to explore and rarely crowded.',
  'Easy', 'Medium', 'Quiet', st_point(7.2734, 43.7202)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Musée National Marc Chagall', '{Culture,Sacred,Icon}',
  'Largest public collection of Chagall''s Biblical Message paintings in a purpose-built modernist space.',
  'The stained glass windows in the auditorium are free to see from the foyer.',
  'Easy', 'Medium', 'Quiet', st_point(7.2685, 43.7148)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Cathédrale Sainte-Réparate', '{Sacred,Historic,Culture}',
  '17th-century Baroque cathedral dedicated to Nice''s patron saint in the heart of Vieux-Nice.',
  'Step inside midday to see the sunlight flood through the side chapels.',
  'Easy', 'Medium', 'Quiet', st_point(7.2757, 43.6970)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Place Masséna', '{Icon,Historic,Scenic}',
  'The city''s grand central square flanked by red Italianate buildings and a contemporary art installation.',
  'Return after dark for the illuminated "Conversation à Nice" sculptures on tall poles.',
  'Easy', 'Large', 'Busy', st_point(7.2700, 43.6983)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Villefranche-sur-Mer', '{Coastal,Scenic,Historic}',
  'Picturesque deep-water bay village 6 km east of Nice, with a 16th-century citadel and cobalt harbour.',
  'Catch the 100 bus from Nice for a 20-minute ride; far quicker than driving.',
  'Easy', 'Medium', 'Moderate', st_point(7.3075, 43.7044)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nice' and k.code = 'FR';

-- Bordeaux (Nouvelle-Aquitaine)
insert into cities (country_id, name, region, center)
select id, 'Bordeaux', 'Nouvelle-Aquitaine', st_point(-0.5792, 44.8378)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Cité du Vin', '{Culture,Modern,Icon}',
  'Futuristic wine-immersion museum shaped like a wine swirling in a glass, on the Garonne quay.',
  'The admission ticket includes a tasting session at the Belvedere on the 8th floor.',
  'Easy', 'Large', 'Moderate', st_point(-0.5512, 44.8633)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Place de la Bourse', '{Historic,Icon,Scenic}',
  'Elegant 18th-century royal square reflected in the miroir d''eau — the world''s largest reflecting pool.',
  'The water mirror cycles between a still mirror and a mist cloud; time your photos.',
  'Easy', 'Large', 'Busy', st_point(-0.5696, 44.8412)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Cathédrale Saint-André', '{Sacred,Historic,Icon}',
  'Gothic cathedral and UNESCO World Heritage site with twin towers and a detached belfry.',
  'Climb the Tour Pey-Berland next door for a rooftop view across the old town.',
  'Easy', 'Large', 'Moderate', st_point(-0.5776, 44.8365)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Rue Sainte-Catherine', '{Culture,Food,Historic}',
  'Europe''s longest pedestrian shopping street, 1.2 km of boutiques in the historic centre.',
  'Side streets off the top end lead to quieter wine bars and brasseries.',
  'Easy', 'Large', 'Busy', st_point(-0.5756, 44.8368)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Grosse Cloche', '{Historic,Icon,Culture}',
  '15th-century double-towered city gate with a colossal medieval bell, one of France''s oldest.',
  'Look up at the gilded astronomical clock face facing the Rue Saint-James.',
  'Easy', 'Small', 'Moderate', st_point(-0.5721, 44.8349)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Musée d''Aquitaine', '{Culture,Historic,Icon}',
  'Regional history museum tracing Bordeaux from prehistoric times through the wine trade era.',
  'The Gallo-Roman gallery in the basement is the most impressive section.',
  'Easy', 'Large', 'Quiet', st_point(-0.5765, 44.8353)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Grand Théâtre de Bordeaux', '{Culture,Historic,Icon}',
  'Neoclassical opera house built 1780, the model for the Paris Opéra Garnier.',
  'Free guided exterior tours run on Saturday mornings from the Place de la Comédie.',
  'Easy', 'Large', 'Moderate', st_point(-0.5748, 44.8426)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Jardin Public de Bordeaux', '{Nature,Scenic,Culture}',
  'English-style garden of 10 ha with a botanical garden, natural history museum, and shaded promenades.',
  'The children''s marionette theatre performs every Wednesday and weekend afternoon.',
  'Easy', 'Large', 'Moderate', st_point(-0.5812, 44.8481)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bordeaux' and k.code = 'FR';

-- Strasbourg (Grand Est)
insert into cities (country_id, name, region, center)
select id, 'Strasbourg', 'Grand Est', st_point(7.7521, 48.5734)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Strasbourg Cathedral', '{Sacred,Historic,Icon}',
  'Pink Vosges sandstone Gothic cathedral with an astronomical clock and 142-metre spire.',
  'Watch the animated apostles parade on the astronomical clock at 12:30 pm daily.',
  'Easy', 'Large', 'Busy', st_point(7.7508, 48.5818)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'La Petite France', '{Historic,Scenic,Icon}',
  'Picturesque medieval quarter of half-timbered houses, lock-keepers'' cottages, and canal weirs.',
  'Cross the Ponts Couverts and climb the Vauban dam for the most photographed angle.',
  'Easy', 'Medium', 'Busy', st_point(7.7399, 48.5783)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Palais Rohan', '{Historic,Culture,Icon}',
  'Former residence of prince-bishops housing three museums: Decorative Arts, Fine Arts, and Archaeology.',
  'The royal apartments are the highlight; arrive at opening to see them without crowds.',
  'Easy', 'Large', 'Moderate', st_point(7.7527, 48.5801)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'European Parliament', '{Modern,Culture,Icon}',
  'Home of the EU Parliament''s Strasbourg session; guided tours reveal the hemicycle chamber.',
  'Book a parliamentary visit tour at least two weeks ahead online.',
  'Easy', 'Large', 'Quiet', st_point(7.7697, 48.5975)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Musée Alsacien', '{Historic,Culture,Food}',
  'Folk museum in a 16th-century townhouse showcasing Alsatian rural life, costumes, and craftwork.',
  'The reconstructed traditional kitchen on the first floor is especially detailed.',
  'Easy', 'Medium', 'Quiet', st_point(7.7547, 48.5780)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Place Gutenberg', '{Historic,Culture,Icon}',
  'Historic market square dominated by the chamber of commerce and a statue of printing pioneer Gutenberg.',
  'Browse the Wednesday and Saturday market for Alsatian produce.',
  'Easy', 'Medium', 'Moderate', st_point(7.7494, 48.5800)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Parc de l''Orangerie', '{Nature,Scenic,Culture}',
  'Strasbourg''s oldest and largest park, home to a stork colony and a 19th-century orangery.',
  'Visit in spring to see the white storks nesting on the platform near the lake.',
  'Easy', 'Large', 'Quiet', st_point(7.7762, 48.5867)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Marché de Noël de Strasbourg', '{Culture,Food,Icon}',
  'One of Europe''s oldest Christmas markets, running since 1570 across multiple squares in the centre.',
  'Start at Place Broglie (the original site) then loop to Place de la Cathédrale.',
  'Easy', 'Large', 'Busy', st_point(7.7494, 48.5836)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Strasbourg' and k.code = 'FR';

-- Toulouse (Occitanie)
insert into cities (country_id, name, region, center)
select id, 'Toulouse', 'Occitanie', st_point(1.4442, 43.6047)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Basilique Saint-Sernin', '{Sacred,Historic,Icon}',
  'The largest Romanesque church in Western Europe and a UNESCO pilgrimage route landmark.',
  'Circle the apse exterior at dawn — the pink brick glows vividly in morning light.',
  'Easy', 'Large', 'Moderate', st_point(1.4415, 43.6082)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Place du Capitole', '{Icon,Historic,Culture}',
  'The grand civic heart of Toulouse fronted by the pink Capitole city hall and its ornate façade.',
  'Look for the Occitan cross inlaid in the paving stones at the centre of the square.',
  'Easy', 'Large', 'Busy', st_point(1.4442, 43.6044)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Cité de l''Espace', '{Modern,Culture,Icon}',
  'Space theme park on the eastern edge of the city with real rockets and an IMAX planetarium.',
  'The Ariane 5 rocket outside is the same model used to launch Galileo satellites.',
  'Easy', 'Large', 'Moderate', st_point(1.4907, 43.5875)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Les Abattoirs', '{Culture,Modern,Icon}',
  'Contemporary and modern art museum in a former slaughterhouse with changing exhibitions.',
  'The permanent collection includes Picasso''s painted stage curtain for L''Après-midi d''un faune.',
  'Easy', 'Large', 'Quiet', st_point(1.4259, 43.5986)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Canal du Midi', '{Scenic,Historic,Nature}',
  'UNESCO-listed 17th-century canal winding through plane-tree tunnels into the heart of the city.',
  'Rent a kayak near the Port Saint-Sauveur for a water-level view of the tree canopy.',
  'Easy', 'Large', 'Moderate', st_point(1.4559, 43.5952)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Musée Saint-Raymond', '{Historic,Culture,Icon}',
  'Archaeological museum of Roman and pre-Roman civilisations housed in a Renaissance college building.',
  'The imperial portrait gallery in the basement is one of the best outside Rome.',
  'Easy', 'Medium', 'Quiet', st_point(1.4407, 43.6089)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Garonne Riverfront', '{Scenic,Nature,Culture}',
  'The wide Garonne promenade below the Pont Neuf — Toulouse''s prime sunset viewpoint.',
  'Walk downstream from the Pont Neuf at golden hour; the pink brick glows most intensely.',
  'Easy', 'Large', 'Moderate', st_point(1.4291, 43.6004)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Jacobins Convent', '{Sacred,Historic,Culture}',
  'Gothic Dominican convent with a celebrated "palm tree" pillar and the relics of Thomas Aquinas.',
  'The cloister garden is free to enter; the church requires a small ticket.',
  'Easy', 'Medium', 'Quiet', st_point(1.4367, 43.6030)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Toulouse' and k.code = 'FR';

-- Lille (Hauts-de-France)
insert into cities (country_id, name, region, center)
select id, 'Lille', 'Hauts-de-France', st_point(3.0573, 50.6292)::geography
from countries where code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Vieux-Lille', '{Historic,Food,Culture}',
  'Flemish Baroque old town of tall shuttered facades, cobbled lanes, and estaminets.',
  'Wander Rue de la Monnaie and Rue Esquermoise for the densest concentration of heritage buildings.',
  'Easy', 'Medium', 'Busy', st_point(3.0597, 50.6361)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Palais des Beaux-Arts de Lille', '{Culture,Historic,Icon}',
  'France''s second-largest fine arts museum after the Louvre, housing a superb Flemish and Dutch collection.',
  'The basement relief maps of French fortified towns are a hidden highlight rarely visited.',
  'Easy', 'Large', 'Moderate', st_point(3.0617, 50.6301)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Citadelle de Lille', '{Historic,Nature,Scenic}',
  'Star-shaped Vauban fortress of 1667 surrounded by a moat and deer park, still in military use.',
  'Weekday mornings allow a guided perimeter walk when the gate to the park is open.',
  'Moderate', 'Large', 'Quiet', st_point(3.0426, 50.6380)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Grand''Place (Place du Général de Gaulle)', '{Icon,Historic,Culture}',
  'The vibrant central square anchored by the Colonne de la Déesse and the ornate Vieille Bourse.',
  'Duck inside the Vieille Bourse courtyard for the daily second-hand book and chess market.',
  'Easy', 'Large', 'Busy', st_point(3.0636, 50.6369)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'La Braderie de Lille', '{Culture,Food,Icon}',
  'Europe''s largest flea market, flooding the entire city for one weekend each September.',
  'The moules-frites tradition means every brasserie stacks mussel shells outside as a trophy.',
  'Easy', 'Large', 'Busy', st_point(3.0636, 50.6292)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Musée de l''Hospice Comtesse', '{Historic,Culture,Sacred}',
  '15th-century charitable hospital turned museum of Flemish art and decorative heritage.',
  'The ward hall with its original painted wooden ceiling is the centrepiece.',
  'Easy', 'Medium', 'Quiet', st_point(3.0600, 50.6373)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Euralille Shopping Centre', '{Modern,Culture,Icon}',
  'Rem Koolhaas''s 1994 deconstructivist retail complex beside the high-speed rail hub.',
  'A pilgrimage for architecture students — the car park ramp is as photographed as the mall.',
  'Easy', 'Large', 'Busy', st_point(3.0768, 50.6375)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Parc Barbieux', '{Nature,Scenic,Culture}',
  'Elegant 19th-century landscaped park in nearby Roubaix, lined with Art Deco villas.',
  'Walk the full 2-km length and spot the belle époque villa facades along the eastern edge.',
  'Easy', 'Large', 'Quiet', st_point(3.1772, 50.6893)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Lille' and k.code = 'FR';
