import { chatAxios } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/utils/api/httpError";

export type ChatHistoryRow = {
  id: number;
  userMessage: string;
  botMessage: string;
  createdAt: string;
};

export type ChatHistoryResponse = {
  messages: ChatHistoryRow[];
  nextBeforeId: number | null;
  hasMore: boolean;
  /** Son söhbət konteksti; null olarsa kurs MS sorğusu atılmır. */
  courseId: string | null;
};

export type ChatHistoryParams = {
  size?: number;
  beforeId?: number;
};

function parseHistoryCourseId(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t.length ? t : null;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return null;
}

function parseChatHistoryResponse(data: unknown): ChatHistoryResponse {
  const empty: ChatHistoryResponse = {
    messages: [],
    nextBeforeId: null,
    hasMore: false,
    courseId: null,
  };
  if (data == null || typeof data !== "object") return empty;
  const o = data as Record<string, unknown>;
  const raw = o.messages;
  const messages: ChatHistoryRow[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item == null || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const id = typeof row.id === "number" ? row.id : Number(row.id);
      if (!Number.isFinite(id)) continue;
      const userMessage = typeof row.userMessage === "string" ? row.userMessage : "";
      const botMessage = typeof row.botMessage === "string" ? row.botMessage : "";
      const createdAt = typeof row.createdAt === "string" ? row.createdAt : "";
      messages.push({ id, userMessage, botMessage, createdAt });
    }
  }
  const nextRaw = o.nextBeforeId;
  const nextBeforeId =
    typeof nextRaw === "number"
      ? nextRaw
      : nextRaw != null && Number.isFinite(Number(nextRaw))
        ? Number(nextRaw)
        : null;
  const hasMore = Boolean(o.hasMore);
  const courseId = parseHistoryCourseId(o.courseId);
  return { messages, nextBeforeId, hasMore, courseId };
}

export async function getChatHistory(params?: ChatHistoryParams): Promise<ChatHistoryResponse> {
  const size = Math.min(100, Math.max(1, params?.size ?? 20));
  const query: Record<string, number> = { size };
  if (params?.beforeId != null) query.beforeId = params.beforeId;
  try {
    const res = await chatAxios.get<unknown>("v1/chat/history", { params: query });
    return parseChatHistoryResponse(res.data);
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, "Failed to load chat history"));
  }
}

export type ChatBotRequest = {
  courseId: string | number | null;
  lang: string;
  /** Mətn sorğusu; kurs seçimi ilə yalnız `courseId` göndəriləndə `null`. */
  customMessage: string | null;
  /** Authenticated user; omitted or null for guests. */
  userId?: number | null;
};

function normalizeChatResponse(data: unknown): string {
  if (data == null) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    const text =
      o.message ??
      o.answer ??
      o.reply ??
      o.text ??
      o.content ??
      (typeof o.data === "string" ? o.data : null);
    if (typeof text === "string") return text;
  }
  return "";
}

export async function getChatBotResponse(params: ChatBotRequest): Promise<string> {
  try {
    const res = await chatAxios.post(`v1/chat`, {
      courseId: params.courseId ?? null,
      userId: params.userId ?? null,
      customMessage: params.customMessage === null ? null : (params.customMessage ?? ""),
      language: params.lang,
    });
    return normalizeChatResponse(res.data).trim();
  } catch (err: unknown) {
    throw new Error(getApiErrorMessage(err, "Failed to get chatbot response"));
  }
}
