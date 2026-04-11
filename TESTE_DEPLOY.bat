@echo off
cd %~dp0
echo Iniciando o deploy na Cloudflare... > log_deploy.txt
call npx --yes wrangler pages deploy --commit-dirty=true >> log_deploy.txt 2>&1
echo Deploy terminado! Verifique o arquivo log_deploy.txt para ver o que aconteceu.
pause
