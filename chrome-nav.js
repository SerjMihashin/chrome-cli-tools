#!/usr/bin/env node
/**
 * chrome-nav - Навигация: back, forward, refresh.
 * 
 * Использование:
 *   chrome-nav https://example.com --back       # Назад в истории
 *   chrome-nav https://example.com --forward    # Вперёд в истории
 *   chrome-nav https://example.com --refresh    # Обновить страницу
 *   chrome-nav https://example.com --hard       # Жёсткая перезагрузка
 */

const { launchBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const backFlag = args.includes('--back');
  const forwardFlag = args.includes('--forward');
  const refreshFlag = args.includes('--refresh');
  const hardFlag = args.includes('--hard');
  
  if (!url) {
    console.error('Использование: chrome-nav <URL> [--back|--forward|--refresh|--hard]');
    console.error('Пример: chrome-nav https://example.com --refresh');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-nav] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.error(`[chrome-nav] Текущий URL: ${page.url()}`);
    
    if (backFlag) {
      console.error('[chrome-nav] Назад');
      await page.goBack({ waitUntil: 'networkidle2' });
    } else if (forwardFlag) {
      console.error('[chrome-nav] Вперёд');
      await page.goForward({ waitUntil: 'networkidle2' });
    } else if (refreshFlag || hardFlag) {
      console.error('[chrome-nav] Обновление');
      await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
    } else {
      console.error('[chrome-nav] Укажите --back, --forward, --refresh или --hard');
      process.exit(1);
    }
    
    console.error(`[chrome-nav] Новый URL: ${page.url()}`);
    console.log(page.url());
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-nav] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
