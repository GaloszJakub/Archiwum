import { XCircle, WifiOff, ServerCrash } from "lucide-react";
import { ErrorState } from "./ErrorState";
import { APIError } from "@/utils/errors/APIError";

/**
 * Example usage of the ErrorState component
 * This file demonstrates various use cases and configurations
 */

export function ErrorStateExamples() {
  const handleRetry = () => {
    console.log("Retry clicked");
  };

  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-xl font-bold mb-4">Basic Usage</h2>
        <div className="space-y-4">
          {/* String error */}
          <ErrorState error="Failed to load movies" />

          {/* Error object */}
          <ErrorState error={new Error("Network connection failed")} />

          {/* APIError */}
          <ErrorState
            error={APIError.networkError()}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">With Retry Button</h2>
        <div className="space-y-4">
          <ErrorState
            error="Failed to fetch data"
            onRetry={handleRetry}
          />

          <ErrorState
            error={new Error("Connection timeout")}
            onRetry={handleRetry}
            retryText="Reload"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Custom Icons</h2>
        <div className="space-y-4">
          <ErrorState
            error="Network error"
            icon={WifiOff}
            title="No Connection"
          />

          <ErrorState
            error="Server error"
            icon={ServerCrash}
            title="Server Error"
          />

          <ErrorState
            error="Operation failed"
            icon={XCircle}
            title="Failed"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Different Sizes</h2>
        <div className="space-y-4">
          <ErrorState
            size="sm"
            error="Small error"
            onRetry={handleRetry}
          />

          <ErrorState
            size="md"
            error="Medium error"
            onRetry={handleRetry}
          />

          <ErrorState
            size="lg"
            error="Large error"
            onRetry={handleRetry}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Custom Styling</h2>
        <div className="space-y-4">
          <ErrorState
            error="Styled error"
            className="min-h-[300px] bg-destructive/5 rounded-lg border border-destructive/20"
            onRetry={handleRetry}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Hide Error Message</h2>
        <div className="space-y-4">
          <ErrorState
            error={new Error("This message won't be shown")}
            title="An error occurred"
            showErrorMessage={false}
            onRetry={handleRetry}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Real-World Examples</h2>
        <div className="space-y-4">
          {/* API Error */}
          <ErrorState
            error={APIError.fromStatusCode(404, "Movie not found")}
            title="Not Found"
            onRetry={handleRetry}
          />

          {/* Rate Limit Error */}
          <ErrorState
            error={APIError.rateLimitExceeded(30000)}
            title="Rate Limit Exceeded"
            onRetry={handleRetry}
          />

          {/* Network Error */}
          <ErrorState
            error={APIError.networkError()}
            icon={WifiOff}
            title="Connection Error"
            onRetry={handleRetry}
          />
        </div>
      </section>
    </div>
  );
}
