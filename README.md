# Verdiyan Legal - Gulp Project

Проект на Gulp з автоматичною конвертацією зображень у WebP формат, компіляцією SCSS та підтримкою jQuery.

## Особливості

- ✅ Автоматична конвертація зображень у WebP формат
- ✅ Компіляція SCSS у CSS з автопрефіксами
- ✅ Мінімізація JavaScript файлів
- ✅ Оптимізація зображень (JPEG, PNG, SVG)
- ✅ Reset CSS
- ✅ Підтримка jQuery
- ✅ Browser Sync для розробки
- ✅ Source maps для дебагінгу

## Встановлення

```bash
yarn install
```

## Використання

### Розробка (з автоматичним оновленням браузера)
```bash
yarn dev
```
або
```bash
gulp
```

### Збірка проекту
```bash
yarn build
```

### Спостереження за змінами (без Browser Sync)
```bash
yarn watch
```

### Очищення папки dist
```bash
yarn clean
```

## Структура проекту

```
verdiyan-legal/
├── src/                    # Вихідні файли
│   ├── scss/              # SCSS файли
│   │   ├── reset.scss    # Reset CSS
│   │   └── main.scss     # Основний SCSS файл
│   ├── js/               # JavaScript файли
│   │   └── main.js       # Основний JS файл
│   ├── libs/             # Кастомна бібліотека
│   │   └── custom-library.js
│   ├── images/           # Зображення (будуть конвертовані в WebP)
│   ├── fonts/            # Шрифти
│   └── index.html        # HTML файли
├── dist/                 # Зібрані файли (генерується автоматично)
├── gulpfile.js           # Конфігурація Gulp
└── package.json          # Залежності проекту
```

## Завдання Gulp

- `gulp` або `gulp dev` - Запуск розробки з Browser Sync
- `gulp build` - Збірка проекту для продакшену
- `gulp watch` - Спостереження за змінами без Browser Sync
- `gulp clean` - Очищення папки dist
- `gulp styles` - Компіляція SCSS
- `gulp scripts` - Обробка JavaScript
- `gulp images` - Конвертація та оптимізація зображень
- `gulp fonts` - Копіювання шрифтів
- `gulp html` - Копіювання HTML файлів

## Використання WebP зображень

Gulp автоматично конвертує всі растрові зображення (JPG, PNG, GIF) з папки `src/images/` у WebP формат. SVG файли копіюються як є без конвертації. Використовуйте `<picture>` елемент для підтримки fallback:

```html
<picture>
  <source srcset="images/example.webp" type="image/webp">
  <img src="images/example.jpg" alt="Example">
</picture>
```

**Примітка:** SVG файли не конвертуються в WebP та не оптимізуються, вони копіюються в `dist/images/` без змін.

## Залежності

- **Gulp 4** - Task runner
- **gulp-sass** - Компіляція SCSS
- **gulp-webp** - Конвертація в WebP
- **gulp-imagemin** - Оптимізація зображень
- **jQuery** - JavaScript бібліотека
- **Browser Sync** - Локальний сервер з автооновленням

## Примітки

- Всі зображення з папки `src/images/` будуть автоматично конвертовані в WebP
- SCSS файли компілюються з автопрефіксами для останніх 2 версій браузерів
- JavaScript файли об'єднуються та мінімізуються
- Reset CSS автоматично додається до основного SCSS файлу
