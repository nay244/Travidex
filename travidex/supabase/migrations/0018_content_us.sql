-- Phase 10 content: United States (18 cities, states tier). Add a city: copy a city block. Add a sight: copy a sight block.

insert into countries (name, code, tier) values ('United States', 'US', 'states');

-- New York City (New York)
insert into cities (country_id, name, region, center)
select id, 'New York City', 'New York', st_point(-74.0060, 40.7128)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Statue of Liberty', '{Icon,Historic,Scenic}',
  'Copper neoclassical colossus gifted by France in 1886, standing on Liberty Island in New York Harbor.',
  'Book the crown tickets months ahead; pedestal access is a worthy backup.',
  'Moderate', 'Large', 'Busy', st_point(-74.0445, 40.6892)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Brooklyn Bridge', '{Icon,Historic,Scenic}',
  'Iconic 1883 suspension bridge spanning the East River between Manhattan and Brooklyn.',
  'Walk from the Brooklyn side at dawn for the best light and thinnest crowds.',
  'Easy', 'Large', 'Busy', st_point(-73.9969, 40.7061)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Times Square', '{Icon,Modern,Culture}',
  'Neon-blazing commercial intersection at the heart of Midtown Manhattan, famed for its New Year''s Eve ball drop.',
  'Visit after midnight on a weeknight when the lights are still blazing but foot traffic thins.',
  'Easy', 'Large', 'Busy', st_point(-73.9857, 40.7580)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Central Park Bethesda Terrace', '{Scenic,Historic,Nature}',
  'Ornate Victorian terrace and fountain at the centre of Central Park, the park''s architectural heart.',
  'The Minton-tile ceiling in the underpass is best admired in early morning quiet.',
  'Easy', 'Large', 'Moderate', st_point(-73.9712, 40.7741)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Empire State Building', '{Icon,Historic,Modern}',
  'Art Deco skyscraper completed in 1931, New York''s most recognisable tower at 443 m.',
  'The 86th-floor observation deck offers the classic open-air NYC panorama; go at sunset.',
  'Easy', 'Large', 'Busy', st_point(-73.9857, 40.7484)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Grand Central Terminal', '{Historic,Icon,Culture}',
  'Beaux-Arts rail station of 1913 with a celestial ceiling mural and whispering gallery beneath the main concourse.',
  'Stand in one corner of the Whispering Gallery arch and speak softly — your partner hears you clearly across the room.',
  'Easy', 'Large', 'Busy', st_point(-73.9772, 40.7527)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'One World Observatory', '{Modern,Icon,Scenic}',
  'Top-floor observation deck on the rebuilt 541-metre One World Trade Center, the Western Hemisphere''s tallest tower.',
  'Book the first entry slot of the day for clear skies and an uncrowded floor.',
  'Easy', 'Large', 'Moderate', st_point(-74.0134, 40.7127)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Flatiron Building', '{Historic,Icon,Scenic}',
  'Triangular 1902 skyscraper at the convergence of Fifth Avenue and Broadway, a pioneer of the steel-frame era.',
  'Best photographed from the small plaza at 23rd Street looking north toward Madison Square Park.',
  'Easy', 'Medium', 'Moderate', st_point(-73.9896, 40.7411)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New York City' and k.code = 'US';

-- Los Angeles (California)
insert into cities (country_id, name, region, center)
select id, 'Los Angeles', 'California', st_point(-118.2437, 34.0522)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Griffith Observatory', '{Scenic,Icon,Culture}',
  'Art Deco public observatory on the slopes of Griffith Park offering sweeping views of the Hollywood Sign and basin.',
  'Arrive an hour before sunset and stay for the free telescope viewing after dark.',
  'Moderate', 'Medium', 'Busy', st_point(-118.3004, 34.1184)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Hollywood Sign', '{Icon,Scenic,Historic}',
  'Iconic 1923 hillside sign in the Santa Monica Mountains, originally advertising a real estate development.',
  'Hike the Brush Canyon Trail from Griffith Park for the closest legal viewpoint.',
  'Hard', 'Large', 'Busy', st_point(-118.3217, 34.1341)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Getty Center', '{Culture,Scenic,Modern}',
  'Richard Meier''s hilltop campus housing one of the world''s great art collections with panoramic city views.',
  'The parking tram to the hilltop is included — grab the rear car for the best view.',
  'Easy', 'Large', 'Moderate', st_point(-118.4741, 34.0780)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Santa Monica Pier', '{Coastal,Icon,Culture}',
  'Historic 1909 pleasure pier with a solar-powered Ferris wheel marking the western end of Route 66.',
  'Come at sunset when the Pacific light turns the pier golden and Ferris wheel reflections hit the water.',
  'Easy', 'Large', 'Busy', st_point(-118.4965, 34.0089)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'The Getty Villa', '{Historic,Culture,Icon}',
  'Roman-style villa museum in Malibu housing J. Paul Getty''s collection of ancient Greek and Roman art.',
  'Advance timed tickets are required; the outer peristyle garden is free to view.',
  'Easy', 'Large', 'Quiet', st_point(-118.5651, 34.0456)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'LACMA', '{Culture,Modern,Icon}',
  'Los Angeles County Museum of Art — the largest encyclopedic museum on the US West Coast.',
  'Chris Burden''s "Urban Light" lamp forest at the entrance is best photographed at dusk.',
  'Easy', 'Large', 'Moderate', st_point(-118.3593, 34.0639)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Venice Beach Boardwalk', '{Coastal,Culture,Icon}',
  'Two-mile oceanfront promenade famous for street performers, Muscle Beach, and the outdoor skate park.',
  'Sunday afternoons bring the busiest drum circle at the south end near the skate park.',
  'Easy', 'Large', 'Busy', st_point(-118.4695, 33.9850)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Bradbury Building', '{Historic,Icon,Culture}',
  '1893 ornate office building with a sky-lit atrium of cast-iron balconies, featured in Blade Runner.',
  'Step inside during business hours — the lobby is freely accessible on weekdays.',
  'Easy', 'Small', 'Moderate', st_point(-118.2483, 34.0506)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Los Angeles' and k.code = 'US';

