import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Artist, Artwork } from "@/lib/types";
import ContactForm from "./contact-form";

type ArtistWithArtworks = Artist & { artworks: Artwork[] };

const priceFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("artists")
    .select("*, artworks(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const artist = data as ArtistWithArtworks;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Volver
      </Link>

      <section className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {artist.avatar_url && (
          <img
            src={artist.avatar_url}
            alt={artist.name}
            className="h-32 w-32 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-rose-600">
            {artist.discipline}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">{artist.name}</h1>
          {artist.city && <p className="text-zinc-500">{artist.city}</p>}
          {artist.bio && (
            <p className="mt-3 max-w-2xl text-zinc-700">{artist.bio}</p>
          )}
          <div className="mt-3 flex gap-4 text-sm">
            {artist.instagram && (
              <a
                href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-rose-600"
              >
                {artist.instagram}
              </a>
            )}
            {artist.website && (
              <a
                href={artist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-rose-600"
              >
                Sitio web
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold">Obras</h2>
          {!artist.artworks.length ? (
            <p className="text-zinc-500">Este artista aún no tiene obras.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {artist.artworks.map((work) => (
                <article
                  key={work.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  <img
                    src={work.image_url}
                    alt={work.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{work.title}</h3>
                      {work.year && (
                        <span className="text-sm text-zinc-500">{work.year}</span>
                      )}
                    </div>
                    {work.description && (
                      <p className="mt-1 text-sm text-zinc-600">
                        {work.description}
                      </p>
                    )}
                    {work.price != null && (
                      <p className="mt-2 font-medium">
                        {priceFormat.format(work.price)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside>
          <h2 className="mb-6 text-2xl font-semibold">Contactar</h2>
          <ContactForm artistId={artist.id} artistName={artist.name} />
        </aside>
      </div>
    </div>
  );
}
