"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Loader2,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";

interface HlsPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

export default function HlsPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  onEnded,
  onError,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [qualities, setQualities] = useState<{ height: number; level: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsLoading(true);

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = src.includes(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const levels = data.levels.map((level, idx) => ({
          height: level.height,
          level: idx,
        }));
        setQualities(levels);
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              onError?.("Помилка відтворення відео");
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    } else {
      // Direct MP4 or other format
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, onError]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "arrowright":
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case "arrowup":
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  }, [duration]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    video.muted = newVolume === 0;
  }, []);

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  }, []);

  const changeQuality = useCallback((level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentQuality(level);
      setShowQualityMenu(false);
    }
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "VIDEO") {
          togglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        className="h-full w-full"
        crossOrigin="anonymous"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
      )}

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
          aria-label="Відтворити"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-2xl transition hover:scale-110">
            <Play className="ml-1 h-10 w-10 fill-black text-black" />
          </div>
        </button>
      )}

      {/* Title (top) */}
      {title && showControls && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300">
          <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
        </div>
      )}

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 transition-opacity duration-300 sm:p-4 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          className="group/progress mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20 hover:h-2"
          onClick={handleSeek}
        >
          <div
            className="absolute h-full rounded-full bg-white/30"
            style={{ width: `${bufferedPercent}%` }}
          />
          <div
            className="relative h-full rounded-full bg-red-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-red-600 opacity-0 group-hover/progress:opacity-100" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20"
            aria-label={isPlaying ? "Пауза" : "Відтворити"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white" />
            )}
          </button>

          {/* Skip Backward */}
          <button
            onClick={() => skip(-10)}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 sm:flex"
            aria-label="Назад на 10 секунд"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Skip Forward */}
          <button
            onClick={() => skip(10)}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20 sm:flex"
            aria-label="Вперед на 10 секунд"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Volume */}
          <div className="group/volume flex items-center">
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20"
              aria-label={isMuted ? "Увімкнути звук" : "Вимкнути звук"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="hidden h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/30 transition-all duration-300 group-hover/volume:w-20 sm:block"
              style={{
                backgroundImage: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>

          {/* Time */}
          <div className="ml-1 select-none text-xs font-medium text-white sm:text-sm">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-1 text-white/60">/</span>
            <span className="text-white/80">{formatTime(duration)}</span>
          </div>

          <div className="flex-1" />

          {/* Quality Selector */}
          {qualities.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="flex h-9 items-center gap-1 rounded-full px-3 text-xs font-medium text-white transition hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {currentQuality === -1
                    ? "Авто"
                    : `${qualities[currentQuality]?.height}p`}
                </span>
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 min-w-[120px] overflow-hidden rounded-lg bg-black/95 py-1 shadow-2xl ring-1 ring-white/10">
                  <button
                    onClick={() => changeQuality(-1)}
                    className={`block w-full px-4 py-2 text-left text-xs transition hover:bg-white/10 ${
                      currentQuality === -1 ? "text-red-500" : "text-white"
                    }`}
                  >
                    Авто
                  </button>
                  {qualities
                    .slice()
                    .reverse()
                    .map((q) => (
                      <button
                        key={q.level}
                        onClick={() => changeQuality(q.level)}
                        className={`block w-full px-4 py-2 text-left text-xs transition hover:bg-white/10 ${
                          currentQuality === q.level ? "text-red-500" : "text-white"
                        }`}
                      >
                        {q.height}p
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/20"
            aria-label={isFullscreen ? "Вийти з повного екрану" : "Повний екран"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
