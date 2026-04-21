import Link from "next/link";

export default function Pagination({
  current,
  total,
  baseQuery,
}: {
  current: number;
  total: number;
  baseQuery: string;
}) {
  if (total <= 1) return null;
  const pages: (number | "…")[] = [];
  const push = (n: number | "…") => pages.push(n);
  const window = 2;
  push(1);
  if (current - window > 2) push("…");
  for (
    let i = Math.max(2, current - window);
    i <= Math.min(total - 1, current + window);
    i++
  ) {
    push(i);
  }
  if (current + window < total - 1) push("…");
  if (total > 1) push(total);

  function url(p: number) {
    const sep = baseQuery.includes("?") ? "&" : "?";
    return `${baseQuery}${sep}page=${p}`;
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {current > 1 ? (
        <Link
          href={url(current - 1)}
          className="rounded-full border border-bg-border bg-bg-soft px-3 py-1.5 text-sm hover:bg-bg-card"
        >
          ← Назад
        </Link>
      ) : null}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={i} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <Link
            key={i}
            href={url(p)}
            className={
              "min-w-[2.25rem] rounded-full border px-3 py-1.5 text-center text-sm " +
              (p === current
                ? "border-brand bg-brand text-white"
                : "border-bg-border bg-bg-soft hover:bg-bg-card")
            }
          >
            {p}
          </Link>
        )
      )}
      {current < total ? (
        <Link
          href={url(current + 1)}
          className="rounded-full border border-bg-border bg-bg-soft px-3 py-1.5 text-sm hover:bg-bg-card"
        >
          Далі →
        </Link>
      ) : null}
    </nav>
  );
}
