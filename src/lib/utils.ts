import type { JikanAnime } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function animeSlug(a: Pick<JikanAnime, "mal_id" | "title">) {
  const base = a.title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "anime"}-${a.mal_id}`;
}

export function idFromSlug(slug: string): number | null {
  const m = slug.match(/(\d+)$/);
  return m ? Number(m[1]) : null;
}

export function formatScore(s: number | null | undefined) {
  if (s == null) return "—";
  return s.toFixed(1);
}

export function typeLabel(t: string | null | undefined) {
  if (!t) return "—";
  const map: Record<string, string> = {
    TV: "Серіал",
    Movie: "Фільм",
    OVA: "OVA",
    ONA: "ONA",
    Special: "Спешл",
    Music: "Кліп",
  };
  return map[t] ?? t;
}

export function statusLabel(s: string | null | undefined) {
  if (!s) return "—";
  const map: Record<string, string> = {
    "Currently Airing": "Онгоінг",
    "Finished Airing": "Завершено",
    "Not yet aired": "Анонс",
  };
  return map[s] ?? s;
}

export function seasonLabel(s: string | null | undefined) {
  if (!s) return "";
  const map: Record<string, string> = {
    spring: "Весна",
    summer: "Літо",
    fall: "Осінь",
    winter: "Зима",
  };
  return map[s] ?? s;
}

export function truncate(s: string, n = 240) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}
