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

module.exports = {
  db,
  getLeads,
  insertLead,
  updateLeadStage,
  updateLeadComplete,
  deleteLead
};