-- San Francisco (California)
insert into cities (country_id, name, region, center)
select id, 'San Francisco', 'California', st_point(-122.4194, 37.7749)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Golden Gate Bridge', '{Icon,Scenic,Historic}',
  'Art Deco suspension bridge of 1937 spanning the 1.6-km Golden Gate strait in International Orange.',
  'Walk the east sidewalk southbound for city-facing views; the north tower vista point is free.',
  'Easy', 'Large', 'Busy', st_point(-122.4786, 37.8199)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Alcatraz Island', '{Historic,Icon,Scenic}',
  'Former federal penitentiary on a bay island, housing infamous inmates including Al Capone.',
  'Book the night tour for a more atmospheric experience with audio narration of escape attempts.',
  'Moderate', 'Medium', 'Busy', st_point(-122.4230, 37.8267)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Fisherman''s Wharf', '{Coastal,Food,Icon}',
  'Historic waterfront district where sea lions lounge at Pier 39 and sourdough bread bowls reign supreme.',
  'The free sea lion colony at Pier 39 K-Dock is at its largest in winter months.',
  'Easy', 'Large', 'Busy', st_point(-122.4177, 37.8080)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Lombard Street', '{Scenic,Icon,Historic}',
  'The crookedest block in San Francisco — eight hairpin turns down a flower-lined one-way brick road.',
  'Walk down rather than driving; the pedestrian stairs on either side are far less congested.',
  'Easy', 'Small', 'Busy', st_point(-122.4194, 37.8021)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Palace of Fine Arts', '{Historic,Scenic,Culture}',
  'Roman rotunda and colonnaded lagoon built for the 1915 Panama-Pacific Exposition — the only structure preserved.',
  'Circle the lagoon at dusk when the rotunda reflects on the water and swans glide past.',
  'Easy', 'Large', 'Moderate', st_point(-122.4483, 37.8029)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Chinatown', '{Culture,Food,Historic}',
  'The oldest Chinatown in North America, founded 1848 — a dense grid of red lanterns, dim sum halls, and temples.',
  'Enter through the Dragon Gate on Bush Street and work your way uphill for the full experience.',
  'Easy', 'Medium', 'Busy', st_point(-122.4064, 37.7941)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Twin Peaks', '{Scenic,Nature,Icon}',
  'Twin summits rising 282 m above the city centre, offering a 360-degree panorama on clear days.',
  'Drive or Uber up — the Muni bus stops lower down and involves a steep walk.',
  'Moderate', 'Medium', 'Moderate', st_point(-122.4477, 37.7525)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'de Young Museum', '{Culture,Icon,Modern}',
  'Herzog & de Meuron copper-clad art museum in Golden Gate Park with a free observation tower.',
  'The Hamon Tower observation floor is free and gives a canopy-level view over the park.',
  'Easy', 'Large', 'Moderate', st_point(-122.4686, 37.7715)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Francisco' and k.code = 'US';

-- Chicago (Illinois)
insert into cities (country_id, name, region, center)
select id, 'Chicago', 'Illinois', st_point(-87.6298, 41.8781)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Millennium Park — Cloud Gate', '{Modern,Icon,Scenic}',
  'Anish Kapoor''s 110-tonne reflective steel bean sculpture in Millennium Park, Chicago''s civic centrepiece.',
  'Duck under the sculpture to see the concave mirror distortion — most visitors miss this view.',
  'Easy', 'Large', 'Busy', st_point(-87.6230, 41.8827)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Art Institute of Chicago', '{Culture,Historic,Icon}',
  'One of the oldest and largest art museums in the US, home to Seurat''s "A Sunday on La Grande Jatte".',
  'The Thorne Miniature Rooms on the lower level are a hidden gem almost no first-time visitors find.',
  'Easy', 'Large', 'Busy', st_point(-87.6237, 41.8796)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Willis Tower Skydeck', '{Icon,Scenic,Modern}',
  'Glass-floored Ledge boxes project from the 103rd floor of the former world''s tallest building.',
  'Arrive at opening — the Ledge queue is negligible for the first 30 minutes.',
  'Easy', 'Large', 'Busy', st_point(-87.6358, 41.8789)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Navy Pier', '{Coastal,Culture,Icon}',
  'Historic 1916 lakefront pier with a Ferris wheel, gardens, and Chicago''s main fireworks venue.',
  'The free Wednesday and Saturday evening fireworks in summer are the best show in the city.',
  'Easy', 'Large', 'Busy', st_point(-87.6010, 41.8917)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Chicago Riverwalk', '{Scenic,Modern,Culture}',
  'Mile-long promenade along the Chicago River beneath the city''s canyon of landmark skyscrapers.',
  'Take an architecture boat tour from the Riverwalk for the best skyline perspectives.',
  'Easy', 'Large', 'Moderate', st_point(-87.6276, 41.8875)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'The 606 Trail', '{Nature,Modern,Culture}',
  'Elevated rail-line converted to a 4.3 km greenway connecting four Northwest Side neighbourhoods.',
  'Access the trail at the Bloomingdale Ave entrance in Bucktown for the most dynamic street-art section.',
  'Easy', 'Large', 'Moderate', st_point(-87.6633, 41.9117)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Lincoln Park Zoo', '{Nature,Culture,Icon}',
  'Free urban zoo founded in 1868 on the Lake Michigan lakefront, one of the last free admission zoos in the US.',
  'The Regenstein African Journey indoor habitat is an excellent cold-weather option.',
  'Easy', 'Large', 'Moderate', st_point(-87.6332, 41.9214)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Wrigley Field', '{Historic,Icon,Culture}',
  '1914 ivy-wall brick ballpark on the North Side, home to the Chicago Cubs and a National Historic Landmark.',
  'Even outside game days, the exterior marquee and surrounding Wrigleyville bars are worth a visit.',
  'Easy', 'Large', 'Busy', st_point(-87.6553, 41.9484)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Chicago' and k.code = 'US';

-- Miami (Florida)
insert into cities (country_id, name, region, center)
select id, 'Miami', 'Florida', st_point(-80.1918, 25.7617)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'South Beach (Ocean Drive)', '{Coastal,Icon,Historic}',
  'World-famous Art Deco strip along Ocean Drive with pastel hotels, white sand, and neon-lit nightlife.',
  'The Art Deco Historic District walking tour departs Lummus Park on Saturday mornings.',
  'Easy', 'Large', 'Busy', st_point(-80.1300, 25.7825)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Wynwood Walls', '{Modern,Culture,Icon}',
  'Outdoor museum of large-scale murals by global street artists in a former industrial warehouse district.',
  'New murals are painted at Art Basel Miami in December — visit in January to see the freshest works.',
  'Easy', 'Medium', 'Busy', st_point(-80.1994, 25.8004)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Vizcaya Museum and Gardens', '{Historic,Scenic,Culture}',
  'Italian Renaissance-style villa and formal gardens built by industrialist James Deering in 1916 on Biscayne Bay.',
  'The bayfront terrace with the ornamental stone barge offers the best photographic composition.',
  'Easy', 'Large', 'Moderate', st_point(-80.1583, 25.7440)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Everglades National Park', '{Nature,Scenic,Icon}',
  'Largest subtropical wilderness in the US — a slow-moving "river of grass" teeming with alligators and birds.',
  'Take the Anhinga Trail at dawn for guaranteed alligator and roseate spoonbill sightings.',
  'Easy', 'Large', 'Moderate', st_point(-80.9282, 25.2866)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Pérez Art Museum Miami', '{Culture,Modern,Coastal}',
  'Herzog & de Meuron waterfront museum with hanging garden façades and a focus on contemporary global art.',
  'The outdoor sculpture terrace overlooking Biscayne Bay is free to access without a museum ticket.',
  'Easy', 'Large', 'Moderate', st_point(-80.1872, 25.7752)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Little Havana (Calle Ocho)', '{Culture,Food,Historic}',
  'The cultural heart of Miami''s Cuban exile community — cigars rolled by hand, domino parks, and café con leche.',
  'The Domino Park at SW 15th Ave is open to spectators; buy a cortadito from the adjacent window.',
  'Easy', 'Medium', 'Moderate', st_point(-80.2101, 25.7658)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Bayside Marketplace', '{Coastal,Culture,Food}',
  'Outdoor waterfront market on Biscayne Bay with live music, boat tours, and views of the Venetian Causeway.',
  'Board an Island Queen cruise from the dock here for a one-hour bay and Star Island tour.',
  'Easy', 'Large', 'Busy', st_point(-80.1874, 25.7745)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Key Biscayne — Bill Baggs Cape Florida State Park', '{Coastal,Nature,Scenic}',
  'Undeveloped barrier island with a historic 1825 lighthouse, beach, and mangrove nature trails.',
  'Climb the 109-step lighthouse for a 360-degree view of the Atlantic and the Miami skyline.',
  'Moderate', 'Large', 'Quiet', st_point(-80.1589, 25.6680)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Miami' and k.code = 'US';

