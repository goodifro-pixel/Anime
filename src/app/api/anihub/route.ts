import { NextRequest, NextResponse } from "next/server";
import type { AniHubAnime, AnimePlayerData } from "@/types/anihub";

const ANIHUB_API_BASE = "https://api.anihub.in.ua";

// Cache for API responses (in-memory, resets on server restart)
const cache = new Map<string, { data: AnimePlayerData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchFromAniHub(id: string): Promise<AniHubAnime | null> {
  try {
    const response = await fetch(`${ANIHUB_API_BASE}/anime/${id}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AniHub-Clone/1.0",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error(`[v0] AniHub API error: ${response.status}`);
      return null;
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("[v0] AniHub fetch error:", error);
    return null;
  }
}

// Search by MAL ID or Shikimori ID
async function searchByExternalId(malId: string): Promise<AniHubAnime | null> {
  try {
    // Try searching by shikimori_id (which often matches MAL ID)
    const response = await fetch(
      `${ANIHUB_API_BASE}/anime?shikimori_id=${malId}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AniHub-Clone/1.0",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) return null;

    const result = await response.json();
    const animeList = result.data || result;
    
    if (Array.isArray(animeList) && animeList.length > 0) {
      return animeList[0];
    }
    
    return null;
  } catch (error) {
    console.error("[v0] AniHub search error:", error);
    return null;
  }
}

// Generate fallback Kodik player URL
function generateKodikUrl(malId: string, episode: number = 1): string {
  return `https://kodik.biz/find-player?shikimoriID=${malId}&translation_id=609&only_translations=true&episode=${episode}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const malId = searchParams.get("mal_id");
  const episode = searchParams.get("episode") || "1";

  if (!id && !malId) {
    return NextResponse.json(
      { error: "ID параметр обов'язковий", success: false },
      { status: 400 }
    );
  }

  const cacheKey = `${id || malId}-${episode}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...cached.data, cached: true, success: true });
  }

  let animeData: AniHubAnime | null = null;

  // Try direct ID first
  if (id) {
    animeData = await fetchFromAniHub(id);
  }

  // If not found, try searching by MAL ID
  if (!animeData && malId) {
    animeData = await searchByExternalId(malId);
  }

  // If still not found, try the provided ID as MAL ID
  if (!animeData && id) {
    animeData = await searchByExternalId(id);
  }

  // If AniHub data found, format and return
  if (animeData) {
    const playerData: AnimePlayerData = {
      id: animeData.id,
      title: animeData.title,
      title_ua: animeData.title_ua,
      poster: animeData.poster,
      episodes: animeData.player?.episodes?.map((ep) => ({
        number: ep.number,
        title: ep.title,
        player_url: ep.player_url,
      })) || [],
      translations: animeData.player?.translations?.map((t) => ({
        id: t.id,
        name: t.team?.name || t.title,
        type: t.type,
      })) || [],
      total_episodes: animeData.episodes_count || animeData.episodes_aired || 12,
      source: "anihub",
    };

    // If no episodes from AniHub, provide Kodik fallback
    if (playerData.episodes.length === 0) {
      const totalEps = playerData.total_episodes || 12;
      playerData.episodes = Array.from({ length: totalEps }, (_, i) => ({
        number: i + 1,
        title: `Серія ${i + 1}`,
        player_url: generateKodikUrl(malId || id || String(animeData!.shikimori_id), i + 1),
      }));
      playerData.source = "fallback";
    }

    // Cache the response
    cache.set(cacheKey, { data: playerData, timestamp: Date.now() });

    return NextResponse.json({ ...playerData, success: true });
  }

  // Fallback: Return Kodik player URLs
  const fallbackId = malId || id || "0";
  const totalEpisodes = 12; // Default

  const fallbackData: AnimePlayerData = {
    id: parseInt(fallbackId, 10) || 0,
    title: "Аніме",
    episodes: Array.from({ length: totalEpisodes }, (_, i) => ({
      number: i + 1,
      title: `Серія ${i + 1}`,
      player_url: generateKodikUrl(fallbackId, i + 1),
    })),
    translations: [
      { id: 609, name: "AniTube UA", type: "voice" },
    ],
    total_episodes: totalEpisodes,
    source: "fallback",
  };

  // Cache fallback too
  cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });

  return NextResponse.json({ ...fallbackData, success: true });
}
