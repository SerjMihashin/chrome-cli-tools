#!/usr/bin/env node
/**
 * chrome-cookies - Показать/управлять cookies.
 *
 * Использование:
 *   chrome-cookies https://example.com              # Показать все cookies
 *   chrome-cookies https://example.com --name sess  # Только cookie с именем
 *   chrome-cookies https://example.com --clear      # Удалить все cookies
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args.find(a => !a.startsWith('--'));
  const nameFlag = args.indexOf('--name');
  const clearFlag = args.includes('--clear');

  if (!url) {
    console.error('Использование: chrome-cookies <URL> [--name <name>|--clear]');
    console.error('Пример: chrome-cookies https://example.com');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-cookies] Открываю: ${url}`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const client = await page.target().createCDPSession();

    if (clearFlag) {
      await client.send('Network.clearBrowserCookies');
      console.error('[chrome-cookies] Cookies удалены');
      console.log('Cookies cleared');
    } else {
      let cookies = await page.cookies();

      if (nameFlag !== -1 && args[nameFlag + 1]) {
        const cookieName = args[nameFlag + 1];
        cookies = cookies.filter(c => c.name === cookieName);
        console.error(`[chrome-cookies] Фильтр по имени: ${cookieName}`);
      }

      console.error(`[chrome-cookies] Найдено cookies: ${cookies.length}`);
      console.log(JSON.stringify(cookies, null, 2));
    }

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-cookies] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-cookies] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-cookies] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
