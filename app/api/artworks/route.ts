import { createClient } from "@/lib/supabase/server";

// GET /api/artworks -> latest artworks with their artist
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artworks")
    .select("*, artist:artists(id, name, discipline, city, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
