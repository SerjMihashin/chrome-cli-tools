# Chrome CLI Tools

Набор утилит для управления Google Chrome через Puppeteer.

## Установка

```bash
cd C:\Scripts
npm install
```

## Быстрый старт

### 1. Запустить браузер (один раз)
```bash
chrome-browser-start
```

### 2. Открывать ссылки в вкладках
```bash
chrome-tab https://site1.com https://site2.com
```

---

## Все команды

### 🌐 Навигация и открытие

| Команда | Описание |
|---------|----------|
| `chrome-browser-start` | Запустить Chrome с отладочным портом |
| `chrome-tab <URL> [URL2...]` | Открыть ссылки в новых вкладках |
| `chrome-open <URL>` | Открыть сайт в отдельном окне |
| `chrome-nav <URL> --back` | Назад в истории |
| `chrome-nav <URL> --forward` | Вперёд в истории |
| `chrome-nav <URL> --refresh` | Обновить страницу |
| `chrome-nav <URL> --hard` | Жёсткая перезагрузка |

### 🖱️ Взаимодействие

| Команда | Описание |
|---------|----------|
| `chrome-click <URL> <selector>` | Клик по элементу |
| `chrome-fill <URL> <selector> <text>` | Ввод текста в поле |
| `chrome-scroll <URL> <selector>` | Прокрутка к элементу |
| `chrome-scroll <URL> --top` | Вверх страницы |
| `chrome-scroll <URL> --bottom` | Вниз страницы |
| `chrome-wait <URL> <selector>` | Ждать появления элемента |
| `chrome-wait <URL> <selector> --visible` | Ждать видимости элемента |
| `chrome-wait <URL> <selector> --hidden` | Ждать исчезновения элемента |

### 📦 Получение данных

| Команда | Описание |
|---------|----------|
| `chrome-text <URL> [selector]` | Извлечь текст по селектору |
| `chrome-html <URL>` | Получить HTML страницы |
| `chrome-eval <URL> "<js-code>"` | Выполнить JS на странице |

### 🛠️ DevTools функции

| Команда | Описание |
|---------|----------|
| `chrome-console <URL>` | Читать консоль страницы |
| `chrome-console <URL> --error` | Только ошибки |
| `chrome-network <URL>` | Перехват сетевых запросов |
| `chrome-network <URL> --api` | Только API запросы (XHR/fetch) |
| `chrome-storage <URL>` | Показать localStorage/sessionStorage |
| `chrome-cookies <URL>` | Показать cookies |
| `chrome-cookies <URL> --name sess` | Только cookie с именем |
| `chrome-cookies <URL> --clear` | Удалить все cookies |

### 📸 Скриншоты

| Команда | Описание |
|---------|----------|
| `chrome-shot <URL>` | Сделать скриншот |
| `chrome-shot <URL> --output file.png` | Сохранить в файл |
| `chrome-shot <URL> --full` | Полная страница |

### 🎓 Тесты

| Команда | Описание |
|---------|----------|
| `chrome-quiz <URL>` | Авто-прохождение тестов |
| `chrome-quiz <URL> --random` | Случайные ответы |
| `chrome-quiz <URL> --first` | Всегда первый вариант |

---

## Примеры использования

### Открыть несколько сайтов в одном браузере
```bash
chrome-browser-start
chrome-tab https://playwright.dev https://github.com/microsoft/playwright
```

### Прочитать консоль сайта
```bash
chrome-console https://mysite.com --error
```

### Перехватить API запросы
```bash
chrome-network https://api.example.com --api
```

### Кликнуть и получить текст
```bash
chrome-click https://site.com ".load-more"
chrome-text https://site.com ".content"
```

### Пройти тест
```bash
chrome-quiz https://testsite.com/quiz --first
```

### Выполнить JavaScript
```bash
chrome-eval https://example.com "document.title"
chrome-eval https://example.com "window.innerWidth"
chrome-eval https://example.com "document.querySelector('h1').innerText"
```

### Получить localStorage
```bash
chrome-storage https://example.com
chrome-storage https://example.com --local
chrome-storage https://example.com --session
```

---

## Интеграция с Qwen Code

Ассистент может использовать команды для:

1. **Открытия сайтов:**
   ```bash
   cd C:\Scripts && node chrome-tab.js <URL>
   ```

2. **Получения контента:**
   ```bash
   cd C:\Scripts && node chrome-text.js <URL> <selector>
   cd C:\Scripts && node chrome-eval.js <URL> "<js-code>"
   ```

3. **DevTools:**
   ```bash
   cd C:\Scripts && node chrome-console.js <URL>
   cd C:\Scripts && node chrome-network.js <URL> --api
   ```

4. **Прохождения тестов:**
   ```bash
   cd C:\Scripts && node chrome-quiz.js <URL>
   ```

---

## Настройка PATH (опционально)

Чтобы вызывать команды из любой папки:

**PowerShell (от администратора):**
```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$userPath;C:\Scripts", "User")
```

---

## Переменные окружения

- `CHROME_PATH` — путь к Chrome.exe
- `NODE_TIMEOUT` — таймаут операций (мс)

---

## Структура файлов

```
C:\Scripts\
├── chrome-lib.js           # Библиотека с функциями
├── chrome-browser-start.bat # Запуск браузера с debug-портом
├── chrome-tab.js/.bat      # Открытие вкладок
├── chrome-open.js/.bat     # Открыть в отдельном окне
├── chrome-click.js         # Клик по элементу
├── chrome-fill.js          # Ввод текста
├── chrome-scroll.js        # Прокрутка
├── chrome-wait.js          # Ожидание элементов
├── chrome-nav.js           # Навигация (back/forward/refresh)
├── chrome-text.js          # Извлечь текст
├── chrome-html.js          # Получить HTML
├── chrome-eval.js          # Выполнить JS
├── chrome-console.js       # Консоль страницы
├── chrome-network.js       # Сетевые запросы
├── chrome-storage.js       # localStorage/sessionStorage
├── chrome-cookies.js       # Cookies
├── chrome-shot.js          # Скриншоты
└── chrome-quiz.js          # Прохождение тестов
```
