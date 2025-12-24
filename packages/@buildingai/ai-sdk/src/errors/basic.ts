/**
 * Base error class for the AI SDK
 */
export class AISdkError extends Error {
    /**
     * Underlying/original error
     */
    cause?: Error;

    /**
     * Constructor
     * @param message Error message
     * @param cause Original error
     * @param name Custom error name (optional)
     */
    constructor(message?: string, cause?: Error) {
        super(message);
        this.name = "AISdkError";
        this.cause = cause;

        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Get the full error message including the original error
     */
    get message(): string {
        if (this.cause) {
            return `${super.message}\nCaused by: ${this.cause.message}`;
        }
        return super.message;
    }
}
