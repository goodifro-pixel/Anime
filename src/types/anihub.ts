// AniHub API Response Types

export interface AniHubEpisode {
  id: number;
  number: number;
  title: string | null;
  player_url: string;
  hls_url?: string;
  thumbnail?: string;
  duration?: number;
  released_at?: string;
}

export interface AniHubTranslation {
  id: number;
  title: string;
  type: "voice" | "subtitles";
  team: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface AniHubPlayer {
  url: string;
  embed_url: string;
  episodes: AniHubEpisode[];
  translations: AniHubTranslation[];
}

export interface AniHubGenre {
  id: number;
  name: string;
  slug: string;
}

export interface AniHubStudio {
  id: number;
  name: string;
}

export interface AniHubAnime {
  id: number;
  title: string;
  title_ua?: string;
  title_en?: string;
  title_ja?: string;
  slug: string;
  description?: string;
  description_ua?: string;
  poster?: string;
  banner?: string;
  status: "ongoing" | "released" | "anons";
  type: "tv" | "movie" | "ova" | "ona" | "special";
  episodes_count?: number;
  episodes_aired?: number;
  score?: number;
  year?: number;
  season?: string;
  rating?: string;
  duration?: number;
  genres?: AniHubGenre[];
  studios?: AniHubStudio[];
  player?: AniHubPlayer;
  shikimori_id?: number;
  mal_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AniHubApiResponse {
  data: AniHubAnime;
  success: boolean;
  message?: string;
}

export interface AniHubSearchResponse {
  data: AniHubAnime[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  success: boolean;
}

// Proxy API Response
export interface AnimePlayerData {
  id: number;
  title: string;
  title_ua?: string;
  poster?: string;
  episodes: {
    number: number;
    title: string | null;
    player_url: string;
  }[];
  translations: {
    id: number;
    name: string;
    type: string;
  }[];
  total_episodes: number;
  source: "anihub" | "fallback";
}
