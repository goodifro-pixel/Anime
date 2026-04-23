import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAnimeById,
  getAnimeEpisodes,
  getRecommendations,
} from "@/lib/jikan";
import {
  animeSlug,
  formatScore,
  seasonLabel,
  statusLabel,
  typeLabel,
} from "@/lib/utils";
import PlayerBalancer from "@/components/PlayerBalancer";

export const revalidate = 1800;

type Params = { slug: string };

function idFromSlug(slug: string): number | null {
  const m = slug.match(/(\d+)$/);
  return m ? Number(m[1]) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromSlug(slug);
  if (!id) return { title: "Аніме" };
  try {
    const a = await getAnimeById(id);
    return {
      title: a.title_english || a.title,
      description: a.synopsis?.slice(0, 180) || undefined,
      openGraph: {
        title: a.title_english || a.title,
        description: a.synopsis?.slice(0, 180) || undefined,
        images: a.images.jpg.large_image_url
          ? [a.images.jpg.large_image_url]
          : undefined,
      },
    };
  } catch {
    return { title: "Аніме" };
  }
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const id = idFromSlug(slug);
  if (!id) notFound();

  const anime = await getAnimeById(id).catch(() => null);
  if (!anime) notFound();

  const [episodesResp, recs] = await Promise.all([
    getAnimeEpisodes(id, 1).catch(() => null),
    getRecommendations(id).catch(() => []),
  ]);

  const episodes = episodesResp?.data ?? [];
  const poster =
    anime.images.webp.large_image_url ||
    anime.images.jpg.large_image_url ||
    anime.images.jpg.image_url;

  return (
    <div>
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20 blur-[4px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-6 pt-8 sm:px-6 md:grid-cols-[260px_1fr]">
          <div>
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-2xl shadow-glow">
              <Image
                src={poster}
                alt={anime.title}
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span className="rounded-md bg-brand/20 px-2 py-0.5 font-medium text-brand">
                {anime.year ?? "—"}
              </span>
              <span className="rounded-md bg-bg-card px-2 py-0.5">
                {typeLabel(anime.type)}
              </span>
              <span className="rounded-md bg-bg-card px-2 py-0.5">
                {statusLabel(anime.status)}
              </span>
              {anime.score ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 font-medium text-yellow-300">
                  ★ {formatScore(anime.score)}
                </span>
              ) : null}
            </div>
            <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
              {anime.title_english || anime.title}
            </h1>
            <div className="mt-1 text-sm text-gray-400">
              {anime.title}
              {anime.title_japanese ? ` • ${anime.title_japanese}` : ""}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <Link
                  key={g.mal_id}
                  href={`/anime?genres=${g.mal_id}`}
                  className="rounded-full border border-bg-border bg-bg-soft px-3 py-1 text-xs text-gray-200 hover:bg-bg-card"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {anime.synopsis || "Опис недоступний."}
            </p>

            {/* Watch Button */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/watch/${anime.mal_id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand/90"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Дивитись онлайн
              </Link>
              {anime.trailer?.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-bg-border bg-bg-soft px-6 py-3 font-medium text-gray-200 transition hover:bg-bg-card hover:text-white"
                >
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  Трейлер
                </a>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Info label="Епізоди" value={anime.episodes ?? "—"} />
              <Info label="Тривалість" value={anime.duration || "—"} />
              <Info
                label="Сезон"
                value={
                  anime.season
                    ? `${seasonLabel(anime.season)} ${anime.year ?? ""}`
                    : "—"
                }
              />
              <Info
                label="Студія"
                value={anime.studios.map((s) => s.name).join(", ") || "—"}
              />
              <Info label="Джерело" value={anime.source || "—"} />
              <Info label="Рейтинг" value={anime.rating || "—"} />
            </dl>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-2xl font-bold text-white">Перегляд</h2>
        <PlayerBalancer
          malId={anime.mal_id}
          title={anime.title_english || anime.title}
          youtubeId={anime.trailer?.youtube_id ?? null}
        />
      </section>

      {episodes.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Епізоди</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.slice(0, 24).map((ep) => (
              <div
                key={ep.mal_id}
                className="flex items-start gap-3 rounded-xl border border-bg-border bg-bg-soft p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/20 font-bold text-brand">
                  {ep.mal_id}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">
                    {ep.title}
                  </div>
                  {ep.title_japanese ? (
                    <div className="truncate text-xs text-gray-500">
                      {ep.title_japanese}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {recs.length ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Рекомендації</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recs.map((r) => (
              <Link
                key={r.entry.mal_id}
                href={`/anime/${animeSlug({
                  mal_id: r.entry.mal_id,
                  title: r.entry.title,
                })}`}
                className="group block"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-bg-card">
                  <Image
                    src={
                      r.entry.images.webp.large_image_url ||
                      r.entry.images.jpg.large_image_url
                    }
                    alt={r.entry.title}
                    fill
                    sizes="160px"
                    className="object-cover transition group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-2 line-clamp-2 text-sm text-gray-200 group-hover:text-white">
                  {r.entry.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-soft p-3">
      <div className="text-[11px] uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm text-white">{value}</div>
    </div>
  );
}
