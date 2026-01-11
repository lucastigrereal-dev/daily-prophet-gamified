@echo off
echo.
echo ========================================================
echo     DAILY PROPHET - ARQUIVO ZIP PRONTO PARA DEPLOY
echo ========================================================
echo.
echo  ZIP criado com sucesso: daily-prophet-deploy.zip
echo  Tamanho: 62 KB
echo.
echo ========================================================
echo  PROXIMOS PASSOS:
echo ========================================================
echo.
echo  1. Acesse: https://vercel.com/new
echo  2. Arraste o arquivo: daily-prophet-deploy.zip
echo  3. Adicione as variaveis de ambiente (veja INSTRUCOES-DEPLOY.txt)
echo  4. Clique Deploy!
echo.
echo ========================================================
echo.
echo  Abrindo pasta do projeto...
echo.
pause

start "" "%~dp0"
start "" "%~dp0INSTRUCOES-DEPLOY.txt"