-- Seattle (Washington)
insert into cities (country_id, name, region, center)
select id, 'Seattle', 'Washington', st_point(-122.3321, 47.6062)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Space Needle', '{Icon,Modern,Scenic}',
  'Futuristic 184-metre observation tower built for the 1962 World''s Fair with a rotating glass floor.',
  'The glass-floor "The Loupe" rotates one revolution per hour — find a seat and let it carry you.',
  'Easy', 'Medium', 'Busy', st_point(-122.3493, 47.6205)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Pike Place Market', '{Food,Culture,Icon}',
  'Historic public farmers'' market of 1907 overlooking Elliott Bay, famous for fish-throwing vendors.',
  'The original Starbucks at 1912 Pike Place is steps away; the downstairs "pure food fish" stall throws fish daily.',
  'Easy', 'Large', 'Busy', st_point(-122.3421, 47.6097)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Chihuly Garden and Glass', '{Culture,Modern,Icon}',
  'Dale Chihuly''s largest permanent exhibition — a greenhouse and garden of monumental blown-glass sculptures.',
  'The Glasshouse ceiling installation is most dramatic in afternoon light filtering through the roof.',
  'Easy', 'Medium', 'Moderate', st_point(-122.3503, 47.6211)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Mount Rainier National Park', '{Nature,Scenic,Icon}',
  'Active 4,392-metre stratovolcano with the most glaciers of any peak in the contiguous US.',
  'Paradise area at 1,646 m gives the most accessible alpine meadow views; arrive before 9 am.',
  'Hard', 'Large', 'Moderate', st_point(-121.7269, 46.8800)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Olympic Sculpture Park', '{Culture,Scenic,Modern}',
  'Free nine-acre waterfront park by the Seattle Art Museum combining large-scale sculpture and Elliott Bay views.',
  'Alexander Calder''s bright red "Eagle" sculpture frames a perfect photo with the Olympic Mountains behind.',
  'Easy', 'Large', 'Quiet', st_point(-122.3553, 47.6164)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Capitol Hill — Cal Anderson Park', '{Culture,Nature,Modern}',
  'The social hub of Seattle''s LGBTQ+ neighbourhood, centred on a beautiful fountain and reflecting pool.',
  'The Saturday farmers'' market on Broadway starts here — come early for Korean-fusion breakfast.',
  'Easy', 'Medium', 'Moderate', st_point(-122.3196, 47.6171)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Museum of Pop Culture (MoPOP)', '{Culture,Modern,Icon}',
  'Frank Gehry-designed rock-and-pop culture museum built around Jimi Hendrix''s Seattle roots.',
  'The "Can''t Look Away" horror exhibit and Infinite Worlds of Science Fiction are perennial highlights.',
  'Easy', 'Large', 'Moderate', st_point(-122.3481, 47.6213)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Kerry Park', '{Scenic,Icon,Nature}',
  'Small hilltop park on Queen Anne Hill with the definitive framed view of the Space Needle and skyline.',
  'Arrive 20 minutes before sunset and stay for the blue hour — the Space Needle lights up at dusk.',
  'Easy', 'Small', 'Moderate', st_point(-122.3596, 47.6295)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Seattle' and k.code = 'US';

-- Boston (Massachusetts)
insert into cities (country_id, name, region, center)
select id, 'Boston', 'Massachusetts', st_point(-71.0589, 42.3601)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Freedom Trail', '{Historic,Icon,Culture}',
  '2.5-mile red-brick path linking 16 Revolutionary-era sites from Boston Common to Bunker Hill.',
  'The self-guided walk is free; start at Boston Common Visitor Center for a map and audio guide.',
  'Easy', 'Large', 'Busy', st_point(-71.0657, 42.3554)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Fenway Park', '{Historic,Icon,Culture}',
  'America''s oldest Major League Baseball park (1912), home of the Red Sox and the iconic Green Monster wall.',
  'Behind-the-scenes tours run daily and include the press box, warning track, and Monster seats.',
  'Easy', 'Large', 'Busy', st_point(-71.0979, 42.3467)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Museum of Fine Arts Boston', '{Culture,Historic,Icon}',
  'One of the largest art museums in the US with outstanding Egyptian, Impressionist, and Native American collections.',
  'The free-admission Wednesday evening after 4 pm is the locals'' favourite entry window.',
  'Easy', 'Large', 'Moderate', st_point(-71.0940, 42.3394)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Harvard University', '{Historic,Culture,Icon}',
  'America''s oldest university (1636) with a storied red-brick yard and the Widener Library on its doorstep.',
  'Join a free student-led Unofficial Harvard Tour from the Science Center Plaza.',
  'Easy', 'Large', 'Busy', st_point(-71.1167, 42.3770)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Quincy Market', '{Historic,Food,Culture}',
  '1826 Greek Revival market hall at Faneuil Hall Marketplace, a bustling food rotunda in the historic core.',
  'Eat at the central rotunda stalls rather than the chain restaurants flanking the building.',
  'Easy', 'Medium', 'Busy', st_point(-71.0541, 42.3601)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'USS Constitution', '{Historic,Icon,Coastal}',
  'World''s oldest commissioned naval warship still afloat, docked in the Charlestown Navy Yard since 1897.',
  'Free Navy tours run several times daily; arrive 30 minutes early and bring photo ID.',
  'Easy', 'Medium', 'Moderate', st_point(-71.0556, 42.3727)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Boston Public Garden', '{Nature,Scenic,Historic}',
  'America''s first public botanical garden (1837), beloved for its swan boats and weeping willows.',
  'The bronze "Make Way for Ducklings" sculptures near the Charles St entrance are a beloved photo stop.',
  'Easy', 'Medium', 'Busy', st_point(-71.0712, 42.3541)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Isabella Stewart Gardner Museum', '{Culture,Historic,Icon}',
  'A Venetian palazzo built around a flower-filled courtyard, housing a personal collection assembled by Gardner herself.',
  'The courtyard changes seasonally; the heist-empty frames are displayed as memorials to the stolen works.',
  'Easy', 'Medium', 'Quiet', st_point(-71.0990, 42.3381)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Boston' and k.code = 'US';

