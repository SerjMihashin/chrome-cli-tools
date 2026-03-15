#!/usr/bin/env node
/**
 * chrome-shot - Сделать скриншот страницы.
 * 
 * Использование:
 *   chrome-shot https://example.com
 *   chrome-shot https://example.com --output C:\Users\...\Desktop\shot.png
 *   chrome-shot https://example.com --full
 */

const { launchBrowser } = require('./chrome-lib');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const outputFlag = args.indexOf('--output');
  const fullFlag = args.includes('--full');
  
  if (!url) {
    console.error('Использование: chrome-shot <URL> [--output <path>] [--full]');
    console.error('Пример: chrome-shot https://example.com --output Desktop\\shot.png');
    process.exit(1);
  }
  
  let outputPath = outputFlag !== -1 
    ? args[outputFlag + 1] 
    : path.join(process.env.USERPROFILE || '', 'Desktop', `screenshot-${Date.now()}.png`);
  
  // Если путь относительный, делаем его абсолютным
  if (!path.isAbsolute(outputPath)) {
    outputPath = path.join(process.cwd(), outputPath);
  }
  
  try {
    console.error(`[chrome-shot] Открываю: ${url}`);
    
    const { browser } = await launchBrowser({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    if (fullFlag) {
      await page.screenshot({ path: outputPath, fullPage: true });
    } else {
      await page.screenshot({ path: outputPath });
    }
    
    await browser.close();
    
    console.error(`[chrome-shot] Скриншот сохранён: ${outputPath}`);
    console.log(outputPath);
    
  } catch (error) {
    console.error('[chrome-shot] Ошибка:', error.message);
    process.exit(1);
  }
}

main();
