import { ExternalLink } from "lucide-react";
import { UA_SOURCES, pickSearchTitle } from "@/lib/ua-sources";

interface UASourcesPanelProps {
  title: string;
  titleEnglish?: string | null;
  /** Visual variant: "card" — full block with header; "compact" — just buttons */
  variant?: "card" | "compact";
}

export default function UASourcesPanel({
  title,
  titleEnglish,
  variant = "card",
}: UASourcesPanelProps) {
  const q = pickSearchTitle({ title, title_english: titleEnglish ?? null });

  const buttons = (
    <div className="flex flex-wrap gap-2">
      {UA_SOURCES.map((s) => (
        <a
          key={s.id}
          href={s.buildSearchUrl(q)}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-zinc-700 hover:bg-zinc-800"
          title={`${s.name} — ${s.description}`}
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: s.color }}
            aria-hidden="true"
          />
          <span>{s.name}</span>
          <span className="text-xs text-gray-500">{s.domain}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );

  if (variant === "compact") return buttons;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white">
          Дивитись українською
        </h3>
        <span className="text-xs text-gray-500">
          Пошук «{q}» на UA-сайтах з дубляжем/озвучкою
        </span>
      </header>
      {buttons}
      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
        Посилання відкривають сторінку пошуку відповідного сайту в новій вкладці.
        AniHub не хостить контент — джерела належать стороннім ресурсам.
      </p>
    </section>
  );
}
