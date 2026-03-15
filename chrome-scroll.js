#!/usr/bin/env node
/**
 * chrome-scroll - Прокрутка страницы к элементу.
 *
 * Использование:
 *   chrome-scroll https://example.com "#section2"
 *   chrome-scroll https://example.com ".footer"
 *   chrome-scroll https://example.com --top       # Вверх страницы
 *   chrome-scroll https://example.com --bottom    # Вниз страницы
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const selector = args.find(a => a.startsWith('#') || a.startsWith('.'));
  const topFlag = args.includes('--top');
  const bottomFlag = args.includes('--bottom');

  if (!url) {
    console.error('Использование: chrome-scroll <URL> [selector] [--top|--bottom]');
    console.error('Пример: chrome-scroll https://example.com "#section2"');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-scroll] Открываю: ${url}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    if (topFlag) {
      await page.evaluate(() => window.scrollTo(0, 0));
      console.error('[chrome-scroll] Прокрутка вверх');
    } else if (bottomFlag) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      console.error('[chrome-scroll] Прокрутка вниз');
    } else if (selector) {
      console.error(`[chrome-scroll] Селектор: ${selector}`);
      await page.waitForSelector(selector);
      await page.evaluate((sel) => {
        document.querySelector(sel).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, selector);
      console.error('[chrome-scroll] Прокрутка к элементу');
    } else {
      console.error('[chrome-scroll] Укажите селектор или --top/--bottom');
      process.exit(1);
    }

    await new Promise(r => setTimeout(r, 500));

    const scrollPosition = await page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY,
      maxHeight: document.body.scrollHeight - window.innerHeight
    }));

    console.log(`Scroll position: x=${scrollPosition.x}, y=${scrollPosition.y} (max: ${scrollPosition.maxHeight})`);

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-scroll] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-scroll] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-scroll] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
