#!/usr/bin/env node
/**
 * chrome-html - Получить полный HTML страницы.
 *
 * Использование:
 *   chrome-html https://example.com
 *   chrome-html https://example.com > page.html
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('Использование: chrome-html <URL>');
    console.error('Пример: chrome-html https://example.com');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-html] Открываю: ${url}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const html = await page.content();

    console.log(html);

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-html] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-html] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-html] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
