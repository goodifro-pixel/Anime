"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Play,
  Tv,
  Mic,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import HlsPlayer from "./HlsPlayer";
import {
  generateDemoEpisodes,
  IFRAME_SOURCES,
  UKRAINIAN_TRANSLATIONS,
} from "@/lib/video-sources";

interface AnimePlayerProps {
  malId: number;
  title: string;
  poster?: string;
  episode?: number;
  totalEpisodes?: number;
  onEpisodeChange?: (episode: number) => void;
}

type PlayerMode = "native" | "iframe";

interface IframeSource {
  id: keyof typeof IFRAME_SOURCES;
  name: string;
  color: string;
}

const IFRAME_SOURCE_LIST: IframeSource[] = [
  { id: "kodik", name: "Kodik", color: "#22c55e" },
  { id: "ashdi", name: "Ashdi", color: "#f59e0b" },
  { id: "aniboom", name: "Aniboom", color: "#8b5cf6" },
];

export default function AnimePlayer({
  malId,
  title,
  poster,
  episode = 1,
  totalEpisodes = 12,
  onEpisodeChange,
}: AnimePlayerProps) {
  // Generate episodes with working HLS streams
  const episodes = useMemo(
    () => generateDemoEpisodes(malId, totalEpisodes, poster),
    [malId, totalEpisodes, poster]
  );

  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [playerMode, setPlayerMode] = useState<PlayerMode>("native");
  const [iframeSource, setIframeSource] = useState<IframeSource>(IFRAME_SOURCE_LIST[0]);
  const [translation, setTranslation] = useState(UKRAINIAN_TRANSLATIONS[0]);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  const currentEpData = episodes.find((ep) => ep.number === currentEpisode) || episodes[0];

  const handleEpisodeChange = useCallback(
    (ep: number) => {
      setCurrentEpisode(ep);
      onEpisodeChange?.(ep);
      // Scroll to top of player
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onEpisodeChange]
  );

  const handleNextEpisode = useCallback(() => {
    if (currentEpisode < episodes.length) {
      handleEpisodeChange(currentEpisode + 1);
    }
  }, [currentEpisode, episodes.length, handleEpisodeChange]);

  const handlePrevEpisode = useCallback(() => {
    if (currentEpisode > 1) {
      handleEpisodeChange(currentEpisode - 1);
    }
  }, [currentEpisode, handleEpisodeChange]);

  const iframeUrl = useMemo(
    () => IFRAME_SOURCES[iframeSource.id](malId, currentEpisode),
    [iframeSource.id, malId, currentEpisode]
  );

  const visibleEpisodes = showAllEpisodes ? episodes : episodes.slice(0, 24);

  return (
    <div className="w-full space-y-6">
      {/* Player Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-2">
        <button
          onClick={() => setPlayerMode("native")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-initial ${
            playerMode === "native"
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <Play className="h-4 w-4 fill-current" />
          Вбудований плеєр
          <span className="hidden rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-400 sm:inline">
            HD
          </span>
        </button>
        <button
          onClick={() => setPlayerMode("iframe")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-initial ${
            playerMode === "iframe"
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <ExternalLink className="h-4 w-4" />
          Зовнішнє джерело
        </button>
      </div>

      {/* Iframe Source Switcher (only shown when iframe mode is active) */}
      {playerMode === "iframe" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-400">
            <Tv className="h-4 w-4" />
            Джерело:
          </span>
          {IFRAME_SOURCE_LIST.map((source) => (
            <button
              key={source.id}
              onClick={() => setIframeSource(source)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                iframeSource.id === source.id
                  ? "text-white shadow-lg"
                  : "bg-zinc-800/50 text-gray-400 hover:bg-zinc-700 hover:text-white"
              }`}
              style={{
                backgroundColor:
                  iframeSource.id === source.id ? source.color : undefined,
              }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white"
                style={{
                  backgroundColor:
                    iframeSource.id === source.id
                      ? "rgba(255,255,255,0.25)"
                      : source.color,
                }}
              >
                {source.name[0]}
              </span>
              {source.name}
            </button>
          ))}
        </div>
      )}

      {/* Translation Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 flex items-center gap-2 text-sm font-medium text-gray-400">
          <Mic className="h-4 w-4" />
          Озвучка:
        </span>
        {UKRAINIAN_TRANSLATIONS.filter((t) => t.popular).map((t) => (
          <button
            key={t.id}
            onClick={() => setTranslation(t)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              translation.id === t.id
                ? "bg-blue-600 text-white"
                : "bg-zinc-800/50 text-gray-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {translation.id === t.id && <CheckCircle2 className="h-3 w-3" />}
            {t.name}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="relative">
        {playerMode === "native" ? (
          <HlsPlayer
            key={`${currentEpisode}-${malId}`}
            src={currentEpData.streams.hls.url}
            poster={currentEpData.poster}
            title={`${title} — ${currentEpData.title}`}
            autoPlay={false}
            onEnded={handleNextEpisode}
          />
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
            <iframe
              key={`${iframeSource.id}-${currentEpisode}-${malId}`}
              src={iframeUrl}
              title={`${title} - ${currentEpData.title}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              scrolling="no"
              referrerPolicy="no-referrer"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups-to-escape-sandbox"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
              <Tv className="h-3 w-3" style={{ color: iframeSource.color }} />
              <span>{iframeSource.name}</span>
            </div>
          </div>
        )}

        {/* Info Badge Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-lg bg-blue-950/50 px-2.5 py-1 text-blue-300 ring-1 ring-blue-500/20">
            <span
              className="inline-block h-3 w-4 overflow-hidden rounded-sm"
              style={{
                background:
                  "linear-gradient(to bottom, #0057B7 50%, #FFD700 50%)",
              }}
            />
            Українська
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-gray-300">
            <Mic className="h-3 w-3" />
            {translation.name}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-gray-300">
            <Clock className="h-3 w-3" />
            {currentEpData.duration}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-gray-300">
            <Calendar className="h-3 w-3" />
            Серія {currentEpisode} з {episodes.length}
          </span>
        </div>
      </div>

      {/* Episode Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrevEpisode}
          disabled={currentEpisode <= 1}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:border-zinc-700 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Попередня</span>
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-500">Зараз дивитесь</p>
          <p className="text-sm font-semibold text-white">
            {currentEpData.title}
          </p>
        </div>
        <button
          onClick={handleNextEpisode}
          disabled={currentEpisode >= episodes.length}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Наступна</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Episode Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-white">Список серій</h4>
          <span className="text-xs text-gray-500">
            {episodes.length} {episodes.length === 1 ? "серія" : "серій"}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
          {visibleEpisodes.map((ep) => (
            <button
              key={ep.number}
              onClick={() => handleEpisodeChange(ep.number)}
              title={ep.title}
              className={`relative aspect-square overflow-hidden rounded-lg text-sm font-semibold transition ${
                currentEpisode === ep.number
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {ep.number}
              {currentEpisode === ep.number && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />
              )}
            </button>
          ))}
        </div>

        {episodes.length > 24 && !showAllEpisodes && (
          <button
            onClick={() => setShowAllEpisodes(true)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-zinc-800 hover:text-white"
          >
            Показати всі серії ({episodes.length})
          </button>
        )}
      </div>

      {/* Ukrainian Dub Info Card */}
      <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-zinc-900/50 to-yellow-950/30">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg ring-2 ring-white/10">
            <div className="h-full w-full">
              <div className="h-1/2 w-full bg-[#0057B7]" />
              <div className="h-1/2 w-full bg-[#FFD700]" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white sm:text-base">
              Українська озвучка від {translation.name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
              Дивіться аніме з професійним українським дубляжем у HD якості
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-gray-500">Якість</p>
            <p className="text-sm font-semibold text-green-400">HD 1080p</p>
          </div>
        </div>
      </div>
    </div>
  );
}
