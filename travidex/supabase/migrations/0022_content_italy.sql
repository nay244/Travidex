-- Phase 10 content: Italy. Add a city: copy a city block. Add a sight: copy a sight block.

-- Italy (cities tier)
insert into countries (name, code, tier) values ('Italy', 'IT', 'cities');

-- Rome (Lazio)
insert into cities (country_id, name, region, center)
select id, 'Rome', 'Lazio', st_point(12.4964, 41.9028)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Colosseum', '{Historic,Icon,Culture}',
  'The world''s largest ancient amphitheatre, built in 70–80 AD to host gladiatorial contests and spectacles.',
  'Book tickets online well in advance; the arena floor access is worth the upgrade.',
  'Easy', 'Large', 'Busy', st_point(12.4922, 41.8902)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Trevi Fountain', '{Icon,Historic,Scenic}',
  'Rome''s most famous Baroque fountain, fed by one of the city''s ancient aqueducts since 1762.',
  'Visit before 8 am for a near-empty fountain and the best photos.',
  'Easy', 'Medium', 'Busy', st_point(12.4833, 41.9009)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Pantheon', '{Historic,Sacred,Icon}',
  'Best-preserved ancient Roman temple, completed around 125 AD with its famous unreinforced concrete dome.',
  'Enter on the hour when the oculus sunbeam hits the interior walls most dramatically.',
  'Easy', 'Large', 'Busy', st_point(12.4768, 41.8986)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Roman Forum', '{Historic,Culture,Icon}',
  'The ancient heart of Rome, a sprawling ruined plaza of temples, arches, and government buildings.',
  'Combine with the Palatine Hill on the same ticket for the full sweep of ancient Rome.',
  'Easy', 'Large', 'Busy', st_point(12.4853, 41.8925)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Spanish Steps', '{Icon,Scenic,Historic}',
  '135 travertine steps linking the French church of Trinità dei Monti to the Piazza di Spagna below.',
  'Climb to the church terrace for a free rooftop panorama over central Rome.',
  'Easy', 'Medium', 'Busy', st_point(12.4823, 41.9057)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'St. Peter''s Basilica', '{Sacred,Historic,Icon}',
  'The world''s largest church, centrepiece of Vatican City and burial site of the apostle Peter.',
  'Climb the dome on foot (not the elevator) for the best view of the nave from above.',
  'Easy', 'Large', 'Busy', st_point(12.4534, 41.9022)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Piazza Navona', '{Historic,Icon,Scenic}',
  'Baroque oval piazza built over Domitian''s stadium, home to Bernini''s Fountain of the Four Rivers.',
  'Find a café on the south end for the best seated view of all three fountains at once.',
  'Easy', 'Large', 'Busy', st_point(12.4730, 41.8992)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Castel Sant''Angelo', '{Historic,Icon,Culture}',
  'Cylindrical mausoleum of Emperor Hadrian, later a papal fortress, now a museum with Tiber views.',
  'Walk the riverside passetto wall connecting the castle to the Vatican on the upper-level visit.',
  'Easy', 'Large', 'Moderate', st_point(12.4663, 41.9031)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Rome' and k.code = 'IT';

