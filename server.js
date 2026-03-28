const express = require('express');
const cors = require('cors');
const path = require('path');
const dbHelper = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Hospedar o HTML visual 
app.use(express.static(path.join(__dirname, 'public')));

// === API LEADS ===

// Listar todos 
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await dbHelper.getLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir 
app.delete('/api/leads/:id', async (req, res) => {
  try {
    await dbHelper.deleteLead(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modificar card inteiro ou mover 
app.put('/api/leads/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await dbHelper.updateLeadComplete(id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo lead manualmente 
app.post('/api/leads', async (req, res) => {
  try {
    const novoLead = await dbHelper.insertLead(req.body);
    res.status(201).json(novoLead);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// === INTEGRAÇÃO WEBHOOK RESPONDI ===
app.post('/api/webhook/respondi', async (req, res) => {
  try {
    console.log('[WEBHOOK] Recebido do Respondi:', req.body);
    // Extraímos os dados que o Respondi manda no payload (Postback API)
    const { name, phone, instagram, answers } = req.body;
    
    // Formatando string de hoje 
    const today = new Date();
    const strDate = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth()+1).padStart(2, '0');

    // Montar o Lead do CRM 
    const autoLead = {
      name: name || (answers && answers.name) || 'Lead Sem Nome',
      wpp: phone || (answers && answers.phone) || '',
      ig: instagram || (answers && answers.instagram) || '—',
      origem: 'formulario',
      stage: 'entrada',
      dateAdded: strDate,
      lastContact: strDate,
      hist: [
        `Lead entrou via Formulário Respondi.`
      ]
    };

    const inserted = await dbHelper.insertLead(autoLead);
    console.log('[WEBHOOK] Processado e lead criado: ID', inserted.id);
    res.status(200).json({ success: true, message: "Lead integrado no Kanban!" });
  } catch (err) {
    console.error('[WEBHOOK ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar Motor 
app.listen(PORT, () => {
  console.log(`🚀 Cérebro Ativado! Servidor rodando em: http://localhost:${PORT}`);
});
