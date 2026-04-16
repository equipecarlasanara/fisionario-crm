const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}



export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY id DESC").all();
    const leads = results.map(r => ({
      ...r,
      hist: r.hist ? JSON.parse(r.hist) : []
    }));

    
    return new Response(JSON.stringify(leads), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const lead = await request.json();
    const { name, wpp, ig, origem, stage, dateAdded, lastContact, hist } = lead;

    const result = await env.DB.prepare(
      "INSERT INTO leads (name, wpp, ig, origem, stage, dateAdded, lastContact, hist) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id"
    ).bind(name, wpp, ig, origem, stage, dateAdded, lastContact, JSON.stringify(hist || [])).first();

    return new Response(JSON.stringify({ id: result.id, ...lead, hist: hist || [] }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

