# List Component

A generic, reusable List component built with TypeScript generics that supports infinite scroll, loading states, and empty states.

## Features

- **Type-safe**: Uses TypeScript generics to maintain type safety
- **Infinite Scroll**: Built-in Intersection Observer for pagination
- **Loading States**: Supports both initial loading and "load more" states
- **Empty States**: Customizable empty state rendering
- **Flexible Rendering**: Custom render function for complete control
- **Accessible**: Proper ARIA attributes and semantic HTML

## Usage

### Basic Example

```tsx
import { List } from '@/components/common/List';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <List
      items={users}
      renderItem={(user) => (
        <div className="p-4 border rounded">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      keyExtractor={(user) => user.id}
    />
  );
}
```

### With Infinite Scroll

```tsx
function InfiniteUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    const newUsers = await fetchUsers(page);
    setUsers((prev) => [...prev, ...newUsers]);
    setPage((prev) => prev + 1);
    setIsLoading(false);
  };

  return (
    <List
      items={users}
      renderItem={(user) => <UserCard user={user} />}
      keyExtractor={(user) => user.id}
      isLoading={isLoading}
      onEndReached={loadMore}
      onEndReachedThreshold={300}
    />
  );
}
```

### With Custom Empty and Loading States

```tsx
function CustomStatesList() {
  return (
    <List
      items={items}
      renderItem={(item) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      emptyState={
        <div className="text-center py-12">
          <p className="text-lg font-semibold">No items found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      }
      loadingState={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    />
  );
}
```

### With Complex Items

```tsx
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
}

function MovieList({ movies }: { movies: Movie[] }) {
  const handleMovieClick = (movie: Movie) => {
    console.log('Clicked:', movie.title);
  };

  return (
    <List
      items={movies}
      renderItem={(movie, index) => (
        <div 
          className="p-4 hover:bg-accent cursor-pointer transition-colors"
          onClick={() => handleMovieClick(movie)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">{movie.year}</p>
            </div>
            <div className="text-sm font-medium">
              ⭐ {movie.rating.toFixed(1)}
            </div>
          </div>
        </div>
      )}
      keyExtractor={(movie) => movie.id}
      className="max-w-2xl mx-auto"
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `T[]` | Yes | - | Array of items to render |
| `renderItem` | `(item: T, index: number) => ReactNode` | Yes | - | Function to render each item |
| `keyExtractor` | `(item: T, index: number) => string \| number` | Yes | - | Function to extract unique key |
| `emptyState` | `ReactNode` | No | Default message | Content when list is empty |
| `loadingState` | `ReactNode` | No | Default spinner | Content when loading |
| `isLoading` | `boolean` | No | `false` | Whether list is loading |
| `onEndReached` | `() => void` | No | - | Callback for infinite scroll |
| `onEndReachedThreshold` | `number` | No | `200` | Pixels from bottom to trigger |
| `virtualized` | `boolean` | No | `false` | Enable virtualization (future) |
| `className` | `string` | No | - | Additional CSS classes |

## Infinite Scroll Behavior

The List component uses the Intersection Observer API to detect when the user scrolls near the end of the list. When the sentinel element (invisible div at the bottom) becomes visible:

1. The `onEndReached` callback is triggered
2. A debounce mechanism prevents multiple rapid calls
3. The loading indicator appears at the bottom
4. After new items are loaded, the cycle can repeat

### Threshold Configuration

The `onEndReachedThreshold` prop controls how far from the bottom (in pixels) the trigger occurs:

- `0`: Trigger only when scrolled to the very bottom
- `200` (default): Trigger 200px before reaching the bottom
- `500`: Trigger earlier for smoother UX

## Styling

The List component uses Tailwind CSS and can be customized via:

1. **className prop**: Add custom classes to the container
2. **renderItem**: Full control over item styling
3. **emptyState/loadingState**: Custom styled states

## Accessibility

- Uses semantic HTML structure
- Sentinel element has `aria-hidden="true"`
- Loading states are announced to screen readers
- Keyboard navigation works naturally with rendered items

## Performance Considerations

- Uses Intersection Observer (efficient, native browser API)
- Debounces `onEndReached` calls to prevent duplicates
- Minimal re-renders with proper key extraction
- Future: Virtualization support for very large lists

## Type Safety

The List component is fully type-safe:

```tsx
// TypeScript will enforce that renderItem receives the correct type
const movieList = (
  <List<Movie>
    items={movies}
    renderItem={(movie) => {
      // movie is typed as Movie
      return <div>{movie.title}</div>;
    }}
    keyExtractor={(movie) => movie.id}
  />
);
```

## Related Components

- **Grid**: For grid layouts instead of vertical lists
- **Card**: Often used within renderItem for consistent styling
- **LoadingState**: Can be used for custom loading states
- **EmptyState**: Can be used for custom empty states
