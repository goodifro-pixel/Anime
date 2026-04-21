"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  { href: "/anime", label: "Аніме" },
  { href: "/genres", label: "Жанри" },
  { href: "/ongoing", label: "Онгоінги" },
  { href: "/top-rated", label: "Топ рейтингу" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/anime?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="На головну"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="text-2xl">
              <span className="text-white">ANI</span>
              <span className="text-brand">HUB</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "rounded-full px-4 py-2 text-sm transition " +
                    (active
                      ? "bg-bg-card text-white"
                      : "text-gray-300 hover:bg-bg-soft hover:text-white")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form
            onSubmit={onSubmit}
            className={
              "relative hidden items-center transition-all md:flex " +
              (searchOpen ? "w-72" : "w-10")
            }
          >
            {searchOpen ? (
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Пошук аніме…"
                className="w-full rounded-full border border-bg-border bg-bg-soft px-4 py-2 pl-10 text-sm outline-none ring-brand/40 focus:ring-2"
              />
            ) : null}
            <button
              type="button"
              aria-label="Відкрити пошук"
              onClick={() => setSearchOpen((v) => !v)}
              className={
                "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft text-gray-300 hover:text-white " +
                (searchOpen ? "" : "")
              }
            >
              <SearchIcon />
            </button>
          </form>

          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-glow hover:bg-brand-600 sm:inline-flex"
          >
            <UserIcon />
            Увійти
          </Link>

          <button
            aria-label="Меню"
            className="rounded-full bg-bg-soft p-2 text-gray-200 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-bg-border bg-bg-soft md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <form onSubmit={onSubmit} className="relative mb-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Пошук аніме…"
                className="w-full rounded-full border border-bg-border bg-bg px-4 py-2 pl-10 text-sm outline-none ring-brand/40 focus:ring-2"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
            </form>
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-bg-card"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white"
              >
                <UserIcon />
                Увійти
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function SearchIcon() {
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
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function MenuIcon() {
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
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
