@echo off
REM chrome-browser-start - Запуск Chrome с отладочным портом
REM Использование: chrome-browser-start

set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
set DEBUG_PORT=9222
set USER_DATA=%TEMP%\chrome-user-data

echo [chrome-browser-start] Запуск Chrome с отладочным портом %DEBUG_PORT%...
echo [chrome-browser-start] Профиль: %USER_DATA%
echo [chrome-browser-start] Для остановки закройте браузер или нажмите Ctrl+C

start "" "%CHROME_PATH%" --remote-debugging-port=%DEBUG_PORT% --user-data-dir="%USER_DATA%" --no-first-run --disable-blink-features=AutomationControlled

echo [chrome-browser-start] Браузер запущен!
echo [chrome-browser-start] Теперь используйте: chrome-tab ^<URL^>
