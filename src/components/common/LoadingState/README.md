# LoadingState Component

A reusable loading state component that displays an animated spinner with an optional message.

## Features

- ✅ Accessible with proper ARIA attributes for screen readers
- ✅ Animated spinner using Lucide icons (Loader2)
- ✅ Configurable size variants (sm, md, lg, xl)
- ✅ Optional loading message
- ✅ Tailwind CSS styling with className composition
- ✅ TypeScript support with full type safety

## Usage

### Basic Usage

```tsx
import { LoadingState } from "@/components/common/LoadingState";

function MyComponent() {
  return <LoadingState />;
}
```

### With Message

```tsx
<LoadingState message="Loading movies..." />
```

### Different Sizes

```tsx
// Small
<LoadingState size="sm" message="Loading..." />

// Medium (default)
<LoadingState size="md" message="Loading..." />

// Large
<LoadingState size="lg" message="Loading..." />

// Extra Large
<LoadingState size="xl" message="Please wait..." />
```

### Custom Styling

```tsx
<LoadingState 
  size="md" 
  message="Fetching data..." 
  className="min-h-[400px] bg-background/50" 
/>
```

### In a Container

```tsx
function MovieList() {
  const { data, isLoading } = useMovies();

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState 
          size="lg" 
          message="Loading movies..." 
          className="min-h-[60vh]"
        />
      </div>
    );
  }

  return <div>{/* Movie list content */}</div>;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `undefined` | Optional message to display below the spinner |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size variant for the spinner and text |
| `className` | `string` | `undefined` | Additional CSS classes to apply to the container |

## Accessibility

The component includes proper ARIA attributes for screen readers:

- `role="status"` - Indicates a status update region
- `aria-live="polite"` - Announces changes to screen readers without interrupting
- `aria-busy="true"` - Indicates the region is currently loading
- `aria-hidden="true"` on the icon - Hides decorative icon from screen readers
- `.sr-only` text - Provides screen reader-only loading text

## Size Variants

The component supports four size variants:

- **sm**: 16px icon, small text
- **md**: 24px icon, base text (default)
- **lg**: 32px icon, large text
- **xl**: 48px icon, extra large text

## Styling

The component uses:
- **CVA (Class Variance Authority)** for variant management
- **Tailwind CSS** for styling
- **Lucide React** for the animated spinner icon
- **cn utility** for className composition

## Examples

### Full Page Loading

```tsx
<LoadingState 
  size="xl" 
  message="Loading application..." 
  className="min-h-screen"
/>
```

### Card Loading State

```tsx
<Card>
  <LoadingState 
    size="sm" 
    message="Loading details..." 
    className="py-8"
  />
</Card>
```

### Conditional Rendering

```tsx
function DataDisplay() {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return <div>{/* Display data */}</div>;
}
```

## Related Components

- `EmptyState` - For displaying empty state messages
- `ErrorState` - For displaying error messages
- `Card` - Generic card component that can contain loading states
