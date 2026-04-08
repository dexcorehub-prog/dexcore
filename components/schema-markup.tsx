import { siteConfig } from "@/lib/site";

export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Dexcore",
        url: siteConfig.url,
        email: siteConfig.email,
        areaServed: ["Mexico", "United States"],
        foundingLocation: "Mexico",
        sameAs: []
      },
      {
        "@type": "ProfessionalService",
        name: "Dexcore",
        description: siteConfig.description,
        areaServed: ["Mexico", "United States"],
        url: siteConfig.url,
        telephone: "",
        availableLanguage: ["English", "Spanish"]
      },
      {
        "@type": "WebSite",
        name: "Dexcore",
        url: siteConfig.url,
        inLanguage: ["en", "es"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