-- Florence (Tuscany)
insert into cities (country_id, name, region, center)
select id, 'Florence', 'Tuscany', st_point(11.2558, 43.7696)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Florence Cathedral (Duomo)', '{Sacred,Historic,Icon}',
  'Gothic cathedral crowned by Brunelleschi''s revolutionary terracotta dome, visible from across the city.',
  'Book the dome climb tickets at least a week ahead — they sell out fast in high season.',
  'Easy', 'Large', 'Busy', st_point(11.2562, 43.7731)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Uffizi Gallery', '{Culture,Historic,Icon}',
  'One of the world''s great art museums, housing Botticelli''s Birth of Venus and hundreds of Renaissance masterworks.',
  'Book a timed entry online; Tuesday mornings are the least congested slot.',
  'Easy', 'Large', 'Busy', st_point(11.2553, 43.7678)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ponte Vecchio', '{Historic,Icon,Scenic}',
  'Medieval bridge lined with jewellers'' shops spanning the Arno, the only bridge Napoleon refused to destroy.',
  'Cross before sunrise for an empty bridge and pastel reflections in the Arno.',
  'Easy', 'Small', 'Busy', st_point(11.2531, 43.7681)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Piazzale Michelangelo', '{Scenic,Icon,Historic}',
  'Hilltop terrace on the south bank offering the most celebrated panoramic view of Florence and the Arno valley.',
  'Walk up via the rose garden steps on the left of the ramp for a quieter ascent.',
  'Moderate', 'Medium', 'Busy', st_point(11.2651, 43.7629)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Palazzo Pitti', '{Historic,Culture,Icon}',
  'Vast Renaissance palace housing six museums including the Palatine Gallery of Raphael and Titian paintings.',
  'The Boboli Gardens behind the palace are included in the same ticket and perfect for a break.',
  'Easy', 'Large', 'Moderate', st_point(11.2499, 43.7652)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Accademia Gallery', '{Culture,Historic,Icon}',
  'Gallery housing Michelangelo''s original David alongside his unfinished Prisoners series.',
  'Arrive at opening to see David without shoulder-to-shoulder crowds — the effect is worth it.',
  'Easy', 'Medium', 'Busy', st_point(11.2567, 43.7769)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Piazza della Signoria', '{Historic,Icon,Culture}',
  'Florence''s open-air sculpture gallery and civic heart, anchored by the Palazzo Vecchio and Neptune fountain.',
  'The Loggia dei Lanzi is free to enter and shelters original Renaissance sculptures.',
  'Easy', 'Large', 'Busy', st_point(11.2558, 43.7694)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Bargello Museum', '{Culture,Historic,Icon}',
  'Former prison turned sculpture museum with Donatello''s David and one of the finest collections of bronzes in Italy.',
  'Far less crowded than the Accademia; Donatello''s bronze David is the highlight.',
  'Easy', 'Medium', 'Moderate', st_point(11.2581, 43.7700)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Florence' and k.code = 'IT';

-- Venice (Veneto)
insert into cities (country_id, name, region, center)
select id, 'Venice', 'Veneto', st_point(12.3155, 45.4408)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'St. Mark''s Basilica', '{Sacred,Historic,Icon}',
  'Byzantine-style cathedral begun in the 9th century, lavishly decorated with golden mosaics inside.',
  'Pre-book the Pala d''Oro and treasury visit to skip the long queue for the main nave.',
  'Easy', 'Large', 'Busy', st_point(12.3397, 45.4345)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Grand Canal', '{Scenic,Icon,Historic}',
  'Venice''s main waterway snaking 3.8 km through the city, lined with Gothic and Renaissance palazzi.',
  'Take vaporetto line 1 (not the express) for the slowest, most scenic journey end to end.',
  'Easy', 'Large', 'Busy', st_point(12.3272, 45.4385)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Rialto Bridge', '{Historic,Icon,Scenic}',
  'The oldest and most famous of four bridges crossing the Grand Canal, completed in 1591.',
  'Cross before 8 am when the fish market below is active and tourists are absent.',
  'Easy', 'Medium', 'Busy', st_point(12.3359, 45.4380)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Doge''s Palace', '{Historic,Culture,Icon}',
  'Gothic palace of the Venetian rulers, housing state chambers and connected to the Bridge of Sighs prison.',
  'The Secret Itinerary tour unlocks rooms not included in the standard ticket.',
  'Easy', 'Large', 'Busy', st_point(12.3408, 45.4337)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Piazza San Marco', '{Icon,Historic,Scenic}',
  'Napoleon''s "finest drawing room in Europe" — Venice''s ceremonial heart with the campanile and clock tower.',
  'Acqua alta (high tide flooding) turns the piazza into a shallow lake — Wellington boots are rented nearby.',
  'Easy', 'Large', 'Busy', st_point(12.3387, 45.4340)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Murano Island', '{Culture,Historic,Icon}',
  'Small island famous since 1291 for its master glassblowers; the Glass Museum shows centuries of craft.',
  'Watch a live glassblowing demonstration at a traditional fornace — many are free to observe.',
  'Easy', 'Medium', 'Moderate', st_point(12.3553, 45.4564)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Burano Island', '{Scenic,Culture,Coastal}',
  'Fishing island of brilliantly painted houses in a checkerboard of vivid colours, famous for lace-making.',
  'Afternoon light makes the colours most saturated; the northern houses are the most photogenic.',
  'Easy', 'Small', 'Moderate', st_point(12.4166, 45.4851)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Gallerie dell''Accademia', '{Culture,Historic,Icon}',
  'Venice''s premier art museum tracing Venetian painting from Byzantine origins to Tiepolo.',
  'Veronese''s Feast in the House of Levi fills an entire wall — step back to the doorway for full scale.',
  'Easy', 'Large', 'Moderate', st_point(12.3276, 45.4310)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Venice' and k.code = 'IT';

