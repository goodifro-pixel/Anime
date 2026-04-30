/**
 * Ukrainian streaming sources (search-link resolvers).
 *
 * These sites do not expose stable public iframe embeds, so we generate
 * search-result URLs the user can open in a new tab to find the title with
 * Ukrainian dub / subs.
 */

export interface UASource {
  id: "anitube" | "uachan" | "anihub" | "uaserials";
  name: string;
  domain: string;
  description: string;
  /** Brand color for UI */
  color: string;
  buildSearchUrl: (title: string) => string;
}

const enc = (s: string) => encodeURIComponent(s.trim());

export const UA_SOURCES: UASource[] = [
  {
    id: "anitube",
    name: "AniTube",
    domain: "anitube.in.ua",
    description: "Аніме українською — озвучка/субтитри, серіали",
    color: "#e11d48",
    buildSearchUrl: (title) =>
      `https://anitube.in.ua/index.php?do=search&subaction=search&story=${enc(title)}`,
  },
  {
    id: "uachan",
    name: "UAchan",
    domain: "uachan.top",
    description: "Аніме з UA дубляжем/субтитрами, фільми",
    color: "#22c55e",
    buildSearchUrl: (title) => `https://uachan.top/?s=${enc(title)}`,
  },
  {
    id: "anihub",
    name: "AniHub / FutaShine",
    domain: "anihub.in.ua",
    description: "Дубльоване аніме від українських студій",
    color: "#8b5cf6",
    buildSearchUrl: (title) =>
      `https://anihub.in.ua/index.php?do=search&subaction=search&story=${enc(title)}`,
  },
  {
    id: "uaserials",
    name: "UASerials",
    domain: "uaserials.my",
    description: "Аніме / серіали / фільми UA озвучкою",
    color: "#f59e0b",
    buildSearchUrl: (title) => `https://uaserials.my/?s=${enc(title)}`,
  },
];

/** Pick the best title to search by (English preferred, fallback to original). */
export function pickSearchTitle(opts: {
  title: string;
  title_english?: string | null;
}): string {
  const t = (opts.title_english || opts.title || "").trim();
  return t.replace(/[:!?]/g, " ").replace(/\s+/g, " ").trim();
}
