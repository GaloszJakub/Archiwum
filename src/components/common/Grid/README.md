# Grid Component

A generic, reusable grid layout component built with TypeScript generics and Tailwind CSS. The Grid component provides a flexible way to display items in a responsive grid layout with support for loading states, empty states, and customizable column configurations.

## Features

- **Type-safe**: Uses TypeScript generics to work with any data type
- **Responsive**: Supports different column counts for various screen sizes
- **Flexible**: Customizable gap spacing and additional styling
- **Loading & Empty States**: Built-in support for loading and empty state displays
- **Accessible**: Semantic HTML structure

## Usage

### Basic Example

```tsx
import { Grid } from '@/components/common/Grid';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
}

function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <Grid
      items={movies}
      renderItem={(movie) => (
        <div>
          <img src={movie.posterPath} alt={movie.title} />
          <h3>{movie.title}</h3>
        </div>
      )}
      keyExtractor={(movie) => movie.id}
      columns={{ default: 2, md: 4, lg: 6 }}
      gap={4}
    />
  );
}
```

### With Loading State

```tsx
<Grid
  items={movies}
  renderItem={(movie) => <MovieCard movie={movie} />}
  keyExtractor={(movie) => movie.id}
  columns={{ default: 2, md: 4, lg: 6 }}
  isLoading={isLoading}
  loadingState={<LoadingSpinner />}
/>
```

### With Empty State

```tsx
<Grid
  items={movies}
  renderItem={(movie) => <MovieCard movie={movie} />}
  keyExtractor={(movie) => movie.id}
  columns={{ default: 2, md: 4, lg: 6 }}
  emptyState={
    <div className="text-center py-12">
      <p>No movies found</p>
    </div>
  }
/>
```

### Responsive Columns

```tsx
<Grid
  items={items}
  renderItem={(item) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  columns={{
    default: 1,  // 1 column on mobile
    sm: 2,       // 2 columns on small screens (640px+)
    md: 3,       // 3 columns on medium screens (768px+)
    lg: 4,       // 4 columns on large screens (1024px+)
    xl: 5,       // 5 columns on xl screens (1280px+)
    '2xl': 6,    // 6 columns on 2xl screens (1536px+)
  }}
  gap={6}
/>
```

### Custom Styling

```tsx
<Grid
  items={items}
  renderItem={(item) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  columns={{ default: 3, lg: 6 }}
  gap={4}
  className="max-w-7xl mx-auto px-4"
/>
```

## Props

### `items` (required)
- **Type**: `T[]`
- **Description**: Array of items to render in the grid

### `renderItem` (required)
- **Type**: `(item: T, index: number) => ReactNode`
- **Description**: Function to render each item in the grid

### `keyExtractor` (required)
- **Type**: `(item: T, index: number) => string | number`
- **Description**: Function to extract a unique key for each item

### `columns`
- **Type**: `GridColumns`
- **Default**: `{ default: 1 }`
- **Description**: Responsive column configuration object

#### GridColumns Interface
```typescript
interface GridColumns {
  default: number;  // Required
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}
```

### `gap`
- **Type**: `number`
- **Default**: `4`
- **Description**: Gap between grid items (in Tailwind spacing units)

### `emptyState`
- **Type**: `ReactNode`
- **Description**: Content to display when items array is empty

### `loadingState`
- **Type**: `ReactNode`
- **Description**: Content to display while loading

### `isLoading`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether the grid is currently loading

### `className`
- **Type**: `string`
- **Description**: Additional CSS classes to apply to the grid container

## Design Patterns

### Composition
The Grid component follows the composition pattern by accepting render functions rather than being tightly coupled to specific item types.

### Type Safety
Uses TypeScript generics to ensure type safety throughout the component tree:

```tsx
// Type is inferred from items array
<Grid<Movie>
  items={movies}
  renderItem={(movie) => {
    // movie is typed as Movie
    return <div>{movie.title}</div>;
  }}
  keyExtractor={(movie) => movie.id}
/>
```

### Responsive Design
Built with mobile-first responsive design using Tailwind's breakpoint system:
- `default`: Base (mobile)
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## Accessibility

- Uses semantic HTML structure
- Maintains proper DOM hierarchy
- Compatible with screen readers
- Keyboard navigation friendly (when used with accessible child components)

## Performance Considerations

- Lightweight implementation with minimal overhead
- Uses React keys for efficient reconciliation
- No unnecessary re-renders (wrap with `React.memo` if needed)
- For very large lists (1000+ items), consider using virtualization

## Related Components

- **List**: For single-column vertical lists
- **Card**: Often used as children within Grid
- **LoadingState**: Can be used for `loadingState` prop
- **EmptyState**: Can be used for `emptyState` prop

## Examples in Codebase

The Grid component is designed to replace manual grid layouts throughout the application:

- Movie grids in `/movies` page
- Series grids in `/series` page
- Collection item grids
- Search result grids

## Migration from Manual Grids

Before:
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {movies.map((movie) => (
    <MovieCard key={movie.id} movie={movie} />
  ))}
</div>
```

After:
```tsx
<Grid
  items={movies}
  renderItem={(movie) => <MovieCard movie={movie} />}
  keyExtractor={(movie) => movie.id}
  columns={{ default: 2, md: 4, lg: 6 }}
  gap={4}
/>
```

## Testing

The Grid component should be tested for:
- Rendering correct number of items
- Applying correct column classes based on configuration
- Showing loading state when `isLoading` is true
- Showing empty state when items array is empty
- Applying custom className correctly
- Type safety with different data types
