"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function HScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scroll(dir: -1 | 1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Прокрутити вліво"
        onClick={() => scroll(-1)}
        className={
          "pointer-events-auto absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-bg-soft/90 p-2 text-white shadow-md backdrop-blur transition hover:bg-brand md:flex " +
          (canLeft ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
        <Arrow dir="left" />
      </button>
      <div
        ref={ref}
        className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Прокрутити вправо"
        onClick={() => scroll(1)}
        className={
          "pointer-events-auto absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-bg-soft/90 p-2 text-white shadow-md backdrop-blur transition hover:bg-brand md:flex " +
          (canRight ? "opacity-100" : "pointer-events-none opacity-0")
        }
      >
        <Arrow dir="right" />
      </button>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}
