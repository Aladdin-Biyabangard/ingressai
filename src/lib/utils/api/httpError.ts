/**
 * Matches backend `ErrorResponse(String code, String message)` JSON shape.
 */

export type ErrorResponse = {
  code: string;
  message: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Parses `ErrorResponse` from response body when present. */
export function parseErrorResponse(data: unknown): Partial<ErrorResponse> | null {
  if (!isRecord(data)) return null;
  const code = data.code;
  const message = data.message;
  const out: Partial<ErrorResponse> = {};
  if (typeof code === "string" && code.trim()) out.code = code.trim();
  if (typeof message === "string" && message.trim()) out.message = message.trim();
  return out.code !== undefined || out.message !== undefined ? out : null;
}

/**
 * Human-readable message for toasts / UI. Prefers `ErrorResponse.message`, then common Spring / problem fields.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const ax = err as {
    response?: { data?: unknown };
    message?: string;
  };
  const data = ax.response?.data;
  const parsed = parseErrorResponse(data);
  if (parsed?.message) return parsed.message;

  if (isRecord(data)) {
    if (typeof data.detail === "string" && data.detail) return data.detail;
    if (typeof data.title === "string" && data.title) return data.title;
    if (typeof data.error === "string" && data.error) return data.error;
  }

  if (typeof ax.message === "string" && ax.message.startsWith("Network")) {
    return "Network error. Check your connection.";
  }
  return fallback;
}

/** Full parse for branching on `code` (e.g. `NOT_FOUND`). */
export function getApiError(err: unknown, fallbackMessage: string): { code?: string; message: string } {
  const ax = err as {
    response?: { data?: unknown };
    message?: string;
  };
  const data = ax.response?.data;
  const parsed = parseErrorResponse(data);
  let message = parsed?.message ?? "";

  if (!message && isRecord(data)) {
    if (typeof data.detail === "string" && data.detail) message = data.detail;
    else if (typeof data.title === "string" && data.title) message = data.title;
    else if (typeof data.error === "string" && data.error) message = data.error;
  }

  if (!message && typeof ax.message === "string" && ax.message.startsWith("Network")) {
    message = "Network error. Check your connection.";
  }

  if (!message) message = fallbackMessage;

  return { code: parsed?.code, message };
}
