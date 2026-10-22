-- SkillFinder secure schema. Run once: Supabase > SQL Editor > New query > paste > Run.
-- Use a FRESH project (or drop old tables first). Sign-in is handled by Supabase Auth.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  role text not null check (role in ('customer','artisan')),      -- chosen at sign-up, never editable
  avatar_url text, location text not null default 'Johannesburg' check (char_length(location) <= 60),
  phone text check (char_length(phone) <= 30), trade text check (char_length(trade) <= 60),
  created_at timestamptz not null default now()
);
create table public.artisan_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  title text not null default 'Professional', cover_image text, bio text not null default '' check (char_length(bio) <= 2000),
  starting_price numeric(10,2) not null default 350 check (starting_price >= 0),
  hourly_rate numeric(10,2) not null default 450 check (hourly_rate >= 0),
  years_experience int not null default 0 check (years_experience between 0 and 70),
  specialties text[] not null default '{}', contact_email text,
  verified boolean not null default false,          -- only an admin may change this
  badges text[] not null default '{}',              -- only an admin may change this
  rating numeric(3,2) not null default 0, review_count int not null default 0   -- maintained by a trigger
);
create table public.portfolio_works (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisan_profiles(id) on delete cascade,
  title text not null, category text not null default 'past' check (category in ('past','new')),
  description text not null default '', image_url text, completed_date text, duration text, client_feedback text
);
create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisan_profiles(id) on delete cascade,
  type text not null check (type in ('education','experience','certification')),
  title text not null, institution_or_company text not null default '', year text, description text not null default ''
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  artisan_id uuid not null references public.artisan_profiles(id) on delete cascade,
  customer_name text not null default '', customer_email text not null default '',   -- filled by trigger (cannot be faked)
  customer_phone text not null default '' check (char_length(customer_phone) <= 30), customer_location text,
  artisan_name text not null default '', trade text not null default '',            -- filled by trigger
  service_type text not null check (char_length(service_type) <= 120), preferred_date text not null,
  description text not null default '' check (char_length(description) <= 2000),
  estimated_price numeric(10,2) not null default 0 check (estimated_price >= 0),
  status text not null default 'pending' check (status in ('pending','accepted','declined','completed')),
  created_at timestamptz not null default now()
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisan_profiles(id) on delete cascade,
  customer_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  customer_name text not null default '', customer_avatar text,                      -- filled by trigger
  rating int not null check (rating between 1 and 5), project_type text not null default '' check (char_length(project_type) <= 120),
  comment text not null default '' check (char_length(comment) <= 2000),
  verified_purchase boolean not null default true, helpful_count int not null default 0,
  created_at timestamptz not null default now(), unique (artisan_id, customer_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null default '',                                         -- built by trigger
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null default '', sender_role text not null default 'customer',
  text text not null check (char_length(text) between 1 and 2000), read boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.bookings (artisan_id); create index on public.bookings (customer_id);
create index on public.messages (conversation_id); create index on public.reviews (artisan_id);

-- ONE sign-up path: Supabase Auth creates the user, this trigger creates the profile. Role is whitelisted.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb); r text;
begin
  r := case when m->>'role' = 'artisan' then 'artisan' else 'customer' end;
  insert into public.profiles (id, name, role, avatar_url, location, phone, trade) values (
    new.id, left(coalesce(nullif(trim(m->>'name'), ''), 'New user'), 80), r,
    case when m->>'avatar_url' like 'https://%' then m->>'avatar_url' end,
    left(coalesce(nullif(m->>'location', ''), 'Johannesburg'), 60), left(m->>'phone', 30),
    case when r = 'artisan' then left(coalesce(nullif(m->>'trade', ''), 'General Trade'), 60) end);
  if r = 'artisan' then
    insert into public.artisan_profiles (id, title, contact_email)
    values (new.id, left(coalesce(nullif(m->>'trade', ''), 'Professional'), 60) || ' Specialist', new.email);
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Server-side fields: the browser cannot fake names, emails, conversation ids or status
create function public.fill_booking() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.customer_id := auth.uid(); new.status := 'pending';
  select p.name, p.location, u.email into new.customer_name, new.customer_location, new.customer_email
    from public.profiles p join auth.users u on u.id = p.id where p.id = auth.uid() and p.role = 'customer';
  if new.customer_name is null then raise exception 'Only customers can request bookings'; end if;
  select name, trade into new.artisan_name, new.trade from public.profiles where id = new.artisan_id;
  return new;
