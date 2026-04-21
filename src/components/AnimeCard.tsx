import Image from "next/image";
import Link from "next/link";
import type { JikanAnime } from "@/lib/types";
import { animeSlug, formatScore, typeLabel } from "@/lib/utils";

type Props = {
  anime: Pick<
    JikanAnime,
    | "mal_id"
    | "title"
    | "title_english"
    | "images"
    | "score"
    | "type"
    | "year"
    | "status"
  >;
  badge?: string | null;
};

export default function AnimeCard({ anime, badge = null }: Props) {
  const href = `/anime/${animeSlug(anime as JikanAnime)}`;
  const img =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url;

  return (
    <Link
      href={href}
      className="group relative block w-[160px] shrink-0 sm:w-[180px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-bg-card shadow-sm transition will-change-transform group-hover:shadow-glow">
        {img ? (
          <Image
            src={img}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 160px, 180px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2">
          {anime.score ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-yellow-300">
              <StarIcon />
              {formatScore(anime.score)}
            </div>
          ) : null}
        </div>
        {badge ? (
          <div className="absolute left-2 top-2 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-100 group-hover:text-white">
        {anime.title_english || anime.title}
      </div>
      <div className="mt-0.5 text-xs text-gray-500">
        {anime.year ?? "—"} • {typeLabel(anime.type)}
      </div>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M12 2.5l2.955 5.988 6.607.96-4.781 4.66 1.128 6.58L12 17.77l-5.909 3.108 1.128-6.58-4.781-4.66 6.607-.96L12 2.5z" />
    </svg>
  );
}
