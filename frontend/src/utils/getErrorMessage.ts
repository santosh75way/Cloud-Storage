/**
 * Safely extracts an error message from an unknown error type.
 * Use this in `catch (error: unknown)` blocks instead of `catch (error: any)`.
 */
export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        const msg = (error as { message: unknown }).message;
        if (typeof msg === "string") {
            return msg;
        }
    }

    if (typeof error === "string") {
        return error;
    }

    return fallback;
}
