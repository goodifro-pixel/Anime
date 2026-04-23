"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Play,
  Tv,
  AlertCircle,
  RefreshCw,
  Volume2,
  Maximize2,
  ArrowLeft,
  Bug,
  ExternalLink,
  Loader2,
  Mic,
} from "lucide-react";
import Link from "next/link";

interface Episode {
  number: number;
  title: string | null;
  player_url: string;
}

interface Translation {
  id: number;
  name: string;
  type: string;
}

interface PlayerData {
  id: number;
  title: string;
  title_ua?: string;
  episodes: Episode[];
  translations: Translation[];
  total_episodes: number;
  source: "anihub" | "fallback";
  success: boolean;
}

interface VideoSource {
  id: string;
  name: string;
  color: string;
  available: boolean;
}

const VIDEO_SOURCES: VideoSource[] = [
  { id: "anihub", name: "AniHub", color: "#6366f1", available: true },
  { id: "kodik", name: "Kodik", color: "#22c55e", available: true },
  { id: "ashdi", name: "Ashdi", color: "#f59e0b", available: true },
];

// Generate player URL based on source
function getPlayerUrl(
  source: string,
  malId: number,
  episode: number,
  episodeData?: Episode
): string {
  // If we have AniHub episode data with a direct URL, use it
  if (source === "anihub" && episodeData?.player_url) {
    return episodeData.player_url;
  }

  // Fallback URLs for each source
  switch (source) {
    case "anihub":
    case "kodik":
      // Using kodik.biz (NOT kodik.info - blocked)
      // translation_id=609 ensures only Ukrainian dubbing
      return `https://kodik.biz/find-player?shikimoriID=${malId}&translation_id=609&only_translations=true&episode=${episode}`;
    case "ashdi":
      return `https://ashdi.vip/serial/${malId}?episode=${episode}&dub=ua`;
    default:
      return `https://kodik.biz/find-player?shikimoriID=${malId}&translation_id=609&episode=${episode}`;
  }
}

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
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const [currentSource, setCurrentSource] = useState<VideoSource>(VIDEO_SOURCES[0]);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);
  const [playerError, setPlayerError] = useState(false);
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === "development");

  // Fetch data from AniHub API
  useEffect(() => {
    async function fetchPlayerData() {
      setIsLoadingData(true);
      setDataError(null);

      try {
        const response = await fetch(
          `/api/anihub?mal_id=${malId}&episode=${currentEpisode}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: PlayerData = await response.json();

        if (data.success) {
          setPlayerData(data);
        } else {
          throw new Error("API повернув помилку");
        }
      } catch (error) {
        console.error("[v0] Failed to fetch player data:", error);
        setDataError("Не вдалося завантажити дані плеєра");
        // Set fallback data
        setPlayerData({
          id: malId,
          title,
          episodes: Array.from({ length: totalEpisodes }, (_, i) => ({
            number: i + 1,
            title: `Серія ${i + 1}`,
            player_url: getPlayerUrl("kodik", malId, i + 1),
          })),
          translations: [{ id: 609, name: "AniTube UA", type: "voice" }],
          total_episodes: totalEpisodes,
          source: "fallback",
          success: true,
        });
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchPlayerData();
  }, [malId, title, totalEpisodes]);

  // Get current episode data
  const currentEpisodeData = playerData?.episodes.find(
    (ep) => ep.number === currentEpisode
  );

  // Build video URL
  const videoUrl = getPlayerUrl(
    currentSource.id,
    malId,
    currentEpisode,
    currentEpisodeData
  );

  const handleSourceChange = useCallback((source: VideoSource) => {
    setCurrentSource(source);
    setIsLoadingPlayer(true);
    setPlayerError(false);
  }, []);

  const handleEpisodeSelect = useCallback(
    (ep: number) => {
      setCurrentEpisode(ep);
      setIsLoadingPlayer(true);
      setPlayerError(false);
      onEpisodeChange?.(ep);
    },
    [onEpisodeChange]
  );

  const handleIframeLoad = useCallback(() => {
    setIsLoadingPlayer(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoadingPlayer(false);
    setPlayerError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoadingPlayer(true);
    setPlayerError(false);
  }, []);

  const episodeCount = playerData?.total_episodes || totalEpisodes;

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
                  currentSource.id === source.id
                    ? "rgba(255,255,255,0.2)"
                    : source.color,
                color: "white",
              }}
            >
              {source.name[0]}
            </span>
            {source.name}
            {source.id === "anihub" && playerData?.source === "anihub" && (
              <span className="ml-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] text-green-400">
                UA
              </span>
            )}
          </button>
        ))}

        {/* Data source indicator */}
        {playerData && (
          <span className="ml-auto text-xs text-gray-500">
            Дані: {playerData.source === "anihub" ? "AniHub API" : "Fallback"}
          </span>
        )}
      </div>

      {/* Translation Selector (if available) */}
      {playerData?.translations && playerData.translations.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-400">
            <Mic className="h-4 w-4" />
            Озвучка:
          </span>
          {playerData.translations
            .filter((t) => t.type === "voice")
            .slice(0, 5)
            .map((translation) => (
              <button
                key={translation.id}
                className="rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-zinc-700 hover:text-white"
              >
                {translation.name}
              </button>
            ))}
        </div>
      )}

      {/* Player Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        {/* Data Loading State */}
        {isLoadingData && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            <p className="mt-4 text-sm text-gray-400">
              Завантаження даних з AniHub...
            </p>
          </div>
        )}

        {/* Player Loading Overlay */}
        {!isLoadingData && isLoadingPlayer && !playerError && (
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

        {/* Error State */}
        {playerError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Контент недоступний
            </h3>
            <p className="mb-6 max-w-md text-sm text-gray-400">
              Відео українською не знайдено для цього аніме. Спробуйте інше
              джерело або поверніться пізніше.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Спробувати знову
              </button>
              {VIDEO_SOURCES.filter(
                (s) => s.id !== currentSource.id && s.available
              ).length > 0 && (
                <button
                  onClick={() => {
                    const available = VIDEO_SOURCES.filter((s) => s.available);
                    const idx = available.findIndex(
                      (s) => s.id === currentSource.id
                    );
                    const next = available[(idx + 1) % available.length];
                    handleSourceChange(next);
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
        {!isLoadingData && (
          <iframe
            key={`${currentSource.id}-${currentEpisode}-${malId}`}
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
        )}

        {/* Bottom Gradient */}
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
            {currentEpisode} / {episodeCount}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(episodeCount, 50) }, (_, i) => i + 1).map(
            (ep) => {
              const epData = playerData?.episodes.find((e) => e.number === ep);
              return (
                <button
                  key={ep}
                  onClick={() => handleEpisodeSelect(ep)}
                  title={epData?.title || `Серія ${ep}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentEpisode === ep
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {ep}
                </button>
              );
            }
          )}
          {episodeCount > 50 && (
            <span className="flex h-10 items-center px-2 text-xs text-gray-500">
              +{episodeCount - 50} серій
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

      {/* Debug Info */}
      {showDebug && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-500">
                Debug Info
              </span>
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
              <span className="text-gray-500">Data Source:</span>
              <span className="text-purple-400">{playerData?.source || "loading"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500">Episodes Count:</span>
              <span className="text-green-400">{playerData?.episodes.length || 0}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-gray-500">Video URL:</span>
              <span className="break-all text-indigo-400">{videoUrl}</span>
            </div>
            {dataError && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500">Error:</span>
                <span className="text-red-400">{dataError}</span>
              </div>
            )}
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
