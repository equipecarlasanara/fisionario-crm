export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // Cabeçalhos CORS (Para o Frontend no Pages conseguir falar com o Worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,PUT,PATCH",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // ROTA: LISTAR LEADS (PARA O KANBAN)
    if (url.pathname === "/api/leads" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY lastContact DESC").all();
      return Response.json(results, { headers: corsHeaders });
    }

    // ROTA: ATUALIZAR ETAPA (ARRASTAR CARD NO KANBAN)
    if (url.pathname.startsWith("/api/leads/") && method === "PATCH") {
      const id = url.pathname.split("/")[3];
      const { status } = await request.json();
      
      // Formata a data atual compatível como string (DD/MM) ou ISO
      const hoje = new Date().toLocaleDateString('pt-BR');
      
      await env.DB.prepare("UPDATE leads SET stage = ?, lastContact = ? WHERE id = ?")
        .bind(status, hoje, id).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    // ROTA: CRIAR NOVO LEAD (FORMULÁRIOS)
    if (url.pathname === "/api/leads" && method === "POST") {
      const data = await request.json();
      const hoje = new Date().toLocaleDateString('pt-BR');
      await env.DB.prepare("INSERT INTO leads (name, wpp, ig, origem, stage, dateAdded, lastContact, hist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(data.name || "Lead Novo", data.wpp || "", data.ig || "", data.origem || "formulario", "novo", hoje, hoje, "[]").run();
      return Response.json({ success: true }, { status: 201, headers: corsHeaders });
    }

    // ROTA: Z-API BUSCAR GRUPOS
    if (url.pathname === "/api/zapi/groups" && method === "GET") {
      const pId = url.searchParams.get("instanceId");
      const pTok = url.searchParams.get("token");
      const pCtok = url.searchParams.get("clientToken") || "";
      
      try {
        const headers = {};
        if (pCtok.trim() !== '') headers["Client-Token"] = pCtok.trim();
        const fetchRes = await fetch(`https://api.z-api.io/instances/${pId}/token/${pTok}/groups`, { method: "GET", headers });
        const ans = await fetchRes.json();
        return Response.json(ans, { headers: corsHeaders });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
      }
    }

    // ROTA: Z-API PROXY (DISPARO DE WHATSAPP REAL)
    if (url.pathname === "/api/zapi" && method === "POST") {
      const data = await request.json();
      const zapiUrl = `https://api.z-api.io/instances/${data.instanceId}/token/${data.token}/send-text`;
      
      try {
        const headers = { "Content-Type": "application/json" };
        if (data.clientToken && data.clientToken.trim() !== '') {
            headers["Client-Token"] = data.clientToken.trim();
        }

        const fetchRes = await fetch(zapiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ phone: data.phone, message: data.messageText })
        });
        const ans = await fetchRes.json();
        return Response.json(ans, { headers: corsHeaders });
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
      }
    }
    
    // ROTA: WEBHOOK META (INSTAGRAM/WHATSAPP)
    
    // ROTA: LISTAR GRUPOS
    if (url.pathname === "/api/groups" && method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM groups").all();
      const format = results.map(r => ({ ...r, messages: r.messages ? JSON.parse(r.messages) : [] }));
      return Response.json(format, { headers: corsHeaders });
    }

    // ROTA: CRIAR GRUPO
    if (url.pathname === "/api/groups" && method === "POST") {
      const data = await request.json();
      const n = data.name || "Novo Grupo";
      // No Cloudflare D1 o id vem pelo select, mas retornamos um genérico no post pois o front precisa de feedback rápido
      await env.DB.prepare("INSERT INTO groups (name, status, leadsCount, investimentoSemana, investimentoTotal, link, messages) VALUES (?, 'active', 0, 0, 0, '', '[]')").bind(n).run();
      
      const { results } = await env.DB.prepare("SELECT * FROM groups ORDER BY id DESC LIMIT 1").all();
      const newGroup = results[0] || { id: Date.now(), name: n, status: 'active', leadsCount: 0, investimentoSemana: 0, investimentoTotal: 0, link: '', messages: [] };
      if(typeof newGroup.messages === 'string') newGroup.messages = JSON.parse(newGroup.messages);
      
      return Response.json(newGroup, { status: 201, headers: corsHeaders });
    }

    // ROTA: ATUALIZAR GRUPO
    if (url.pathname.startsWith("/api/groups/") && method === "PUT") {
      const id = url.pathname.split("/")[3];
      const data = await request.json();
      await env.DB.prepare("UPDATE groups SET name=?, status=?, leadsCount=?, investimentoSemana=?, investimentoTotal=?, link=?, messages=? WHERE id=?")
        .bind(data.name, data.status, data.leadsCount, data.investimentoSemana, data.investimentoTotal, data.link, JSON.stringify(data.messages || []), id).run();
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (url.pathname === "/webhook" ) {
       // ... (Lógica do webhook que criamos nos passos anteriores)
       return new Response("OK", { headers: corsHeaders });
    }

    return new Response("Não encontrado", { status: 404, headers: corsHeaders });
  }
}
