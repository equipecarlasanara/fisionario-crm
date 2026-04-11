export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    console.log('[Z-API WEBHOOK RECEBIDO]', body);
    
    // O payload do Z-API onMessageReceived geralmente vem estruturado assim:
    // { isGroup: false, phone: '5511...', messageId: '...', text: { message: 'ola' }, ... }
    
    // Ignorar status de leitura/envio ou mensagens de grupo por enquanto na inbox 1:1
    if (body.isGroup) return new Response('Ignorado - Grupo', { status: 200 });
    
    const phone = body.phone || body.participantPhone;
    let messageText = '';
    
    if(body.text && body.text.message) {
      messageText = body.text.message;
    } else if (body.audio) {
      messageText = '🎵 [Mensagem de Áudio]';
    } else if (body.image) {
      messageText = '📷 [Imagem]';
    } else if (body.type) {
      messageText = `[Formato não suportado: ${body.type}]`;
    }

    if (!phone || !messageText) return new Response('Ignorado - Sem info', { status: 200 });

    const cleanPhone = phone.replace(/\D/g, '');
    const today = new Date();
    const strDate = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth()+1).padStart(2, '0');
    const timeStr = String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0');
    
    const msgBlock = `[${strDate} ${timeStr} | Recebido] ${messageText}`;

    // Procurar lead no banco D1 pelo telefone
    const dbRes = await env.DB.prepare("SELECT * FROM leads WHERE wpp LIKE ?").bind('%' + cleanPhone + '%').first();
    
    if (dbRes) {
      // Já existe. Adicionar no histórico.
      const currentHist = dbRes.hist ? JSON.parse(dbRes.hist) : [];
      currentHist.push(msgBlock);
      
      await env.DB.prepare(
        "UPDATE leads SET hist = ?, lastContact = ? WHERE id = ?"
      ).bind(JSON.stringify(currentHist), strDate, dbRes.id).all();
      
    } else {
      // Criar nova lead
      const histObj = [msgBlock];
      await env.DB.prepare(
        "INSERT INTO leads (name, wpp, ig, origem, stage, dateAdded, lastContact, hist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        'Lead Nova Z-API ' + cleanPhone, 
        cleanPhone, 
        '—', 
        'whatsapp', 
        'novo', 
        strDate, 
        strDate, 
        JSON.stringify(histObj)
      ).all();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
