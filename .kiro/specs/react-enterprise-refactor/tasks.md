# Implementation Plan

## Phase 1: Foundation & TypeScript Strict Mode ✅

- [x] 1. Configure TypeScript strict mode
  - Update `tsconfig.json` to enable strict mode settings
  - Set `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
  - Set `noUnusedLocals: true`, `noUnusedParameters: true`
  - _Requirements: 1.1_

- [x] 2. Create new directory structure
  - Create `src/components/common/` for generic reusable components
  - Create `src/components/features/` for feature-specific components
  - Create `src/types/api/` for API response types
  - Create `src/types/domain/` for domain model types
  - Create `src/types/ui/` for UI-specific types
  - Create `src/services/api/` for API service classes
  - Create `src/services/transformers/` for data transformers
  - Create `src/hooks/api/` for API-related hooks
  - Create `src/hooks/ui/` for UI-related hooks
  - Create `src/utils/formatters/` for formatting utilities
  - Create `src/utils/validators/` for validation utilities
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 3. Define core domain types
  - Create `src/types/domain/media.ts` with MediaItem, Movie, TVShow interfaces
  - Create `src/types/domain/season.ts` with Season, Episode interfaces
  - Create `src/types/domain/collection.ts` with Collection, CollectionItem interfaces
  - Create `src/types/domain/genre.ts` with Genre interface
  - Export all types from `src/types/domain/index.ts`
  - _Requirements: 1.2, 1.3, 9.5_

- [x] 4. Define API response types
  - Create `src/types/api/tmdb.ts` with TMDB API response interfaces
  - Create `src/types/api/common.ts` with shared API types (PaginatedResponse, etc.)
  - Ensure all API types are explicitly typed with no `any`
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 5. Create data transformer service
  - Create `src/services/transformers/TMDBTransformer.ts`
  - Implement `toMovie()`, `toTVShow()`, `toMediaItem()` methods
  - Implement `toSeason()`, `toEpisode()` methods
  - Add proper TypeScript types for all inputs and outputs
  - _Requirements: 7.5, 1.2, 1.3_

- [ ]* 5.1 Write property test for data transformers
  - **Property 4: Data transformer round-trip consistency**
  - **Validates: Requirements 7.5**

## Phase 2: Service Layer Refactoring ✅

- [x] 6. Refactor TMDB service with strict types
  - Update `src/services/api/TMDBService.ts` (move from lib/tmdb.ts)
  - Replace all `any` types with proper interfaces
  - Use domain types from transformers for return values
  - Add explicit error handling with custom APIError class
  - Type all method parameters and return values
  - _Requirements: 1.2, 1.3, 1.4, 7.1, 7.3, 7.4, 7.5_

- [ ]* 6.1 Write unit tests for TMDB service
  - Test API error handling
  - Test rate limiting
  - Test cache functionality
  - _Requirements: 7.4, 14.2_

- [x] 7. Create Firebase service abstraction
  - Create `src/services/api/FirebaseService.ts`
  - Abstract Firebase auth operations
  - Abstract Firestore operations for collections, reviews, episodes
  - Add proper TypeScript types for all operations
  - Implement consistent error handling
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]* 7.1 Write unit tests for Firebase service
  - Test authentication operations
  - Test Firestore CRUD operations
  - Test error handling
  - _Requirements: 7.4, 14.2_

## Phase 3: Generic UI Components (Partial)

- [x] 8. Create generic Card component
  - Create `src/components/common/Card/Card.tsx`
  - Implement with TypeScript generics `Card<T>`
  - Add props: `data: T`, `renderContent`, `renderActions`, `onClick`, `className`
  - Support `layoutId` for Framer Motion animations
  - Add `enableHoverEffect` and `enable3DEffect` boolean props
  - Use Tailwind classes with `cn()` utility for styling
  - Support CVA variants for different card styles
  - _Requirements: 3.1, 3.2, 3.3, 1.5, 4.1, 4.2, 4.4_

- [x] 8.1 Create Card component types
  - Create `src/components/common/Card/Card.types.ts`
  - Define `CardProps<T>` interface with JSDoc comments
  - Define variant types using CVA
  - _Requirements: 1.3, 4.3, 15.2_

- [ ]* 8.2 Write property test for Card component
  - **Property 3: Type safety preservation in generic components**
  - **Validates: Requirements 1.5, 3.2**

- [ ]* 8.3 Write component tests for Card
  - Test rendering with different data types
  - Test onClick callback
  - Test hover effects
  - Test className composition
  - _Requirements: 14.1_

- [x] 9. Create generic List component



  - Create `src/components/common/List/List.tsx`
  - Implement with TypeScript generics `List<T>`
  - Add props: `items: T[]`, `renderItem`, `keyExtractor`, `emptyState`, `loadingState`
  - Implement infinite scroll with Intersection Observer
  - Add `onEndReached` callback for pagination
  - Support `virtualized` prop for large lists
  - Use Tailwind for layout and spacing
  - _Requirements: 3.1, 3.2, 3.3, 1.5, 4.1, 4.2_

- [x] 9.1 Create List component types


  - Create `src/components/common/List/List.types.ts`
  - Define `ListProps<T>` interface with JSDoc comments
  - _Requirements: 1.3, 4.3, 15.2_

- [ ]* 9.2 Write property test for List component
  - **Property 1: Generic List renders all items**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 9.3 Write component tests for List
  - Test rendering with empty array
  - Test rendering with items
  - Test infinite scroll trigger
  - Test loading and empty states
  - _Requirements: 14.1_

- [x] 10. Create generic Grid component



  - Create `src/components/common/Grid/Grid.tsx`
  - Implement with TypeScript generics `Grid<T>`
  - Add props: `items: T[]`, `renderItem`, `keyExtractor`, `columns`, `gap`
  - Support responsive column configuration
  - Use Tailwind grid classes with dynamic columns
  - Add empty and loading states
  - _Requirements: 3.1, 3.2, 3.3, 1.5, 4.1, 4.2_

- [x] 10.1 Create Grid component types

  - Create `src/components/common/Grid/Grid.types.ts`
  - Define `GridProps<T>` interface with column configuration type
  - _Requirements: 1.3, 4.3, 15.2_

- [ ]* 10.2 Write property test for Grid component
  - **Property 2: Generic Grid respects column configuration**
  - **Validates: Requirements 3.2, 3.3**

- [ ]* 10.3 Write component tests for Grid
  - Test responsive column rendering
  - Test gap spacing
  - Test empty and loading states
  - _Requirements: 14.1_

- [x] 11. Create generic Modal component



  - Create `src/components/common/Modal/Modal.tsx`
  - Wrap Radix Dialog with better API
  - Add props: `isOpen`, `onClose`, `title`, `children`, `footer`, `size`
  - Support `closeOnOverlayClick` and `closeOnEscape` boolean props
  - Implement focus trap and focus restoration
  - Use Tailwind for styling with size variants
  - Add proper ARIA attributes
  - _Requirements: 3.1, 3.3, 4.1, 4.2, 4.4, 13.1, 13.5_

- [x] 11.1 Create Modal component types

  - Create `src/components/common/Modal/Modal.types.ts`
  - Define `ModalProps` interface
  - _Requirements: 1.3, 4.3_

- [ ]* 11.2 Write component tests for Modal
  - Test open/close behavior
  - Test keyboard navigation (Escape key)
  - Test focus trap
  - Test ARIA attributes
  - _Requirements: 13.3, 14.1_

- [x] 12. Create MediaCard component (specialized Card)



  - Create `src/components/common/MediaCard/MediaCard.tsx`
  - Extend generic Card component for movies/series
  - Add props: `media: MediaItem`, `onClick`, `showActions`
  - Render poster, title, year, rating using composition
  - Use Framer Motion for 3D tilt effect
  - Use Tailwind for responsive design
  - _Requirements: 3.1, 3.3, 5.1, 5.5_

- [x] 12.1 Create MediaCard component types

  - Create `src/components/common/MediaCard/MediaCard.types.ts`
  - Define `MediaCardProps` interface
  - _Requirements: 1.3, 4.3_

- [ ]* 12.2 Write component tests for MediaCard
  - Test rendering movie data
  - Test rendering TV show data
  - Test onClick callback
  - Test action buttons
  - _Requirements: 14.1_

## Phase 4: Shared UI Components

- [x] 13. Create LoadingState component





  - Create `src/components/common/LoadingState/LoadingState.tsx`
  - Add props: `message`, `size`, `className`
  - Use Lucide icons (Loader2) with Tailwind animations
  - Add proper ARIA attributes for screen readers
  - _Requirements: 3.4, 13.1_

- [x] 14. Create EmptyState component



  - Create `src/components/common/EmptyState/EmptyState.tsx`
  - Add props: `icon`, `title`, `description`, `action`, `className`
  - Use Tailwind for centered layout
  - Support custom action button
  - _Requirements: 3.4_

- [x] 15. Create ErrorState component



  - Create `src/components/common/ErrorState/ErrorState.tsx`
  - Add props: `error`, `onRetry`, `className`
  - Display user-friendly error messages
  - Add retry button with proper event handler naming
  - Use Tailwind for styling
  - _Requirements: 3.4, 4.1, 11.2_

- [x] 16. Create InfoBadge component



  - Create `src/components/common/InfoBadge/InfoBadge.tsx`
  - Add props: `icon`, `label`, `value`, `variant`, `className`
  - Use CVA for variant styling (year, rating, genre, etc.)
  - Use Tailwind badge styles
  - _Requirements: 3.4, 4.2_

## Phase 5: Custom Hooks Extraction

- [ ] 17. Extract useInfiniteScroll hook
  - Create `src/hooks/ui/useInfiniteScroll.ts`
  - Extract intersection observer logic from Movies/Series pages
  - Return `observerRef` and `isIntersecting` state
  - Add proper TypeScript types
  - _Requirements: 6.1, 6.2, 6.3, 1.2_

- [ ]* 17.1 Write unit tests for useInfiniteScroll
  - Test observer setup and cleanup
  - Test intersection detection
  - _Requirements: 14.3_

- [ ] 18. Extract useDebounce hook
  - Create `src/hooks/ui/useDebounce.ts`
  - Generic hook for debouncing any value
  - Extract debounce logic from Movies/Series pages
  - Add configurable delay parameter
  - Use TypeScript generics
  - _Requirements: 6.1, 6.2, 6.3, 1.5_

- [ ]* 18.1 Write unit tests for useDebounce
  - Test debounce timing
  - Test cleanup on unmount
  - _Requirements: 14.3_

- [ ] 19. Extract useFocusTrap hook
  - Create `src/hooks/ui/useFocusTrap.ts`
  - Implement focus trapping for modals
  - Return ref to attach to container
  - Add proper TypeScript types
  - _Requirements: 6.5, 13.5_

- [ ]* 19.1 Write unit tests for useFocusTrap
  - Test focus trapping behavior
  - Test cleanup
  - _Requirements: 14.3_

- [ ] 20. Extract useRestoreFocus hook
  - Create `src/hooks/ui/useRestoreFocus.ts`
  - Save and restore focus for modals
  - Return `saveFocus` and `restoreFocus` functions
  - _Requirements: 6.5, 13.5_

- [ ] 21. Move TMDB hooks to api directory
  - Move `src/hooks/useTMDB.ts` to `src/hooks/api/useTMDB.ts`
  - Update imports throughout the codebase
  - Ensure hooks use TMDBService (already done)
  - Verify all return types use proper domain models
  - _Requirements: 6.1, 6.4, 7.1, 10.1_

## Phase 6: Error Handling Infrastructure

- [ ] 22. Create additional custom error classes
  - Create `src/utils/errors/ValidationError.ts`
  - Create `src/utils/errors/AuthError.ts`
  - Add proper TypeScript types and error codes
  - Note: APIError.ts already exists
  - _Requirements: 7.4, 11.2_

- [ ] 23. Create ErrorBoundary component
  - Create `src/components/common/ErrorBoundary/ErrorBoundary.tsx`
  - Implement React error boundary with proper types
  - Add props: `fallback`, `onError`, `children`
  - Log errors appropriately
  - Use Tailwind for fallback UI
  - _Requirements: 11.1, 11.5_

- [ ]* 23.1 Write property test for ErrorBoundary
  - **Property 5: Error boundary catches component errors**
  - **Validates: Requirements 11.1**

- [ ]* 23.2 Write component tests for ErrorBoundary
  - Test error catching
  - Test fallback rendering
  - Test error logging
  - _Requirements: 11.1, 14.1_

- [ ] 24. Create error transformation utilities
  - Create `src/utils/errors/transformError.ts`
  - Transform API errors to user-friendly messages
  - Add i18n support for error messages
  - _Requirements: 11.2_

- [ ] 25. Replace remaining 'any' types with proper types
  - Fix error handling in Login.tsx (catch error: any)
  - Fix Dashboard.tsx searchResults.map((item: any))
  - Fix CollectionDetails.tsx handleItemClick((item: any))
  - Fix ScraperButton.tsx saveEpisodeToFirebase((result: any))
  - Fix FriendsSidebar.tsx error handling (catch error: any)
  - Fix AddToCollectionButton.tsx error handling (catch error: any)
  - _Requirements: 1.2, 1.4_

## Phase 7: Movies Feature Refactoring

- [ ] 26. Create MovieListContainer (Smart Component)
  - Create `src/components/features/movies/MovieListContainer.tsx`
  - Use `usePopularMovies` or `useSearchMovies` hooks
  - Handle loading, error, and empty states
  - Pass data to Grid component for rendering
  - Extract all business logic to hooks
  - _Requirements: 2.1, 2.5, 6.1, 8.4_

- [ ] 27. Create MovieSearchContainer (Smart Component)
  - Create `src/components/features/movies/MovieSearchContainer.tsx`
  - Use `useDebounce` hook for search input
  - Use `useSearchMovies` hook for API calls
  - Compose with SearchInput and MovieListContainer
  - _Requirements: 2.1, 2.5, 5.5, 6.2_

- [ ] 28. Create MovieFilters component (Dumb Component)
  - Create `src/components/features/movies/MovieFilters.tsx`
  - Add props: `filters`, `onFilterChange`, `genres`
  - Pure presentational component with no logic
  - Use Tailwind for responsive layout
  - _Requirements: 2.2, 2.3, 4.1_

- [ ] 29. Refactor Movies page
  - Update `src/pages/Movies.tsx`
  - Compose MovieSearchContainer and MovieFilters
  - Remove all business logic (move to containers/hooks)
  - Use generic Grid component for layout
  - Use MediaCard for rendering items instead of MovieCard
  - Ensure proper TypeScript types throughout
  - _Requirements: 2.5, 5.5, 8.1, 8.4_

- [ ]* 29.1 Write integration tests for Movies page
  - Test search functionality
  - Test filter functionality
  - Test infinite scroll
  - _Requirements: 14.5_

## Phase 8: Series Feature Refactoring

- [ ] 30. Create SeriesListContainer (Smart Component)
  - Create `src/components/features/series/SeriesListContainer.tsx`
  - Similar to MovieListContainer but for TV shows
  - Use `usePopularTVShows` or `useSearchTVShows` hooks
  - _Requirements: 2.1, 2.5, 9.2_

- [ ] 31. Create SeriesSearchContainer (Smart Component)
  - Create `src/components/features/series/SeriesSearchContainer.tsx`
  - Similar to MovieSearchContainer but for TV shows
  - Reuse useDebounce hook
  - _Requirements: 2.1, 2.5, 6.2, 9.2_

- [ ] 32. Refactor Series page
  - Update `src/pages/Series.tsx`
  - Compose SeriesSearchContainer and filters
  - Use generic Grid and MediaCard components
  - Remove all business logic
  - _Requirements: 2.5, 5.5, 8.1, 9.2_

- [ ]* 32.1 Write integration tests for Series page
  - Test search functionality
  - Test filter functionality
  - _Requirements: 14.5_

## Phase 9: Collections Feature Refactoring

- [ ] 33. Create CollectionCard component (Dumb Component)
  - Create `src/components/features/collections/CollectionCard.tsx`
  - Add props: `collection`, `onClick`, `onEdit`, `onDelete`
  - Pure presentational component
  - Use Tailwind for card styling
  - _Requirements: 2.2, 2.3, 4.1_

- [ ] 34. Create CollectionListContainer (Smart Component)
  - Create `src/components/features/collections/CollectionListContainer.tsx`
  - Use `useCollections` hook for data fetching
  - Handle loading and error states
  - Pass data to Grid component
  - _Requirements: 2.1, 2.5_

- [ ] 35. Create AddToCollectionModal component
  - Create `src/components/features/collections/AddToCollectionModal.tsx`
  - Use generic Modal component
  - Add form with validation using Zod
  - Use react-hook-form for form management
  - _Requirements: 5.1, 5.5, 11.3_

- [ ] 36. Refactor Collections page
  - Update `src/pages/Collections.tsx`
  - Compose CollectionListContainer
  - Use generic components for layout
  - Remove business logic
  - _Requirements: 2.5, 5.5, 8.1_

## Phase 10: Performance Optimization

- [ ] 37. Add React.memo to pure components
  - Wrap all dumb components with React.memo
  - Add custom comparison function where needed
  - Document why memoization is used
  - _Requirements: 12.4, 15.1_

- [ ] 38. Add useMemo for expensive computations
  - Identify expensive filtering/sorting operations in pages
  - Wrap with useMemo with proper dependencies
  - Add comments explaining the optimization
  - _Requirements: 12.1, 15.3_

- [ ] 39. Add useCallback for event handlers
  - Wrap all event handlers passed as props with useCallback
  - Ensure proper dependency arrays
  - Focus on Movies, Series, Collections pages
  - _Requirements: 12.2_

- [ ] 40. Implement code splitting for pages
  - Use React.lazy for all page components
  - Add Suspense boundaries with loading states
  - Test lazy loading behavior
  - _Requirements: 12.3_

- [ ] 41. Optimize images
  - Add responsive srcSet to MovieCard/MediaCard images
  - Ensure loading="lazy" on all images (already done in MovieCard)
  - Add proper alt text for accessibility
  - _Requirements: 12.5, 13.1_

- [ ] 42. Implement list virtualization
  - Add virtualization to Grid component for large lists
  - Use @tanstack/react-virtual
  - Make it optional via prop
  - _Requirements: 12.3_

## Phase 11: Accessibility Improvements

- [ ] 43. Add ARIA attributes to interactive elements
  - Review all buttons, links, and interactive elements
  - Add aria-label where text is not visible (e.g., icon-only buttons)
  - Add aria-pressed for toggle buttons
  - Add aria-expanded for collapsible sections (filters in Movies/Series)
  - _Requirements: 13.1_

- [ ] 44. Improve form accessibility
  - Ensure all inputs have associated labels (Collections page forms)
  - Add aria-describedby for help text
  - Add aria-invalid and error announcements
  - Test with screen reader
  - _Requirements: 13.2_

- [ ] 45. Implement keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Add visible focus indicators with Tailwind focus: classes
  - Test tab order in Movies, Series, Collections pages
  - Add keyboard shortcuts where appropriate
  - _Requirements: 13.3_

- [ ] 46. Add focus management to modals
  - Implement focus trap in Modal component
  - Restore focus on close
  - Test with keyboard navigation
  - Apply to Collections dialogs
  - _Requirements: 13.5_

- [ ] 47. Improve color contrast
  - Review all text/background combinations
  - Ensure WCAG AA compliance (4.5:1 for normal text)
  - Use Tailwind color tokens with proper contrast
  - Add alternative indicators where color conveys meaning
  - _Requirements: 13.4_

## Phase 12: Documentation & Polish

- [ ] 48. Add JSDoc comments to complex components
  - Document all generic components with usage examples
  - Document props with @param tags
  - Add @example sections for complex APIs (Grid, List, Modal)
  - _Requirements: 15.1, 15.2, 15.5_

- [ ] 49. Create component documentation
  - Create README.md in each new component folder
  - Document props, variants, and usage examples
  - Add code examples
  - Note: Card component already has README.md
  - _Requirements: 15.4, 15.5_

- [ ] 50. Create architecture documentation
  - Create `docs/ARCHITECTURE.md`
  - Document Smart vs Dumb component pattern
  - Document service layer architecture
  - Document type system organization
  - Document the refactoring approach
  - _Requirements: 15.4_

- [ ] 51. Create migration guide
  - Create `docs/MIGRATION.md`
  - Document breaking changes from refactoring
  - Provide migration examples for old patterns to new
  - Document new patterns and best practices
  - _Requirements: 15.4_

- [ ] 52. Update main README
  - Update project structure section
  - Add development guidelines
  - Add testing instructions
  - Add contribution guidelines
  - _Requirements: 15.4_

- [ ] 53. Final code review and cleanup
  - Remove unused imports and files
  - Remove or deprecate old MovieCard if MediaCard replaces it
  - Ensure consistent naming conventions
  - Verify all TypeScript errors are resolved
  - Run linter and fix all issues
  - _Requirements: 8.5, 9.1, 10.5_

## Phase 13: Testing & Validation

- [ ] 54. Run TypeScript compiler
  - Ensure no TypeScript errors
  - Verify strict mode compliance
  - Check for any remaining `any` types (should be fixed in task 25)
  - _Requirements: 1.1, 1.2, 1.4_

- [ ] 55. Run ESLint
  - Fix all linting errors
  - Configure ESLint rules for new patterns
  - Ensure consistent code style
  - _Requirements: 8.5, 10.5_

- [ ] 56. Run all tests
  - Execute unit tests
  - Execute component tests
  - Execute integration tests
  - Execute property-based tests
  - Ensure 100% of tests pass
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 57. Manual testing
  - Test all user flows (Movies, Series, Collections)
  - Test on different screen sizes
  - Test keyboard navigation
  - Test with screen reader
  - Test error scenarios
  - _Requirements: 13.3, 14.5_

- [ ] 58. Performance audit
  - Run Lighthouse audit
  - Check bundle size
  - Verify lazy loading works
  - Check for unnecessary re-renders using React DevTools
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 59. Accessibility audit
  - Run axe DevTools
  - Test with keyboard only
  - Test with screen reader
  - Verify WCAG compliance
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 60. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
