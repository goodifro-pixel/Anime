import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Calendar, Clock, Film } from "lucide-react";
import AnimePlayer from "@/components/AnimePlayer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
}

async function getAnimeById(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: WatchPageProps) {
  const { id } = await params;
  const anime = await getAnimeById(id);

  if (!anime) {
    return { title: "Аніме не знайдено | AniHub" };
  }

  return {
    title: `Дивитись ${anime.title} українською | AniHub`,
    description: `Дивіться ${anime.title} з українською озвучкою онлайн безкоштовно на AniHub. ${anime.episodes || "?"} серій.`,
  };
}

function PlayerSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-zinc-800" />
        ))}
      </div>
      <div className="aspect-video w-full animate-pulse rounded-2xl bg-zinc-800" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-10 animate-pulse rounded-lg bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { id } = await params;
  const { ep } = await searchParams;
  const anime = await getAnimeById(id);

  if (!anime) {
    notFound();
  }

  const currentEpisode = ep ? parseInt(ep, 10) : 1;
  const totalEpisodes = anime.episodes || 12;

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Back Navigation */}
        <Link
          href={`/anime/${anime.mal_id}-${anime.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до аніме
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Main Content - Player */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-white lg:text-3xl">
                {anime.title}
              </h1>
              {anime.title_japanese && (
                <p className="text-sm text-gray-500">{anime.title_japanese}</p>
              )}
            </div>

            <Suspense fallback={<PlayerSkeleton />}>
              <AnimePlayer
                malId={anime.mal_id}
                title={anime.title}
                episode={currentEpisode}
                totalEpisodes={totalEpisodes}
              />
            </Suspense>

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="mb-3 font-semibold text-white">Опис</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {anime.synopsis}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Anime Info */}
          <aside className="space-y-4">
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-800">
              <Image
                src={anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>

            {/* Quick Info */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h3 className="mb-4 font-semibold text-white">Інформація</h3>
              
              <div className="space-y-3 text-sm">
                {anime.score && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Рейтинг:</span>
                    <span className="ml-auto font-medium text-white">
                      {anime.score} / 10
                    </span>
                  </div>
                )}

                {anime.episodes && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Film className="h-4 w-4 text-indigo-500" />
                    <span>Серій:</span>
                    <span className="ml-auto font-medium text-white">
                      {anime.episodes}
                    </span>
                  </div>
                )}

                {anime.duration && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>Тривалість:</span>
                    <span className="ml-auto font-medium text-white">
                      {anime.duration}
                    </span>
                  </div>
                )}

                {anime.aired?.string && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Дата:</span>
                    <span className="ml-auto text-right font-medium text-white">
                      {anime.aired.string}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genres?.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="mb-3 font-semibold text-white">Жанри</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre: { mal_id: number; name: string }) => (
                    <Link
                      key={genre.mal_id}
                      href={`/genres?genre=${genre.mal_id}`}
                      className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-zinc-700 hover:text-white"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {anime.studios?.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="mb-3 font-semibold text-white">Студія</h3>
                <div className="text-sm text-gray-400">
                  {anime.studios.map((s: { name: string }) => s.name).join(", ")}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
