import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReferralProgramResponseDto } from "@/lib/utils/api/referralProgram";

export function ReferralProgramAdminListCard({
  program,
  onCopyCode,
}: {
  program: ReferralProgramResponseDto;
  onCopyCode: (code: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-card p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-primary/10 sm:p-5",
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-accent/15 blur-2xl"
        aria-hidden
      />
      <div className="relative min-w-0 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{program.program}</p>
            <h3 className="mt-1 truncate text-base font-bold text-foreground sm:text-lg">{program.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{program.subtitle}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 border border-primary/25 bg-primary/10 text-primary">
            {program.highlight}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            {t("referralAdmin.progressLabel", {
              current: program.progressCurrent,
              goal: program.proggressGoal,
            })}
          </span>
        </div>
        {program.badges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {program.badges.map((b) => (
              <Badge key={b} variant="outline" className="border-dashed text-[11px] font-normal">
                {b}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">{program.progressHint}</p>
        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="min-w-0 truncate rounded-lg border border-primary/20 bg-primary/5 px-2 py-1.5 font-mono text-xs text-foreground">
            {program.referralCode || "—"}
          </code>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={!program.referralCode}
            className="h-10 shrink-0 gap-2 border-primary/30 bg-primary/10 hover:bg-primary/15"
            onClick={() => onCopyCode(program.referralCode)}
          >
            <Copy className="size-4 shrink-0" aria-hidden />
            {t("referralAdmin.copyCode")}
          </Button>
        </div>
      </div>
    </div>
  );
}
