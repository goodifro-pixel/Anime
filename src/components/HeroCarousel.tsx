"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { JikanAnime } from "@/lib/types";
import { animeSlug, formatScore, truncate, typeLabel } from "@/lib/utils";

export default function HeroCarousel({ items }: { items: JikanAnime[] }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pause = useRef(false);

  useEffect(() => {
    timer.current = setInterval(() => {
      if (!pause.current) setIdx((i) => (i + 1) % items.length);
    }, 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [items.length]);

  if (!items.length) return null;
  const a = items[idx];
  const bg =
    a.images.webp.large_image_url ||
    a.images.jpg.large_image_url ||
    a.images.jpg.image_url;

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseEnter={() => (pause.current = true)}
      onMouseLeave={() => (pause.current = false)}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          key={a.mal_id + "-bg"}
          src={bg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span className="rounded-md bg-brand/20 px-2 py-0.5 font-medium text-brand">
                {a.year ?? "—"}
              </span>
              <span className="rounded-md bg-bg-card px-2 py-0.5">
                {typeLabel(a.type)}
              </span>
              {a.score ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 font-medium text-yellow-300">
                  <Star />
                  {formatScore(a.score)}
                </span>
              ) : null}
            </div>
            <h1 className="text-balance text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {a.title_english || a.title}
            </h1>
            {a.title_japanese ? (
              <div className="mt-1 text-sm text-gray-400">
                {a.title_japanese}
              </div>
            ) : null}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
              {truncate(a.synopsis || "", 320)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/anime/${animeSlug(a)}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-brand-600"
              >
                <Play />
                Дивитись
              </Link>
              <Link
                href={`/anime/${animeSlug(a)}`}
                className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-soft px-5 py-2.5 text-sm font-semibold text-white hover:bg-bg-card"
              >
                Детальніше
              </Link>
            </div>
          </div>

          <div className="hidden justify-end md:flex">
            <div className="relative aspect-[2/3] w-[280px] overflow-hidden rounded-2xl shadow-glow">
              <Image
                key={a.mal_id + "-poster"}
                src={bg}
                alt={a.title}
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Перейти до слайду ${i + 1}`}
              onClick={() => setIdx(i)}
              className={
                "h-1.5 rounded-full transition-all " +
                (i === idx
                  ? "w-8 bg-brand"
                  : "w-4 bg-bg-border hover:bg-bg-card")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Play() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function Star() {
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