-- Washington (District of Columbia)
insert into cities (country_id, name, region, center)
select id, 'Washington', 'District of Columbia', st_point(-77.0369, 38.9072)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Lincoln Memorial', '{Historic,Icon,Scenic}',
  'Daniel Chester French''s 1922 marble statue of Abraham Lincoln gazes across the Reflecting Pool to the Capitol.',
  'Read the Gettysburg Address carved on the south wall — many visitors miss it entirely.',
  'Easy', 'Large', 'Busy', st_point(-77.0502, 38.8893)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'National Mall', '{Historic,Icon,Scenic}',
  'Two-mile monumental greensward flanked by Smithsonian museums, stretching from the Capitol to the Lincoln Memorial.',
  'All Smithsonian museums on the Mall are free — the Air and Space Museum and Natural History are perennial favourites.',
  'Easy', 'Large', 'Busy', st_point(-77.0302, 38.8895)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'United States Capitol', '{Historic,Icon,Culture}',
  'Neoclassical seat of Congress crowned by Thomas Walter''s cast-iron dome, completed during the Civil War.',
  'Free visitor passes for gallery tours of House and Senate chambers can be arranged via your representative.',
  'Easy', 'Large', 'Busy', st_point(-77.0091, 38.8897)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'The White House', '{Historic,Icon,Culture}',
  'Official residence of the US President since 1800 — the North Portico is the world''s most recognisable facade.',
  'Public tours require advance booking through your Member of Congress; the fence views are always free.',
  'Easy', 'Large', 'Busy', st_point(-77.0366, 38.8977)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'National Museum of Natural History', '{Culture,Icon,Historic}',
  'Smithsonian institution housing the Hope Diamond, an IMAX ocean hall, and 145 million natural specimens.',
  'The Sant Ocean Hall blue whale is the largest museum specimen in the world — look for the 94-foot model.',
  'Easy', 'Large', 'Busy', st_point(-77.0261, 38.8913)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Washington National Cathedral', '{Sacred,Historic,Icon}',
  'Gothic limestone cathedral completed in 1990 after 83 years of construction, with a moonrock embedded in a window.',
  'Climb the Pilgrim Observation Gallery for the city''s finest elevated view outside the Washington Monument.',
  'Easy', 'Large', 'Moderate', st_point(-77.0707, 38.9306)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'National Gallery of Art', '{Culture,Historic,Icon}',
  'Twin neoclassical and modernist pavilions housing a comprehensive collection from da Vinci to Rothko — all free.',
  'The underground concourse connecting the East and West Buildings has a moving walkway and a Calder mobile overhead.',
  'Easy', 'Large', 'Moderate', st_point(-77.0200, 38.8913)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Arlington National Cemetery', '{Historic,Sacred,Scenic}',
  'The nation''s most hallowed burial ground with 400,000 graves, the Tomb of the Unknown Soldier, and JFK''s eternal flame.',
  'The Changing of the Guard at the Tomb of the Unknown Soldier happens every hour on the hour; arrive early for a front position.',
  'Easy', 'Large', 'Moderate', st_point(-77.0731, 38.8760)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Washington' and k.code = 'US';

-- Las Vegas (Nevada)
insert into cities (country_id, name, region, center)
select id, 'Las Vegas', 'Nevada', st_point(-115.1398, 36.1699)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'The Strip (Las Vegas Boulevard)', '{Icon,Modern,Culture}',
  '4.2-mile neon boulevard of mega-resort casinos — the densest concentration of hotel rooms in the world.',
  'Walk the full Strip at least once at 2 am when the crowd thins and neon blazes without daytime glare.',
  'Easy', 'Large', 'Busy', st_point(-115.1729, 36.1147)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Bellagio Fountains', '{Icon,Modern,Scenic}',
  'Choreographed water-and-light show on an 8.5-acre artificial lake, running every 15–30 minutes.',
  'The 8 pm show set to opera or Broadway is the most dramatic; stake out a spot on the bridge early.',
  'Easy', 'Large', 'Busy', st_point(-115.1765, 36.1127)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'High Roller Observation Wheel', '{Modern,Icon,Scenic}',
  'World''s tallest observation wheel at 167 m, with 28 glass cabins and a full-circuit view of the valley.',
  'Book the Happy Half Hour cabin (open bar) for sunset — worth the price uplift.',
  'Easy', 'Large', 'Moderate', st_point(-115.1688, 36.1173)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Red Rock Canyon National Conservation Area', '{Nature,Scenic,Icon}',
  'Striking crimson Aztec sandstone escarpment 25 km west of the Strip with a 13-mile scenic drive.',
  'The Calico Hills trail is a 2.5-mile loop with no scrambling and outstanding colour-contrast photography.',
  'Easy', 'Large', 'Moderate', st_point(-115.4274, 36.1350)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Fremont Street Experience', '{Icon,Historic,Culture}',
  'Downtown Vegas''s pedestrian mall under a 460-metre LED canopy running free light shows every hour after dark.',
  'The zip lines launched from the canopy top are the most unique way to see the show.',
  'Easy', 'Large', 'Busy', st_point(-115.1443, 36.1706)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'The Venetian Grand Canal Shoppes', '{Modern,Culture,Icon}',
  'Indoor sky-painted canal lined with gondolas, cobblestone piazzas, and a replica Doge''s Palace.',
  'The St. Mark''s Square street performers put on free 20-minute shows every two hours.',
  'Easy', 'Large', 'Moderate', st_point(-115.1699, 36.1212)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Valley of Fire State Park', '{Nature,Scenic,Icon}',
  'Nevada''s oldest state park — alien red sandstone formations, petrified logs, and 3,000-year-old petroglyphs.',
  'Elephant Rock and the Wave (Fire Wave trail) are the two must-photograph formations in the park.',
  'Moderate', 'Large', 'Quiet', st_point(-114.5350, 36.4850)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Hoover Dam', '{Historic,Icon,Modern}',
  'Mighty Art Deco arch-gravity dam of 1936 impounding Lake Mead — an engineering marvel on the Colorado River.',
  'Park on the Nevada side and walk across the bypass bridge for the best downstream dam view.',
  'Easy', 'Large', 'Busy', st_point(-114.7377, 36.0156)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Las Vegas' and k.code = 'US';

