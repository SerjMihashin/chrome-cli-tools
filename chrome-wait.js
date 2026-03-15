#!/usr/bin/env node
/**
 * chrome-wait - Ожидание появления элемента на странице.
 *
 * Использование:
 *   chrome-wait https://example.com ".loader" --timeout 10000
 *   chrome-wait https://example.com "#content" --visible
 *   chrome-wait https://example.com "button.submit" --hidden  # Ждать исчезновения
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const selector = args[1];
  const timeoutFlag = args.indexOf('--timeout');
  const visibleFlag = args.includes('--visible');
  const hiddenFlag = args.includes('--hidden');

  const timeout = timeoutFlag !== -1 ? parseInt(args[timeoutFlag + 1]) : 30000;

  if (!url || !selector) {
    console.error('Использование: chrome-wait <URL> <selector> [--timeout ms] [--visible|--hidden]');
    console.error('Пример: chrome-wait https://example.com ".loader" --timeout 10000');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-wait] Открываю: ${url}`);
    console.error(`[chrome-wait] Селектор: ${selector}`);
    console.error(`[chrome-wait] Таймаут: ${timeout}ms`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const startTime = Date.now();

    if (hiddenFlag) {
      // Ждём исчезновения элемента
      await page.waitForSelector(selector, { state: 'hidden', timeout });
      console.error('[chrome-wait] Элемент исчез');
    } else if (visibleFlag) {
      // Ждём видимости элемента
      await page.waitForSelector(selector, { visible: true, timeout });
      console.error('[chrome-wait] Элемент видим');
    } else {
      // Ждём появления в DOM
      await page.waitForSelector(selector, { timeout });
      console.error('[chrome-wait] Элемент найден в DOM');
    }

    const waitTime = Date.now() - startTime;
    console.log(`Element appeared in ${waitTime}ms`);

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-wait] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-wait] Сначала выполните: chrome-browser-start');
    } else if (error.message.includes('timeout')) {
      console.error('[chrome-wait] Таймаут: элемент не появился за', timeout, 'ms');
    } else {
      console.error('[chrome-wait] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
