/**
 * Common API response types shared across different services
 */

/**
 * Generic paginated response structure
 * @template T The type of items in the results array
 */
export interface PaginatedResponse<T> {
  /** Current page number (1-indexed) */
  page: number;
  /** Array of results for the current page */
  results: T[];
  /** Total number of pages available */
  total_pages: number;
  /** Total number of results across all pages */
  total_results: number;
}

/**
 * Standard API error response structure
 */
export interface APIErrorResponse {
  /** HTTP status code */
  status_code: number;
  /** Human-readable error message */
  status_message: string;
  /** Whether the request was successful */
  success: false;
}

/**
 * Generic API success response
 * @template T The type of data returned
 */
export interface APISuccessResponse<T> {
  /** Whether the request was successful */
  success: true;
  /** Response data */
  data: T;
}

/**
 * Union type for API responses
 * @template T The type of data returned on success
 */
export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;
