# Card Component

A highly reusable, generic Card component built with TypeScript generics, Framer Motion animations, and Tailwind CSS styling.

## Features

- **Type-Safe**: Uses TypeScript generics to ensure type safety for any data type
- **Flexible Rendering**: Customizable content and actions via render props
- **Interactive**: Optional click handlers with keyboard accessibility
- **Animated**: Built-in hover and 3D tilt effects using Framer Motion
- **Styled**: CVA-based variants with Tailwind CSS
- **Accessible**: Proper ARIA attributes and keyboard navigation

## Installation

The Card component is already part of the project. Import it from:

```typescript
import { Card } from "@/components/common/Card";
import type { CardProps } from "@/components/common/Card";
```

## Basic Usage

```tsx
interface Movie {
  id: number;
  title: string;
  year: number;
}

const movie: Movie = {
  id: 1,
  title: "Inception",
  year: 2010,
};

<Card<Movie>
  data={movie}
  renderContent={(movie) => (
    <div>
      <h3>{movie.title}</h3>
      <p>{movie.year}</p>
    </div>
  )}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T` | The data object to display in the card |
| `renderContent` | `(data: T) => React.ReactNode` | Function to render the main content |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderActions` | `(data: T) => React.ReactNode` | `undefined` | Function to render action buttons |
| `onClick` | `(data: T) => void` | `undefined` | Click handler for the entire card |
| `className` | `string` | `undefined` | Additional CSS classes |
| `layoutId` | `string` | `undefined` | Framer Motion layout ID for animations |
| `enableHoverEffect` | `boolean` | `false` | Enable scale and shadow on hover |
| `enable3DEffect` | `boolean` | `false` | Enable 3D tilt effect on mouse move |
| `variant` | `"default" \| "elevated" \| "outlined" \| "ghost"` | `"default"` | Visual style variant |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Padding size |

## Variants

### Visual Variants

- **default**: Standard card with border and subtle shadow
- **elevated**: Card with more prominent shadow
- **outlined**: Card with thicker border and no shadow
- **ghost**: Transparent card with no border or shadow

### Padding Variants

- **none**: No padding (p-0)
- **sm**: Small padding (p-3)
- **md**: Medium padding (p-4)
- **lg**: Large padding (p-6)

## Examples

### Movie Card with Actions

```tsx
<Card<Movie>
  data={movie}
  variant="elevated"
  padding="lg"
  enableHoverEffect
  renderContent={(movie) => (
    <div>
      <img src={movie.posterUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.year}</p>
    </div>
  )}
  renderActions={(movie) => (
    <>
      <button>Watch</button>
      <button>Add to List</button>
    </>
  )}
  onClick={(movie) => navigate(`/movie/${movie.id}`)}
/>
```

### User Profile Card with 3D Effect

```tsx
<Card<User>
  data={user}
  variant="outlined"
  enable3DEffect
  enableHoverEffect
  renderContent={(user) => (
    <div className="flex items-center gap-4">
      <img src={user.avatar} alt={user.name} className="rounded-full" />
      <div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  )}
/>
```

### Simple Notification Card

```tsx
<Card<Notification>
  data={notification}
  variant="ghost"
  padding="sm"
  renderContent={(notif) => (
    <div>
      <p>{notif.message}</p>
      <span>{notif.timestamp}</span>
    </div>
  )}
/>
```

## Accessibility

The Card component includes proper accessibility features:

- **Keyboard Navigation**: When `onClick` is provided, the card is keyboard accessible (Tab, Enter, Space)
- **ARIA Attributes**: Proper `role="button"` and `tabIndex` when interactive
- **Focus Management**: Visible focus indicators via Tailwind CSS

## Animation Features

### Hover Effect

Enable with `enableHoverEffect={true}`:
- Scales the card to 103% on hover
- Adds a shadow effect
- Smooth transition

### 3D Tilt Effect

Enable with `enable3DEffect={true}`:
- Card tilts based on mouse position
- Smooth spring animation
- Resets on mouse leave

### Layout Animations

Use `layoutId` for shared layout animations between routes:

```tsx
<Card<Movie>
  data={movie}
  layoutId={`movie-${movie.id}`}
  renderContent={...}
/>
```

## TypeScript Generics

The Card component uses TypeScript generics to maintain type safety:

```tsx
// The type parameter T is inferred from the data prop
<Card<Movie> data={movie} ... />

// TypeScript ensures renderContent receives the correct type
renderContent={(movie: Movie) => ...} // ✅ Type-safe

// TypeScript catches type errors
renderContent={(user: User) => ...} // ❌ Type error
```

## Styling

The component uses:
- **Tailwind CSS** for utility classes
- **CVA (Class Variance Authority)** for variant management
- **cn() utility** for className composition

You can extend styling with the `className` prop:

```tsx
<Card
  data={data}
  className="max-w-md hover:border-primary"
  renderContent={...}
/>
```

## Performance

- Uses `React.useCallback` for event handlers to prevent unnecessary re-renders
- Motion values are only created when 3D effect is enabled
- Efficient event handling with proper cleanup

## Related Components

- **MediaCard**: Specialized card for movies/TV shows (extends Card)
- **Grid**: Layout component for displaying multiple cards
- **List**: List component for displaying cards in a list

## See Also

- [Card.example.tsx](./Card.example.tsx) - More usage examples
- [Card.types.ts](./Card.types.ts) - Full TypeScript definitions
