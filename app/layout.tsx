import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { SiteProvider } from "@/components/providers/site-context";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SchemaMarkup } from "@/components/schema-markup";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Dexcore | AI systems for service businesses",
    template: "%s | Dexcore"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Dexcore",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Dexcore",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Dexcore",
    description: siteConfig.description
  },
  robots: {
    index: true,
    follow: true
  },
  category: "technology"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ink text-text antialiased">
        <SiteProvider>
          <SchemaMarkup />
          <GoogleAnalytics />
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
