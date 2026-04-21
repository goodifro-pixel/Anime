import Link from "next/link";

export default function Section({
  title,
  subtitle,
  href,
  hrefLabel = "Переглянути всі",
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-bg-border bg-bg-soft px-3 py-1.5 text-xs text-gray-200 hover:bg-bg-card hover:text-white"
          >
            {hrefLabel}
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
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
