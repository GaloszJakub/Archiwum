# EmptyState Component

A reusable component for displaying empty states when no content is available.

## Features

- 🎨 Customizable icon (defaults to Inbox from Lucide)
- 📝 Title and optional description text
- 🔘 Optional action button support
- 📏 Multiple size variants (sm, md, lg)
- ♿ Accessible with proper ARIA attributes
- 🎭 Tailwind CSS styling with className composition
- 📱 Responsive and centered layout

## Usage

### Basic Usage

```tsx
import { EmptyState } from "@/components/common/EmptyState";

function MyComponent() {
  return <EmptyState title="No items found" />;
}
```

### With Description

```tsx
<EmptyState
  title="No movies in your collection"
  description="Start adding movies to build your personal collection"
/>
```

### With Custom Icon

```tsx
import { Film } from "lucide-react";

<EmptyState
  icon={Film}
  title="No movies found"
  description="Try adjusting your search or filters"
/>
```

### With Action Button

```tsx
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

<EmptyState
  icon={FolderOpen}
  title="No collections yet"
  description="Create your first collection to organize your movies"
  action={
    <Button onClick={handleCreate}>
      Create Collection
    </Button>
  }
/>
```

### Size Variants

```tsx
// Small
<EmptyState size="sm" title="No results" />

// Medium (default)
<EmptyState size="md" title="No results" />

// Large
<EmptyState size="lg" title="No results" />
```

### Custom Styling

```tsx
<EmptyState
  title="Empty"
  description="Custom styled empty state"
  className="min-h-[400px] bg-muted/50 rounded-lg"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | `Inbox` | Icon component from Lucide to display |
| `title` | `string` | - | **Required.** Title text to display |
| `description` | `string` | - | Optional description text |
| `action` | `React.ReactNode` | - | Optional action element (typically a button) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | - | Additional CSS classes |

## Common Use Cases

### Search Results

```tsx
import { Search } from "lucide-react";

<EmptyState
  icon={Search}
  title="No results found"
  description="We couldn't find any movies matching your search"
  action={<Button variant="outline" onClick={clearSearch}>Clear Search</Button>}
/>
```

### Empty Collection

```tsx
import { FolderOpen } from "lucide-react";

<EmptyState
  icon={FolderOpen}
  title="No collections yet"
  description="Create your first collection to get started"
  action={<Button onClick={createCollection}>Create Collection</Button>}
/>
```

### No Movies/Series

```tsx
import { Film } from "lucide-react";

<EmptyState
  icon={Film}
  title="No movies found"
  description="Try adjusting your filters or search criteria"
/>
```

### Empty Favorites

```tsx
import { Heart } from "lucide-react";

<EmptyState
  icon={Heart}
  title="No favorites yet"
  description="Start adding movies to your favorites"
/>
```

## Accessibility

The component includes proper accessibility features:

- `role="status"` for screen reader announcements
- `aria-live="polite"` for dynamic content updates
- `aria-hidden="true"` on decorative icon
- Semantic HTML structure with proper heading hierarchy

## Styling

The component uses Tailwind CSS with CVA (Class Variance Authority) for variant management. It follows the application's design system with:

- Muted foreground colors for icons and descriptions
- Proper spacing and padding
- Centered layout
- Responsive text sizing

## Integration with Other Components

The EmptyState component works well with:

- **List/Grid components**: Display when no items are available
- **Search components**: Show when search returns no results
- **Filter components**: Display when filters exclude all items
- **Collection components**: Show when collection is empty

## Example Integration

```tsx
function MovieList({ movies, isLoading }) {
  if (isLoading) {
    return <LoadingState message="Loading movies..." />;
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title="No movies found"
        description="Try adjusting your search or filters"
        action={<Button onClick={clearFilters}>Clear Filters</Button>}
      />
    );
  }

  return <Grid items={movies} renderItem={renderMovie} />;
}
```

## Related Components

- **LoadingState**: Display while content is loading
- **ErrorState**: Display when an error occurs
- **Grid/List**: Display content when available