-- New Orleans (Louisiana)
insert into cities (country_id, name, region, center)
select id, 'New Orleans', 'Louisiana', st_point(-90.0715, 29.9511)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'French Quarter (Vieux Carré)', '{Historic,Culture,Food}',
  'America''s oldest urban neighbourhood — a grid of Spanish Creole architecture, jazz clubs, and iron-lace balconies.',
  'Bourbon Street is the loud tourist core; Royal Street is one block over and far more atmospheric.',
  'Easy', 'Large', 'Busy', st_point(-90.0646, 29.9584)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Jackson Square', '{Historic,Icon,Culture}',
  'St. Louis Cathedral and the Pontalba Buildings frame this landmark 1721 plaza in the heart of the French Quarter.',
  'The fortune tellers and artists who line the iron fence set up by 10 am on weekends.',
  'Easy', 'Medium', 'Busy', st_point(-90.0632, 29.9575)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Garden District', '{Historic,Scenic,Culture}',
  'Antebellum Greek Revival and Italianate mansions shaded by massive live oaks along Magazine Street.',
  'Board the St. Charles streetcar on Canal Street for a scenic $1.25 ride through the whole district.',
  'Easy', 'Large', 'Moderate', st_point(-90.0973, 29.9299)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Preservation Hall', '{Culture,Icon,Historic}',
  'Legendary intimate jazz venue in the French Quarter that has preserved New Orleans jazz since 1961.',
  'The $15–20 balcony bar tickets are sold only at the door; queue 30 minutes before the 8 pm show.',
  'Easy', 'Small', 'Busy', st_point(-90.0660, 29.9579)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'St. Louis Cemetery No. 1', '{Historic,Sacred,Culture}',
  'The oldest extant cemetery in New Orleans (1789) with above-ground brick-and-plaster tombs in the Creole tradition.',
  'Guided tours are now required to enter; book through Save Our Cemeteries for the most knowledgeable guides.',
  'Easy', 'Small', 'Moderate', st_point(-90.0697, 29.9620)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Café Du Monde', '{Food,Icon,Historic}',
  'Open-air café in the French Market since 1862, serving beignets and chicory café au lait around the clock.',
  'Wear dark clothing — the powdered sugar on the beignets will cover everything.',
  'Easy', 'Small', 'Busy', st_point(-90.0609, 29.9572)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Frenchmen Street', '{Culture,Food,Icon}',
  'Local alternative to Bourbon Street — a three-block stretch where New Orleans jazz still spills out of every doorway.',
  'The Spotted Cat Music Club has free live jazz every night; arrive before 9 pm for a table.',
  'Easy', 'Medium', 'Busy', st_point(-90.0548, 29.9621)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Audubon Park and Zoo', '{Nature,Culture,Scenic}',
  'Spanish-moss-draped 340-acre park along the Mississippi levee with a nationally acclaimed zoo.',
  'Rent a paddleboat on the lagoon — the view of the live oak canopy from the water is magical.',
  'Easy', 'Large', 'Moderate', st_point(-90.1180, 29.9260)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'New Orleans' and k.code = 'US';

-- Austin (Texas)
insert into cities (country_id, name, region, center)
select id, 'Austin', 'Texas', st_point(-97.7431, 30.2672)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Sixth Street Entertainment District', '{Culture,Food,Icon}',
  'Austin''s live-music epicentre — a stretch of bars and venues where every genre of Texas music plays nightly.',
  'East Sixth Street beyond Chicon is the locals'' preferred end with craft cocktail bars and fewer cover charges.',
  'Easy', 'Medium', 'Busy', st_point(-97.7404, 30.2680)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Texas State Capitol', '{Historic,Icon,Culture}',
  '1888 Renaissance Revival granite capitol that stands taller than the US Capitol, set in 22 acres of park.',
  'The rotunda star dome interior is freely accessible — look up for the lone-star ceiling pattern.',
  'Easy', 'Large', 'Moderate', st_point(-97.7405, 30.2747)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Barton Springs Pool', '{Nature,Scenic,Coastal}',
  'Three-acre natural spring-fed swimming hole in Zilker Park, maintained at a constant 68°F year-round.',
  'Arrive before 9 am on weekends when admission is free and the water is freshest.',
  'Easy', 'Medium', 'Busy', st_point(-97.7719, 30.2642)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'South Congress Avenue', '{Culture,Food,Icon}',
  'Walkable strip of vintage boutiques, Tex-Mex restaurants, and the famous Güero''s Taco Bar beneath the Capitol view.',
  'The unobstructed view of the Capitol dome at the north end of SoCo is a classic photo axis.',
  'Easy', 'Medium', 'Busy', st_point(-97.7491, 30.2487)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Blanton Museum of Art', '{Culture,Modern,Icon}',
  'The largest university art museum in the US, on the UT campus, with a major Ellsworth Kelly chapel.',
  'Ellsworth Kelly''s "Austin" — a non-denominational stone chapel of coloured windows — is a 15-minute walk away and free.',
  'Easy', 'Large', 'Quiet', st_point(-97.7388, 30.2822)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Congress Avenue Bridge (Bat Colony)', '{Nature,Icon,Scenic}',
  'The Ann W. Richards Congress Avenue Bridge hosts 1.5 million Mexican free-tailed bats — the world''s largest urban colony.',
  'Bat emergence begins about 20 minutes after sunset from late March through October; face east to see them spiral out.',
  'Easy', 'Large', 'Busy', st_point(-97.7440, 30.2631)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Rainey Street Historic District', '{Food,Culture,Modern}',
  'Converted bungalow homes turned bars and restaurants along a tree-canopied stretch near downtown.',
  'The bungalow patios are smaller and more intimate than the Sixth Street mega-bars; reserve ahead on weekends.',
  'Easy', 'Small', 'Busy', st_point(-97.7362, 30.2598)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Hamilton Pool Preserve', '{Nature,Scenic,Coastal}',
  'Collapsed grotto swimming hole 37 km west of Austin with a 15-metre waterfall and jade-green pool.',
  'Reserve the timed entry permit online the morning reservations open — spots fill within minutes.',
  'Hard', 'Medium', 'Busy', st_point(-98.1278, 30.3427)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Austin' and k.code = 'US';

