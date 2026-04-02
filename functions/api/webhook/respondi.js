export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const payload = await request.json();
    const { name, phone, instagram, answers } = payload;
    
    const today = new Date();
    const strDate = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth()+1).padStart(2, '0');

    const autoLead = {
      name: name || (answers && answers.name) || 'Lead Sem Nome',
      wpp: phone || (answers && answers.phone) || '',
      ig: instagram || (answers && answers.instagram) || '—',
      origem: 'formulario',
      stage: 'entrada',
      dateAdded: strDate,
      lastContact: strDate,
      hist: [ 'Lead entrou via Formulário web/Webhook.' ]
    };

    const result = await env.DB.prepare(
      "INSERT INTO leads (name, wpp, ig, origem, stage, dateAdded, lastContact, hist) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id"
    ).bind(autoLead.name, autoLead.wpp, autoLead.ig, autoLead.origem, autoLead.stage, autoLead.dateAdded, autoLead.lastContact, JSON.stringify(autoLead.hist)).first();
    
    return new Response(JSON.stringify({ success: true, message: "Lead integrado no Kanban!", id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
