const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'fisionario.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Tabela principal de leads
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    wpp TEXT,
    ig TEXT,
    origem TEXT,
    stage TEXT DEFAULT 'entrada',
    dateAdded TEXT,
    lastContact TEXT,
    hist TEXT -- JSON array das mensagens
  )`);

  // Tabela de grupos VIP
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    leadsCount INTEGER DEFAULT 0,
    investimentoSemana REAL DEFAULT 0,
    investimentoTotal REAL DEFAULT 0,
    link TEXT,
    messages TEXT -- JSON array das mensagens do grupo
  )`);
});

// Funções Helpers
const getLeads = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM leads", (err, rows) => {
      if (err) return reject(err);
      // Fazer o parse do campo hist que é JSON String
      const data = rows.map(r => ({
        ...r,
        hist: r.hist ? JSON.parse(r.hist) : []
      }));
      resolve(data);
    });
  });
};

const insertLead = (lead) => {
  return new Promise((resolve, reject) => {
    const { name, wpp, ig, origem, stage, dateAdded, lastContact, hist } = lead;
    const stmt = db.prepare("INSERT INTO leads (name, wpp, ig, origem, stage, dateAdded, lastContact, hist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run([name, wpp, ig, origem, stage, dateAdded, lastContact, JSON.stringify(hist || [])], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, ...lead, hist: hist || [] });
    });
    stmt.finalize();
  });
};

const updateLeadStage = (id, newStage) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE leads SET stage = ? WHERE id = ?", [newStage, id], function(err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

const updateLeadComplete = (id, leadData) => {
  return new Promise((resolve, reject) => {
     const { name, wpp, ig, origem, stage, dateAdded, lastContact, hist } = leadData;
     db.run(
       "UPDATE leads SET name=?, wpp=?, ig=?, origem=?, stage=?, dateAdded=?, lastContact=?, hist=? WHERE id=?",
       [name, wpp, ig, origem, stage, dateAdded, lastContact, JSON.stringify(hist || []), id],
       function(err) {
         if (err) return reject(err);
         resolve(this.changes);
       }
     );
  });
};

const deleteLead = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM leads WHERE id = ?", [id], function(err) {
      if(err) return reject(err);
      resolve(this.changes);
    });
  });
};

// === Helpers GROUPS ===
const getGroups = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM groups", (err, rows) => {
      if (err) return reject(err);
      const data = rows.map(r => ({
        ...r,
        messages: r.messages ? JSON.parse(r.messages) : []
      }));
      resolve(data);
    });
  });
};

const insertGroup = (groupData) => {
  return new Promise((resolve, reject) => {
    const name = groupData.name || "Novo Grupo";
    const status = groupData.status || "active";
    const leadsCount = groupData.leadsCount || 0;
    const invSemana = groupData.investimentoSemana || 0;
    const invTotal = groupData.investimentoTotal || 0;
    const link = groupData.link || "";
    const messages = groupData.messages || [];

    const stmt = db.prepare("INSERT INTO groups (name, status, leadsCount, investimentoSemana, investimentoTotal, link, messages) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run([name, status, leadsCount, invSemana, invTotal, link, JSON.stringify(messages)], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, name, status, leadsCount, investimentoSemana: invSemana, investimentoTotal: invTotal, link, messages });
    });
    stmt.finalize();
  });
};

const updateGroup = (id, groupData) => {
  return new Promise((resolve, reject) => {
    const { name, status, leadsCount, investimentoSemana, investimentoTotal, link, messages } = groupData;
    db.run(
      "UPDATE groups SET name=?, status=?, leadsCount=?, investimentoSemana=?, investimentoTotal=?, link=?, messages=? WHERE id=?",
      [name, status, leadsCount, investimentoSemana, investimentoTotal, link, JSON.stringify(messages || []), id],
      function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
};

const deleteGroup = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM groups WHERE id = ?", [id], function(err) {
      if(err) return reject(err);
      resolve(this.changes);
    });
  });
};

module.exports = {
  db,
  getLeads,
  insertLead,
  updateLeadStage,
  updateLeadComplete,
  deleteLead,
  getGroups,
  insertGroup,
  updateGroup,
  deleteGroup
};
