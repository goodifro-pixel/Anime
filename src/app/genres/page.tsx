import type { Metadata } from "next";
import Link from "next/link";
import { getGenres } from "@/lib/jikan";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Жанри аніме",
  description: "Перегляньте аніме за жанром.",
};

export default async function GenresPage() {
  const genres = await getGenres().catch(() => []);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Жанри</h1>
      <p className="mt-2 text-sm text-gray-400">
        Оберіть жанр, щоб переглянути відповідний каталог.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {genres.map((g) => (
          <Link
            key={g.mal_id}
            href={`/anime?genres=${g.mal_id}`}
            className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-soft px-4 py-3 text-sm font-medium text-white transition hover:border-brand/50 hover:bg-bg-card"
          >
            <span>{g.name}</span>
            {g.count ? (
              <span className="text-xs text-gray-500">{g.count}</span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
