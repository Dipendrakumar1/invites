export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = process.env.SHEET_URL;
  if (!url) {
    return new Response(JSON.stringify({ ok: false, error: "Not configured" }), { status: 500 });
  }

  const body = await req.text();
  if (body.length > 3000) {
    return new Response(JSON.stringify({ ok: false }), { status: 413 });
  }

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body
    });
    return new Response(JSON.stringify({ ok: r.ok }), {
      status: r.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false }), { status: 502 });
  }
};

export const config = { path: "/api/rsvp" };