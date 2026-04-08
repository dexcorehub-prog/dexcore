import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dexcore",
    short_name: "Dexcore",
    description: "Bilingual premium AI-native agency website for Mexico and the USA.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0D10",
    theme_color: "#0B0D10",
    icons: [
      {
        src: "/icon?light=false",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
