import { createClient } from "@/lib/supabase/server";

// GET /api/artists/:id -> artist with their artworks
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .select("*, artworks(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "Artist not found" }, { status: 404 });

  return Response.json(data);
}
