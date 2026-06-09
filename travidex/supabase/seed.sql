insert into countries (id, name, code) values
  ('11111111-1111-1111-1111-111111111111', 'France', 'FR');

insert into cities (id, country_id, name, region, center) values
  ('22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111', 'Paris', 'Île-de-France',
   st_point(2.3522, 48.8566)::geography);

insert into sights (city_id, dex_no, name, type_tags, about, hint, access, size, busyness, location, reference_photo) values
  ('22222222-2222-2222-2222-222222222222', 1, 'Eiffel Tower', '{Historic,Scenic,Icon}',
   'Wrought-iron tower built 1889 for the World''s Fair.', 'Best photo from the Champ de Mars lawn, south side.',
   'Easy', 'Large', 'Busy', st_point(2.2945, 48.8584)::geography, null),
  ('22222222-2222-2222-2222-222222222222', 2, 'Louvre Museum', '{Historic,Culture,Icon}',
   'The world''s most-visited museum, home of the Mona Lisa.', 'Enter via the Carrousel for shorter lines.',
   'Moderate', 'Large', 'Busy', st_point(2.3376, 48.8606)::geography, null),
  ('22222222-2222-2222-2222-222222222222', 3, 'Sainte-Chapelle', '{Historic,Culture}',
   '13th-century royal chapel famed for its stained glass.', 'Go on a sunny morning for the best light.',
   'Easy', 'Medium', 'Moderate', st_point(2.3450, 48.8554)::geography, null);