end; $$;
create trigger bookings_fill before insert on public.bookings for each row execute function public.fill_booking();

create function public.fill_review() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.customer_id := auth.uid(); new.verified_purchase := true; new.helpful_count := 0;
  select name, avatar_url into new.customer_name, new.customer_avatar from public.profiles where id = auth.uid();
  return new;
end; $$;
create trigger reviews_fill before insert on public.reviews for each row execute function public.fill_review();

create function public.refresh_rating() returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.artisan_profiles set
    rating = (select coalesce(round(avg(rating), 2), 0) from public.reviews where artisan_id = new.artisan_id),
    review_count = (select count(*) from public.reviews where artisan_id = new.artisan_id)
  where id = new.artisan_id;
  return new;
end; $$;
create trigger reviews_rating after insert on public.reviews for each row execute function public.refresh_rating();

create function public.fill_message() returns trigger language plpgsql security definer set search_path = public as $$
declare r text;
begin
  new.sender_id := auth.uid();
  select name, role into new.sender_name, r from public.profiles where id = auth.uid();
  new.sender_role := r;
  new.conversation_id := case when r = 'artisan' then new.sender_id::text || '_' || new.recipient_id::text
                              else new.recipient_id::text || '_' || new.sender_id::text end;
  new.read := false;
  return new;
end; $$;
create trigger messages_fill before insert on public.messages for each row execute function public.fill_message();

-- Row Level Security: everything is locked unless a policy allows it
alter table public.profiles enable row level security;
alter table public.artisan_profiles enable row level security;
alter table public.portfolio_works enable row level security;
alter table public.credentials enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

create policy "profiles: artisans are public, you see yourself" on public.profiles for select using (role = 'artisan' or id = auth.uid());
create policy "profiles: edit own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "artisans: public read" on public.artisan_profiles for select using (true);
create policy "artisans: edit own" on public.artisan_profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "portfolio: public read" on public.portfolio_works for select using (true);
create policy "portfolio: owner writes" on public.portfolio_works for all using (artisan_id = auth.uid()) with check (artisan_id = auth.uid());
create policy "credentials: public read" on public.credentials for select using (true);
create policy "credentials: owner writes" on public.credentials for all using (artisan_id = auth.uid()) with check (artisan_id = auth.uid());

create policy "bookings: participants read" on public.bookings for select using (customer_id = auth.uid() or artisan_id = auth.uid());
create policy "bookings: customer creates" on public.bookings for insert with check (customer_id = auth.uid());
create policy "bookings: artisan updates status" on public.bookings for update using (artisan_id = auth.uid()) with check (artisan_id = auth.uid());

create policy "reviews: public read" on public.reviews for select using (true);
create policy "reviews: only after an accepted booking" on public.reviews for insert with check (
  customer_id = auth.uid() and exists (select 1 from public.bookings b where b.customer_id = auth.uid()
    and b.artisan_id = reviews.artisan_id and b.status in ('accepted','completed')));

create policy "messages: participants read" on public.messages for select using (sender_id = auth.uid() or recipient_id = auth.uid());
create policy "messages: send" on public.messages for insert with check (
  sender_id = auth.uid() and sender_id <> recipient_id and (
    (not exists (select 1 from public.artisan_profiles a where a.id = auth.uid())
      and exists (select 1 from public.artisan_profiles a where a.id = messages.recipient_id))
    or (exists (select 1 from public.artisan_profiles a where a.id = auth.uid())
      and (exists (select 1 from public.messages m where m.sender_id = messages.recipient_id and m.recipient_id = auth.uid())
        or exists (select 1 from public.bookings b where b.artisan_id = auth.uid() and b.customer_id = messages.recipient_id)))));

-- Column-level locks: users may only edit the columns listed here (role, verified, rating, status etc. stay locked)
revoke insert, update, delete on all tables in schema public from anon;
revoke update on public.profiles, public.artisan_profiles, public.bookings, public.reviews, public.messages from authenticated;
revoke insert on public.profiles, public.artisan_profiles from authenticated;
grant update (name, avatar_url, location, phone, trade) on public.profiles to authenticated;
grant update (title, cover_image, bio, starting_price, hourly_rate, years_experience, specialties, contact_email) on public.artisan_profiles to authenticated;
grant update (status) on public.bookings to authenticated;
revoke delete on public.profiles, public.artisan_profiles, public.bookings, public.reviews, public.messages from authenticated;
