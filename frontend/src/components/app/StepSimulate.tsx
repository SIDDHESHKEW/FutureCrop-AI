import { useEffect, useState } from "react";
import { Cpu, Database, Atom, Brain, Check } from "lucide-react";

const PHASES = [
  { icon: Database, label: "Loading regional climate tensors", ms: 700 },
  { icon: Atom, label: "Resolving soil hydrology PDEs", ms: 900 },
  { icon: Cpu, label: "Forward-passing 12.7M genotypes", ms: 1100 },
  { icon: Brain, label: "Computing SHAP attributions", ms: 700 },
];

export function StepSimulate({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    function run() {
      if (i >= PHASES.length) {
        if (!cancelled) setTimeout(onDone, 350);
        return;
      }
      const start = performance.now();
      const dur = PHASES[i].ms;
      function tick(t: number) {
        if (cancelled) return;
        const elapsed = t - start;
        const local = Math.min(1, elapsed / dur);
        const overall = (i + local) / PHASES.length;
        setProgress(overall);
        if (local < 1) {
          requestAnimationFrame(tick);
        } else {
          i++;
          setPhase(i);
          run();
        }
      }
      requestAnimationFrame(tick);
    }
    run();
    return () => { cancelled = true; };
  }, [onDone]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-10 animate-fade-in">
        <div
          className="pointer-events-none absolute inset-0 grid-bg opacity-30"
          style={{ animation: "grid-flow 8s linear infinite" }}
        />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Step 03 · Inference
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Running CropOracle simulation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time inference on the global decision engine.
          </p>

          {/* Animated rings */}
          <div className="my-10 flex items-center justify-center">
            <div className="relative h-44 w-44">
              <div
                className="absolute inset-0 rounded-full border-2 border-primary/30 animate-glow-pulse"
                style={{ boxShadow: "0 0 60px oklch(0.88 0.27 145 / 0.4)" }}
              />
              <div
                className="absolute inset-3 rounded-full border border-accent/40"
                style={{ animation: "spin 6s linear infinite" }}
              />
              <div
                className="absolute inset-6 rounded-full border border-violet/40"
                style={{ animation: "spin 4s linear infinite reverse" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-3xl neon-text">
                    {Math.round(progress * 100)}%
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    inference
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase list */}
          <ul className="space-y-2">
            {PHASES.map((p, i) => {
              const done = i < phase;
              const active = i === phase;
              return (
                <li
                  key={p.label}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                    active
                      ? "border-primary/40 bg-primary/5"
                      : done
                        ? "border-hairline bg-panel/40"
                        : "border-hairline bg-panel/20 opacity-50"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      active ? "bg-primary/20 text-primary" : done ? "bg-primary/15 text-primary" : "bg-panel-2 text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : <p.icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                    {p.label}
                  </span>
                  {active && (
                    <span className="ml-auto font-mono text-[10px] text-primary">running…</span>
                  )}
                  {done && <span className="ml-auto font-mono text-[10px] text-muted-foreground">ok</span>}
                </li>
              );
            })}
          </ul>

          {/* Bottom progress bar */}
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-panel-2">
            <div
              className="h-full transition-[width] duration-100"
              style={{ width: `${progress * 100}%`, background: "var(--gradient-neon)" }}
            />
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
