import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Stepper, type StepKey } from "@/components/app/Stepper";
import { StepRegion } from "@/components/app/StepRegion";
import { StepScenario } from "@/components/app/StepScenario";
import { StepSimulate } from "@/components/app/StepSimulate";
import { StepResults, type Genotype } from "@/components/app/StepResults";
import { StepAnalysis } from "@/components/app/StepAnalysis";
import { StepConfirm } from "@/components/app/StepConfirm";
import { AIAssistant } from "@/components/app/AIAssistant";
import { REGIONS, type Region, type Scenario } from "@/lib/futurecrop-data";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "CropOracle Console — FutureCrop AI" },
      {
        name: "description",
        content:
          "Run climate-genotype simulations and generate breeding blueprints with audited AI.",
      },
    ],
  }),
  component: AppConsole,
});

function AppConsole() {
  const [step, setStep] = useState<StepKey>("region");
  const [region, setRegion] = useState<Region | null>(REGIONS[0]);
  const [scenario, setScenario] = useState<Scenario>({
    ssp: "SSP2-4.5", year: 2050, warming: 2.7, co2: 603,
  });
  const [genotype, setGenotype] = useState<Genotype | null>(null);

  const reset = () => {
    setStep("region");
    setGenotype(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.88 0.27 145 / 0.08), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 noise opacity-50" />
      </div>

      {/* App header */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-5 w-px bg-hairline" />
            <Link to="/" className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: "var(--gradient-neon)" }}
              >
                <Sparkles className="h-3.5 w-3.5 text-background" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold">CropOracle Console</span>
            </Link>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Stepper current={step} />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[11px] text-muted-foreground sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" />
              Engine v2.4
            </span>
          </div>
        </div>
        {/* Mobile stepper */}
        <div className="mx-auto max-w-7xl px-6 pb-3 md:hidden">
          <Stepper current={step} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 pb-24">
        {step === "region" && (
          <StepRegion
            selected={region}
            onSelect={setRegion}
            onNext={() => region && setStep("scenario")}
          />
        )}
        {step === "scenario" && (
          <StepScenario
            scenario={scenario}
            onChange={setScenario}
            onBack={() => setStep("region")}
            onNext={() => setStep("simulate")}
          />
        )}
        {step === "simulate" && <StepSimulate onDone={() => setStep("results")} />}
        {step === "results" && region && (
          <StepResults
            region={region}
            scenario={scenario}
            onPickGenotype={(g) => { setGenotype(g); setStep("analysis"); }}
            onConfirm={() => setStep("confirm")}
            onBack={() => setStep("scenario")}
          />
        )}
        {step === "analysis" && genotype && (
          <StepAnalysis
            genotype={genotype}
            onBack={() => setStep("results")}
            onConfirm={() => setStep("confirm")}
          />
        )}
        {step === "confirm" && region && (
          <StepConfirm
            region={region}
            scenario={scenario}
            genotype={genotype ?? {
              id: "Z-7421", name: "Maize", trait: "Drought-tolerant",
              yield: 9.4, risk: 0.12, water: 0.78, confidence: 0.947,
            }}
            onBack={() => setStep("results")}
            onRestart={reset}
          />
        )}
      </main>

      <AIAssistant />
    </div>
  );
}
