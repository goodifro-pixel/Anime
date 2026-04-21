import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-bg-border bg-bg-soft">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-white">ANI</span>
            <span className="text-brand">HUB</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-gray-400">
            AniHub — дивитись аніме українською онлайн безкоштовно. Відкрий
            світ аніме по новому.
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
            Навігація
          </div>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-400">
            <li><Link className="hover:text-white" href="/anime">Каталог</Link></li>
            <li><Link className="hover:text-white" href="/genres">Жанри</Link></li>
            <li><Link className="hover:text-white" href="/ongoing">Онгоінги</Link></li>
            <li><Link className="hover:text-white" href="/top-rated">Топ рейтингу</Link></li>
            <li><Link className="hover:text-white" href="/news">Новини</Link></li>
            <li><Link className="hover:text-white" href="/login">Увійти</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
            Спільнота
          </div>
          <ul className="grid gap-2 text-sm text-gray-400">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-white"
                href="https://t.me/s/anihub_ua"
                target="_blank"
                rel="noreferrer noopener"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-white"
                href="https://www.tiktok.com/@anihub.in.ua"
                target="_blank"
                rel="noreferrer noopener"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bg-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:px-6">
          <div>
            © {new Date().getFullYear()} AniHub. Дані надано Jikan / MyAnimeList.
          </div>
          <div>Made with Next.js & Vercel.</div>
        </div>
      </div>
    </footer>
  );
}
