export async function onRequestPut(context) {
  const { request, env, params } = context;
  try {
    const id = params.id;
    const groupData = await request.json();
    const { name, status, leadsCount, investimentoSemana, investimentoTotal, link, messages } = groupData;
    
    await env.DB.prepare(
      "UPDATE groups SET name=?, status=?, leadsCount=?, investimentoSemana=?, investimentoTotal=?, link=?, messages=? WHERE id=?"
    ).bind(name, status, leadsCount, investimentoSemana, investimentoTotal, link, JSON.stringify(messages || []), id).all();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  try {
    const id = params.id;
    await env.DB.prepare("DELETE FROM groups WHERE id=?").bind(id).all();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
