import type { ReferralProgramResponseDto } from "@/lib/utils/api/referralProgram";

export type ReferralBadgeTone = "earned" | "active" | "locked";

export type ReferralProgramStep = { title: string; body: string };

export type ReferralProgramBadge = { label: string; tone: ReferralBadgeTone };

export type ReferralProgramI18n = {
  id: string;
  accent?: string;
  eyebrow: string;
  highlight: string;
  title: string;
  subtitle: string;
  progressCurrent: number;
  progressGoal: number;
  progressLabel: string;
  progressHint: string;
  badges: ReferralProgramBadge[];
  code: string;
};

function isStep(x: unknown): x is ReferralProgramStep {
  if (typeof x !== "object" || x === null) return false;
  const s = x as Record<string, unknown>;
  return typeof s.title === "string" && typeof s.body === "string";
}

export function parseReferralSteps(raw: unknown): ReferralProgramStep[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isStep);
}

export function formatProgressLabel(template: string, current: number, goal: number): string {
  return template.replace(/\{\{current\}\}/g, String(current)).replace(/\{\{goal\}\}/g, String(goal));
}

export function referralProgressPercent(current: number, goal: number): number {
  if (!Number.isFinite(goal) || goal <= 0) return 0;
  return Math.min(100, Math.max(0, (current / goal) * 100));
}

const DASHBOARD_ACCENT_CYCLE = ["amber", "violet", "sky"] as const;

export type MapReferralToDashboardOpts = {
  progressLabelTemplate: string;
  eyebrowDefault: string;
  accentIndex: number;
};

/** Maps API referral program DTO to the shape used by dashboard cards. */
export function mapReferralProgramToDashboardCard(
  dto: ReferralProgramResponseDto,
  opts: MapReferralToDashboardOpts,
): ReferralProgramI18n {
  const accent = DASHBOARD_ACCENT_CYCLE[opts.accentIndex % DASHBOARD_ACCENT_CYCLE.length];
  const badges: ReferralProgramBadge[] = dto.badges
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label) => ({ label, tone: "active" as const }));

  return {
    id: dto.program,
    accent,
    eyebrow: opts.eyebrowDefault,
    highlight: dto.highlight,
    title: dto.title,
    subtitle: dto.subtitle,
    progressCurrent: dto.progressCurrent,
    progressGoal: dto.proggressGoal,
    progressLabel: opts.progressLabelTemplate,
    progressHint: dto.progressHint,
    badges,
    code: dto.referralCode.trim(),
  };
}
