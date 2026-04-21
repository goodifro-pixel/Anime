"use client";

import { useState } from "react";

export default function Player({
  youtubeId,
  title,
}: {
  youtubeId?: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-bg-border bg-bg-soft text-center text-sm text-gray-400">
        <div className="max-w-md p-6">
          <div className="mb-2 text-2xl">🎬</div>
          Відеоджерело недоступне для цього тайтлу.
          <br />
          Для реального стрімінгу підключіть ваш CDN / HLS плеєр.
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        onClick={() => setPlaying(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-bg-border bg-black"
      >
        {}
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
          className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/90 shadow-glow transition group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-sm text-gray-200">
          Відтворити трейлер
        </div>
      </button>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-bg-border bg-black">
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