-- Denver (Colorado)
insert into cities (country_id, name, region, center)
select id, 'Denver', 'Colorado', st_point(-104.9903, 39.7392)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Rocky Mountain National Park', '{Nature,Scenic,Icon}',
  'Alpine wilderness 105 km from Denver with 77 peaks over 4,000 m, elk meadows, and Trail Ridge Road.',
  'Trail Ridge Road reaches 3,713 m — drive it early morning before afternoon thunderstorms build.',
  'Hard', 'Large', 'Busy', st_point(-105.6836, 40.3428)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Denver Art Museum', '{Culture,Modern,Icon}',
  'Daniel Libeskind''s sharp titanium expansion housing one of the finest Native American art collections in the world.',
  'The American Indian Art gallery on level 4 of the Frederic C. Hamilton Building is the standout collection.',
  'Easy', 'Large', 'Moderate', st_point(-104.9894, 39.7373)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Red Rocks Amphitheatre', '{Scenic,Culture,Nature}',
  'Naturally formed red sandstone amphitheatre carved into the Morrison foothills — one of the world''s great music venues.',
  'Even without a show, the sunrise yoga sessions and hiking trails through the rock formations are worth the drive.',
  'Moderate', 'Large', 'Moderate', st_point(-105.2046, 39.6654)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Colorado State Capitol', '{Historic,Icon,Scenic}',
  '1908 gold-domed capitol set at exactly one mile elevation above sea level on the 13th step of the west entrance.',
  'The free rotunda tour includes the gold dome interior and rooftop views over the Front Range.',
  'Easy', 'Large', 'Moderate', st_point(-104.9847, 39.7392)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Larimer Square', '{Historic,Culture,Food}',
  'Denver''s oldest commercial block (1870s) — a lantern-lit Victorian street of restaurants and boutiques.',
  'The upper balcony restaurants along the east side are the most atmospheric dining spots in the city.',
  'Easy', 'Small', 'Busy', st_point(-104.9979, 39.7475)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Denver Botanic Gardens', '{Nature,Scenic,Culture}',
  'World-class botanical garden in Capitol Hill showcasing 45,000 plants from around the globe.',
  'The Japanese garden and the outdoor sculpture walk are serene even on busy weekend mornings.',
  'Easy', 'Medium', 'Moderate', st_point(-104.9613, 39.7316)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'RiNo Art District', '{Modern,Culture,Food}',
  'River North warehouse district transformed by murals, breweries, and galleries — Denver''s creative epicentre.',
  'The Zeppelin Station food hall is the best introduction to the neighbourhood''s culinary range.',
  'Easy', 'Medium', 'Moderate', st_point(-104.9774, 39.7657)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Confluence Park', '{Nature,Scenic,Culture}',
  'Urban river park where Cherry Creek meets the South Platte — kayaking, beach volleyball, and mountain views.',
  'Rent a kayak from the REI flagship store just upstream and run the city whitewater channel.',
  'Easy', 'Medium', 'Moderate', st_point(-105.0097, 39.7543)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Denver' and k.code = 'US';

-- Honolulu (Hawaii)
insert into cities (country_id, name, region, center)
select id, 'Honolulu', 'Hawaii', st_point(-157.8583, 21.3069)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Waikiki Beach', '{Coastal,Icon,Scenic}',
  'World-famous two-mile crescent beach below the Diamond Head crater with reliable beginner surf.',
  'Rent a longboard from the beach boys near the Royal Hawaiian Hotel for a lesson at sunrise.',
  'Easy', 'Large', 'Busy', st_point(-157.8324, 21.2793)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Diamond Head State Monument', '{Nature,Scenic,Icon}',
  '232-metre tuff cone volcanic crater with a summit trail through WWI-era tunnels and a panoramic lookout.',
  'Start hiking by 7 am before the midday heat and queue at the narrow tunnel sections.',
  'Moderate', 'Medium', 'Busy', st_point(-157.8057, 21.2640)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'USS Arizona Memorial', '{Historic,Sacred,Icon}',
  'Floating white memorial spanning the sunken hull of the battleship Arizona at Pearl Harbor, where 1,177 crew rest.',
  'Book the free NPS boat tour well in advance — walk-up tickets run out by 9 am.',
  'Easy', 'Medium', 'Busy', st_point(-157.9500, 21.3650)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Iolani Palace', '{Historic,Icon,Culture}',
  'America''s only royal palace (1882) — official residence of the last Hawaiian monarchs before annexation.',
  'The audio-guided Grand Hall tour ($27) is the most thorough; book online to avoid the walk-up wait.',
  'Easy', 'Medium', 'Moderate', st_point(-157.8584, 21.3069)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Manoa Falls Trail', '{Nature,Scenic,Icon}',
  'Lush rainforest trail in the Ko''olau Mountains leading to a 46-metre waterfall above Honolulu.',
  'Wear waterproof shoes — the trail is almost always muddy, and the falls are fullest after morning rain.',
  'Moderate', 'Medium', 'Moderate', st_point(-157.8025, 21.3335)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Bishop Museum', '{Culture,Historic,Icon}',
  'Hawaii''s largest natural and cultural history museum with the world''s finest collection of Hawaiian and Pacific artifacts.',
  'The Hawaiian Hall interior — three tiers of dark koa wood — is itself a masterwork of 1889 architecture.',
  'Easy', 'Large', 'Moderate', st_point(-157.8660, 21.3177)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Hanauma Bay Nature Preserve', '{Coastal,Nature,Scenic}',
  'Sheltered volcanic bay with a barrier coral reef and over 400 fish species — Honolulu''s premier snorkel site.',
  'Reservations are mandatory; the 7 am slot has the clearest water and fewest people on the reef.',
  'Easy', 'Medium', 'Busy', st_point(-157.6938, 21.2694)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Tantalus — Pu''u ''Uala''ka''a State Wayside', '{Scenic,Nature,Icon}',
  'Lookout atop the Tantalus crater rim at 520 m offering the best panoramic view of Honolulu and Waikiki.',
  'Drive up Round Top Drive at dusk — the city lights below rival Waikiki at any hour.',
  'Easy', 'Medium', 'Quiet', st_point(-157.8354, 21.3152)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Honolulu' and k.code = 'US';

-- Nashville (Tennessee)
insert into cities (country_id, name, region, center)
select id, 'Nashville', 'Tennessee', st_point(-86.7816, 36.1627)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Grand Ole Opry', '{Icon,Culture,Historic}',
  'The world''s longest-running live radio program (since 1925) and shrine of country music, now in a 4,400-seat theatre.',
  'Backstage tours run on non-show days; call-in tickets are cheaper than weekend premium seats.',
  'Easy', 'Large', 'Busy', st_point(-86.6986, 36.2023)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'The Parthenon (Centennial Park)', '{Historic,Icon,Culture}',
  'Full-scale replica of the Athenian Parthenon built for the 1897 centennial, housing a 13-metre Athena statue.',
  'The Naos gallery with Athena Parthenos is open Tuesday–Sunday; the exterior is freely viewable any time.',
  'Easy', 'Large', 'Moderate', st_point(-86.8131, 36.1498)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Country Music Hall of Fame and Museum', '{Culture,Historic,Icon}',
  'The definitive archive of country music history, housing Elvis''s gold Cadillac and Hank Williams'' hand-written songs.',
  'Pair the museum visit with a Studio B recording studio tour for an extra $10.',
  'Easy', 'Large', 'Busy', st_point(-86.7793, 36.1573)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Lower Broadway (Honky Tonk Highway)', '{Culture,Food,Icon}',
  'Neon-lit block of multi-level honky-tonk bars with live country music from noon until 3 am, seven nights a week.',
  'Bands play for tips until midnight; arrive early for a rooftop bar spot before crowds block the stage view.',
  'Easy', 'Medium', 'Busy', st_point(-86.7757, 36.1608)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Bicentennial Capitol Mall State Park', '{Historic,Scenic,Culture}',
  'Open-air park north of the Capitol tracing 200 years of Tennessee history with granite terraces and bells.',
  'The 31-bell carillon at the north end plays Tennessee tunes at noon — time your visit accordingly.',
  'Easy', 'Large', 'Quiet', st_point(-86.7849, 36.1675)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Ryman Auditorium', '{Historic,Icon,Culture}',
  'The "Mother Church of Country Music" — an 1892 tabernacle that hosted the Grand Ole Opry for 31 years.',
  'The original wooden pew seating in the balcony preserves the authentic gospel-hall atmosphere.',
  'Easy', 'Medium', 'Moderate', st_point(-86.7793, 36.1614)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'The Gulch', '{Modern,Food,Culture}',
  'Nashville''s LEED-certified urban neighbourhood with the Instagram-famous "wings" mural and indie dining.',
  'The "What Lifts You" angel wings mural on 11th Ave S is best photographed in the late-afternoon golden light.',
  'Easy', 'Medium', 'Moderate', st_point(-86.7915, 36.1524)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Belle Meade Historic Site', '{Historic,Culture,Scenic}',
  'Antebellum Greek Revival plantation and winery estate that became one of America''s most celebrated thoroughbred stud farms.',
  'The award-winning Belle Meade winery tasting room is included in the house tour ticket.',
  'Easy', 'Large', 'Quiet', st_point(-86.8491, 36.1022)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Nashville' and k.code = 'US';

