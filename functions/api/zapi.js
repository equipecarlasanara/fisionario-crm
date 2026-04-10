export async function onRequestPost(context) {
  const { request } = context;
  try {
    const body = await request.json();
    const { instanceId, token, messageText, phone } = body;
    
    if(!instanceId || !token) {
      return new Response(JSON.stringify({ error: "Credenciais ausentes" }), { status: 400 });
    }

    // Chamada real para a Z-API
    const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone || "551199999999", 
        message: messageText || "Mensagem Teste CRM"
      })
    });
    
    const zapiRes = await response.json();
    
    return new Response(JSON.stringify({ success: true, zapiResponse: zapiRes }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
