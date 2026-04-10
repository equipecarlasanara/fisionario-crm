@echo off
chcp 65001 >nul
cd %~dp0
echo.
echo ========================================================
echo ATUALIZANDO BANCO DE DADOS NA CLOUDFLARE D1...
echo ========================================================
echo.
npx --yes wrangler d1 execute fisionario_db --remote --command="CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, status TEXT DEFAULT 'active', leadsCount INTEGER DEFAULT 0, investimentoSemana REAL DEFAULT 0, investimentoTotal REAL DEFAULT 0, link TEXT, messages TEXT);"
echo.
echo ================================================================
echo ✅ SUCESSO! A TABELA GROUP FOI CRIADA NO BANCO! ✅
echo ================================================================
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
