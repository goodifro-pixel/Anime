import type {
  JikanAnime,
  JikanEpisode,
  JikanPaginated,
  JikanSingle,
  Genre,
} from "./types";

const BASE = "https://api.jikan.moe/v4";

type CacheOpts = { revalidate?: number };

async function jfetch<T>(
  path: string,
  { revalidate = 60 * 30 }: CacheOpts = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Jikan ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

export async function getTopAnime(
  filter: "airing" | "upcoming" | "bypopularity" | "favorite" = "bypopularity",
  limit = 24
) {
  const r = await jfetch<JikanPaginated<JikanAnime>>(
    `/top/anime?filter=${filter}&limit=${limit}`
  );
  return r.data;
}

export async function getSeasonNow(limit = 24) {
  const r = await jfetch<JikanPaginated<JikanAnime>>(
    `/seasons/now?limit=${limit}`
  );
  return r.data;
}

export async function getUpcoming(limit = 24) {
  const r = await jfetch<JikanPaginated<JikanAnime>>(
    `/seasons/upcoming?limit=${limit}`
  );
  return r.data;
}

export async function searchAnime(params: {
  q?: string;
  page?: number;
  limit?: number;
  genres?: string;
  status?: "airing" | "complete" | "upcoming";
  type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
  order_by?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "score"
    | "rank"
    | "popularity"
    | "favorites";
  sort?: "asc" | "desc";
  min_score?: number;
}) {
  const q = new URLSearchParams();
  if (params.q) q.set("q", params.q);
  if (params.page) q.set("page", String(params.page));
  q.set("limit", String(params.limit ?? 24));
  if (params.genres) q.set("genres", params.genres);
  if (params.status) q.set("status", params.status);
  if (params.type) q.set("type", params.type);
  if (params.order_by) q.set("order_by", params.order_by);
  if (params.sort) q.set("sort", params.sort);
  if (params.min_score) q.set("min_score", String(params.min_score));
  return jfetch<JikanPaginated<JikanAnime>>(`/anime?${q.toString()}`, {
    revalidate: 60 * 15,
  });
}

export async function getAnimeById(id: number) {
  const r = await jfetch<JikanSingle<JikanAnime>>(`/anime/${id}/full`);
  return r.data;
}

export async function getAnimeEpisodes(id: number, page = 1) {
  return jfetch<JikanPaginated<JikanEpisode>>(
    `/anime/${id}/episodes?page=${page}`
  );
}

export async function getRecommendations(id: number) {
  const r = await jfetch<{
    data: {
      entry: {
        mal_id: number;
        title: string;
        images: JikanAnime["images"];
      };
    }[];
  }>(`/anime/${id}/recommendations`);
  return r.data.slice(0, 12);
}

export async function getGenres() {
  const r = await jfetch<{ data: Genre[] }>(`/genres/anime`);
  return r.data;
}
