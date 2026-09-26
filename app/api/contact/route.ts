import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact { artist_id, sender_name, sender_email, message }
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const artist_id = body?.artist_id?.toString().trim();
  const sender_name = body?.sender_name?.toString().trim();
  const sender_email = body?.sender_email?.toString().trim();
  const message = body?.message?.toString().trim();

  if (!artist_id || !sender_name || !sender_email || !message) {
    return Response.json(
      { error: "artist_id, sender_name, sender_email and message are required" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(sender_email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  if (message.length > 2000) {
    return Response.json({ error: "Message is too long" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_requests")
    .insert({ artist_id, sender_name, sender_email, message });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true }, { status: 201 });
}
