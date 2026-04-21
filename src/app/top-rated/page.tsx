import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTopAnime } from "@/lib/jikan";
import { animeSlug, formatScore, typeLabel } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Топ-100 аніме — найкраще за рейтингом",
  description: "Найвище оцінені аніме за весь час.",
};

export default async function TopRatedPage() {
  const items = await getTopAnime("bypopularity", 25).catch(() => []);
  const hero = items[0];
  return (
    <div>
      {hero ? (
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src={hero.images.webp.large_image_url || hero.images.jpg.large_image_url}
              alt=""
              fill
              className="object-cover opacity-30 blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="text-xs uppercase tracking-wider text-brand">
              #1 у рейтингу
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {hero.title_english || hero.title}
            </h1>
            <div className="mt-1 text-sm text-gray-400">{hero.title_japanese}</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-yellow-300">
              ★ {formatScore(hero.score)} • {hero.year ?? "—"} • {typeLabel(hero.type)}
            </div>
            <Link
              href={`/anime/${animeSlug(hero)}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-brand-600"
            >
              Дивитись зараз
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="mb-6 text-2xl font-bold text-white">Топ-25 Аніме</h2>
        <ol className="space-y-3">
          {items.map((a, i) => (
            <li
              key={a.mal_id}
              className="flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-soft p-3 transition hover:bg-bg-card"
            >
              <div className="w-8 shrink-0 text-center text-xl font-bold text-brand sm:text-2xl">
                {i + 1}
              </div>
              <Link
                href={`/anime/${animeSlug(a)}`}
                className="relative block h-20 w-14 shrink-0 overflow-hidden rounded-md bg-bg-card"
              >
                <Image
                  src={
                    a.images.webp.large_image_url ||
                    a.images.jpg.large_image_url
                  }
                  alt={a.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/anime/${animeSlug(a)}`}
                  className="truncate text-sm font-semibold text-white hover:text-brand sm:text-base"
                >
                  {a.title_english || a.title}
                </Link>
                <div className="truncate text-xs text-gray-500">
                  {a.title} • {a.year ?? "—"} • {typeLabel(a.type)}
                </div>
              </div>
              <div className="shrink-0 text-sm font-bold text-yellow-300">
                ★ {formatScore(a.score)}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