-- Philadelphia (Pennsylvania)
insert into cities (country_id, name, region, center)
select id, 'Philadelphia', 'Pennsylvania', st_point(-75.1652, 39.9526)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Liberty Bell', '{Historic,Icon,Culture}',
  'The 1752 cracked copper bell that became a symbol of American independence, displayed in a glass pavilion.',
  'Entry to the Liberty Bell Center is free; arrive before 9 am to avoid the school-group rush.',
  'Easy', 'Small', 'Busy', st_point(-75.1501, 39.9494)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Independence Hall', '{Historic,Icon,Sacred}',
  'Georgian brick building where both the Declaration of Independence and the Constitution were signed.',
  'Free timed-entry tickets are required March–December; reserve online or at the visitor centre by 8:30 am.',
  'Easy', 'Medium', 'Busy', st_point(-75.1497, 39.9489)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Philadelphia Museum of Art', '{Culture,Historic,Icon}',
  'One of the largest art museums in the US, with the "Rocky Steps" and a world-class Asian art collection.',
  'Run up the 72 steps and then go inside — the collection rivals many European national museums.',
  'Easy', 'Large', 'Busy', st_point(-75.1808, 39.9656)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Reading Terminal Market', '{Food,Historic,Culture}',
  'Philadelphia''s beloved 1893 covered market under the old Reading Railroad train shed — a National Historic Landmark.',
  'The Amish vendors from Lancaster County sell out by early afternoon; arrive before noon for scrapple and shoo-fly pie.',
  'Easy', 'Medium', 'Busy', st_point(-75.1587, 39.9533)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Eastern State Penitentiary', '{Historic,Icon,Culture}',
  'Gothic fortress prison (1829) where Al Capone was held — now an acclaimed art installation and haunt site.',
  'The Terror Behind the Walls Halloween event is one of America''s top haunted attractions; book months ahead.',
  'Easy', 'Large', 'Moderate', st_point(-75.1726, 39.9681)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Barnes Foundation', '{Culture,Modern,Historic}',
  'The most concentrated collection of Renoir and Cézanne on Earth, reinstalled in a purpose-built Parkway building.',
  'Timed-entry tickets sell out; book online at least a week ahead for weekend slots.',
  'Easy', 'Large', 'Moderate', st_point(-75.1753, 39.9627)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Elfreth''s Alley', '{Historic,Scenic,Culture}',
  'America''s oldest continuously inhabited residential street (1702) — 32 Federal and Georgian houses in use today.',
  'The Elfreth''s Alley Museum at No. 124 opens on weekends and gives access to two original furnished houses.',
  'Easy', 'Small', 'Moderate', st_point(-75.1454, 39.9529)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Mural Arts Philadelphia', '{Modern,Culture,Icon}',
  'Over 4,000 murals citywide make Philadelphia the "Mural Capital of the World" — tours depart by foot and trolley.',
  'The North Broad Street mural corridor is the densest concentration; the free map from visitphilly.com covers all.',
  'Easy', 'Large', 'Moderate', st_point(-75.1657, 39.9597)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Philadelphia' and k.code = 'US';

-- San Diego (California)
insert into cities (country_id, name, region, center)
select id, 'San Diego', 'California', st_point(-117.1611, 32.7157)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Balboa Park', '{Culture,Nature,Icon}',
  '1,200-acre urban park with 17 museums, the San Diego Zoo, and Spanish Colonial Revival architecture.',
  'The free Spreckels Organ Pavilion concert at 2 pm on Sundays is a beloved San Diego tradition.',
  'Easy', 'Large', 'Busy', st_point(-117.1425, 32.7296)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'San Diego Zoo', '{Nature,Icon,Culture}',
  'One of the world''s most famous zoos, pioneering open-air enclosures and home to giant pandas.',
  'The Skyfari aerial tram crosses the whole park — ride it first to plan your route before crowds queue.',
  'Easy', 'Large', 'Busy', st_point(-117.1490, 32.7353)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'USS Midway Museum', '{Historic,Icon,Culture}',
  'America''s longest-serving 20th-century aircraft carrier, now a floating museum with 30 restored aircraft on deck.',
  'The self-guided audio tour is excellent; climb to the island bridge for a carrier-captain perspective.',
  'Easy', 'Large', 'Busy', st_point(-117.1754, 32.7137)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Cabrillo National Monument', '{Historic,Scenic,Coastal}',
  'Windswept Point Loma peninsula where Juan Rodríguez Cabrillo made the first European landing on the West Coast (1542).',
  'The tide pools on the western shore are accessible at low tide — check the tidal calendar before going.',
  'Easy', 'Medium', 'Moderate', st_point(-117.2415, 32.6736)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Old Town San Diego State Historic Park', '{Historic,Culture,Food}',
  'The site of the first European settlement in Alta California (1769), with adobe buildings and Mexican markets.',
  'The Bazaar del Mundo shops and Fiesta de Reyes restaurants keep authentic Californio craft traditions alive.',
  'Easy', 'Medium', 'Moderate', st_point(-117.1965, 32.7541)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'La Jolla Cove', '{Coastal,Nature,Scenic}',
  'Protected ocean cove in the Scripps Coastal Reserve where sea lions and leopard sharks share the crystal water.',
  'Snorkel in the early morning before the afternoon swell picks up and visibility drops.',
  'Easy', 'Medium', 'Busy', st_point(-117.2729, 32.8500)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Gaslamp Quarter', '{Historic,Food,Culture}',
  '16-block National Historic District of Victorian commercial architecture transformed into restaurants and nightlife.',
  'The Ghosts and Gravestones tour departs here on weekends for a walking tour of San Diego''s dark history.',
  'Easy', 'Medium', 'Busy', st_point(-117.1602, 32.7099)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Coronado Beach', '{Coastal,Scenic,Icon}',
  'Wide silver-sand beach beside the Victorian Hotel del Coronado, consistently ranked among the US top 10.',
  'Walk north past the hotel to the quiet Coronado Shores stretch — fewer people and better swimming.',
  'Easy', 'Large', 'Busy', st_point(-117.1882, 32.6981)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'San Diego' and k.code = 'US';

