#!/usr/bin/env node
/**
 * chrome-html - Получить полный HTML страницы.
 * 
 * Использование:
 *   chrome-html https://example.com
 *   chrome-html https://example.com > page.html
 */

const { launchBrowser } = require('./chrome-lib');

async function main() {
  const url = process.argv[2];
  
  if (!url) {
    console.error('Использование: chrome-html <URL>');
    console.error('Пример: chrome-html https://example.com');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-html] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    const html = await page.content();
    
    console.log(html);
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-html] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
