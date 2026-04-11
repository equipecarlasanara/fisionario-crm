@echo off
cd /d "%~dp0"
color 0A

echo ========================================================
echo SALVANDO O SISTEMA DIRETAMENTE NA NUVEM...
echo ========================================================

git add .
git commit -m "Correcao final Z-API Inbox e Cadencia"
git push -u origin main --force

echo.
echo ========================================================
echo TUDO PRONTO! O CHAT VAI ENTRAR NO AR!
echo ========================================================
echo IMPORTANTE PARA O WHATSAPP FUNCIONAR SOZINHO:
echo O seu site vai atualizar de verdade em exatos 2 minutos.
echo Enquanto isso, pegue esta URL abaixo e cole la no 
echo painel da sua Z-API na aba "Webhooks" -^> "Ao Receber Mensagem":
echo.
echo https://fisionario-crm.pages.dev/api/webhook/zapi
echo.
echo --------------------------------------------------------
echo Finalizado. Tecle Enter para fechar e abrir seu site Oficial.
pause >nul
start https://fisionario-crm.pages.dev/
