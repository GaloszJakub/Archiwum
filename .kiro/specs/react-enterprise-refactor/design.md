# Design Document

## Overview

This design document outlines the comprehensive refactoring strategy for transforming the React + TypeScript movie archive application into an Enterprise Grade codebase. The refactoring will systematically address architectural patterns, type safety, component reusability, and code organization while maintaining existing functionality.

The application currently uses:
- **React 18** with functional components and hooks
- **TypeScript** (currently in loose mode)
- **Vite** as build tool
- **TanStack Query** for server state management
- **React Router** for navigation
- **Firebase** for authentication
- **Radix UI + Tailwind CSS** for UI components
- **Framer Motion** for animations
- **TMDB API** as external data source

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Pages (Smart)   │────────▶│  Layout Components│         │
│  └──────────────────┘         └──────────────────┘         │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ Feature Components│────────▶│  UI Components   │         │
│  │    (Smart)       │         │    (Dumb)        │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Custom Hooks    │────────▶│  State Management│         │
│  │                  │         │  (TanStack Query)│         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                        Service Layer                         │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  API Services    │────────▶│  Data Transformers│         │
│  │  (TMDB, Firebase)│         │                  │         │
│  └──────────────────┘         └──────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│         TMDB API  │  Firebase Auth  │  Firebase DB          │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure (Proposed)

```
src/
├── components/
│   ├── common/              # Generic reusable components
│   │   ├── Card/
│   │   ├── List/
│   │   ├── Grid/
│   │   ├── Modal/
│   │   └── ...
│   ├── features/            # Feature-specific smart components
│   │   ├── movies/
│   │   ├── series/
│   │   ├── collections/
│   │   └── ...
│   ├── layout/              # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── ...
│   └── ui/                  # Radix UI wrappers (existing)
├── hooks/
│   ├── api/                 # API-related hooks
│   ├── ui/                  # UI-related hooks
│   └── utils/               # Utility hooks
├── services/
│   ├── api/                 # API service classes
│   ├── transformers/        # Data transformation utilities
│   └── validators/          # Validation utilities
├── types/
│   ├── api/                 # API response types
│   ├── domain/              # Domain model types
│   └── ui/                  # UI-specific types
├── utils/
│   ├── formatters/
│   ├── validators/
│   └── helpers/
├── contexts/                # React contexts
├── pages/                   # Page components (smart)
└── lib/                     # Third-party integrations
```

## Components and Interfaces

### Component Classification

#### Dumb Components (Presentational)

Characteristics:
- Receive all data via props
- No business logic or API calls
- No context consumption (except theme/i18n)
- Fully typed props interfaces
- Reusable across features

Examples to create/refactor:
- `Card<T>` - Generic card component
- `List<T>` - Generic list component with virtualization
- `Grid<T>` - Generic grid layout
- `MediaCard` - Specific card for movies/series
- `InfoBadge` - Display metadata (year, rating, etc.)
- `EmptyState` - Empty state placeholder
- `LoadingState` - Loading indicator
- `ErrorState` - Error display

#### Smart Components (Container)

Characteristics:
- Handle data fetching via hooks
- Manage local UI state
- Compose dumb components
- Handle user interactions
- Connect to contexts when needed

Examples to create/refactor:
- `MovieListContainer` - Fetches and displays movies
- `SearchContainer` - Handles search logic
- `CollectionManagerContainer` - Manages collections
- `EpisodeTrackerContainer` - Tracks episode progress

### Generic Component Patterns

#### 1. Generic Card Component

```typescript
interface CardProps<T> {
  data: T;
  renderContent: (item: T) => React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
  className?: string;
  layoutId?: string;
  enableHoverEffect?: boolean;
  enable3DEffect?: boolean;
}

function Card<T>({ data, renderContent, renderActions, onClick, ... }: CardProps<T>) {
  // Implementation
}
```

#### 2. Generic List Component

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  isLoading?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  virtualized?: boolean;
  className?: string;
}

function List<T>({ items, renderItem, keyExtractor, ... }: ListProps<T>) {
  // Implementation with intersection observer for infinite scroll
}
```

#### 3. Generic Grid Component

```typescript
interface GridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

