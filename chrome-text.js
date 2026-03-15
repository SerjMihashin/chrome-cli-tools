#!/usr/bin/env node
/**
 * chrome-text - Извлечь текст со страницы по селектору.
 *
 * Использование:
 *   chrome-text https://example.com
 *   chrome-text https://example.com h1
 *   chrome-text https://example.com .content
 *   chrome-text https://example.com #main
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser, getPageData } = require('./chrome-lib');

async function main() {
  const url = process.argv[2];
  const selector = process.argv[3] || 'body';

  if (!url) {
    console.error('Использование: chrome-text <URL> [selector]');
    console.error('Пример: chrome-text https://example.com .content');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-text] Открываю: ${url}`);
    console.error(`[chrome-text] Селектор: ${selector}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const data = await getPageData(page, selector);

    if (data.error) {
      console.error('[chrome-text] Ошибка:', data.error);
      process.exit(1);
    }

    console.log(data.text);

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-text] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-text] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-text] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
