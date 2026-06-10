-- Restrict badge codes to the app catalog (clients can insert-own; codes must be valid).
-- NOTE: This list must be extended whenever the badge catalog in lib/badges.ts grows.
alter table user_badges
  add constraint user_badges_code_check
  check (badge_code in ('first_find', 'finds_10', 'finds_50', 'city_claimed', 'countries_5'));
