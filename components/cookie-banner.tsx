"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/site";
import { useSitePreferences } from "@/components/providers/site-context";

export function CookieBanner() {
  const { locale, consent, setConsent } = useSitePreferences();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);
  const t = copy[locale].cookies;

  useEffect(() => {
    const alreadySet = window.localStorage.getItem("dexcore-consent");
    if (!alreadySet) {
      const timer = window.setTimeout(() => setOpen(true), 650);
      return () => window.clearTimeout(timer);
    }
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-panel/95 p-5 shadow-soft backdrop-blur-xl">
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{t.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{t.body}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked disabled className="accent-brand" />
                Essential
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="accent-brand"
                />
                {t.analytics}
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="accent-brand"
                />
                {t.marketing}
              </label>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                setConsent({ essential: true, analytics: true, marketing: true });
                setOpen(false);
              }}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
            >
              {t.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => {
                setConsent({ essential: true, analytics: false, marketing: false });
                setOpen(false);
              }}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              {t.essentialOnly}
            </button>
            <button
              type="button"
              onClick={() => {
                setConsent({ essential: true, analytics, marketing });
                setOpen(false);
              }}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-muted transition hover:text-white"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
