import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/artists?discipline=Pintura&q=valeria
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const discipline = searchParams.get("discipline");
  const q = searchParams.get("q");

  const supabase = await createClient();
  let query = supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  if (discipline) query = query.eq("discipline", discipline);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