function Grid<T>({ items, renderItem, columns, ... }: GridProps<T>) {
  // Implementation with responsive columns
}
```

#### 4. Generic Modal Component

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

function Modal({ isOpen, onClose, title, children, ... }: ModalProps) {
  // Implementation using Radix Dialog
}
```

## Data Models

### Type Definitions

#### Domain Types

```typescript
// Core domain types
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

interface Movie extends MediaItem {
  type: 'movie';
  runtime: number | null;
  budget: number | null;
  revenue: number | null;
}

interface TVShow extends MediaItem {
  type: 'tv';
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: Season[];
  episodeRunTime: number[];
}

interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  overview: string;
  posterPath: string | null;
}

interface Episode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  stillPath: string | null;
  voteAverage: number;
}

interface Genre {
  id: number;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  userId: string;
  items: CollectionItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionItem {
  tmdbId: number;
  type: 'movie' | 'tv';
  addedAt: Date;
}
```

#### API Response Types

```typescript
// TMDB API response types
interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

interface TMDBMovieResponse {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  // ... other TMDB fields
}

interface TMDBTVResponse {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  // ... other TMDB fields
}
```

#### UI State Types

```typescript
interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FilterState {
  genre: number | null;
  year: number | null;
  sortBy: 'popularity' | 'rating' | 'release_date' | 'title';
  sortOrder: 'asc' | 'desc';
}
```

### Data Transformers

```typescript
// Transform TMDB API responses to domain models
class TMDBTransformer {
  static toMovie(response: TMDBMovieResponse): Movie {
    return {
      id: response.id,
      title: response.title,
      type: 'movie',
      posterPath: response.poster_path,
      backdropPath: response.backdrop_path,
      overview: response.overview,
      releaseDate: response.release_date,
      voteAverage: response.vote_average,
      voteCount: response.vote_count,
      popularity: response.popularity,
      runtime: response.runtime ?? null,
      budget: response.budget ?? null,
      revenue: response.revenue ?? null,
    };
  }

  static toTVShow(response: TMDBTVResponse): TVShow {
    // Similar transformation
  }

  static toMediaItem(response: TMDBMovieResponse | TMDBTVResponse): MediaItem {
    // Generic transformation
  }
}
```

## Styling Architecture with Tailwind CSS

### Tailwind Configuration Strategy

The application uses Tailwind CSS with a custom configuration. The styling architecture should follow these principles:

#### 1. Design Tokens and Theme

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--foreground-secondary))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other semantic colors
      },
      spacing: {
        // Consistent spacing scale
      },
      borderRadius: {
        // Consistent border radius scale
      },
    },
  },
};
```

#### 2. Component Styling Patterns

**Pattern 1: Composition with className prop**
```typescript
interface ComponentProps {
  className?: string;
  // ... other props
}

function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {/* content */}
    </div>
  );
}
```

**Pattern 2: Variant-based styling with CVA**
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}
```

**Pattern 3: Responsive Design**
```typescript
// Use Tailwind's responsive prefixes consistently
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
```

#### 3. Utility Classes Organization

- **Layout**: `flex`, `grid`, `container`
- **Spacing**: `p-*`, `m-*`, `gap-*`
- **Typography**: `text-*`, `font-*`, `leading-*`
- **Colors**: Use semantic tokens from theme
- **Effects**: `shadow-*`, `rounded-*`, `opacity-*`
- **Animations**: Use `tailwindcss-animate` for transitions

#### 4. Custom Utilities

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 5. Animation Integration

The project uses both Tailwind animations and Framer Motion:

**Tailwind Animations** (for simple transitions):
```typescript
<div className="transition-opacity duration-300 hover:opacity-80">
```

**Framer Motion** (for complex animations):
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Guidelines**:
- Use Tailwind for hover states, focus states, and simple transitions
- Use Framer Motion for page transitions, complex animations, and gestures
- Avoid mixing both for the same animation to prevent conflicts

#### 6. Dark Mode Support

```typescript
// Use Tailwind's dark mode with class strategy
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

The application uses `next-themes` for theme management, which should be integrated with Tailwind's dark mode.

### Styling Best Practices

1. **Avoid inline styles** - Use Tailwind classes
2. **Extract repeated patterns** - Create reusable components with CVA variants
3. **Use semantic color tokens** - Don't hardcode colors like `bg-blue-500`
4. **Maintain consistent spacing** - Use the spacing scale from theme
5. **Responsive by default** - Always consider mobile-first design
6. **Accessibility** - Use proper contrast ratios and focus states

## Error Handling

### Error Boundary Strategy

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Implementation with proper error logging
}
```

