# Компоненти та стилі

Ця папка містить всі SCSS файли для кастомної бібліотеки компонентів.

## Структура

- `reset.scss` - Reset CSS стилі
- `_variables.scss` - Змінні (кольори, відступи, радіуси)
- `_typography.scss` - Типографічні стилі (Inter font, заголовки, параграфи)
- `_buttons.scss` - Компонент кнопок (Button CTA)
- `_inputs.scss` - Компонент полів вводу
- `_icons.scss` - Стилі для іконок
- `main.scss` - Головний файл, який імпортує всі компоненти

## Використання компонентів

### Кнопки (Button CTA)

```html
<!-- Dark Theme - Primary -->
<button class="btn-cta btn-cta--dark-primary">Button CTA</button>

<!-- Dark Theme - Outline -->
<button class="btn-cta btn-cta--dark-outline">Button CTA</button>

<!-- Light Theme - Primary -->
<button class="btn-cta btn-cta--light-primary">Button CTA</button>

<!-- Light Theme - Outline -->
<button class="btn-cta btn-cta--light-outline">Button CTA</button>

<!-- Disabled -->
<button class="btn-cta btn-cta--dark-primary" disabled>Button CTA</button>

<!-- Sizes -->
<button class="btn-cta btn-cta--dark-primary btn-cta--sm">Small</button>
<button class="btn-cta btn-cta--dark-primary btn-cta--lg">Large</button>
```

### Поля вводу (Input Fields)

```html
<div class="input-field">
  <label class="input-label">Email</label>
  <input type="email" class="input-control" placeholder="olivia@untitledui.com">
</div>

<!-- Focused state (автоматично при фокусі) -->
<input type="email" class="input-control" placeholder="olivia@untitledui.com">

<!-- Disabled state -->
<input type="email" class="input-control" placeholder="olivia@untitledui.com" disabled>

<!-- Error state -->
<input type="email" class="input-control input-control--error" placeholder="olivia@untitledui.com">
```

### Типографіка

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<p class="p1">Paragraph 1</p>
<p class="p2">Paragraph 2</p>
<p class="p3">Paragraph 3</p>
```

### Іконки

```html
<!-- Base icon -->
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <!-- SVG path -->
</svg>

<!-- Icon sizes -->
<svg class="icon icon--sm">...</svg>
<svg class="icon icon--md">...</svg>
<svg class="icon icon--lg">...</svg>
<svg class="icon icon--xl">...</svg>

<!-- Icon list -->
<ul class="icon-list">
  <li class="icon-list-item">
    <svg class="icon">...</svg>
    <span>Icon Label</span>
  </li>
</ul>
```

## Кольори

Всі кольори визначені в `_variables.scss`:

- **Fiord** (синьо-сірі): `$fiord-900` до `$fiord-050`
- **White Linen** (бежеві): `$white-linen-900` до `$white-000`
- **Electric Violet** (фіолетові): `$electric-violet-900` до `$electric-violet-000`
- **Black Rock** (темно-сині): `$black-rock-900` до `$black-rock-100`

Семантичні кольори:
- `$color-primary` - Основний колір
- `$color-text-primary` - Основний текст
- `$color-text-secondary` - Вторинний текст
- `$color-border` - Колір рамки
- `$color-background` - Фоновий колір

## Змінні

### Відступи (Spacing)
- `$spacing-xs` - 4px
- `$spacing-sm` - 8px
- `$spacing-md` - 16px
- `$spacing-lg` - 24px
- `$spacing-xl` - 32px
- `$spacing-2xl` - 48px

### Радіуси (Border Radius)
- `$radius-sm` - 4px
- `$radius-md` - 8px
- `$radius-lg` - 12px
- `$radius-full` - 9999px

### Переходи (Transitions)
- `$transition-fast` - 150ms ease
- `$transition-base` - 200ms ease
- `$transition-slow` - 300ms ease
