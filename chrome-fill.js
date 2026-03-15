#!/usr/bin/env node
/**
 * chrome-fill - Ввод текста в поле формы.
 *
 * Использование:
 *   chrome-fill https://example.com "#username" "myuser"
 *   chrome-fill https://example.com "input[name='email']" "test@example.com"
 *   chrome-fill https://example.com ".search-input" "запрос" --clear
 *
 * Требование: Браузер должен быть запущен через chrome-browser-start
 */

const { connectToBrowser } = require('./chrome-lib');

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const selector = args[1];
  const text = args[2];
  const clearFlag = args.includes('--clear');

  if (!url || !selector || text === undefined) {
    console.error('Использование: chrome-fill <URL> <selector> <text> [--clear]');
    console.error('Пример: chrome-fill https://example.com "#username" "myuser"');
    process.exit(1);
  }

  let browser;
  let disconnect;

  try {
    console.error(`[chrome-fill] Открываю: ${url}`);
    console.error(`[chrome-fill] Селектор: ${selector}`);
    console.error(`[chrome-fill] Текст: "${text}"`);

    const connection = await connectToBrowser();
    browser = connection.browser;
    disconnect = connection.disconnect;

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    if (clearFlag) {
      await page.click(selector, { clickCount: 3 });
      await page.keyboard.press('Backspace');
    }

    await page.type(selector, text);

    console.error('[chrome-fill] Текст введён');

    await disconnect();

  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Не удалось подключиться')) {
      console.error('[chrome-fill] ОШИБКА: Браузер не запущен!');
      console.error('[chrome-fill] Сначала выполните: chrome-browser-start');
    } else {
      console.error('[chrome-fill] Ошибка:', error.message);
    }
    process.exit(1);
  }
}

main();
