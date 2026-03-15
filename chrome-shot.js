#!/usr/bin/env node
/**
 * chrome-shot - Сделать скриншот страницы.
 *
 * Использование:
 *   chrome-shot https://example.com
 *   chrome-shot https://example.com --output C:\Users\...\Desktop\shot.png
 *   chrome-shot https://example.com --full
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');
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

  let browser;
  let disconnect;

  let outputPath = outputFlag !== -1
    ? args[outputFlag + 1]
    : path.join(process.env.USERPROFILE || '', 'Desktop', `screenshot-${Date.now()}.png`);

  // Если путь относительный, делаем его абсолютным
  if (!path.isAbsolute(outputPath)) {
    outputPath = path.join(process.cwd(), outputPath);
  }

  try {
    console.error(`[chrome-shot] Открываю: ${url}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    if (fullFlag) {
      await page.screenshot({ path: outputPath, fullPage: true });
    } else {
      await page.screenshot({ path: outputPath });
    }

    await disconnect();

    console.error(`[chrome-shot] Скриншот сохранён: ${outputPath}`);
    console.log(outputPath);

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-shot] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-shot] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-shot] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