-- Milan (Lombardy)
insert into cities (country_id, name, region, center)
select id, 'Milan', 'Lombardy', st_point(9.1900, 45.4642)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Milan Cathedral (Duomo di Milano)', '{Sacred,Historic,Icon}',
  'The world''s largest Gothic cathedral, its marble spires and 3,400 statues taking six centuries to complete.',
  'Book the rooftop terrace ticket for a close-up walk among the flying buttresses and spires.',
  'Easy', 'Large', 'Busy', st_point(9.1919, 45.4641)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'The Last Supper', '{Culture,Historic,Sacred}',
  'Leonardo da Vinci''s mural painted 1495–98 in the refectory of Santa Maria delle Grazie.',
  'Tickets sell out months ahead — book the moment your travel dates are confirmed.',
  'Easy', 'Small', 'Busy', st_point(9.1712, 45.4659)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Galleria Vittorio Emanuele II', '{Historic,Icon,Culture}',
  'Italy''s oldest shopping mall, a 19th-century glass-vaulted arcade connecting the Duomo to La Scala.',
  'Spin on the bull mosaic in the floor for good luck — look for the worn patch at the centre.',
  'Easy', 'Large', 'Busy', st_point(9.1898, 45.4656)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Teatro alla Scala', '{Culture,Historic,Icon}',
  'One of the world''s most prestigious opera houses, opened in 1778 and still home to the finest voices.',
  'The museum is open year-round; book a backstage tour when the company is on tour.',
  'Easy', 'Large', 'Moderate', st_point(9.1895, 45.4673)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Pinacoteca di Brera', '{Culture,Historic,Icon}',
  'Milan''s leading art gallery in an 18th-century Baroque palace, with Raphael, Caravaggio, and Mantegna.',
  'The courtyard bronze of Napoleon by Canova is often overlooked — see it before going upstairs.',
  'Easy', 'Large', 'Moderate', st_point(9.1882, 45.4720)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Sforza Castle', '{Historic,Culture,Icon}',
  'Vast 15th-century fortress of the Sforza dukes, now housing twelve civic museums including Michelangelo''s last Pietà.',
  'The free outer courtyard and towers are open daily; arrive at dusk for atmospheric lighting.',
  'Easy', 'Large', 'Moderate', st_point(9.1797, 45.4706)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Navigli District', '{Culture,Food,Historic}',
  'Milan''s former canal network turned aperitivo hub, with towpath bars and weekend antique markets.',
  'Sunday morning flea market along the Naviglio Grande is one of the best in northern Italy.',
  'Easy', 'Medium', 'Busy', st_point(9.1742, 45.4514)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Parco Sempione', '{Nature,Scenic,Culture}',
  '47-hectare English-style park behind the Sforza Castle, Milan''s green lung with a triumphal arch.',
  'The Arco della Pace at the north end frames a perfect long view back toward the castle.',
  'Easy', 'Large', 'Moderate', st_point(9.1762, 45.4743)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Milan' and k.code = 'IT';

