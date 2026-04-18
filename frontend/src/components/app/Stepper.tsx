import { Check } from "lucide-react";

export type StepKey =
  | "region"
  | "scenario"
  | "crop"
  | "simulate"
  | "results"
  | "analysis"
  | "confirm";

export const STEPS: { key: StepKey; label: string; index: number }[] = [
  { key: "region", label: "Select Location", index: 1 },
  { key: "scenario", label: "Climate Setup", index: 2 },
  { key: "crop", label: "Crop Selection", index: 3 },
  { key: "simulate", label: "Run Simulation", index: 4 },
  { key: "results", label: "Results", index: 5 },
  { key: "analysis", label: "AI Insights", index: 6 },
  { key: "confirm", label: "Download Report", index: 7 },
];

export function Stepper({
  current,
  onStepClick,
}: {
  current: StepKey;
  onStepClick?: (step: StepKey) => void;
}) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  const step = Math.max(1, currentIdx + 1);
  const totalSteps = STEPS.length;
  const progress = ((step - 1) / Math.max(1, totalSteps - 1)) * 100;
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="glass rounded-2xl p-1.5">
      <div className="mb-2 h-1 overflow-hidden rounded-full bg-panel-2">
        <div
          className="h-full transition-[width] duration-300"
          style={{ width: `${safeProgress}%`, background: "var(--gradient-neon)" }}
        />
      </div>

      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const canNavigate = i <= currentIdx;
          return (
            <div key={s.key} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(s.key)}
                disabled={!canNavigate || !onStepClick}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all ${
                  active
                    ? "bg-primary/15 text-primary"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground"
                } ${canNavigate ? "cursor-pointer hover:bg-panel-2/50" : "cursor-not-allowed opacity-70"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] ${
                    active
                      ? "bg-primary text-primary-foreground neon-glow"
                      : done
                        ? "bg-primary/20 text-primary"
                        : "bg-panel-2 text-muted-foreground"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : s.index}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="mx-1 h-px w-4 bg-hairline sm:w-6" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
