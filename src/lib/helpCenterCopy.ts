import type en from "@/lib/i18n/locales/en.json";
import i18n from "@/lib/i18n/instance";

export type HelpCenterKey = keyof typeof en.helpCenter;

export function tHelp(key: HelpCenterKey, vars?: Record<string, string>): string {
  return i18n.t(`helpCenter.${key}`, vars ?? {});
}