-- Portland (Oregon)
insert into cities (country_id, name, region, center)
select id, 'Portland', 'Oregon', st_point(-122.6765, 45.5231)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Powell''s City of Books', '{Culture,Icon,Historic}',
  'The world''s largest independent bookstore — a city-block warren of new, used, and rare books across five colour-coded rooms.',
  'Pick up a free store map at the entrance; the Rare Book Room on the second floor is a bibliophile''s grail.',
  'Easy', 'Large', 'Busy', st_point(-122.6836, 45.5231)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'International Rose Test Garden', '{Nature,Scenic,Icon}',
  'Hilltop garden of 610 rose varieties in Washington Park with an unobstructed view of Mount Hood on clear days.',
  'Peak bloom is mid-May to June; the Queen''s Cup varieties are in the lower terraced beds.',
  'Easy', 'Medium', 'Moderate', st_point(-122.7074, 45.5193)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Columbia River Gorge', '{Nature,Scenic,Icon}',
  'Dramatic 130-km basalt canyon with 90 waterfalls and the Historic Columbia River Highway — one hour from Portland.',
  'Multnomah Falls (189 m, two-tier) requires a timed-entry permit in summer; book at recreation.gov.',
  'Hard', 'Large', 'Busy', st_point(-121.9000, 45.5762)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Portland Japanese Garden', '{Nature,Scenic,Sacred}',
  'Eight-acre authentic Japanese garden in Washington Park, called the finest outside Japan by Kyoto''s mayor.',
  'The pavilion garden is most serene at opening (10 am) in autumn leaf season — a 20-minute Uber from downtown.',
  'Easy', 'Medium', 'Quiet', st_point(-122.7087, 45.5186)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Pearl District', '{Modern,Culture,Food}',
  'Former warehouse district reborn as Portland''s design hub — galleries, farm-to-table restaurants, and Saturday Market.',
  'The first Thursday gallery walk on NW 13th Ave is free and introduces the best contemporary art spaces.',
  'Easy', 'Medium', 'Moderate', st_point(-122.6836, 45.5285)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Portland Art Museum', '{Culture,Historic,Icon}',
  'The oldest art museum on the West Coast (1892), with a superb Northwest Coast Native American collection.',
  'The Mark Building across the street — the contemporary wing — is included in admission and is often quieter.',
  'Easy', 'Large', 'Moderate', st_point(-122.6870, 45.5177)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Lan Su Chinese Garden', '{Culture,Historic,Scenic}',
  'Authentic Ming Dynasty-style garden built by Suzhou craftsmen in the Old Town — a walled world of pavilions and pools.',
  'Afternoon tea in the Tower of Cosmic Reflections teahouse requires no extra charge beyond entry.',
  'Easy', 'Small', 'Quiet', st_point(-122.6725, 45.5252)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Forest Park', '{Nature,Scenic,Culture}',
  '5,100-acre urban forest — the largest in the US — with 80 km of trails above the Northwest neighbourhoods.',
  'The Wildwood Trail from the Hoyt Arboretum entrance is well-signed and connects to the Japanese Garden.',
  'Easy', 'Large', 'Moderate', st_point(-122.7531, 45.5504)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Portland' and k.code = 'US';

-- Atlanta (Georgia)
insert into cities (country_id, name, region, center)
select id, 'Atlanta', 'Georgia', st_point(-84.3880, 33.7490)::geography
from countries where code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Georgia Aquarium', '{Nature,Culture,Icon}',
  'The world''s largest aquarium (by water volume) with whale sharks, beluga whales, and a 4D theatre.',
  'Book online and enter at opening — the Ocean Voyager tunnel is uncrowded for the first 30 minutes.',
  'Easy', 'Large', 'Busy', st_point(-84.3952, 33.7634)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Martin Luther King Jr. National Historic Site', '{Historic,Sacred,Icon}',
  'Birth home, church, and tomb of Dr. King — the National Park Service preserves the full Auburn Avenue complex.',
  'The Ebenezer Baptist Church guided tour gives the most powerful account of the Civil Rights movement.',
  'Easy', 'Large', 'Moderate', st_point(-84.3736, 33.7497)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'World of Coca-Cola', '{Culture,Icon,Modern}',
  'Immersive museum tracing the history of Coca-Cola with a vault, tasting room of 100 global flavours, and the iconic bottle.',
  'The tasting room is at the end — the Beverly flavour is notoriously the worst; try it as a rite of passage.',
  'Easy', 'Medium', 'Busy', st_point(-84.3939, 33.7628)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Centennial Olympic Park', '{Historic,Scenic,Modern}',
  'Legacy park from the 1996 Summer Olympics with the five-ring Fountain of Rings water feature.',
  'The fountain shows are free and run every hour; summer evening shows are synchronised to music and lights.',
  'Easy', 'Large', 'Moderate', st_point(-84.3920, 33.7605)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'High Museum of Art', '{Culture,Modern,Icon}',
  'Richard Meier''s white porcelain-tiled museum — the Southeast''s leading art institution with a touring Louvre partnership.',
  'The Folk Art and Photography galleries are outstanding and rarely as congested as the travelling exhibitions.',
  'Easy', 'Large', 'Moderate', st_point(-84.3847, 33.7900)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Stone Mountain Park', '{Nature,Scenic,Historic}',
  'Largest exposed granite monadnock in the world, with a cable car summit and the world''s largest bas-relief carving.',
  'The Summit Skyride runs year-round; the Cherokee Trail loop around the mountain base takes about 5 miles.',
  'Easy', 'Large', 'Busy', st_point(-84.1452, 33.8081)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Ponce City Market', '{Modern,Food,Culture}',
  'Adaptive reuse of the 1926 Sears building — a food hall, retail market, and rooftop fairground on the BeltLine.',
  'The BeltLine trail outside the east entrance links directly to Piedmont Park — perfect for a morning walk.',
  'Easy', 'Large', 'Busy', st_point(-84.3673, 33.7720)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Jimmy Carter Presidential Library and Museum', '{Historic,Culture,Icon}',
  'Presidential library on 35 acres of azalea gardens tracing Carter''s life from Plains, Georgia to the Nobel Prize.',
  'The Japanese-style garden and duck pond behind the library are free and serene at any hour.',
  'Easy', 'Medium', 'Quiet', st_point(-84.3614, 33.7622)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Atlanta' and k.code = 'US';
