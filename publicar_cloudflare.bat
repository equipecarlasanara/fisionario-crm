@echo off
cd %~dp0
echo Iniciando o deploy OFICIAL E DIRETO na Cloudflare...
call npx --yes wrangler pages deploy --branch=main --commit-dirty=true
echo =======================================================
echo FINALIZADO COM SUCESSO!
echo =======================================================
pause
