@echo off
cd %~dp0
call npx wrangler d1 execute fisionario_db --remote --command="CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, status TEXT DEFAULT 'active', leadsCount INTEGER DEFAULT 0, investimentoSemana REAL DEFAULT 0, investimentoTotal REAL DEFAULT 0, link TEXT, messages TEXT);"
pause
