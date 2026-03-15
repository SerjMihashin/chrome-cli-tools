#!/usr/bin/env node
/**
 * chrome-browser-start - Запуск Chrome с отладочным портом.
 * Использование: chrome-browser-start [--port 9222] [--headless] [--profile <name>]
 *
 * Профиль по умолчанию: %TEMP%\chrome-automation-profile
 * Этот профиль отделён от вашего основного браузера с учётной записью.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
];

function findChrome() {
  for (const chromePath of CHROME_PATHS) {
    if (!chromePath) continue;
    try {
      if (fs.existsSync(chromePath)) return chromePath;
    } catch (e) {}
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 && args[portIndex + 1] ? args[portIndex + 1] : '9222';
  const headless = args.includes('--headless');
  
  // Профиль для автоматизации (отдельный от основного браузера пользователя)
  const profileIndex = args.indexOf('--profile');
  const profileName = profileIndex !== -1 && args[profileIndex + 1] 
    ? args[profileIndex + 1] 
    : 'chrome-automation-profile';
  
  const userDataDir = path.join(process.env.TEMP || '', profileName);

  const chromePath = findChrome();
  if (!chromePath) {
    console.error('[chrome-browser-start] Ошибка: Chrome не найден!');
    console.error('[chrome-browser-start] Укажите путь: setx CHROME_PATH "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"');
    process.exit(1);
  }

  // Проверяем, запущен ли уже браузер на этом порту
  try {
    const response = await fetch(`http://localhost:${port}/json/version`);
    if (response.ok) {
      console.error(`[chrome-browser-start] Chrome уже запущен на порту ${port}`);
      console.error('[chrome-browser-start] Используйте: chrome-tab <URL>');
      process.exit(0);
    }
  } catch (e) {}

  const chromeArgs = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--disable-blink-features=AutomationControlled',
  ];
  if (headless) chromeArgs.push('--headless=new');

  console.error(`[chrome-browser-start] Запуск Chrome с портом ${port}...`);
  console.error(`[chrome-browser-start] Профиль автоматизации: ${userDataDir}`);
  console.error(`[chrome-browser-start] Ваш основной браузер не будет затронут`);

  const chrome = spawn(chromePath, chromeArgs, { detached: false, stdio: 'ignore' });
  chrome.unref();

  await new Promise(r => setTimeout(r, 3000));

  try {
    const response = await fetch(`http://localhost:${port}/json/version`);
    if (response.ok) {
      console.error('[chrome-browser-start] Браузер запущен!');
      console.error('[chrome-browser-start] Используйте: chrome-tab <URL>');
      console.error('[chrome-browser-start] Нажмите Ctrl+C для выхода.');
      await new Promise(() => {});
    }
  } catch (e) {
    console.error('[chrome-browser-start] Ошибка запуска:', e.message);
    console.error('[chrome-browser-start] Убедитесь, что Chrome не запущен с этим же профилем');
    process.exit(1);
  }
}

main();
