#!/usr/bin/env node
/**
 * chrome-storage - Показать localStorage и sessionStorage.
 * 
 * Использование:
 *   chrome-storage https://example.com
 *   chrome-storage https://example.com --local     # Только localStorage
 *   chrome-storage https://example.com --session  # Только sessionStorage
 */

const { launchBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const localFlag = args.includes('--local');
  const sessionFlag = args.includes('--session');
  
  if (!url) {
    console.error('Использование: chrome-storage <URL> [--local|--session]');
    console.error('Пример: chrome-storage https://example.com');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-storage] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const storage = {};
    
    if (!sessionFlag) {
      storage.localStorage = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data[key] = localStorage.getItem(key);
        }
        return data;
      });
      console.error('[chrome-storage] localStorage получен');
    }
    
    if (!localFlag) {
      storage.sessionStorage = await page.evaluate(() => {
        const data = {};
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          data[key] = sessionStorage.getItem(key);
        }
        return data;
      });
      console.error('[chrome-storage] sessionStorage получен');
    }
    
    console.log(JSON.stringify(storage, null, 2));
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-storage] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