### API Error Handling

```typescript
// Consistent error handling in services
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// In service layer
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new APIError(
        'Failed to fetch data',
        response.status,
        'FETCH_ERROR'
      );
    }
    return response.json();
  } catch (error) {
    // Transform and rethrow
    throw transformError(error);
  }
}
```

### Form Validation

```typescript
// Using Zod for validation
import { z } from 'zod';

const movieSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  year: z.number().min(1900).max(2100).optional(),
  genre: z.number().optional(),
});

type MovieSearchInput = z.infer<typeof movieSearchSchema>;
```

## Testing Strategy

### Unit Testing

**Framework**: Vitest (recommended for Vite projects)

**What to test**:
- Utility functions (formatters, validators, transformers)
- Custom hooks (in isolation using `@testing-library/react-hooks`)
- Service layer functions
- Data transformers

**Example**:
```typescript
describe('TMDBTransformer', () => {
  it('should transform TMDB movie response to domain model', () => {
    const response = createMockTMDBResponse();
    const movie = TMDBTransformer.toMovie(response);
    
    expect(movie.id).toBe(response.id);
    expect(movie.type).toBe('movie');
    expect(movie.title).toBe(response.title);
  });
});
```

### Component Testing

**Framework**: React Testing Library

**What to test**:
- Dumb components render correctly with different props
- User interactions trigger correct callbacks
- Conditional rendering based on props
- Accessibility attributes

**Example**:
```typescript
describe('MediaCard', () => {
  it('should render movie information', () => {
    const movie = createMockMovie();
    render(<MediaCard data={movie} type="movie" />);
    
    expect(screen.getByText(movie.title)).toBeInTheDocument();
    expect(screen.getByAltText(movie.title)).toHaveAttribute('src', expect.stringContaining(movie.posterPath));
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    const movie = createMockMovie();
    render(<MediaCard data={movie} type="movie" onClick={onClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(onClick).toHaveBeenCalledWith(movie);
  });
});
```

### Integration Testing

**What to test**:
- Smart components with hooks
- Data fetching and state management
- User flows (search, filter, navigate)

### Property-Based Testing

**Framework**: fast-check (for JavaScript/TypeScript)

**What to test**:
- Generic components work with any valid data type
- Data transformers preserve invariants
- Validation functions correctly identify valid/invalid inputs

**Example**:
```typescript
import fc from 'fast-check';

describe('Generic List Component', () => {
  it('should render any array of items', () => {
    fc.assert(
      fc.property(
        fc.array(fc.anything()),
        (items) => {
          const { container } = render(
            <List
              items={items}
              renderItem={(item, index) => <div key={index}>{String(item)}</div>}
              keyExtractor={(_, index) => index}
            />
          );
          
          const renderedItems = container.querySelectorAll('div');
          expect(renderedItems.length).toBe(items.length);
        }
      )
    );
  });
});
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Analysis

After reviewing all acceptance criteria, this refactoring project is primarily focused on **code quality, architecture, and maintainability** rather than runtime behavior. The requirements are mostly:
- Organizational guidelines (file structure, naming conventions)
- Design patterns (Smart/Dumb components, composition)
- Static analysis rules (TypeScript strict mode, no `any` types)
- Documentation standards

These are **not testable as runtime properties** because they describe how code should be structured, not what it should do at runtime.

### Testable Properties

However, we can define a small set of properties for the **generic components** we'll create, as these have concrete runtime behavior:

#### Property 1: Generic List renders all items

*For any* array of items and valid render function, the List component should render exactly the same number of elements as items in the array.

**Validates: Requirements 3.2, 3.3**

#### Property 2: Generic Grid respects column configuration

*For any* array of items and column configuration, the Grid component should apply the correct CSS grid columns based on the configuration object.

**Validates: Requirements 3.2, 3.3**

#### Property 3: Type safety preservation in generic components

*For any* typed data passed to a generic component, the render function should receive items of the same type, maintaining type safety throughout.

**Validates: Requirements 1.5, 3.2**

#### Property 4: Data transformer round-trip consistency

*For any* valid TMDB API response, transforming to domain model and back should preserve all essential data fields.

**Validates: Requirements 7.5**

#### Property 5: Error boundary catches component errors

*For any* component that throws an error, wrapping it in an ErrorBoundary should prevent the error from propagating to the root and should render the fallback UI.

**Validates: Requirements 11.1**

### Note on Testing Approach

Since this is a **refactoring project** focused on code quality and architecture, the primary validation will be through:

1. **Code Review** - Manual verification of architectural patterns
2. **Static Analysis** - TypeScript compiler, ESLint rules
3. **Unit Tests** - For utility functions and transformers
4. **Component Tests** - For UI components
5. **Integration Tests** - For user flows

The properties listed above are the few runtime behaviors we can test with property-based testing. The majority of requirements will be validated through code review and static analysis during the refactoring process.

## Performance Optimization

### Memoization Strategy

```typescript
// Use React.memo for pure presentational components
export const MediaCard = React.memo<MediaCardProps>(({ data, onClick }) => {
  // Component implementation
});

