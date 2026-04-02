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
