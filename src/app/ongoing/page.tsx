import type { Metadata } from "next";
import { searchAnime } from "@/lib/jikan";
import AnimeCard from "@/components/AnimeCard";
import Pagination from "@/components/Pagination";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Онгоінги — аніме, що зараз транслюється",
  description: "Список аніме-онгоінгів, що наразі виходять.",
};

export default async function OngoingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const res = await searchAnime({
    status: "airing",
    order_by: "popularity",
    sort: "asc",
    page,
    limit: 24,
  }).catch(() => null);
  const items = res?.data ?? [];
  const last = Math.min(res?.pagination.last_visible_page ?? 1, 50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Онгоінги</h1>
      <p className="mt-2 text-sm text-gray-400">
        Аніме з активними випусками нових серій.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((a) => (
          <AnimeCard key={a.mal_id} anime={a} badge="NEW" />
        ))}
      </div>
      <Pagination current={page} total={last} baseQuery="/ongoing" />
    </div>
  );
}
