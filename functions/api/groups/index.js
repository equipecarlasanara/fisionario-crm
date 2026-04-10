export async function onRequestGet(context) {
  const { env } = context;
  try {
    // Auto-create table on first load to bypass Windows CMD issues
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, status TEXT DEFAULT 'active', leadsCount INTEGER DEFAULT 0, investimentoSemana REAL DEFAULT 0, investimentoTotal REAL DEFAULT 0, link TEXT, messages TEXT)").all();

    const { results } = await env.DB.prepare("SELECT * FROM groups ORDER BY id DESC").all();
    const groups = results.map(r => ({
      ...r,
      messages: r.messages ? JSON.parse(r.messages) : []
    }));
    return new Response(JSON.stringify(groups), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const groupData = await request.json();
    const name = groupData.name || "Novo Grupo";
    const status = groupData.status || "active";
    const leadsCount = groupData.leadsCount || 0;
    const invSemana = groupData.investimentoSemana || 0;
    const invTotal = groupData.investimentoTotal || 0;
    const link = groupData.link || "";
    const messages = groupData.messages || [];
    
    const result = await env.DB.prepare(
      "INSERT INTO groups (name, status, leadsCount, investimentoSemana, investimentoTotal, link, messages) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id"
    ).bind(name, status, leadsCount, invSemana, invTotal, link, JSON.stringify(messages)).first();
    
    return new Response(JSON.stringify({ 
      id: result.id, name, status, leadsCount, investimentoSemana: invSemana, investimentoTotal: invTotal, link, messages 
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
