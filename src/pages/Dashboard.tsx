import { Star } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import {
  usePopularMovies,
  usePopularTVShows,
  useTrendingMovies,
} from "@/hooks/useTMDB";
import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import { useAuth } from "@/contexts/AuthContext";
import { tmdbService } from "@/lib/tmdb";
import { useMemo } from "react";

// Design tokens
const A = {
  bg: "#0a0a0c",
  surface: "#14141a",
  surface2: "#1c1c23",
  border: "rgba(255,248,230,0.06)",
  border2: "rgba(255,248,230,0.10)",
  text: "#f3efe6",
  text2: "#b8b1a3",
  muted: "#847d6f",
  subtle: "#58524a",
  amber: "#d4a056",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: popularMoviesData } = usePopularMovies();
  const { data: popularTVData } = usePopularTVShows();
  const { data: recentlyWatched } = useRecentlyWatched();
  const { data: trendingData } = useTrendingMovies();
  const { user } = useAuth();

  const popularMovies = popularMoviesData?.pages[0]?.results.slice(0, 6) || [];
  const popularTV = popularTVData?.pages[0]?.results.slice(0, 6) || [];

  // Pick a trending movie for the hero
  const heroMovie = useMemo(() => {
    if (trendingData?.results?.length) {
      const withBackdrop = trendingData.results.filter(
        (m: { backdrop_path?: string }) => m.backdrop_path,
      );
      return withBackdrop[0] || null;
    }
    return null;
  }, [trendingData]);

  const genres = [
    { name: "Dramat", id: 18 },
    { name: "Sci-Fi", id: 878 },
    { name: "Komedia", id: 35 },
    { name: "Dokument", id: 99 },
    { name: "Animacja", id: 16 },
    { name: "Thriller", id: 53 },
  ];

  return (
    <div
      style={{
        fontFamily:
          '"Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        paddingBottom: 100,
      }}
    >
      {/* ═══ HERO ═══ */}
      {heroMovie && (
        <div style={{ position: "relative", height: 520, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${tmdbService.getImageUrl(heroMovie.backdrop_path, "original")})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, ${A.bg} 0%, rgba(10,10,12,0.6) 50%, rgba(10,10,12,0.2) 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0) 30%, rgba(10,10,12,0) 60%, ${A.bg} 100%)`,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "80px 20px",
              maxWidth: 640,
            }}
            className="sm:px-14"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <span style={{ width: 24, height: 1, background: A.amber }} />
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: A.amber,
                  fontWeight: 600,
                }}
              >
                POPULARNE
              </span>
              <span style={{ color: A.subtle, fontSize: 11 }}>·</span>
              <span
                style={{ fontSize: 11, color: A.muted, letterSpacing: "0.1em" }}
              >
                {heroMovie.media_type === "movie" ? "FILM" : "SERIAL"} ·{" "}
                {heroMovie.release_date?.slice(0, 4) ||
                  heroMovie.first_air_date?.slice(0, 4)}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: '"Instrument Serif", "Times New Roman", serif',
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 8vw, 72px)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: A.text,
              }}
            >
              {heroMovie.title || heroMovie.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginTop: 22,
                fontSize: 13,
                color: A.text2,
              }}
            >
              <span>
                {heroMovie.release_date?.slice(0, 4) ||
                  heroMovie.first_air_date?.slice(0, 4)}
              </span>
              <span style={{ color: A.subtle }}>·</span>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <Star size={12} fill={A.amber} color={A.amber} />
                <span style={{ color: A.amber, fontWeight: 500 }}>
                  {heroMovie.vote_average?.toFixed(1)}
                </span>
              </span>
            </div>

            <p
              style={{
                margin: "22px 0 0",
                color: A.text2,
                fontSize: 15,
                lineHeight: 1.55,
                maxWidth: 540,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {heroMovie.overview}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              <button
                onClick={() =>
                  navigate(
                    heroMovie.media_type === "movie"
                      ? `/movie/${heroMovie.id}`
                      : `/series/${heroMovie.id}`,
                  )
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "14px 28px",
                  background: "rgba(10, 10, 12, 0.65)",
                  fontSize: 12,
                  fontFamily: '"JetBrains Mono", monospace',
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
                className="text-[#f3efe6] border border-[rgba(255,248,230,0.06)] hover:text-[#d4a056]  active:scale-[0.98]"
              >
                WIĘCEJ INFORMACJI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONTINUE WATCHING ═══ */}
      {recentlyWatched && recentlyWatched.length > 0 && (
        <section
          style={{
            padding: "0 20px",
            marginTop: heroMovie ? -20 : 40,
            position: "relative",
            zIndex: 3,
          }}
          className="sm:px-14"
        >
          <SectionHeader
            title="Kontynuuj oglądanie"
            subtitle="Wróć tam, gdzie skończyłeś"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentlyWatched.map((item) => (
              <PosterCard
                key={item.tmdbId}
                title={item.name}
                posterPath={item.posterPath}
                subtitle={
                  item.lastEpisode
                    ? `S${item.lastEpisode.seasonNumber} · E${String(item.lastEpisode.episodeNumber).padStart(2, "0")}`
                    : undefined
                }
                onClick={() =>
                  navigate(`/series/${item.tmdbId}`, {
                    state: {
                      initialSeason: item.lastEpisode?.seasonNumber,
                      initialEpisode: item.lastEpisode?.episodeNumber,
                    },
                  })
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══ POPULAR MOVIES ═══ */}
      {
        <section
          style={{ padding: "0 20px", marginTop: 48 }}
          className="sm:px-14"
        >
          <SectionHeader
            title="Popularne filmy"
            subtitle="Najczęściej oglądane w tym tygodniu"
            actionLabel="Pokaż wszystko →"
            onAction={() => navigate("/movies")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularMovies.map((movie) => (
              <PosterCard
                key={movie.id}
                title={movie.title || movie.name || ''}
                posterPath={movie.poster_path}
                subtitle={`Film · ${movie.release_date?.slice(0, 4)}`}
                rating={movie.vote_average}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        </section>
      }

      {/* ═══ POPULAR TV ═══ */}
      {
        <section
          style={{ padding: "0 20px", marginTop: 48 }}
          className="sm:px-14"
        >
          <SectionHeader
            title="Popularne seriale"
            subtitle="Seriale, które warto nadrobić"
            actionLabel="Pokaż wszystko →"
            onAction={() => navigate("/series")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularTV.map((show) => (
              <PosterCard
                key={show.id}
                title={show.name || show.title || ''}
                posterPath={show.poster_path}
                subtitle={`Serial · ${show.first_air_date?.slice(0, 4)}`}
                rating={show.vote_average}
                onClick={() => navigate(`/series/${show.id}`)}
              />
            ))}
          </div>
        </section>
      }

      {/* ═══ GENRES ═══ */}
      {
        <section style={{ padding: "48px 20px 64px" }} className="sm:px-14">
          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.018em",
              color: A.text,
            }}
          >
            Przeglądaj według gatunku
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {genres.map((genre) => (
              <div
                key={genre.name}
                onClick={() => navigate(`/movies?genre=${genre.id}`)}
                className="group transition-all duration-300 hover:border-[#d4a056]"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 0,
                  height: 96,
                  border: `1px solid ${A.border}`,
                  cursor: "pointer",
                  background:
                    "linear-gradient(160deg, #1a1d26 0%, #2c2418 60%, #14161c 100%)",
                }}
              >
                <div
                  className="transition-opacity duration-500 group-hover:opacity-0"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(120deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.3) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    className="transition-all duration-300 group-hover:text-[#d4a056] group-hover:translate-x-2"
                    style={{
                      fontFamily: '"Instrument Serif", serif',
                      fontStyle: "italic",
                      fontSize: 22,
                      color: A.text,
                      lineHeight: 1,
                    }}
                  >
                    {genre.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      }
    </div>
  );
};

// ─── Shared sub-components ───

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 18,
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            color: "#f3efe6",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <div style={{ fontSize: 12, color: "#847d6f", marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </div>
      {actionLabel && (
        <span
          onClick={onAction}
          className="text-[#847d6f] hover:text-[#d4a056] transition-colors duration-200"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </span>
      )}
    </div>
  );
}

function PosterCard({
  title,
  posterPath,
  subtitle,
  rating,
  onClick,
}: {
  title: string;
  posterPath: string | null;
  subtitle?: string;
  rating?: number;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }} className="group">
      <div className="relative">
        {/* Brutalist Hard Shadow */}
        <div className="absolute inset-0 bg-[#d4a056] opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all duration-300 ease-out" />

        <div
          className="relative z-10 transition-transform duration-300 ease-out group-hover:-translate-x-[1px] group-hover:-translate-y-[1px] bg-[#0a0a0c]"
          style={{
            overflow: "hidden",
            border: "1px solid rgba(255,248,230,0.06)",
          }}
        >
          <img
            src={tmdbService.getImageUrl(posterPath)}
            alt={title}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              objectFit: "cover",
              display: "block",
            }}
            className="transition-all duration-500 group-hover:grayscale-[30%] group-hover:contrast-110"
            loading="lazy"
          />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div
          className="transition-colors duration-300 group-hover:text-[#d4a056]"
          style={{
            fontFamily: '"Inter Tight", sans-serif',
            fontWeight: 500,
            fontSize: 14,
            color: "#f3efe6",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {(subtitle || rating) && (
          <div
            style={{
              fontSize: 11,
              color: "#847d6f",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {subtitle && <span>{subtitle}</span>}
            {rating && (
              <>
                <span style={{ color: "#58524a" }}>·</span>
                <span
                  style={{
                    color: "#d4a056",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  <Star size={10} fill="#d4a056" color="#d4a056" />
                  {rating.toFixed(1)}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
