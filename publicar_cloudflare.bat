@echo off
cd %~dp0
echo Iniciando o deploy na Cloudflare...
call npx --yes wrangler pages deploy --commit-dirty=true
pause
