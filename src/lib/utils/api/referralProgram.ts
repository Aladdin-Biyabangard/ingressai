import { authAxios } from "@/lib/axios";

/**
 * Referral program API DTOs. `proggressGoal` matches backend spelling.
 * HTTP paths stay `v1/referal` if the gateway uses that segment.
 */
export type ReferralProgramRequestDto = {
  program: string;
  highlight: string;
  title: string;
  subtitle: string;
  progressCurrent: number;
  proggressGoal: number;
  progressHint: string;
  badges: string[];
};

export type ReferralProgramResponseDto = ReferralProgramRequestDto & {
  referralCode: string;
};

/** Shared React Query key for list endpoints (dashboard + admin). */
export const REFERRAL_PROGRAMS_QUERY_KEY = ["referral-programs"] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function strArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

/** Normalizes one item from GET search (tolerates legacy `referalCode` from API). */
export function parseReferralProgramResponse(raw: unknown): ReferralProgramResponseDto | null {
  if (!isRecord(raw)) return null;
  const program = str(raw.program);
  if (!program) return null;
  const goal = num(raw.proggressGoal, num(raw.progressGoal, 0));
  return {
    program,
    highlight: str(raw.highlight),
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    progressCurrent: num(raw.progressCurrent, 0),
    proggressGoal: goal,
    progressHint: str(raw.progressHint),
    badges: strArr(raw.badges),
    referralCode: str(raw.referralCode) || str(raw.referalCode),
  };
}

export async function createReferralProgram(body: ReferralProgramRequestDto): Promise<ReferralProgramResponseDto> {
  const res = await authAxios.post<unknown>("v1/referal", body);
  const parsed = parseReferralProgramResponse(res.data);
  if (!parsed) throw new Error("Invalid referral program response");
  return parsed;
}

export async function searchReferralPrograms(): Promise<ReferralProgramResponseDto[]> {
  const res = await authAxios.get<unknown[]>("v1/referal/search");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map(parseReferralProgramResponse).filter((x): x is ReferralProgramResponseDto => x !== null);
}
