import type { Metadata } from "next";
import Link from "next/link";
import { searchAnime, getGenres } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Аніме каталог українською онлайн",
  description:
    "Повний каталог аніме українською. Фільтри за жанром, статусом, рейтингом.",
};

type SP = {
  q?: string;
  page?: string;
  genres?: string;
  status?: "airing" | "complete" | "upcoming";
  order_by?:
    | "popularity"
    | "score"
    | "start_date"
    | "title"
    | "rank"
    | "favorites";
};

function buildQuery(sp: SP) {
  const u = new URLSearchParams();
  if (sp.q) u.set("q", sp.q);
  if (sp.genres) u.set("genres", sp.genres);
  if (sp.status) u.set("status", sp.status);
  if (sp.order_by) u.set("order_by", sp.order_by);
  return u.toString() ? `/anime?${u.toString()}` : "/anime";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [result, genres] = await Promise.all([
    searchAnime({
      q: sp.q,
      page,
      genres: sp.genres,
      status: sp.status,
      order_by: sp.order_by || "popularity",
      sort: sp.order_by === "title" ? "asc" : "desc",
      limit: 24,
    }).catch(() => null),
    getGenres().catch(() => []),
  ]);

  const items = result?.data ?? [];
  const lastPage = Math.min(result?.pagination.last_visible_page ?? 1, 50);

  const activeGenre = sp.genres;
  const activeStatus = sp.status;
  const activeOrder = sp.order_by || "popularity";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Каталог аніме</h1>
      <p className="mt-2 text-sm text-gray-400">
        Знайдіть улюблений тайтл за жанром, статусом та рейтингом.
      </p>

      <form className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          name="q"
          defaultValue={sp.q || ""}
          placeholder="Пошук…"
          className="min-w-[220px] flex-1 rounded-full border border-bg-border bg-bg-soft px-4 py-2 text-sm outline-none ring-brand/40 focus:ring-2"
        />
        <select
          name="status"
          defaultValue={sp.status || ""}
          className="rounded-full border border-bg-border bg-bg-soft px-4 py-2 text-sm"
        >
          <option value="">Будь-який статус</option>
          <option value="airing">Онгоінги</option>
          <option value="complete">Завершені</option>
          <option value="upcoming">Анонси</option>
        </select>
        <select
          name="genres"
          defaultValue={sp.genres || ""}
          className="rounded-full border border-bg-border bg-bg-soft px-4 py-2 text-sm"
        >
          <option value="">Усі жанри</option>
          {genres.map((g) => (
            <option key={g.mal_id} value={String(g.mal_id)}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          name="order_by"
          defaultValue={activeOrder}
          className="rounded-full border border-bg-border bg-bg-soft px-4 py-2 text-sm"
        >
          <option value="popularity">За популярністю</option>
          <option value="score">За рейтингом</option>
          <option value="start_date">За датою виходу</option>
          <option value="title">За назвою</option>
          <option value="rank">За рангом</option>
          <option value="favorites">За обраним</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Застосувати
        </button>
        {sp.q || sp.genres || sp.status ? (
          <Link
            href="/anime"
            className="rounded-full border border-bg-border bg-bg-soft px-4 py-2 text-sm text-gray-300 hover:bg-bg-card"
          >
            Скинути
          </Link>
        ) : null}
      </form>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-bg-border bg-bg-soft p-10 text-center text-gray-400">
          Нічого не знайдено. Спробуйте змінити фільтри.
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((a) => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </div>
          <Pagination
            current={page}
            total={lastPage}
            baseQuery={buildQuery({
              q: sp.q,
              genres: activeGenre,
              status: activeStatus,
              order_by: activeOrder,
            })}
          />
        </>
      )}
    </div>
  );
}
