# Chrome CLI Tools

Набор CLI-утилит для управления Google Chrome через Puppeteer.

Проект позволяет автоматизировать типовые действия в браузере прямо из командной строки: открытие вкладок, навигацию, клики, ввод текста, чтение HTML и текста, выполнение JavaScript, получение cookies/localStorage, перехват сетевых запросов, снятие скриншотов и простое автопрохождение тестов.

## Возможности

- запуск Chrome с debugging-портом
- открытие ссылок в новых вкладках и отдельных окнах
- навигация по страницам: back / forward / refresh / hard reload
- клик по элементам и ввод текста в поля
- ожидание появления, видимости и скрытия элементов
- извлечение текста и HTML со страницы
- выполнение JavaScript в контексте страницы
- чтение консоли браузера
- перехват сетевых запросов
- просмотр cookies и storage
- создание скриншотов
- автоматизация простых тестов и квизов

## Требования

Перед использованием убедитесь, что у вас установлены:

- [Node.js](https://nodejs.org/)
- Google Chrome

## Установка

### Вариант 1. Через Git

```bash
git clone https://github.com/SerjMihashin/chrome-cli-tools.git
cd chrome-cli-tools
npm install
````

### Вариант 2. Если скачали ZIP-архив

Распакуйте проект, откройте терминал в папке проекта и выполните:

```bash
npm install
```

## Быстрый старт

### 1. Запустите Chrome в режиме удалённой отладки

```bash
chrome-browser-start
```

### 2. Откройте сайт в новой вкладке

```bash
chrome-tab https://example.com
```

### 3. Получите заголовок страницы

```bash
chrome-eval https://example.com "document.title"
```

---

## Команды

### Навигация и открытие

| Команда                      | Описание                                           |
| ---------------------------- | -------------------------------------------------- |
| `chrome-browser-start`       | Запустить Chrome с debugging-портом                |
| `chrome-tab <URL> [URL2...]` | Открыть одну или несколько ссылок в новых вкладках |
| `chrome-open <URL>`          | Открыть сайт в отдельном окне                      |
| `chrome-nav <URL> --back`    | Назад по истории                                   |
| `chrome-nav <URL> --forward` | Вперёд по истории                                  |
| `chrome-nav <URL> --refresh` | Обновить страницу                                  |
| `chrome-nav <URL> --hard`    | Жёсткая перезагрузка страницы                      |

### Взаимодействие со страницей

| Команда                                  | Описание                           |
| ---------------------------------------- | ---------------------------------- |
| `chrome-click <URL> <selector>`          | Клик по элементу                   |
| `chrome-fill <URL> <selector> <text>`    | Ввод текста в поле                 |
| `chrome-scroll <URL> <selector>`         | Прокрутка к элементу               |
| `chrome-scroll <URL> --top`              | Прокрутка в начало страницы        |
| `chrome-scroll <URL> --bottom`           | Прокрутка в конец страницы         |
| `chrome-wait <URL> <selector>`           | Ждать появления элемента           |
| `chrome-wait <URL> <selector> --visible` | Ждать, пока элемент станет видимым |
| `chrome-wait <URL> <selector> --hidden`  | Ждать, пока элемент исчезнет       |

### Получение данных

| Команда                         | Описание                                    |
| ------------------------------- | ------------------------------------------- |
| `chrome-text <URL> [selector]`  | Получить текст со страницы или по селектору |
| `chrome-html <URL>`             | Получить HTML страницы                      |
| `chrome-eval <URL> "<js-code>"` | Выполнить JavaScript на странице            |

### DevTools и отладка

| Команда                              | Описание                               |
| ------------------------------------ | -------------------------------------- |
| `chrome-console <URL>`               | Прочитать сообщения консоли страницы   |
| `chrome-console <URL> --error`       | Показать только ошибки                 |
| `chrome-network <URL>`               | Перехватить сетевые запросы            |
| `chrome-network <URL> --api`         | Показать только XHR/fetch запросы      |
| `chrome-storage <URL>`               | Показать localStorage и sessionStorage |
| `chrome-storage <URL> --local`       | Показать только localStorage           |
| `chrome-storage <URL> --session`     | Показать только sessionStorage         |
| `chrome-cookies <URL>`               | Показать cookies                       |
| `chrome-cookies <URL> --name <name>` | Показать cookie по имени               |
| `chrome-cookies <URL> --clear`       | Очистить cookies                       |

### Скриншоты

| Команда                                     | Описание                       |
| ------------------------------------------- | ------------------------------ |
| `chrome-shot <URL>`                         | Сделать скриншот страницы      |
| `chrome-shot <URL> --output screenshot.png` | Сохранить скриншот в файл      |
| `chrome-shot <URL> --full`                  | Сделать скриншот всей страницы |

### Тесты и квизы

| Команда                      | Описание                       |
| ---------------------------- | ------------------------------ |
| `chrome-quiz <URL>`          | Автопрохождение теста          |
| `chrome-quiz <URL> --random` | Выбирать случайные ответы      |
| `chrome-quiz <URL> --first`  | Всегда выбирать первый вариант |

---

## Примеры использования

### Открыть несколько сайтов

```bash
chrome-browser-start
chrome-tab https://playwright.dev https://github.com/microsoft/playwright
```

### Получить текст элемента

```bash
chrome-text https://example.com "h1"
```

### Выполнить JavaScript

```bash
chrome-eval https://example.com "document.title"
chrome-eval https://example.com "window.innerWidth"
chrome-eval https://example.com "document.querySelector('h1')?.innerText"
```

### Кликнуть по кнопке и затем прочитать контент

```bash
chrome-click https://site.com ".load-more"
chrome-text https://site.com ".content"
```

### Перехватить API-запросы

```bash
chrome-network https://example.com --api
```

### Посмотреть ошибки в консоли

```bash
chrome-console https://example.com --error
```

### Снять скриншот страницы

```bash
chrome-shot https://example.com --output screenshot.png
```

### Получить данные из localStorage

```bash
chrome-storage https://example.com --local
```

### Пройти простой тест

```bash
chrome-quiz https://testsite.com/quiz --first
```

---

## Использование в AI-агентах и скриптах

Эти утилиты можно использовать не только вручную, но и из других Node.js-скриптов, CLI-обвязок и AI-агентов.

Примеры запуска через Node.js из папки проекта:

```bash
node chrome-tab.js https://example.com
node chrome-text.js https://example.com h1
node chrome-eval.js https://example.com "document.title"
node chrome-console.js https://example.com --error
node chrome-network.js https://example.com --api
node chrome-quiz.js https://example.com/quiz --first
```

Если вы хотите вызывать команды из любой папки, добавьте директорию проекта в `PATH` или установите удобные `.bat`-обёртки.

---

## Переменные окружения

* `CHROME_PATH` — путь к `chrome.exe`, если Chrome не найден автоматически
* `NODE_TIMEOUT` — таймаут операций в миллисекундах

Пример для PowerShell:

```powershell
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
$env:NODE_TIMEOUT="15000"
```

---

## Структура проекта

```text
chrome-cli-tools/
├── chrome-lib.js
├── chrome-browser-start.bat
├── chrome-tab.js
├── chrome-open.js
├── chrome-click.js
├── chrome-fill.js
├── chrome-scroll.js
├── chrome-wait.js
├── chrome-nav.js
├── chrome-text.js
├── chrome-html.js
├── chrome-eval.js
├── chrome-console.js
├── chrome-network.js
├── chrome-storage.js
├── chrome-cookies.js
├── chrome-shot.js
├── chrome-quiz.js
├── package.json
└── README.md
```

---

## Ограничения

* Для большинства команд Chrome должен быть запущен с debugging-портом
* Селекторы должны соответствовать реальной структуре страницы
* Некоторые сайты могут блокировать автоматизацию
* Работа с динамическими интерфейсами может требовать ожидания элементов через `chrome-wait`

---

## Планы по развитию

* улучшение логирования
* дополнительные режимы ожидания и ретраев
* более удобный вывод ошибок
* расширение набора CLI-команд
* примеры интеграции с AI-ассистентами

## Лицензия

Пока без отдельной лицензии.

