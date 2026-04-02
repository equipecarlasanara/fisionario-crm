export async function onRequestPut(context) {
  const { request, env, params } = context;
  const id = params.id;
  try {
    const leadData = await request.json();
    const { name, wpp, ig, origem, stage, dateAdded, lastContact, hist } = leadData;
    await env.DB.prepare(
      "UPDATE leads SET name=?, wpp=?, ig=?, origem=?, stage=?, dateAdded=?, lastContact=?, hist=? WHERE id=?"
    ).bind(name, wpp, ig, origem, stage, dateAdded, lastContact, JSON.stringify(hist || []), id).run();
    
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  const id = params.id;
  try {
    await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
