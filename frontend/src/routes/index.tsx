import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FutureCrop AI — Predict the future of farming" },
      {
        name: "description",
        content:
          "AI + atmospheric physics + crop genomics simulating yield, risk and breeding strategy across 192 countries to 2050.",
      },
      { property: "og:title", content: "FutureCrop AI — CropOracle Platform" },
      {
        property: "og:description",
        content:
          "A decision intelligence platform for governments, scientists and breeders shaping the next century of food.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <LandingInfoSection
          id="science"
          badge="Science"
          title="Research Signals"
          description="Explore model validation snapshots, climate datasets and explainability summaries used in our decision workflow."
          items={[
            { title: "Model Benchmarks", text: "Validation runs across drought, flood and heat stress scenarios." },
            { title: "Open Datasets", text: "Curated climate and crop observations for transparent review." },
            { title: "Explainability Notes", text: "Feature impact reports that support genotype recommendations." },
          ]}
        />
        <LandingInfoSection
          id="enterprise"
          badge="Enterprise"
          title="Deployment Paths"
          description="Understand how teams deploy FarmerCrop AI for ministries, agri-enterprises and cooperative networks."
          items={[
            { title: "Government Programs", text: "Regional planning workflows with auditable reporting." },
            { title: "Breeding Teams", text: "Multi-region scenario testing for resilient genotype decisions." },
            { title: "Secure Rollout", text: "Private deployment options for regulated organizations." },
          ]}
        />
        <LandingInfoSection
          id="docs"
          badge="Docs"
          title="Quick Documentation"
          description="Navigate essential docs-style guides before launching into the app workflow."
          items={[
            { title: "Getting Started", text: "Step-by-step flow from location setup to PDF report export." },
            { title: "API Snapshot", text: "Prediction, SHAP and PDF endpoint behavior overview." },
            { title: "Workflow Tips", text: "Recommended sequence for simulation and insights review." },
          ]}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

function LandingInfoSection({
  id,
  badge,
  title,
  description,
  items,
}: {
  id: string;
  badge: string;
  title: string;
  description: string;
  items: Array<{ title: string; text: string }>;
}) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">{badge}</span>
        </div>
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-hairline bg-panel/40 p-5">
            <h4 className="text-base font-semibold">{item.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
