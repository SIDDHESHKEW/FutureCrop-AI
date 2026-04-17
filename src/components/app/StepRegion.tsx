import { MapPin, Search } from "lucide-react";
import { REGIONS, type Region } from "@/lib/futurecrop-data";
import { useState } from "react";

export function StepRegion({
  selected,
  onSelect,
  onNext,
}: {
  selected: Region | null;
  onSelect: (r: Region) => void;
  onNext: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = REGIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.country.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glass-strong rounded-3xl p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Step 01 · Network
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Select an agricultural region
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the geographic network to load climate, soil and genotype layers.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full glass px-3 py-1.5 text-xs sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-muted-foreground">8 networks online</span>
          </div>
        </div>

        <div className="mt-5 flex h-10 items-center gap-2 rounded-xl glass px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search regions, countries, crops…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {filtered.map((r) => {
            const active = selected?.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? "border-primary/50 bg-primary/5 neon-glow"
                    : "border-hairline bg-panel/40 hover:bg-panel-2"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? "bg-primary/15" : "bg-panel-2"
                  }`}
                >
                  <MapPin className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{r.name}</span>
                    <span className="rounded-full bg-panel-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {r.staple}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {r.country} · {r.lat.toFixed(1)}°, {r.lon.toFixed(1)}° · {r.area}
                  </div>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    active ? "bg-primary shadow-[0_0_10px_var(--primary)]" : "bg-panel-2"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 animate-fade-in">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Selection</div>
        {selected ? (
          <>
            <div className="mt-2 text-lg font-semibold">{selected.name}</div>
            <div className="text-sm text-muted-foreground">{selected.country}</div>
            <MiniMap region={selected} />
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Latitude", `${selected.lat.toFixed(2)}°`],
                ["Longitude", `${selected.lon.toFixed(2)}°`],
                ["Coverage", selected.area],
                ["Primary staple", selected.staple],
                ["Layers ready", "Climate · Soil · Genotype"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-hairline pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={onNext}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground neon-glow transition-transform hover:scale-[1.01]"
            >
              Continue to scenario →
            </button>
          </>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">
            Pick a region to load layers.
          </div>
        )}
      </div>
    </div>
  );
}

function MiniMap({ region }: { region: Region }) {
  // Mercator-ish projection of lon/lat into a 160x100 box
  const x = ((region.lon + 180) / 360) * 100;
  const y = ((90 - region.lat) / 180) * 100;
  return (
    <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-hairline bg-background/50">
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Pseudo continents */}
      <svg viewBox="0 0 100 62.5" className="absolute inset-0 h-full w-full opacity-30">
        <path
          d="M10 25 Q15 18 22 22 T35 24 L40 30 L34 36 Q24 40 18 35 Z M50 18 Q60 14 70 18 T88 22 L88 32 Q78 38 68 34 T54 30 Z M48 38 Q55 36 60 42 T68 50 L60 56 Q52 56 48 50 Z"
          fill="oklch(0.88 0.27 145 / 0.5)"
        />
      </svg>
      <div
        className="absolute"
        style={{ left: `${x}%`, top: `${y * 0.625}%`, transform: "translate(-50%, -50%)" }}
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_14px_var(--primary)] animate-glow-pulse" />
      </div>
    </div>
  );
}
