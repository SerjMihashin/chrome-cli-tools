#!/usr/bin/env node
/**
 * chrome-text - Извлечь текст со страницы по селектору.
 * 
 * Использование:
 *   chrome-text https://example.com
 *   chrome-text https://example.com h1
 *   chrome-text https://example.com .content
 *   chrome-text https://example.com #main
 */

const { launchBrowser, getPageData } = require('./chrome-lib');

async function main() {
  const url = process.argv[2];
  const selector = process.argv[3] || 'body';
  
  if (!url) {
    console.error('Использование: chrome-text <URL> [selector]');
    console.error('Пример: chrome-text https://example.com .content');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-text] Открываю: ${url}`);
    console.error(`[chrome-text] Селектор: ${selector}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    const data = await getPageData(page, selector);
    
    if (data.error) {
      console.error('[chrome-text] Ошибка:', data.error);
      process.exit(1);
    }
    
    console.log(data.text);
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-text] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
