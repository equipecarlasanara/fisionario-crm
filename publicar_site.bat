@echo off
cd %~dp0
echo Iniciando o deploy do FRONTEND (Telas) na Cloudflare Pages...
call npx --yes wrangler pages deploy public --project-name=fisionario-visao --branch=main
echo =======================================================
echo SITE FINALIZADO COM SUCESSO!
echo =======================================================
pause
