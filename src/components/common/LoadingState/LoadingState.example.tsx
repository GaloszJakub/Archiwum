import { LoadingState } from "./LoadingState";

/**
 * Example usage of the LoadingState component
 * This file demonstrates various ways to use the LoadingState component
 */

export function LoadingStateExamples() {
  return (
    <div className="space-y-12 p-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold">Basic Usage</h2>
        <div className="rounded-lg border p-8">
          <LoadingState />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">With Message</h2>
        <div className="rounded-lg border p-8">
          <LoadingState message="Loading movies..." />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Size Variants</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-8">
            <h3 className="mb-4 text-center text-sm font-semibold">Small</h3>
            <LoadingState size="sm" message="Loading..." />
          </div>
          <div className="rounded-lg border p-8">
            <h3 className="mb-4 text-center text-sm font-semibold">Medium</h3>
            <LoadingState size="md" message="Loading..." />
          </div>
          <div className="rounded-lg border p-8">
            <h3 className="mb-4 text-center text-sm font-semibold">Large</h3>
            <LoadingState size="lg" message="Loading..." />
          </div>
          <div className="rounded-lg border p-8">
            <h3 className="mb-4 text-center text-sm font-semibold">Extra Large</h3>
            <LoadingState size="xl" message="Loading..." />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Custom Styling</h2>
        <div className="rounded-lg border p-8">
          <LoadingState
            size="lg"
            message="Fetching data from server..."
            className="min-h-[300px] bg-muted/50"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Real-World Example: Movie List</h2>
        <div className="rounded-lg border p-8">
          <MovieListExample />
        </div>
      </section>
    </div>
  );
}

/**
 * Example of LoadingState in a real-world scenario
 */
function MovieListExample() {
  // Simulate loading state
  const isLoading = true;

  if (isLoading) {
    return (
      <LoadingState
        size="lg"
        message="Loading movies..."
        className="min-h-[400px]"
      />
    );
  }

  return <div>Movie list would appear here</div>;
}

/**
 * Example of LoadingState in a card
 */
export function CardLoadingExample() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <LoadingState size="sm" message="Loading details..." className="py-8" />
    </div>
  );
}

/**
 * Example of full-page loading
 */
export function FullPageLoadingExample() {
  return (
    <LoadingState
      size="xl"
      message="Loading application..."
      className="min-h-screen"
    />
  );
}

/**
 * Example with conditional rendering
 */
export function ConditionalLoadingExample() {
  const isLoading = true;
  const error = null;
  const data = null;

  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <div>Data: {data}</div>;
}
