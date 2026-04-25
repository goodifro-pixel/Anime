/**
 * Video Sources for Anime Player
 *
 * Working HLS streams (CDN-hosted, public domain test content).
 * In production, swap these for real anime URLs from Kodik/Ashdi/AniHub APIs.
 *
 * Each entry represents an episode with its HLS manifest and metadata.
 */

export interface VideoStream {
  url: string;
  type: "hls" | "mp4" | "iframe";
  quality?: string;
}

export interface DemoEpisode {
  number: number;
  title: string;
  duration: string;
  poster: string;
  streams: {
    hls: VideoStream;
    mp4?: VideoStream;
  };
}

/**
 * Public domain HLS test streams that always work.
 * These are CDN-hosted by Mux, Apple, and Akamai for testing.
 */
export const DEMO_HLS_STREAMS = [
  {
    name: "Tears of Steel",
    hls: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://mango.blender.org/wp-content/gallery/4k-renders/01_thom_celia_bridge.jpg",
    duration: "12:14",
  },
  {
    name: "Big Buck Bunny",
    hls: "https://test-streams.mux.dev/test_001/stream.m3u8",
    mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
    duration: "9:56",
  },
  {
    name: "Sintel",
    hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    poster: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Sintel_poster.jpg",
    duration: "14:48",
  },
  {
    name: "Apple HLS Bipbop",
    hls: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8",
    mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    duration: "10:54",
  },
  {
    name: "Mux Test Pattern",
    hls: "https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8",
    mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    duration: "0:30",
  },
];

/**
 * Generate demo episodes based on anime ID.
 * Distributes available demo streams across episodes deterministically.
 */
export function generateDemoEpisodes(
  malId: number,
  totalEpisodes: number,
  defaultPoster?: string
): DemoEpisode[] {
  const count = Math.min(totalEpisodes, 50);
  return Array.from({ length: count }, (_, i) => {
    // Use anime ID + episode number to pick a stream deterministically
    const streamIndex = (malId + i) % DEMO_HLS_STREAMS.length;
    const stream = DEMO_HLS_STREAMS[streamIndex];

    return {
      number: i + 1,
      title: `Серія ${i + 1}`,
      duration: stream.duration,
      poster: defaultPoster || stream.poster,
      streams: {
        hls: { url: stream.hls, type: "hls" as const, quality: "auto" },
        mp4: stream.mp4
          ? { url: stream.mp4, type: "mp4" as const, quality: "720p" }
          : undefined,
      },
    };
  });
}

/**
 * Production iframe sources (Kodik, Ashdi, etc.)
 * These work in production but may be blocked in dev/sandbox environments.
 */
export const IFRAME_SOURCES = {
  kodik: (malId: number, episode: number) =>
    `https://kodik.biz/find-player?shikimoriID=${malId}&translation_id=609&only_translations=true&episode=${episode}`,
  ashdi: (malId: number, episode: number) =>
    `https://ashdi.vip/serial/${malId}?episode=${episode}&dub=ua`,
  aniboom: (malId: number, episode: number) =>
    `https://aniboom.com/embed/${malId}?episode=${episode}`,
};

/**
 * Available translation/dub options (Ukrainian voice acting studios)
 */
export const UKRAINIAN_TRANSLATIONS = [
  { id: 609, name: "AniTube UA", type: "voice" as const, popular: true },
  { id: 610, name: "UADub", type: "voice" as const, popular: true },
  { id: 611, name: "Hikka.io", type: "voice" as const, popular: false },
  { id: 612, name: "AniUA", type: "voice" as const, popular: false },
  { id: 613, name: "AnimeUA", type: "voice" as const, popular: false },
  { id: 614, name: "FanVox", type: "voice" as const, popular: false },
];
