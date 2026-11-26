import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fit Mom 20 — 20-Minute Daily Plan for Busy Moms",
    short_name: "Fit Mom 20",
    description:
      "Personalized 20-minute daily home workouts, gentle postpartum recovery, 3-step family meals, and hydration tracking.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FFFDF9",
    theme_color: "#4A2C40",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
