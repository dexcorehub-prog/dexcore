"use client";

import Script from "next/script";
import { useSitePreferences } from "@/components/providers/site-context";

export function GoogleAnalytics() {
  const { consent } = useSitePreferences();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || !consent.analytics) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="dexcore-ga" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
