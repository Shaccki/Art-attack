import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Artist, Artwork } from "@/lib/types";

type ArtworkWithArtist = Artwork & {
  artist: Pick<Artist, "id" | "name" | "discipline"> | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string }>;
}) {
  const { discipline } = await searchParams;
  const supabase = await createClient();

  let artistsQuery = supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });
  if (discipline) artistsQuery = artistsQuery.eq("discipline", discipline);

  const [{ data: artists }, { data: allArtists }, { data: artworks }] =
    await Promise.all([
      artistsQuery,
      supabase.from("artists").select("discipline"),
      supabase
        .from("artworks")
        .select("*, artist:artists(id, name, discipline)")
        .order("created_at", { ascending: false }),
    ]);

  const disciplines = [
    ...new Set((allArtists ?? []).map((a) => a.discipline as string)),
  ].sort();

  const visibleArtworks = ((artworks ?? []) as ArtworkWithArtist[]).filter(
    (w) => !discipline || w.artist?.discipline === discipline
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Descubre artistas emergentes
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600">
          Explora su obra y contáctalos directamente para comprar, colaborar o
          encargar una pieza.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterLink href="/" active={!discipline}>
          Todos
        </FilterLink>
        {disciplines.map((d) => (
          <FilterLink
            key={d}
            href={`/?discipline=${encodeURIComponent(d)}`}
            active={discipline === d}
          >
            {d}
          </FilterLink>
        ))}
      </div>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold">Artistas</h2>
        {!artists?.length ? (
          <p className="text-zinc-500">No hay artistas en esta categoría.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(artists as Artist[]).map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                {artist.avatar_url && (
                  <img
                    src={artist.avatar_url}
                    alt={artist.name}
                    className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                  />
                )}
                <h3 className="font-semibold group-hover:text-rose-600">
                  {artist.name}
                </h3>
                <p className="text-sm text-zinc-500">
                  {artist.discipline}
                  {artist.city && ` · ${artist.city}`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Obras recientes</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleArtworks.map((work) => (
            <Link
              key={work.id}
              href={`/artists/${work.artist_id}`}
              className="group overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <img
                src={work.image_url}
                alt={work.title}
                className="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
              />
              <div className="p-4">
                <h3 className="font-semibold">{work.title}</h3>
                <p className="text-sm text-zinc-500">{work.artist?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-zinc-900 text-white"
          : "border border-black/10 bg-white hover:bg-zinc-100"
      }`}
    >
      {children}
    </Link>
  );
}
