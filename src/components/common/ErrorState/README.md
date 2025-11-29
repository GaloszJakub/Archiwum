# ErrorState Component

A reusable component for displaying error states with optional retry functionality.

## Features

- ✅ Displays user-friendly error messages
- ✅ Supports Error objects, APIError, and string messages
- ✅ Optional retry button with customizable callback
- ✅ Customizable icon (defaults to AlertCircle)
- ✅ Configurable size variants (sm, md, lg)
- ✅ Tailwind CSS styling with className composition
- ✅ Proper ARIA attributes for accessibility
- ✅ TypeScript strict mode compliant

## Usage

### Basic Usage

```tsx
import { ErrorState } from "@/components/common/ErrorState";

// With string error
<ErrorState error="Failed to load movies" />

// With Error object
<ErrorState error={new Error("Network error")} />

// With APIError
<ErrorState error={apiError} />
```

### With Retry Button

```tsx
<ErrorState
  error="Failed to fetch data"
  onRetry={() => refetch()}
/>

// Custom retry text
<ErrorState
  error={error}
  onRetry={handleRetry}
  retryText="Reload"
/>
```

### Custom Icon and Title

```tsx
import { WifiOff } from "lucide-react";

<ErrorState
  error="Network connection failed"
  icon={WifiOff}
  title="No Connection"
/>
```

### Different Sizes

```tsx
<ErrorState size="sm" error="Small error" />
<ErrorState size="md" error="Medium error" />
<ErrorState size="lg" error="Large error" />
```

### Hide Error Message

```tsx
<ErrorState
  error={error}
  title="Something went wrong"
  showErrorMessage={false}
  onRetry={handleRetry}
/>
```

### Custom Styling

```tsx
<ErrorState
  error={error}
  className="min-h-[400px] bg-destructive/5 rounded-lg"
  onRetry={handleRetry}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `Error \| string` | **Required** | Error object or error message to display |
| `icon` | `LucideIcon` | `AlertCircle` | Custom icon component from lucide-react |
| `title` | `string` | `"Something went wrong"` | Custom title text |
| `onRetry` | `() => void` | `undefined` | Callback function for retry button |
| `retryText` | `string` | `"Try Again"` | Text for the retry button |
| `showErrorMessage` | `boolean` | `true` | Whether to show the full error message |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | `undefined` | Additional CSS classes |

## Real-World Examples

### In a Data Fetching Component

```tsx
function MovieList() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
  });

  if (isLoading) return <LoadingState message="Loading movies..." />;
  
  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to Load Movies"
        onRetry={() => refetch()}
      />
    );
  }

  return <div>{/* Render movies */}</div>;
}
```

### With APIError Handling

```tsx
function MovieDetails({ id }: { id: number }) {
  const { data, error, refetch } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id),
  });

  if (error) {
    // APIError provides structured error information
    if (APIError.isAPIError(error)) {
      if (error.code === APIErrorCode.NOT_FOUND) {
        return (
          <ErrorState
            error={error}
            title="Movie Not Found"
            showErrorMessage={false}
          />
        );
      }
      
      if (error.code === APIErrorCode.RATE_LIMIT_EXCEEDED) {
        return (
          <ErrorState
            error={error}
            title="Too Many Requests"
            onRetry={() => refetch()}
          />
        );
      }
    }

    // Generic error fallback
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <div>{/* Render movie details */}</div>;
}
```

### Network Error with Custom Icon

```tsx
import { WifiOff } from "lucide-react";

function OfflineError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      error={APIError.networkError()}
      icon={WifiOff}
      title="No Internet Connection"
      onRetry={onRetry}
      retryText="Check Connection"
    />
  );
}
```

## Accessibility

The ErrorState component follows accessibility best practices:

- Uses `role="alert"` for screen reader announcements
- Uses `aria-live="assertive"` for immediate error announcements
- Icon has `aria-hidden="true"` to avoid redundant announcements
- Retry button is keyboard accessible
- Proper semantic HTML structure

## Design Decisions

1. **Error Message Extraction**: The component intelligently extracts messages from Error objects, APIError instances, or plain strings.

2. **User-Friendly Display**: Focuses on displaying actionable error information without overwhelming technical details.

3. **Retry Pattern**: Optional retry functionality encourages error recovery without forcing it on all use cases.

4. **Consistent Styling**: Follows the same pattern as EmptyState and LoadingState for visual consistency.

5. **Flexible Customization**: Supports custom icons, titles, and styling while providing sensible defaults.

## Related Components

- [LoadingState](../LoadingState/README.md) - For loading states
- [EmptyState](../EmptyState/README.md) - For empty states
- [APIError](../../../utils/errors/APIError.ts) - Custom error class for API errors
