#!/usr/bin/env node
/**
 * chrome-network - Перехват сетевых запросов (DevTools Network).
 * 
 * Использование:
 *   chrome-network https://example.com
 *   chrome-network https://example.com --api      # Только API запросы
 *   chrome-network https://example.com --images   # Только изображения
 */

const { launchBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const apiFlag = args.includes('--api');
  const imagesFlag = args.includes('--images');
  
  if (!url) {
    console.error('Использование: chrome-network <URL> [--api|--images]');
    console.error('Пример: chrome-network https://example.com');
    process.exit(1);
  }
  
  try {
    console.error(`[chrome-network] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    const requests = [];
    
    page.on('request', request => {
      const resourceType = request.resourceType();
      const requestUrl = request.url();
      
      if (apiFlag && resourceType !== 'xhr' && resourceType !== 'fetch') return;
      if (imagesFlag && resourceType !== 'image') return;
      
      const reqData = {
        method: request.method(),
        url: requestUrl,
        type: resourceType,
        headers: request.headers()
      };
      
      requests.push({ ...reqData, direction: 'request' });
      
      console.error(`[chrome-network] >>> ${request.method()} ${requestUrl} (${resourceType})`);
    });
    
    page.on('response', response => {
      const request = response.request();
      const resourceType = request.resourceType();
      const requestUrl = request.url();
      
      if (apiFlag && resourceType !== 'xhr' && resourceType !== 'fetch') return;
      if (imagesFlag && resourceType !== 'image') return;
      
      const resData = {
        status: response.status(),
        statusText: response.statusText(),
        url: requestUrl,
        type: resourceType,
        headers: response.headers()
      };
      
      requests.push({ ...resData, direction: 'response' });
      
      console.error(`[chrome-network] <<< ${response.status()} ${requestUrl} (${resourceType})`);
    });
    
    page.on('requestfailed', request => {
      console.error(`[chrome-network] FAILED ${request.url()} - ${request.failure()?.errorText}`);
      requests.push({
        url: request.url(),
        type: request.resourceType(),
        direction: 'failed',
        error: request.failure()?.errorText
      });
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Ждём для сбора всех запросов
    await new Promise(r => setTimeout(r,(2000);
    
    console.error('[chrome-network] Готово');
    console.log(JSON.stringify(requests, null, 2));
    
    await browser.close();
    
  } catch (error) {
    console.error('[chrome-network] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
