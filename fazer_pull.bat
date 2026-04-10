@echo off
cd %~dp0
echo Baixando atualizacoes do GitHub...
git pull origin main
echo.
echo ========================================================
echo PRONTO! Atualizacao concluida.
echo ========================================================
pause
