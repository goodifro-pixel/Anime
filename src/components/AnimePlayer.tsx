"use client";

import { useState, useCallback } from "react";
import { Play, Tv, AlertCircle, RefreshCw, Volume2, Maximize2 } from "lucide-react";

interface VideoSource {
  id: string;
  name: string;
  getUrl: (params: { malId: number; episode: number }) => string;
  color: string;
}

const VIDEO_SOURCES: VideoSource[] = [
  {
    id: "ashdi",
    name: "Ashdi",
    color: "#22c55e",
    getUrl: ({ malId, episode }) =>
      `https://ashdi.vip/serial/${malId}?episode=${episode}`,
  },
  {
    id: "kodik",
    name: "Kodik",
    color: "#6366f1",
    getUrl: ({ malId, episode }) =>
      `https://kodik.info/find-player?shikimoriID=${malId}&episode=${episode}&only_season=false`,
  },
  {
    id: "aniboom",
    name: "Aniboom",
    color: "#f97316",
    getUrl: ({ malId, episode }) =>
      `https://aniboom.one/embed/${malId}?episode=${episode}`,
  },
  {
    id: "moonanime",
    name: "MoonAnime",
    color: "#8b5cf6",
    getUrl: ({ malId, episode }) =>
      `https://moonanime.art/embed/anime/${malId}/${episode}`,
  },
];

interface AnimePlayerProps {
  malId: number;
  title: string;
  episode?: number;
  totalEpisodes?: number;
  onEpisodeChange?: (episode: number) => void;
}

export default function AnimePlayer({
  malId,
  title,
  episode = 1,
  totalEpisodes = 12,
  onEpisodeChange,
}: AnimePlayerProps) {
  const [currentSource, setCurrentSource] = useState<VideoSource>(VIDEO_SOURCES[0]);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoUrl = currentSource.getUrl({ malId, episode: currentEpisode });

  const handleSourceChange = useCallback((source: VideoSource) => {
    setCurrentSource(source);
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleEpisodeSelect = useCallback((ep: number) => {
    setCurrentEpisode(ep);
    setIsLoading(true);
    setHasError(false);
    onEpisodeChange?.(ep);
  }, [onEpisodeChange]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Source Switcher */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-400">
          <Tv className="h-4 w-4" />
          Джерело:
        </span>
        {VIDEO_SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => handleSourceChange(source)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              currentSource.id === source.id
                ? "text-white shadow-lg"
                : "bg-zinc-800/50 text-gray-400 hover:bg-zinc-700 hover:text-white"
            }`}
            style={{
              backgroundColor:
                currentSource.id === source.id ? source.color : undefined,
            }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold"
              style={{
                backgroundColor:
                  currentSource.id === source.id ? "rgba(255,255,255,0.2)" : source.color,
                color: "white",
              }}
            >
              {source.name[0]}
            </span>
            {source.name}
          </button>
        ))}
      </div>

      {/* Player Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/95">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-indigo-500" />
              <Play className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Завантаження плеєра...</p>
            <p className="mt-1 text-xs text-gray-600">
              {currentSource.name} / Серія {currentEpisode}
            </p>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/95 p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Не вдалося завантажити плеєр
            </h3>
            <p className="mb-4 max-w-md text-sm text-gray-400">
              Спробуйте інше джерело або перезавантажте плеєр.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Повторити
              </button>
              <button
                onClick={() => {
                  const nextIndex =
                    (VIDEO_SOURCES.findIndex((s) => s.id === currentSource.id) + 1) %
                    VIDEO_SOURCES.length;
                  handleSourceChange(VIDEO_SOURCES[nextIndex]);
                }}
                className="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-600"
              >
                <Tv className="h-4 w-4" />
                Інше джерело
              </button>
            </div>
          </div>
        )}

        {/* Placeholder when no URL */}
        {!videoUrl ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800">
              <Play className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Виберіть серію</h3>
            <p className="text-sm text-gray-500">
              Оберіть серію нижче для початку перегляду
            </p>
          </div>
        ) : (
          /* Video Iframe */
          <iframe
            key={`${currentSource.id}-${currentEpisode}`}
            src={videoUrl}
            title={`${title} - Серія ${currentEpisode}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            className="h-full w-full"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Bottom Gradient Overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Player Info Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          <Volume2 className="h-3 w-3 text-green-400" />
          <span className="font-medium">{currentSource.name}</span>
          <span className="text-gray-400">|</span>
          <span>Серія {currentEpisode}</span>
        </div>

        {/* Fullscreen Hint */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" />
          <span>F для повного екрану</span>
        </div>
      </div>

      {/* Episode Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Серії</h4>
          <span className="text-xs text-gray-500">
            {currentEpisode} / {totalEpisodes}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
            <button
              key={ep}
              onClick={() => handleEpisodeSelect(ep)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                currentEpisode === ep
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {ep}
            </button>
          ))}
        </div>
      </div>

      {/* Ukrainian Dub Info */}
      <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          <div className="h-full w-full">
            <div className="h-1/2 w-full bg-[#0057B7]" />
            <div className="h-1/2 w-full bg-[#FFD700]" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Українська озвучка</p>
          <p className="text-xs text-gray-400">
            Дивіться аніме з українським дубляжем від найкращих студій локалізації
          </p>
        </div>
      </div>
    </div>
  );
}