-- Naples (Campania)
insert into cities (country_id, name, region, center)
select id, 'Naples', 'Campania', st_point(14.2681, 40.8518)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'National Archaeological Museum', '{Culture,Historic,Icon}',
  'The world''s greatest collection of Greco-Roman antiquities, holding the Farnese treasures and Pompeii finds.',
  'The Secret Cabinet of erotic art requires a separate request — ask at the ticket desk.',
  'Easy', 'Large', 'Moderate', st_point(14.2506, 40.8536)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Pompeii', '{Historic,Culture,Icon}',
  'Roman city buried by Vesuvius in 79 AD, preserved under ash and rediscovered since the 18th century.',
  'Wear sturdy shoes — the cobblestone streets are very uneven — and arrive early to avoid afternoon heat.',
  'Easy', 'Large', 'Busy', st_point(14.4896, 40.7506)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Spaccanapoli', '{Historic,Culture,Food}',
  'The arrow-straight ancient decumanus that splits Naples in two, lined with churches, street food, and craftsmen.',
  'Follow the scent of freshly fried pizza fritta — the best is found in side alleys off the main drag.',
  'Easy', 'Medium', 'Busy', st_point(14.2557, 40.8498)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Castel dell''Ovo', '{Historic,Scenic,Icon}',
  'Naples'' oldest castle on a small islet in the bay, with sweeping views of Vesuvius and the Gulf.',
  'Entry is free — walk up through the ramparts to the highest terrace for the best Vesuvius panorama.',
  'Easy', 'Medium', 'Moderate', st_point(14.2483, 40.8283)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Mount Vesuvius', '{Nature,Scenic,Historic}',
  'The still-active volcano that buried Pompeii, offering a crater rim hike with views over the Bay of Naples.',
  'Book the shuttle from Pompeii car park and take the steep crater walk in the morning before clouds roll in.',
  'Hard', 'Large', 'Moderate', st_point(14.4260, 40.8210)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Naples Cathedral', '{Sacred,Historic,Culture}',
  'Gothic cathedral housing the Cappella Sansevero and the phials of San Gennaro''s blood, Naples'' most sacred relic.',
  'Attend the Miracle of San Gennaro on 19 September to see the blood liquefaction ceremony.',
  'Easy', 'Large', 'Moderate', st_point(14.2594, 40.8534)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Certosa di San Martino', '{Historic,Scenic,Culture}',
  '14th-century Carthusian monastery on the Vomero hill, now a museum with extraordinary baroque decoration and city views.',
  'The great cloister is one of the finest in Italy and is included in the entrance ticket.',
  'Moderate', 'Large', 'Quiet', st_point(14.2396, 40.8411)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Lungomare Caracciolo', '{Scenic,Coastal,Icon}',
  'Naples'' grand seafront promenade with views of Castel dell''Ovo, Vesuvius, and Capri on clear days.',
  'Walk west past the Villa Comunale gardens at sunset for the most vivid Vesuvius silhouette.',
  'Easy', 'Large', 'Moderate', st_point(14.2421, 40.8297)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Naples' and k.code = 'IT';

