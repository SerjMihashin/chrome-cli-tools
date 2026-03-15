#!/usr/bin/env node
/**
 * chrome-eval - Выполнить JavaScript код на странице.
 * 
 * Использование:
 *   chrome-eval https://example.com "document.title"
 *   chrome-eval https://example.com "document.querySelector('h1').innerText"
 *   chrome-eval https://example.com "window.innerWidth"
 */

const { launchBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const jsCode = args.slice(1).join(' ');
  
  if (!url || !jsCode) {
    console.error('Использование: chrome-eval <URL> "<js-code>"');
    console.error('Пример: chrome-eval https://example.com "document.title"');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-eval] Открываю: ${url}`);
    console.error(`[chrome-eval] Код: ${jsCode}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Выполняем JS код на странице
    const result = await page.evaluate(jsCode);
    
    console.error('[chrome-eval] Результат:');
    
    // Вывод результата
    if (typeof result === 'object') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result);
    }
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-eval] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
