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

function isBadge(x: unknown): x is ReferralProgramBadge {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return typeof b.label === "string" && (b.tone === "earned" || b.tone === "active" || b.tone === "locked");
}

function isReferralProgram(x: unknown): x is ReferralProgramI18n {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string" || typeof o.code !== "string") return false;
  if (typeof o.eyebrow !== "string" || typeof o.highlight !== "string" || typeof o.subtitle !== "string") return false;
  if (typeof o.progressLabel !== "string" || typeof o.progressHint !== "string") return false;
  if (typeof o.progressCurrent !== "number" || typeof o.progressGoal !== "number") return false;
  if (!Array.isArray(o.badges) || !o.badges.every(isBadge)) return false;
  return true;
}

export function parseReferralPrograms(raw: unknown): ReferralProgramI18n[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isReferralProgram);
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
