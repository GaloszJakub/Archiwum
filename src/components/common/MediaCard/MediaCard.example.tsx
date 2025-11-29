/**
 * MediaCard Component Examples
 * 
 * This file demonstrates various usage patterns for the MediaCard component.
 */

import { MediaCard } from "./MediaCard";
import { type MediaItem, type Movie, type TVShow } from "@/types/domain/media";

// Example movie data
const exampleMovie: Movie = {
  id: 550,
  title: "Fight Club",
  type: "movie",
  posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdropPath: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
  releaseDate: "1999-10-15",
  voteAverage: 8.4,
  voteCount: 26280,
  popularity: 61.416,
  runtime: 139,
  budget: 63000000,
  revenue: 100853753,
};

// Example TV show data
const exampleTVShow: TVShow = {
  id: 1396,
  title: "Breaking Bad",
  type: "tv",
  posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  backdropPath: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
  overview: "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live.",
  releaseDate: "2008-01-20",
  voteAverage: 8.9,
  voteCount: 12345,
  popularity: 234.567,
  numberOfSeasons: 5,
  numberOfEpisodes: 62,
  seasons: [],
  episodeRunTime: [45, 47],
};

/**
 * Example 1: Basic MediaCard with movie
 */
export function BasicMovieExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleMovie}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 2: MediaCard with TV show
 */
export function BasicTVShowExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleTVShow}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 3: MediaCard without actions
 */
export function NoActionsExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleMovie}
        showActions={false}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 4: MediaCard with custom styling
 */
export function CustomStyledExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleMovie}
        className="shadow-2xl ring-2 ring-primary"
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 5: MediaCard without 3D effect
 */
export function No3DEffectExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleMovie}
        enable3DEffect={false}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 6: Grid of MediaCards
 */
export function GridExample() {
  const mediaItems: MediaItem[] = [
    exampleMovie,
    exampleTVShow,
    { ...exampleMovie, id: 551, title: "Another Movie" },
    { ...exampleTVShow, id: 1397, title: "Another Show" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {mediaItems.map((media) => (
        <MediaCard
          key={media.id}
          media={media}
          onClick={(media) => console.log("Clicked:", media.title)}
        />
      ))}
    </div>
  );
}

/**
 * Example 7: MediaCard with Framer Motion layout animation
 */
export function LayoutAnimationExample() {
  return (
    <div className="w-48">
      <MediaCard
        media={exampleMovie}
        layoutId={`movie-${exampleMovie.id}`}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 8: MediaCard with missing poster (shows placeholder)
 */
export function MissingPosterExample() {
  const movieWithoutPoster: Movie = {
    ...exampleMovie,
    posterPath: null,
  };

  return (
    <div className="w-48">
      <MediaCard
        media={movieWithoutPoster}
        onClick={(media) => console.log("Clicked:", media.title)}
      />
    </div>
  );
}

/**
 * Example 9: Interactive demo with all features
 */
export function InteractiveDemoExample() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Movie Card</h2>
        <div className="w-48">
          <MediaCard
            media={exampleMovie}
            onClick={(media) => alert(`Clicked: ${media.title}`)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">TV Show Card</h2>
        <div className="w-48">
          <MediaCard
            media={exampleTVShow}
            onClick={(media) => alert(`Clicked: ${media.title}`)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Without Actions</h2>
        <div className="w-48">
          <MediaCard
            media={exampleMovie}
            showActions={false}
            onClick={(media) => alert(`Clicked: ${media.title}`)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Grid Layout</h2>
        <GridExample />
      </div>
    </div>
  );
}
