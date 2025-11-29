/**
 * Custom error class for API-related errors
 * Provides structured error information for better error handling and debugging
 */

/**
 * Error codes for different types of API errors
 */
export enum APIErrorCode {
  /** Network-related errors (no connection, timeout, etc.) */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Rate limit exceeded */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  /** Invalid request (400) */
  BAD_REQUEST = 'BAD_REQUEST',
  /** Authentication required (401) */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** Access forbidden (403) */
  FORBIDDEN = 'FORBIDDEN',
  /** Resource not found (404) */
  NOT_FOUND = 'NOT_FOUND',
  /** Server error (500+) */
  SERVER_ERROR = 'SERVER_ERROR',
  /** Unknown error */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom error class for API operations
 * Extends the native Error class with additional context
 */
export class APIError extends Error {
  /**
   * HTTP status code (if applicable)
   */
  public readonly statusCode: number | null;

  /**
   * Structured error code for programmatic handling
   */
  public readonly code: APIErrorCode;

  /**
   * Additional context about the error
   */
  public readonly context?: Record<string, unknown>;

  /**
   * Timestamp when the error occurred
   */
  public readonly timestamp: Date;

  /**
   * Create a new APIError
   * 
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (if applicable)
   * @param code - Structured error code
   * @param context - Additional error context
   */
  constructor(
    message: string,
    statusCode: number | null = null,
    code: APIErrorCode = APIErrorCode.UNKNOWN_ERROR,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  /**
   * Create an APIError from an HTTP status code
   * 
   * @param statusCode - HTTP status code
   * @param message - Optional custom message
   * @returns APIError instance
   */
  static fromStatusCode(statusCode: number, message?: string): APIError {
    let code: APIErrorCode;
    let defaultMessage: string;

    if (statusCode === 400) {
      code = APIErrorCode.BAD_REQUEST;
      defaultMessage = 'Invalid request';
    } else if (statusCode === 401) {
      code = APIErrorCode.UNAUTHORIZED;
      defaultMessage = 'Authentication required';
    } else if (statusCode === 403) {
      code = APIErrorCode.FORBIDDEN;
      defaultMessage = 'Access forbidden';
    } else if (statusCode === 404) {
      code = APIErrorCode.NOT_FOUND;
      defaultMessage = 'Resource not found';
    } else if (statusCode >= 500) {
      code = APIErrorCode.SERVER_ERROR;
      defaultMessage = 'Server error';
    } else {
      code = APIErrorCode.UNKNOWN_ERROR;
      defaultMessage = 'An error occurred';
    }

    return new APIError(
      message || defaultMessage,
      statusCode,
      code,
      { statusCode }
    );
  }

  /**
   * Create an APIError for rate limit exceeded
   * 
   * @param timeUntilReset - Time in milliseconds until rate limit resets
   * @returns APIError instance
   */
  static rateLimitExceeded(timeUntilReset: number): APIError {
    const seconds = Math.ceil(timeUntilReset / 1000);
    return new APIError(
      `Rate limit exceeded. Please wait ${seconds} seconds.`,
      429,
      APIErrorCode.RATE_LIMIT_EXCEEDED,
      { timeUntilReset, seconds }
    );
  }

  /**
   * Create an APIError for network errors
   * 
   * @param originalError - The original error that occurred
   * @returns APIError instance
   */
  static networkError(originalError?: Error): APIError {
    return new APIError(
      'Network error. Please check your connection and try again.',
      null,
      APIErrorCode.NETWORK_ERROR,
      { originalError: originalError?.message }
    );
  }

  /**
   * Check if an error is an APIError instance
   * 
   * @param error - Error to check
   * @returns True if error is an APIError
   */
  static isAPIError(error: unknown): error is APIError {
    return error instanceof APIError;
  }

  /**
   * Convert error to a plain object for logging/serialization
   * 
   * @returns Plain object representation
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
