@echo off
cd %~dp0
echo Iniciando o deploy OFICIAL E DIRETO na Cloudflare...
    call npx --yes wrangler deploy
echo =======================================================
echo FINALIZADO COM SUCESSO!
echo =======================================================
pause
