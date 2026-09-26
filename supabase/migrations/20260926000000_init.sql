-- Art Attack: descubrir artistas emergentes y contactarlos

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete cascade,
  name text not null,
  bio text,
  discipline text not null,
  city text,
  avatar_url text,
  instagram text,
  website text,
  created_at timestamptz not null default now()
);

create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists (id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  year int,
  price numeric(10, 2),
  created_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists (id) on delete cascade,
  sender_name text not null,
  sender_email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index artworks_artist_id_idx on public.artworks (artist_id);
create index contact_requests_artist_id_idx on public.contact_requests (artist_id);
create index artists_discipline_idx on public.artists (discipline);

alter table public.artists enable row level security;
alter table public.artworks enable row level security;
alter table public.contact_requests enable row level security;

-- Artists: public profiles, each user manages their own
create policy "Artists are public"
  on public.artists for select
  using (true);

create policy "Users create their own artist profile"
  on public.artists for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users update their own artist profile"
  on public.artists for update
  to authenticated
  using (auth.uid() = user_id);

-- Artworks: public, only the owning artist can write
create policy "Artworks are public"
  on public.artworks for select
  using (true);

create policy "Artists manage their own artworks"
  on public.artworks for all
  to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.user_id = auth.uid()
    )
  );

-- Contact requests: anyone can send, only the receiving artist can read
create policy "Anyone can contact an artist"
  on public.contact_requests for insert
  to anon, authenticated
  with check (true);

create policy "Artists read their own contact requests"
  on public.contact_requests for select
  to authenticated
  using (
    exists (
      select 1 from public.artists a
      where a.id = artist_id and a.user_id = auth.uid()
    )
  );
