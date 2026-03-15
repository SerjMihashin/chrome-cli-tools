#!/usr/bin/env node
/**
 * chrome-click - Клик по элементу на странице.
 *
 * Использование:
 *   chrome-click https://example.com "button.submit"
 *   chrome-click https://example.com "#myButton"
 *   chrome-click https://example.com ".nav > li:first-child" --visible
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const selector = args[1];
  const visibleFlag = args.includes('--visible');

  if (!url || !selector) {
    console.error('Использование: chrome-click <URL> <selector> [--visible]');
    console.error('Пример: chrome-click https://example.com "button.submit"');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-click] Открываю: ${url}`);
    console.error(`[chrome-click] Селектор: ${selector}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    if (visibleFlag) {
      await page.waitForSelector(selector, { visible: true });
    }

    await page.click(selector);

    console.error('[chrome-click] Клик выполнен');

    // Ждём немного для возможных переходов
    await new Promise(r => setTimeout(r, 1000));

    const currentUrl = page.url();
    console.log(currentUrl);

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-click] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-click] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-click] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
