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
      </main>
      <SiteFooter />
    </div>
  );
}
