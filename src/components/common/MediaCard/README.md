# MediaCard Component

A specialized card component for displaying movies and TV shows with rich metadata and interactive features.

## Overview

`MediaCard` extends the generic `Card` component to provide movie/series-specific rendering including poster images, metadata overlays, and collection management actions.

## Features

- **Poster Display**: Automatically fetches and displays TMDB poster images with lazy loading
- **Metadata Overlay**: Shows title, year, and rating on hover
- **3D Tilt Effect**: Optional 3D perspective transform based on mouse position
- **Collection Actions**: Integrated "Add to Collection" button
- **Responsive Design**: Maintains 2:3 aspect ratio for poster images
- **Accessibility**: Proper alt text and keyboard navigation support
- **Type Safety**: Fully typed with TypeScript using domain models

## Usage

### Basic Example

```tsx
import { MediaCard } from "@/components/common/MediaCard";

function MovieGrid({ movies }: { movies: MediaItem[] }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MediaCard
          key={movie.id}
          media={movie}
          onClick={(media) => navigate(`/movie/${media.id}`)}
        />
      ))}
    </div>
  );
}
```

### With Custom Styling

```tsx
<MediaCard
  media={movie}
  onClick={handleClick}
  className="shadow-xl"
  enable3DEffect={false}
  enableHoverEffect={true}
/>
```

### Without Actions

```tsx
<MediaCard
  media={tvShow}
  showActions={false}
  onClick={handleClick}
/>
```

### With Framer Motion Layout Animation

```tsx
<MediaCard
  media={movie}
  layoutId={`movie-${movie.id}`}
  onClick={handleClick}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `media` | `MediaItem` | **required** | The media item (movie or TV show) to display |
| `onClick` | `(media: MediaItem) => void` | `undefined` | Click handler for the card |
| `showActions` | `boolean` | `true` | Whether to show the "Add to Collection" button |
| `layoutId` | `string` | `undefined` | Layout ID for Framer Motion shared layout animations |
| `className` | `string` | `undefined` | Additional CSS classes |
| `enable3DEffect` | `boolean` | `true` | Enable 3D tilt effect on hover |
| `enableHoverEffect` | `boolean` | `true` | Enable scale effect on hover |

## Composition

MediaCard is built using:
- **Card**: Generic card component for structure and animations
- **AddToCollectionButton**: Action button for collection management
- **TMDB Image API**: For poster images

## Styling

The component uses Tailwind CSS with the following key classes:
- `aspect-[2/3]`: Maintains poster aspect ratio
- `group`: Enables group hover effects
- `opacity-0 group-hover:opacity-100`: Reveals overlay on hover
- `bg-gradient-to-t from-black/80`: Creates readable text overlay

## Accessibility

- Proper `alt` text for poster images
- Keyboard navigation support (inherited from Card)
- Lazy loading for performance
- Async decoding for images

## Performance

- **Lazy Loading**: Images load only when visible
- **Async Decoding**: Non-blocking image decoding
- **Memoization**: Can be wrapped with `React.memo` for list optimization
- **Placeholder**: Shows placeholder for missing posters

## Related Components

- `Card`: Generic card component
- `AddToCollectionButton`: Collection management button
- `Grid`: For laying out multiple MediaCards
- `List`: Alternative layout component

## Type Safety

MediaCard uses the `MediaItem` domain type which is a union of `Movie` and `TVShow`:

```typescript
interface MediaItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
}
```

## Migration from MovieCard

If you're migrating from the old `MovieCard` component:

**Before:**
```tsx
<MovieCard
  id={movie.id.toString()}
  title={movie.title}
  posterUrl={posterUrl}
  year={year}
  rating={rating}
  tmdbId={movie.id}
  type="movie"
/>
```

**After:**
```tsx
<MediaCard
  media={movie}
  onClick={(media) => handleClick(media)}
/>
```

The new component:
- Uses domain types instead of primitive props
- Handles image URLs internally
- Extracts year from releaseDate automatically
- Supports both movies and TV shows with a single component
