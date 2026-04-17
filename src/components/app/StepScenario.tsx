import type { Scenario } from "@/lib/futurecrop-data";
import { Thermometer, Wind, Calendar } from "lucide-react";

const SSP_OPTIONS: {
  ssp: Scenario["ssp"];
  label: string;
  desc: string;
  warming: number;
  co2: number;
}[] = [
  { ssp: "SSP1-1.9", label: "Sustainability", desc: "Aggressive mitigation", warming: 1.4, co2: 445 },
  { ssp: "SSP2-4.5", label: "Middle road", desc: "Current trajectory", warming: 2.7, co2: 603 },
  { ssp: "SSP3-7.0", label: "Regional rivalry", desc: "High emissions", warming: 3.6, co2: 867 },
  { ssp: "SSP5-8.5", label: "Fossil-fueled", desc: "Worst case", warming: 4.4, co2: 1135 },
];

export function StepScenario({
  scenario,
  onChange,
  onNext,
  onBack,
}: {
  scenario: Scenario;
  onChange: (s: Scenario) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const setSSP = (ssp: Scenario["ssp"]) => {
    const opt = SSP_OPTIONS.find((o) => o.ssp === ssp)!;
    onChange({ ...scenario, ssp, warming: opt.warming, co2: opt.co2 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glass-strong rounded-3xl p-6 animate-fade-in">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Step 02 · Climate scenario
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          Configure climate trajectory
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select an IPCC Shared Socioeconomic Pathway and projection horizon.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SSP_OPTIONS.map((o) => {
            const active = scenario.ssp === o.ssp;
            return (
              <button
                key={o.ssp}
                onClick={() => setSSP(o.ssp)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary/50 bg-primary/5 neon-glow"
                    : "border-hairline bg-panel/40 hover:bg-panel-2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{o.ssp}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-primary shadow-[0_0_10px_var(--primary)]" : "bg-panel-2"
                    }`}
                  />
                </div>
                <div className="mt-2 text-base font-semibold">{o.label}</div>
                <div className="text-xs text-muted-foreground">{o.desc}</div>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-warning">+{o.warming}°C</span>
                  <span className="text-muted-foreground">{o.co2} ppm</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-hairline bg-panel/40 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-accent" />
              <span>Projection year</span>
            </div>
            <span className="font-mono text-lg neon-text">{scenario.year}</span>
          </div>
          <input
            type="range"
            min={2030}
            max={2100}
            step={5}
            value={scenario.year}
            onChange={(e) => onChange({ ...scenario, year: Number(e.target.value) })}
            className="mt-4 w-full accent-[oklch(0.88_0.27_145)]"
            style={{ height: 4 }}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>2030</span><span>2050</span><span>2070</span><span>2100</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            onClick={onBack}
            className="rounded-xl glass px-4 py-2 text-sm hover:bg-panel-2"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground neon-glow"
          >
            Run simulation →
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 animate-fade-in">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Forcing summary</div>
        <div className="mt-4 space-y-4">
          <Stat icon={Thermometer} label="Mean warming" value={`+${scenario.warming.toFixed(1)} °C`} accent="text-warning" />
          <Stat icon={Wind} label="Atmospheric CO₂" value={`${scenario.co2} ppm`} accent="text-accent" />
          <Stat icon={Calendar} label="Horizon" value={`${scenario.year}`} accent="text-foreground" />
        </div>
        <div className="mt-6 rounded-xl bg-panel/40 p-4 text-xs text-muted-foreground">
          <span className="text-foreground">Note.</span> Forcing values derived from CMIP6
          ensemble means and downscaled with our 4-km regional model.
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, accent,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className={`font-mono ${accent}`}>{value}</span>
    </div>
  );
}
