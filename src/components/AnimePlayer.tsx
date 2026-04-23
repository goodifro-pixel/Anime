"use client";

import { useState, useCallback } from "react";
import { Play, Tv, AlertCircle, RefreshCw, Volume2, Maximize2, ArrowLeft, Bug, ExternalLink } from "lucide-react";
import Link from "next/link";

interface VideoSource {
  id: string;
  name: string;
  getUrl: (params: { shikimoriId: number; episode: number }) => string;
  color: string;
  available: boolean;
}

// IMPORTANT: Using kodik.biz (NOT kodik.info - blocked)
// translation_id=609 ensures only Ukrainian dubbing is shown
const VIDEO_SOURCES: VideoSource[] = [
  {
    id: "kodik",
    name: "Kodik",
    color: "#6366f1",
    available: true,
    getUrl: ({ shikimoriId }) =>
      `https://kodik.biz/find-player?shikimoriID=${shikimoriId}&translation_id=609&only_translations=true&translations=false`,
  },
  {
    id: "ashdi",
    name: "Ashdi",
    color: "#22c55e",
    available: true,
    getUrl: ({ shikimoriId, episode }) =>
      `https://ashdi.vip/serial/${shikimoriId}?episode=${episode}&dub=ua`,
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
  // MAL ID is the same as Shikimori ID for most anime
  const shikimoriId = malId;
  
  const [currentSource, setCurrentSource] = useState<VideoSource>(VIDEO_SOURCES[0]);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === "development");

  const videoUrl = currentSource.getUrl({ shikimoriId, episode: currentEpisode });

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
            disabled={!source.available}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              currentSource.id === source.id
                ? "text-white shadow-lg"
                : source.available 
                  ? "bg-zinc-800/50 text-gray-400 hover:bg-zinc-700 hover:text-white"
                  : "cursor-not-allowed bg-zinc-900/50 text-gray-600"
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
            {!source.available && <span className="text-xs">(скоро)</span>}
          </button>
        ))}
      </div>

      {/* Player Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-zinc-700 border-t-indigo-500" />
              <Play className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-indigo-500" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Завантаження плеєра...</p>
            <p className="mt-1 text-xs text-gray-600">
              {currentSource.name} | Серія {currentEpisode}
            </p>
          </div>
        )}

        {/* Error State - Video not found in Ukrainian */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Відео українською не знайдено
            </h3>
            <p className="mb-6 max-w-md text-sm text-gray-400">
              На жаль, це аніме ще не має українського дубляжу. Спробуйте інше джерело або поверніться пізніше.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Спробувати знову
              </button>
              {VIDEO_SOURCES.filter(s => s.id !== currentSource.id && s.available).length > 0 && (
                <button
                  onClick={() => {
                    const availableSources = VIDEO_SOURCES.filter(s => s.available);
                    const currentIndex = availableSources.findIndex(s => s.id === currentSource.id);
                    const nextIndex = (currentIndex + 1) % availableSources.length;
                    handleSourceChange(availableSources[nextIndex]);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-600"
                >
                  <Tv className="h-4 w-4" />
                  Інше джерело
                </button>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-zinc-600 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                На головну
              </Link>
            </div>
          </div>
        )}

        {/* Video Iframe */}
        <iframe
          key={`${currentSource.id}-${currentEpisode}-${shikimoriId}`}
          src={videoUrl}
          title={`${title} - Серія ${currentEpisode}`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          referrerPolicy="no-referrer"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          className="h-full w-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />

        {/* Bottom Gradient Overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Player Info Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          <Volume2 className="h-3 w-3 text-blue-400" />
          <span className="font-medium text-blue-400">UA</span>
          <span className="text-gray-500">|</span>
          <span className="font-medium">{currentSource.name}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Серія {currentEpisode}</span>
        </div>

        {/* Fullscreen Hint */}
        <div className="absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-lg bg-black/80 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm sm:flex">
          <Maximize2 className="h-3 w-3" />
          <span>F - повний екран</span>
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
          {Array.from({ length: Math.min(totalEpisodes, 50) }, (_, i) => i + 1).map((ep) => (
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
          {totalEpisodes > 50 && (
            <span className="flex h-10 items-center px-2 text-xs text-gray-500">
              +{totalEpisodes - 50} серій
            </span>
          )}
        </div>
      </div>

      {/* Ukrainian Dub Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 to-yellow-950/20 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-lg">
          <div className="h-full w-full">
            <div className="h-1/2 w-full bg-[#0057B7]" />
            <div className="h-1/2 w-full bg-[#FFD700]" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">Українська озвучка</p>
          <p className="text-xs text-gray-400">
            Дивіться аніме з професійним українським дубляжем
          </p>
        </div>
      </div>

      {/* Debug Info - Development Only */}
      {showDebug && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">Debug Info</span>
            </div>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-xs text-gray-500 hover:text-gray-400"
            >
              Сховати
            </button>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-start gap-2">
              <span className="text-gray-500">Shikimori ID:</span>
              <span className="text-green-400">{shikimoriId}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">MAL ID:</span>
              <span className="text-green-400">{malId}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">Episode:</span>
              <span className="text-green-400">{currentEpisode}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">Source:</span>
              <span className="text-blue-400">{currentSource.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-gray-500">Video URL:</span>
              <span className="break-all text-indigo-400">{videoUrl}</span>
            </div>
            <a 
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" />
              Відкрити в новій вкладці
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
