-- Selected profile-art background (design 3.11). Flat catalog lives in the app.
alter table profiles add column art_id text not null default 'trailhead';
