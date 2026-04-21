# AniHub Clone

Сучасний клон [anihub.in.ua](https://anihub.in.ua/) на Next.js 14 + TypeScript + TailwindCSS, готовий до деплою на Vercel.

## Особливості

- **App Router** (Next.js 14) з серверним рендерингом і ISR-кешуванням
- Каталог, фільтри, пошук, детальна сторінка аніме, епізоди, рекомендації
- Героїчна каруселька, горизонтальні скрол-списки, дизайн у темній темі під оригінал
- **Jikan (MyAnimeList) API** як джерело даних — жодних ключів не потрібно
- Плеєр трейлерів YouTube (готовий до заміни на ваш HLS/DASH-плеєр)
- Next.js Image, SEO, sitemap, robots.txt, OpenGraph
- TailwindCSS із брендовими кольорами (purple neon)
- Готовий `vercel.json`

## Запуск локально

```bash
npm install
npm run dev
# http://localhost:3000
```

## Деплой на Vercel

1. Залогіньтесь: `npx vercel login`
2. Деплой: `npx vercel --prod`

Або через веб-інтерфейс Vercel — імпортуйте цей репозиторій, фреймворк визначиться автоматично (Next.js).

## Структура

```
src/
  app/                  # App Router pages
    page.tsx            # Головна
    anime/
      page.tsx          # Каталог
      [slug]/page.tsx   # Детальна сторінка аніме
    genres/page.tsx
    ongoing/page.tsx
    top-rated/page.tsx
    login/page.tsx
    sitemap.ts
  components/           # Header, Footer, Hero, Cards, Player
  lib/
    jikan.ts            # Обгортка над Jikan API
    types.ts
    utils.ts
```

## Що можна доробити далі

- Підключити автентифікацію (NextAuth / Clerk / Supabase)
- Власний плеєр із HLS-стрімом (hls.js) замість трейлерів
- Українські переклади назв і описів через власну базу / API
- Коментарі, списки користувачів, історія перегляду

## Ліцензія

Дані надано безкоштовним публічним API [Jikan](https://jikan.moe/) (MyAnimeList).
