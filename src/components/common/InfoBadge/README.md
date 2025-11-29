# InfoBadge Component

A reusable badge component for displaying metadata information such as year, rating, genre, duration, and status.

## Features

- **Icon Support**: Optional Lucide icon integration
- **Label & Value**: Flexible display with optional label
- **Variant Styling**: Pre-defined styles for different information types (year, rating, genre, duration, status)
- **Size Options**: Three size variants (sm, md, lg)
- **Dark Mode**: Full dark mode support
- **Accessibility**: Proper ARIA attributes and semantic HTML
- **Customizable**: Supports custom className for additional styling

## Usage

### Basic Usage

```tsx
import { InfoBadge } from "@/components/common/InfoBadge";

// Simple value badge
<InfoBadge value="2024" variant="year" />

// With icon
<InfoBadge icon={Star} value="8.5" variant="rating" />

// With label
<InfoBadge icon={Calendar} label="Release Year" value="2024" variant="year" />
```

### Variants

The component supports several semantic variants:

```tsx
// Year badge (blue)
<InfoBadge icon={Calendar} value="2024" variant="year" />

// Rating badge (yellow)
<InfoBadge icon={Star} value="8.5" variant="rating" />

// Genre badge (purple)
<InfoBadge value="Action" variant="genre" />

// Duration badge (green)
<InfoBadge icon={Clock} value="2h 30m" variant="duration" />

// Status badge (gray)
<InfoBadge icon={Tv} value="Ongoing" variant="status" />

// Default badge
<InfoBadge value="HD" variant="default" />
```

### Sizes

```tsx
// Small
<InfoBadge value="2024" variant="year" size="sm" />

// Medium (default)
<InfoBadge value="2024" variant="year" size="md" />

// Large
<InfoBadge value="2024" variant="year" size="lg" />
```

### Real-World Examples

#### Movie Card

```tsx
import { Calendar, Star, Clock } from "lucide-react";

<div className="movie-card">
  <h3>The Matrix</h3>
  <div className="flex gap-2">
    <InfoBadge icon={Calendar} value="1999" variant="year" />
    <InfoBadge icon={Star} value="8.7" variant="rating" />
    <InfoBadge icon={Clock} value="2h 16m" variant="duration" />
    <InfoBadge value="Sci-Fi" variant="genre" />
    <InfoBadge value="Action" variant="genre" />
  </div>
</div>
```

#### TV Show Card

```tsx
import { Calendar, Star, Tv } from "lucide-react";

<div className="tv-show-card">
  <h3>Breaking Bad</h3>
  <div className="flex gap-2">
    <InfoBadge icon={Calendar} value="2008-2013" variant="year" />
    <InfoBadge icon={Star} value="9.5" variant="rating" />
    <InfoBadge icon={Tv} value="5 Seasons" variant="status" />
    <InfoBadge value="Drama" variant="genre" />
  </div>
</div>
```

### Custom Styling

You can add custom styles using the `className` prop:

```tsx
<InfoBadge
  icon={Star}
  value="Featured"
  variant="rating"
  className="border-2 border-yellow-500"
/>

<InfoBadge
  value="New Release"
  variant="year"
  className="animate-pulse"
/>

<InfoBadge
  value="Premium"
  variant="default"
  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
/>
```

## Props

### InfoBadgeProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | `undefined` | Optional Lucide icon component to display before the value |
| `label` | `string` | `undefined` | Optional label text to display before the value |
| `value` | `string \| number` | **required** | The main value to display in the badge |
| `variant` | `"year" \| "rating" \| "genre" \| "duration" \| "status" \| "default"` | `"default"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `className` | `string` | `undefined` | Additional CSS classes |
| `aria-label` | `string` | auto-generated | Custom ARIA label for accessibility |

## Accessibility

The component includes proper accessibility features:

- Uses semantic `<span>` element with `role="status"`
- Auto-generates `aria-label` from label and value
- Icons are marked with `aria-hidden="true"`
- Supports custom `aria-label` for complex cases

```tsx
// Auto-generated aria-label: "Rating: 8.5"
<InfoBadge icon={Star} label="Rating" value="8.5" variant="rating" />

// Custom aria-label
<InfoBadge
  icon={Star}
  value="8.5"
  variant="rating"
  aria-label="User rating: 8.5 out of 10"
/>
```

## Styling

The component uses:
- **CVA (Class Variance Authority)** for variant management
- **Tailwind CSS** for styling
- **Dark mode** support via Tailwind's dark mode classes
- **cn() utility** for className composition

### Color Schemes

- **Year**: Blue (`bg-blue-100`, `text-blue-800`)
- **Rating**: Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Genre**: Purple (`bg-purple-100`, `text-purple-800`)
- **Duration**: Green (`bg-green-100`, `text-green-800`)
- **Status**: Gray (`bg-gray-100`, `text-gray-800`)
- **Default**: Secondary theme colors

All colors have dark mode variants for proper contrast.

## TypeScript

The component is fully typed with TypeScript:

```tsx
import { type InfoBadgeProps } from "@/components/common/InfoBadge";

// Type-safe usage
const badge: InfoBadgeProps = {
  icon: Star,
  label: "Rating",
  value: 8.5,
  variant: "rating",
  size: "md",
};
```

## Examples

See `InfoBadge.example.tsx` for comprehensive usage examples including:
- All variant types
- All size options
- Icon usage
- Label combinations
- Real-world movie/TV show cards
- Custom styling examples
