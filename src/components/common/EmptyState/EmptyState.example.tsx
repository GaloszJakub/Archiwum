import { Film, Search, FolderOpen } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";

/**
 * Example usage of the EmptyState component
 */
export function EmptyStateExamples() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">EmptyState Examples</h2>
      </div>

      {/* Basic usage */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
        <EmptyState title="No items found" />
      </div>

      {/* With description */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">With Description</h3>
        <EmptyState
          title="No movies in your collection"
          description="Start adding movies to build your personal collection"
        />
      </div>

      {/* With custom icon */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">With Custom Icon</h3>
        <EmptyState
          icon={Film}
          title="No movies found"
          description="Try adjusting your search or filters to find what you're looking for"
        />
      </div>

      {/* With action button */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">With Action Button</h3>
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          description="Create your first collection to organize your favorite movies and series"
          action={
            <Button onClick={() => console.log("Create collection")}>
              Create Collection
            </Button>
          }
        />
      </div>

      {/* Search results empty state */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Search Results Empty</h3>
        <EmptyState
          icon={Search}
          title="No results found"
          description="We couldn't find any movies matching your search. Try different keywords."
          action={
            <Button variant="outline" onClick={() => console.log("Clear search")}>
              Clear Search
            </Button>
          }
        />
      </div>

      {/* Different sizes */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-muted-foreground mb-2">Small</p>
            <EmptyState size="sm" title="No items" description="Small size variant" />
          </div>
          <div className="border-b pb-4">
            <p className="text-sm text-muted-foreground mb-2">Medium (default)</p>
            <EmptyState size="md" title="No items" description="Medium size variant" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Large</p>
            <EmptyState size="lg" title="No items" description="Large size variant" />
          </div>
        </div>
      </div>

      {/* Custom styling */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Custom Styling</h3>
        <EmptyState
          icon={Film}
          title="Custom styled empty state"
          description="This empty state has custom background and minimum height"
          className="min-h-[300px] bg-muted/30 rounded-lg border-2 border-dashed"
        />
      </div>
    </div>
  );
}
