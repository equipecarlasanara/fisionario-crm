@echo off
cd %~dp0
echo.
echo ========================================================
echo PREPARANDO PARA ENVIAR SEU CODIGO PARA O GITHUB...
echo ========================================================
echo.

git init
git add .
git commit -m "feat: atualizando modulos e integracoes do CRM"
git branch -M principal
git remote remove origin 2>nul
git remote add origin https://github.com/equipecarlasanara/fisionario-crm.git
git push -u origin principal --force

echo.
echo ================================================================
echo ✅ SUCESSO! AS ATUALIZACOES FORAM ENVIADAS PARA O GITHUB! ✅
echo ================================================================
echo.
echo O Cloudflare percebera a alteracao no GitHub e colocara seu site
echo atualizado no ar automaticamente em cerca de 2 ou 3 minutinhos!
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
