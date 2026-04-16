@echo off
cd /d "%~dp0"
color 0B

echo ========================================================
echo ENVIANDO OS DADOS DIRETAMENTE DO SEU COMPUTADOR...
echo ========================================================
echo A Cloudflare quebrou a conexao automatica do GitHub, 
echo entao o proprio seu computador vai empurrar o codigo e
echo passar por cima deles gogela abaixo agora mesmo.
echo.
echo Aguarde o Upload...
echo.

call npx --yes wrangler pages deploy public --project-name="fisionario-crm" --branch=main

echo.
echo ========================================================
echo DEPLOY DIRETO FINALIZADO! TUDO NO AR!
echo ========================================================
echo.
echo O envio foi forcado direto para a producao.
echo Pegue esta URL do Webhook e bote la na Z-API:
echo https://fisionario-crm.pages.dev/api/webhook/zapi
echo.
echo Tecle Enter para abrir o sistema Oficial. De um F5 forte e bom uso!
pause >nul
start https://fisionario-crm.pages.dev/