// Use useMemo for expensive computations
const filteredMovies = useMemo(() => {
  return movies.filter(movie => movie.rating > 7);
}, [movies]);

// Use useCallback for event handlers passed as props
const handleClick = useCallback((id: number) => {
  navigate(`/movie/${id}`);
}, [navigate]);
```

### Code Splitting

```typescript
// Lazy load pages
const Movies = lazy(() => import('./pages/Movies'));
const Series = lazy(() => import('./pages/Series'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/movies" element={<Movies />} />
    <Route path="/series" element={<Series />} />
  </Routes>
</Suspense>
```

### Image Optimization

```typescript
// Lazy loading with native browser support
<img 
  src={posterUrl} 
  alt={title}
  loading="lazy"
  decoding="async"
/>

// Responsive images
<img
  srcSet={`
    ${tmdbService.getImageUrl(path, 'w200')} 200w,
    ${tmdbService.getImageUrl(path, 'w500')} 500w,
    ${tmdbService.getImageUrl(path, 'original')} 1000w
  `}
  sizes="(max-width: 640px) 200px, (max-width: 1024px) 500px, 1000px"
/>
```

### List Virtualization

For large lists (100+ items), implement virtualization:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedList<T>({ items, renderItem }: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Estimated item height
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Accessibility

### ARIA Attributes

```typescript
// Proper button semantics
<button
  type="button"
  aria-label="Add to collection"
  aria-pressed={isInCollection}
  onClick={handleAdd}
>
  <Plus aria-hidden="true" />
</button>

// Proper form labels
<label htmlFor="search-input">Search movies</label>
<input
  id="search-input"
  type="search"
  aria-describedby="search-help"
/>
<span id="search-help">Enter movie title or keywords</span>

// Loading states
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading movies...' : `${movies.length} movies found`}
</div>
```

### Keyboard Navigation

```typescript
// Trap focus in modals
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useFocusTrap(isOpen);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

### Focus Management

```typescript
// Restore focus after modal closes
function useRestoreFocus() {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);
  
  const restoreFocus = useCallback(() => {
    previousActiveElement.current?.focus();
  }, []);
  
  return { saveFocus, restoreFocus };
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
1. Enable TypeScript strict mode
2. Set up new directory structure
3. Create type definitions for domain models
4. Refactor service layer with proper types

### Phase 2: Generic Components (Week 3-4)
1. Create generic Card, List, Grid components
2. Create generic Modal, Dialog components
3. Implement proper TypeScript generics
4. Add comprehensive prop interfaces

### Phase 3: Feature Refactoring (Week 5-8)
1. Refactor Movies page and components
2. Refactor Series page and components
3. Refactor Collections feature
4. Extract custom hooks from components

### Phase 4: Polish & Testing (Week 9-10)
1. Add error boundaries
2. Implement performance optimizations
3. Add accessibility improvements
4. Write tests for critical paths
5. Documentation

### Backward Compatibility

During refactoring:
- Keep old components alongside new ones
- Use feature flags if needed
- Migrate page by page
- Ensure no breaking changes to user experience

