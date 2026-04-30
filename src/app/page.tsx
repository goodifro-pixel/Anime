import {
  getSeasonNow,
  getTopAnime,
  getUpcoming,
  searchAnime,
} from "@/lib/jikan";
import HeroCarousel from "@/components/HeroCarousel";
import Section from "@/components/Section";
import HScroll from "@/components/HScroll";
import AnimeCard from "@/components/AnimeCard";

export const revalidate = 1800;

export default async function HomePage() {
  const [hero, ongoing, season, top, upcoming] = await Promise.all([
    searchAnime({ status: "airing", order_by: "popularity", sort: "asc", limit: 6 }).then(r => r.data).catch(() => []),
    searchAnime({ status: "airing", order_by: "start_date", sort: "desc", limit: 20 }).then(r => r.data).catch(() => []),
    getSeasonNow(24).catch(() => []),
    getTopAnime("bypopularity", 24).catch(() => []),
    getUpcoming(24).catch(() => []),
  ]);

  return (
    <>
      {hero && hero.length ? <HeroCarousel items={hero} /> : null}

      <Section
        title="Новинки аніме"
        subtitle="Аніме з активними випусками нових серій"
        href="/ongoing"
        hrefLabel="Переглянути всі активні"
      >
        <HScroll>
          {(ongoing ?? []).map((a) => (
            <AnimeCard key={a.mal_id} anime={a} badge="NEW" />
          ))}
        </HScroll>
      </Section>

      <Section
        title="Популярне цього сезону"
        subtitle="Популярне цього сезону"
        href="/anime?status=airing"
        hrefLabel="Всі сезонні аніме"
      >
        <HScroll>
          {(season ?? []).map((a) => (
            <AnimeCard key={a.mal_id} anime={a} />
          ))}
        </HScroll>
      </Section>

      <Section
        title="Топ за популярністю"
        subtitle="Найпопулярніші аніме за весь час"
        href="/top-rated"
        hrefLabel="Топ-100"
      >
        <HScroll>
          {(top ?? []).map((a) => (
            <AnimeCard key={a.mal_id} anime={a} />
          ))}
        </HScroll>
      </Section>

      <Section
        title="Анонсовані аніме"
        subtitle="Найочікуваніші анонси наступного сезону"
        href="/anime?status=upcoming"
        hrefLabel="Всі анонси"
      >
        <HScroll>
          {(upcoming ?? []).map((a) => (
            <AnimeCard key={a.mal_id} anime={a} badge="АНОНС" />
          ))}
        </HScroll>
      </Section>
    </>
  );
}
