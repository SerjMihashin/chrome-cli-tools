/**
 * Базовая библиотека для работы с Google Chrome через Puppeteer.
 *
 * Использование:
 * const { launchBrowser, connectToBrowser, findChrome } = require('./chrome-lib');
 *
 * Настройка:
 * - Укажите путь к Chrome в chromePath
 * - Или задайте переменную окружения CHROME_PATH
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

/**
 * Пути к Google Chrome (проверяются по порядку).
 */
const CHROME_PATHS = [
  // Путь из переменной окружения
  process.env.CHROME_PATH,

  // Стандартные пути Windows
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',

  // Путь пользователя
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),

  // Другие возможные пути
  'C:\\Users\\Public\\Google\\Chrome\\Application\\chrome.exe',
];

/**
 * Поиск установленного Google Chrome.
 * @returns {string|null} Путь к chrome.exe или null
 */
function findChrome() {
  for (const chromePath of CHROME_PATHS) {
    if (!chromePath) continue;

    try {
      if (fs.existsSync(chromePath)) {
        console.error(`[chrome-lib] Chrome найден: ${chromePath}`);
        return chromePath;
      }
    } catch (e) {
      // Игнорируем ошибки проверки пути
    }
  }

  console.error('[chrome-lib] Chrome не найден в стандартных путях');
  console.error('[chrome-lib] Укажите путь в переменной окружения CHROME_PATH');
  return null;
}

/**
 * Запуск браузера.
 * @param {Object} options - Опции
 * @param {boolean} options.headless - Режим без интерфейса
 * @param {number} options.timeout - Таймаут в мс
 * @returns {Promise<{browser: Object, chromePath: string}>}
 */
async function launchBrowser(options = {}) {
  const {
    headless = false,
    timeout = 30000,
    args = []
  } = options;

  const chromePath = findChrome();

  if (!chromePath) {
    throw new Error(
      'Google Chrome не найден. Укажите путь в переменной окружения CHROME_PATH\n' +
      'Пример: setx CHROME_PATH "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"'
    );
  }

  const defaultArgs = [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-blink-features=AutomationControlled',
  ];

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: headless,
    timeout: timeout,
    args: [...defaultArgs, ...args],
  });

  return { browser, chromePath };
}

/**
 * Подключение к существующему браузеру через DevTools Protocol.
 * @param {Object} options - Опции
 * @param {number} options.port - Порт отладки (по умолчанию 9222)
 * @param {number} options.timeout - Таймаут подключения в мс
 * @returns {Promise<{browser: Object, disconnect: Function}>}
 */
async function connectToBrowser(options = {}) {
  const {
    port = 9222,
    timeout = 30000
  } = options;

  const debugUrl = `http://localhost:${port}`;

  console.error(`[chrome-lib] Подключение к Chrome на порту ${port}...`);

  // Проверяем, доступен ли браузер
  try {
    const response = await fetch(`${debugUrl}/json/version`, {
      signal: AbortSignal.timeout(timeout)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const versionInfo = await response.json();
    console.error(`[chrome-lib] Chrome версия: ${versionInfo['Browser'] || 'unknown'}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.name === 'TimeoutError' || error.message.includes('fetch failed')) {
      throw new Error(
        `Не удалось подключиться к Chrome на порту ${port}.\n` +
        `Убедитесь, что браузер запущен через: chrome-browser-start`
      );
    }
    throw error;
  }

  // Подключаемся через Puppeteer
  const browser = await puppeteer.connect({
    browserURL: debugUrl,
    defaultViewport: null,
  });

  console.error(`[chrome-lib] Подключено успешно`);

  // Функция отключения (не закрывает браузер)
  const disconnect = async () => {
    await browser.disconnect();
    console.error('[chrome-lib] Отключено от браузера');
  };

  return { browser, disconnect };
}

/**
 * Получение данных страницы.
 * @param {Object} page - Puppeteer page
 * @param {string} selector - CSS селектор
 * @returns {Promise<{text: string, html: string, attributes: Object}>}
 */
async function getPageData(page, selector = 'body') {
  const data = await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) {
      return { error: `Element not found: ${sel}` };
    }
    
    return {
      text: element.textContent,
      html: element.outerHTML,
      innerHTML: element.innerHTML,
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
    };
  }, selector);
  
  return data;
}

/**
 * Извлечение __NEXT_DATA__ со страницы.
 * @param {Object} page - Puppeteer page
 * @returns {Promise<Object|null>}
 */
async function getNextData(page) {
  const data = await page.evaluate(() => {
    const script = document.querySelector('script#__NEXT_DATA__');
    if (!script) {
      return null;
    }
    
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      return { error: e.message };
    }
  });
  
  return data;
}

/**
 * Скачивание файлов.
 * @param {Object} page - Puppeteer page
 * @param {string} downloadPath - Путь для сохранения
 */
async function setupDownload(page, downloadPath) {
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });
}

module.exports = {
  launchBrowser,
  connectToBrowser,
  findChrome,
  getPageData,
  getNextData,
  setupDownload,
  CHROME_PATHS,
};
