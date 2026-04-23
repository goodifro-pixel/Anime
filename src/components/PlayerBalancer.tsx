"use client";

import { useState, useEffect } from "react";

interface VoiceTeam {
  id: string;
  name: string;
  type: "ukr" | "sub";
  label: string;
}

interface PlayerSource {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const VOICE_TEAMS: VoiceTeam[] = [
  { id: "anitube", name: "AniTube UA", type: "ukr", label: "Укр. дубляж" },
  { id: "uadub", name: "UADub", type: "ukr", label: "Укр. дубляж" },
  { id: "hikka", name: "Hikka", type: "ukr", label: "Укр. дубляж" },
  { id: "aniua", name: "AniUA", type: "ukr", label: "Укр. дубляж" },
  { id: "animeua", name: "AnimeUA", type: "ukr", label: "Укр. дубляж" },
  { id: "fanvox", name: "FanVox", type: "ukr", label: "Укр. дубляж" },
  { id: "sub_ukr", name: "Укр. субтитри", type: "sub", label: "Субтитри" },
];

const PLAYER_SOURCES: PlayerSource[] = [
  { id: "kodik", name: "Kodik", icon: "K", color: "#6366f1" },
  { id: "ashdi", name: "Ashdi", icon: "A", color: "#22c55e" },
  { id: "aniboom", name: "Aniboom", icon: "B", color: "#f97316" },
  { id: "moonanime", name: "MoonAnime", icon: "M", color: "#8b5cf6" },
];

interface PlayerBalancerProps {
  malId: number;
  title: string;
  youtubeId?: string | null;
}

export default function PlayerBalancer({
  malId,
  title,
  youtubeId,
}: PlayerBalancerProps) {
  const [selectedVoice, setSelectedVoice] = useState<VoiceTeam>(VOICE_TEAMS[0]);
  const [selectedSource, setSelectedSource] = useState<PlayerSource>(PLAYER_SOURCES[0]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedSource, selectedVoice, selectedEpisode]);

  useEffect(() => {
    setIsLoading(true);
  }, [selectedSource, selectedVoice, selectedEpisode]);

  const ukrainianVoices = VOICE_TEAMS.filter((v) => v.type === "ukr");
  const subtitleVoices = VOICE_TEAMS.filter((v) => v.type === "sub");

  return (
    <div className="space-y-4">
      {/* Voice Team & Source Selector */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Voice Team Dropdown */}
        <div className="relative">
          <button
            onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-bg-border bg-bg-soft px-4 py-2.5 text-sm font-medium text-white transition hover:bg-bg-card"
          >
            <MicIcon className="h-4 w-4 text-brand" />
            <span>{selectedVoice.name}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
          
          {voiceDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setVoiceDropdownOpen(false)} 
              />
              <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-bg-border bg-bg-card p-2 shadow-xl">
                <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Українська озвучка
                </div>
                {ukrainianVoices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => {
                      setSelectedVoice(voice);
                      setVoiceDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedVoice.id === voice.id
                        ? "bg-brand/20 text-brand"
                        : "text-gray-300 hover:bg-bg-soft hover:text-white"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      selectedVoice.id === voice.id ? "bg-brand/30" : "bg-bg-soft"
                    }`}>
                      <MicIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-xs text-gray-500">{voice.label}</div>
                    </div>
                    {selectedVoice.id === voice.id && (
                      <CheckIcon className="ml-auto h-4 w-4" />
                    )}
                  </button>
                ))}
                
                <div className="mb-2 mt-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Субтитри
                </div>
                {subtitleVoices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => {
                      setSelectedVoice(voice);
                      setVoiceDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedVoice.id === voice.id
                        ? "bg-brand/20 text-brand"
                        : "text-gray-300 hover:bg-bg-soft hover:text-white"
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      selectedVoice.id === voice.id ? "bg-brand/30" : "bg-bg-soft"
                    }`}>
                      <SubtitleIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-xs text-gray-500">{voice.label}</div>
                    </div>
                    {selectedVoice.id === voice.id && (
                      <CheckIcon className="ml-auto h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Player Source Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-bg-border bg-bg-soft p-1">
          {PLAYER_SOURCES.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                selectedSource.id === source.id
                  ? "bg-bg-card text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white"
                style={{ backgroundColor: source.color }}
              >
                {source.icon}
              </span>
              <span className="hidden sm:inline">{source.name}</span>
            </button>
          ))}
        </div>

        {/* Trailer Button */}
        {youtubeId && (
          <button
            onClick={() => setShowTrailer(!showTrailer)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              showTrailer
                ? "border-red-500/50 bg-red-500/20 text-red-400"
                : "border-bg-border bg-bg-soft text-gray-300 hover:bg-bg-card hover:text-white"
            }`}
          >
            <PlayIcon className="h-4 w-4" />
            Трейлер
          </button>
        )}
      </div>

      {/* Player Area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-bg-border bg-black">
        {showTrailer && youtubeId ? (
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <>
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
                  <div className="text-sm text-gray-400">
                    Завантаження плеєра...
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/20">
                  <PlayIcon className="h-10 w-10 text-brand" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                <p className="mb-1 text-sm text-gray-300">
                  Серія {selectedEpisode} / {selectedVoice.name}
                </p>
                <p className="mb-6 text-xs text-gray-500">
                  Плеєр: {selectedSource.name}
                </p>
                
                <div className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-soft/80 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20">
                    <InfoIcon className="h-5 w-5 text-brand" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Демо-режим</div>
                    <div className="text-xs text-gray-400">
                      Для реального перегляду підключіть API джерела
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Episode Selector */}
      {!showTrailer && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Серії</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Серія {selectedEpisode} з {totalEpisodes}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(totalEpisodes, 24) }, (_, i) => i + 1).map(
              (ep) => (
                <button
                  key={ep}
                  onClick={() => setSelectedEpisode(ep)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                    selectedEpisode === ep
                      ? "bg-brand text-white shadow-glow"
                      : "bg-bg-soft text-gray-300 hover:bg-bg-card hover:text-white"
                  }`}
                >
                  {ep}
                </button>
              )
            )}
            {totalEpisodes > 24 && (
              <button className="flex h-10 items-center rounded-lg bg-bg-soft px-3 text-sm text-gray-400 hover:bg-bg-card hover:text-white">
                +{totalEpisodes - 24} ще
              </button>
            )}
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20">
          <UkraineFlagIcon className="h-4 w-4" />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium text-white">
            Українська озвучка
          </div>
          <p className="text-xs text-gray-400">
            Контент озвучено студією <span className="text-brand">{selectedVoice.name}</span>.
            Ви підтримуєте українську локалізацію аніме.
          </p>
        </div>
      </div>
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function SubtitleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <path d="M7 15h4" />
      <path d="M13 15h4" />
      <path d="M7 11h2" />
      <path d="M13 11h4" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function UkraineFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect x="2" y="4" width="20" height="8" fill="#0057B7" rx="1" />
      <rect x="2" y="12" width="20" height="8" fill="#FFD700" rx="1" />
    </svg>
  );
}
