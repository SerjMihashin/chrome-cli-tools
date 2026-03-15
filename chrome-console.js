#!/usr/bin/env node
/**
 * chrome-console - Читать консоль страницы (DevTools Console).
 * 
 * Использование:
 *   chrome-console https://example.com
 *   chrome-console https://example.com --all    # Все сообщения
 *   chrome-console https://example.com --error  # Только ошибки
 */

const { launchBrowser } = require('./chrome-lib');

// Вспомогательная функция для задержки
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const allFlag = args.includes('--all');
  const errorFlag = args.includes('--error');
  
  if (!url) {
    console.error('Использование: chrome-console <URL> [--all|--error]');
    console.error('Пример: chrome-console https://example.com');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-console] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    // Сбор сообщений консоли
    const consoleMessages = [];
    
    page.on('console', msg => {
      const type = msg.type();
      
      if (errorFlag && type !== 'error') return;
      if (!allFlag && type === 'debug') return;
      
      const text = msg.text();
      consoleMessages.push({ type, text });
      
      const prefix = {
        log: '[LOG]',
        error: '[ERROR]',
        warn: '[WARN]',
        info: '[INFO]',
        debug: '[DEBUG]'
      }[type] || `[${type.toUpperCase()}]`;
      
      console.error(`[chrome-console] ${prefix}: ${text}`);
    });
    
    page.on('pageerror', error => {
      console.error(`[chrome-console] [PAGE ERROR]: ${error.message}`);
      consoleMessages.push({ type: 'pageerror', text: error.message });
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Ждём немного для сбора сообщений
    await sleep(2000);
    
    console.error('[chrome-console] Готово');
    console.log(JSON.stringify(consoleMessages, null, 2));
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-console] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
