# Modal Component

A generic, accessible modal component that wraps Radix UI Dialog with a simplified API.

## Features

- ✅ **Configurable sizes**: `sm`, `md`, `lg`, `xl`, `full`
- ✅ **Focus trap**: Automatically traps focus within the modal
- ✅ **Focus restoration**: Restores focus to the trigger element on close
- ✅ **Keyboard navigation**: Close with Escape key (configurable)
- ✅ **Overlay click**: Close by clicking outside (configurable)
- ✅ **Accessibility**: Proper ARIA attributes and screen reader support
- ✅ **Flexible content**: Support for title, description, children, and footer
- ✅ **TypeScript**: Fully typed with comprehensive prop interfaces

## Usage

### Basic Modal

```tsx
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
        description="This is a basic modal example"
      >
        <p>Modal content goes here.</p>
      </Modal>
    </>
  );
}
```

### Modal with Footer Actions

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### Different Sizes

```tsx
// Small modal
<Modal isOpen={isOpen} onClose={onClose} size="sm" title="Small Modal">
  <p>Compact content</p>
</Modal>

// Large modal
<Modal isOpen={isOpen} onClose={onClose} size="lg" title="Large Modal">
  <div>More spacious content</div>
</Modal>

// Full screen modal
<Modal isOpen={isOpen} onClose={onClose} size="full" title="Full Screen">
  <div>Takes up most of the viewport</div>
</Modal>
```

### Prevent Closing

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Important Form"
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <form>
    {/* Form content */}
  </form>
</Modal>
```

### Custom Styling

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Custom Styled Modal"
  className="bg-gradient-to-br from-purple-50 to-blue-50"
>
  <p>Content with custom background</p>
</Modal>
```

### Form Modal Example

```tsx
function AddMovieModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Movie"
      description="Enter movie details below"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="movie-form">
            Add Movie
          </Button>
        </>
      }
    >
      <form id="movie-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </form>
    </Modal>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls whether the modal is open or closed |
| `onClose` | `() => void` | - | Callback function called when the modal should close |
| `title` | `string` | `undefined` | Optional title displayed in the modal header |
| `description` | `string` | `undefined` | Optional description displayed below the title |
| `children` | `ReactNode` | - | Content to be rendered inside the modal |
| `footer` | `ReactNode` | `undefined` | Optional footer content (typically action buttons) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Size variant of the modal |
| `closeOnOverlayClick` | `boolean` | `true` | Whether clicking the overlay should close the modal |
| `closeOnEscape` | `boolean` | `true` | Whether pressing Escape key should close the modal |
| `className` | `string` | `undefined` | Additional CSS classes to apply to the modal content |

## Size Variants

- **`sm`**: `max-w-sm` (384px) - For small confirmations or alerts
- **`md`**: `max-w-lg` (512px) - Default size for most modals
- **`lg`**: `max-w-2xl` (672px) - For forms or detailed content
- **`xl`**: `max-w-4xl` (896px) - For complex interfaces
- **`full`**: `max-w-[95vw] h-[95vh]` - Nearly full screen

## Accessibility

The Modal component follows accessibility best practices:

- **Focus Management**: Automatically traps focus within the modal and restores it on close
- **Keyboard Navigation**: 
  - `Escape` key closes the modal (configurable)
  - `Tab` cycles through focusable elements
- **ARIA Attributes**:
  - `role="dialog"` on the modal container
  - `aria-modal="true"` to indicate modal behavior
  - `aria-labelledby` references the title
  - `aria-describedby` references the description
- **Screen Reader Support**: Close button includes `sr-only` text

## Best Practices

1. **Always provide a title** for better accessibility and user understanding
2. **Use descriptive onClose callbacks** to handle cleanup or state updates
3. **Disable overlay/escape closing** for critical forms to prevent accidental data loss
4. **Keep modal content focused** - avoid putting too much content in a single modal
5. **Use appropriate sizes** - don't use `full` size unless absolutely necessary
6. **Provide clear action buttons** in the footer for user guidance

## Related Components

- `Dialog` - The underlying Radix UI primitive
- `Button` - Commonly used in modal footers
- `Form` - Often used within modals for data input