-- Turin (Piedmont)
insert into cities (country_id, name, region, center)
select id, 'Turin', 'Piedmont', st_point(7.6869, 45.0703)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Egyptian Museum', '{Culture,Historic,Icon}',
  'The world''s second-largest collection of Egyptian antiquities after Cairo''s, with an intact tomb complex.',
  'The basement tomb of Kha and Merit is the undisputed highlight — allocate an hour just for this section.',
  'Easy', 'Large', 'Moderate', st_point(7.6826, 45.0654)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Mole Antonelliana', '{Icon,Historic,Modern}',
  'Turin''s defining 167-metre spire, originally a synagogue and now housing the National Cinema Museum.',
  'Take the panoramic elevator inside to the viewing platform for a 360-degree Alpine panorama.',
  'Easy', 'Large', 'Moderate', st_point(7.6929, 45.0690)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Piazza San Carlo', '{Historic,Icon,Scenic}',
  'Turin''s elegant Baroque salon, flanked by twin churches and the equestrian statue of Emmanuel Philibert.',
  'Visit the historic cafés under the arcades — Caffè San Carlo and Caffè Torino are both 19th-century institutions.',
  'Easy', 'Large', 'Moderate', st_point(7.6830, 45.0655)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Royal Palace of Turin', '{Historic,Culture,Icon}',
  'Savoy royal residence from 1646, with gilded state rooms, the Armoury, and a UNESCO World Heritage designation.',
  'The Chinese Cabinet and Alcove Chamber are the most lavishly decorated rooms in the palace.',
  'Easy', 'Large', 'Moderate', st_point(7.6845, 45.0724)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Turin Cathedral', '{Sacred,Historic,Culture}',
  'Renaissance cathedral housing the Turin Shroud, the linen cloth bearing a faint human image venerated as Jesus'' burial cloth.',
  'The Shroud is displayed only on rare occasions; the chapel housing it is always open for viewing.',
  'Easy', 'Large', 'Moderate', st_point(7.6842, 45.0735)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Parco del Valentino', '{Nature,Scenic,Historic}',
  '50-hectare riverside park along the Po with a medieval village replica and botanical garden.',
  'Rent a bike from the park entrance and loop the full riverside path to the Borgo Medievale.',
  'Easy', 'Large', 'Moderate', st_point(7.6895, 45.0529)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Basilica of Superga', '{Sacred,Scenic,Historic}',
  'Baroque basilica on a hilltop east of the city, royal mausoleum of the House of Savoy, with Alpine views.',
  'Take the historic rack railway (Dentiera) from Sassi for the scenic ascent.',
  'Moderate', 'Large', 'Quiet', st_point(7.7676, 45.0778)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'Palazzo Madama', '{Historic,Culture,Icon}',
  'Two-millennium palazzo housing the Civic Museum of Ancient Art, with a Baroque façade by Juvara.',
  'The medieval tower rooms at the back of the building are the oldest surviving part — don''t skip them.',
  'Easy', 'Large', 'Moderate', st_point(7.6858, 45.0708)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Turin' and k.code = 'IT';

-- Bologna (Emilia-Romagna)
insert into cities (country_id, name, region, center)
select id, 'Bologna', 'Emilia-Romagna', st_point(11.3426, 44.4949)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Two Towers (Due Torri)', '{Historic,Icon,Scenic}',
  'Bologna''s medieval skyline symbols — the 97-metre Asinelli and the leaning Garisenda — built by rival noble families.',
  'Climb Asinelli''s 498 steps for the finest rooftop panorama of the red-tiled city.',
  'Moderate', 'Medium', 'Moderate', st_point(11.3474, 44.4944)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Piazza Maggiore', '{Historic,Icon,Culture}',
  'Bologna''s vast central square ringed by Gothic civic palaces, the Basilica di San Petronio, and the Sala Borsa.',
  'Come on a summer evening when the square fills with an outdoor cinema — entrance is free.',
  'Easy', 'Large', 'Busy', st_point(11.3426, 44.4938)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'University of Bologna', '{Historic,Culture,Icon}',
  'The world''s oldest university, founded in 1088; the Archiginnasio library and anatomy theatre are open to visitors.',
  'The anatomical theatre with its carved cedar professor''s chair is one of the most beautiful rooms in Italy.',
  'Easy', 'Medium', 'Moderate', st_point(11.3449, 44.4923)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Quadrilatero Market', '{Food,Culture,Historic}',
  'Medieval market district of narrow lanes packed with salumerias, cheesemongers, and pasta makers.',
  'Arrive before noon to taste mortadella and tagliatelle at source — many stalls close by 1 pm.',
  'Easy', 'Medium', 'Busy', st_point(11.3468, 44.4950)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Portico di San Luca', '{Historic,Scenic,Sacred}',
  'The world''s longest portico — 3.8 km of 666 arches climbing to the hilltop Sanctuary of San Luca.',
  'Walk the full ascent on a clear morning for views of the Apennines from the sanctuary terrace.',
  'Moderate', 'Large', 'Moderate', st_point(11.3001, 44.4766)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Basilica di Santo Stefano', '{Sacred,Historic,Culture}',
  'A complex of seven interconnected churches dating from the 4th century, known as the "Seven Churches" of Bologna.',
  'The courtyard with the Pilate''s Basin is the most atmospheric space — free and open all day.',
  'Easy', 'Large', 'Quiet', st_point(11.3492, 44.4910)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Neptune Fountain', '{Historic,Icon,Scenic}',
  'Giambologna''s muscular bronze Neptune (1566) presiding over a fountain at the edge of Piazza Maggiore.',
  'Photograph from the southwest corner at dusk when the bronze turns amber in the low light.',
  'Easy', 'Small', 'Moderate', st_point(11.3417, 44.4942)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'FICO Eataly World', '{Food,Culture,Modern}',
  'The world''s largest agri-food park, a 100,000 m² celebration of Italian cuisine with live production areas.',
  'Join a pasta-making class in the morning before the weekend crowds arrive in the afternoon.',
  'Easy', 'Large', 'Busy', st_point(11.3918, 44.5094)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Bologna' and k.code = 'IT';

