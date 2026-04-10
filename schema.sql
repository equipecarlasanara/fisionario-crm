DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  wpp TEXT,
  ig TEXT,
  origem TEXT,
  stage TEXT DEFAULT 'entrada',
  dateAdded TEXT,
  lastContact TEXT,
  hist TEXT -- JSON array das mensagens
);

CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  leadsCount INTEGER DEFAULT 0,
  investimentoSemana REAL DEFAULT 0,
  investimentoTotal REAL DEFAULT 0,
  link TEXT,
  messages TEXT -- JSON array das mensagens do grupo
);
