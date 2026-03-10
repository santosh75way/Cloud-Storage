type ErrorWithMessage = {
  data?: {
    message?: string;
    code?: string;
  };
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (typeof error === "object" && error !== null) {
    const apiError = error as ErrorWithMessage;

    if (apiError.data?.message && apiError.data.message.trim().length > 0) {
      return apiError.data.message;
    }

    if (apiError.message && apiError.message.trim().length > 0) {
      return apiError.message;
    }
  }

  return fallback;
}