-- Palermo (Sicily)
insert into cities (country_id, name, region, center)
select id, 'Palermo', 'Sicily', st_point(13.3614, 38.1157)::geography
from countries where code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 1, 'Palermo Cathedral', '{Sacred,Historic,Icon}',
  'Norman-Arab-Byzantine cathedral begun in 1185, containing the porphyry tombs of the Norman kings.',
  'Climb to the roof for an unusual bird''s-eye view of the Arab-Norman exterior geometries.',
  'Easy', 'Large', 'Moderate', st_point(13.3523, 38.1131)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 2, 'Cappella Palatina', '{Sacred,Historic,Icon}',
  'Roger II''s royal chapel (1130s) with the finest Byzantine mosaics outside Constantinople inside a Norman palace.',
  'Pre-book entry to the Palazzo dei Normanni — the chapel queues are separate and often shorter.',
  'Easy', 'Small', 'Busy', st_point(13.3505, 38.1115)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 3, 'Ballarò Market', '{Food,Culture,Historic}',
  'Palermo''s oldest and most vibrant street market, a riot of vendors selling street food, fish, and produce.',
  'Follow the arancina vendors for the best rice balls in the city — try both the meat and butter versions.',
  'Easy', 'Medium', 'Busy', st_point(13.3510, 38.1125)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 4, 'Quattro Canti', '{Historic,Icon,Scenic}',
  'The Baroque crossroads at the heart of old Palermo, four ornate concave façades meeting at a single intersection.',
  'Stand at the centre of the crossroads and look up at all four facades simultaneously for the intended theatrical effect.',
  'Easy', 'Small', 'Moderate', st_point(13.3617, 38.1149)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 5, 'Monreale Cathedral', '{Sacred,Historic,Icon}',
  'Norman cathedral 8 km from Palermo housing the most complete cycle of Byzantine mosaics in the world.',
  'Take bus 389 from Palermo centre; arrive at opening to see the mosaics in the morning light.',
  'Easy', 'Large', 'Moderate', st_point(13.2912, 38.0818)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 6, 'Teatro Massimo', '{Culture,Historic,Icon}',
  'Italy''s largest opera house, opened in 1897, whose steps featured in The Godfather Part III.',
  'Take the 30-minute guided tour to see the royal box and under-stage machinery even if not attending a performance.',
  'Easy', 'Large', 'Moderate', st_point(13.3566, 38.1195)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 7, 'Capuchin Catacombs', '{Historic,Culture,Icon}',
  'Underground burial corridors displaying 8,000 mummified bodies in period dress, spanning 1599 to 1920.',
  'Photography is permitted but use a respectful tone; children under 10 may find the display distressing.',
  'Easy', 'Medium', 'Moderate', st_point(13.3462, 38.1115)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location)
select c.id, 8, 'La Martorana', '{Sacred,Historic,Icon}',
  'Byzantine church of 1143 with original Norman-era mosaics, famous for its marzipan fruits (frutta martorana).',
  'The Greek Orthodox mass on Sunday morning is open to visitors and fills the church with incense and chant.',
  'Easy', 'Small', 'Moderate', st_point(13.3616, 38.1153)::geography
from cities c join countries k on k.id = c.country_id
where c.name = 'Palermo' and k.code = 'IT';
