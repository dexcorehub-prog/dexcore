"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Menu, X, Globe2, BadgeDollarSign, ChevronDown } from "lucide-react";
import { copy, siteConfig } from "@/lib/site";
import type { Currency, Locale } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { CookieBanner } from "@/components/cookie-banner";

type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

type SiteContextValue = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  consent: ConsentState;
  setConsent: (value: ConsentState) => void;
};

const defaultConsent: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSitePreferences() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSitePreferences must be used inside SiteProvider");
  return context;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("dexcore-locale") as Locale | null;
    const savedCurrency = window.localStorage.getItem("dexcore-currency") as Currency | null;
    const savedConsent = window.localStorage.getItem("dexcore-consent");

    if (savedLocale === "en" || savedLocale === "es") setLocale(savedLocale);
    if (savedCurrency === "usd" || savedCurrency === "mxn") setCurrency(savedCurrency);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as ConsentState;
        setConsent({
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing)
        });
      } catch {
        setConsent(defaultConsent);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("dexcore-locale", locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem("dexcore-currency", currency);
  }, [currency]);

  useEffect(() => {
    window.localStorage.setItem("dexcore-consent", JSON.stringify(consent));
  }, [consent]);

  const value = useMemo(
    () => ({ locale, currency, setLocale, setCurrency, consent, setConsent }),
    [locale, currency, consent]
  );

  return (
    <SiteContext.Provider value={value}>
      <Shell>{children}</Shell>
      <CookieBanner />
    </SiteContext.Provider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, currency, setLocale, setCurrency } = useSitePreferences();
  const t = copy[locale];

  const navItems = [
    { href: "#features", label: t.nav.features },
    { href: "#process", label: t.nav.process },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq }
  ];

  return (
    <div className="min-h-screen bg-ink text-text">
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-2xl border border-brand/30 bg-white/[0.04] shadow-soft">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/35 to-white/10 opacity-70 transition-opacity group-hover:opacity-100" />
              <span className="relative text-lg font-black tracking-tight">D</span>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Dexcore</div>
              <div className="text-xs text-muted">{siteConfig.regionTagline[locale]}</div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center gap-6 text-sm text-muted">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              ))}
              <Link href="/billing" className="transition hover:text-white">
                {t.nav.billing}
              </Link>
              <Link href="/portal" className="transition hover:text-white">
                Portal
              </Link>
            </nav>

            <PreferenceSwitch
              locale={locale}
              currency={currency}
              setLocale={setLocale}
              setCurrency={setCurrency}
            />

            <a
              href="#contact"
              className="rounded-full border border-brand/40 bg-brand px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#255cf0]"
            >
              {t.nav.cta}
            </a>
          </div>

          <button
            className="inline-flex rounded-full border border-white/10 p-2 text-muted lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-panel/95 px-4 py-4 lg:hidden">
            <div className="space-y-4">
              <div className="grid gap-3">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-muted transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                <Link href="/billing" onClick={() => setMenuOpen(false)} className="text-sm text-muted transition hover:text-white">
                  {t.nav.billing}
                </Link>
                <Link href="/portal" onClick={() => setMenuOpen(false)} className="text-sm text-muted transition hover:text-white">
                  Portal
                </Link>
              </div>
              <PreferenceSwitch
                locale={locale}
                currency={currency}
                setLocale={setLocale}
                setCurrency={setCurrency}
              />
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-brand/40 bg-brand px-5 py-3 text-center text-sm font-semibold text-white shadow-glow"
              >
                {t.nav.cta}
              </a>
            </div>
          </div>
        )}
      </div>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="text-2xl font-black tracking-tight">Dexcore</div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              {siteConfig.regionTagline[locale]}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/40">
              {copy[locale].footer.madeIn}
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Legal</div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link href="/legal/privacy" className="transition hover:text-white">
                {copy[locale].footer.privacy}
              </Link>
              <Link href="/legal/terms" className="transition hover:text-white">
                {copy[locale].footer.terms}
              </Link>
              <Link href="/billing" className="transition hover:text-white">
                {copy[locale].footer.billing}
              </Link>
              <Link href="/portal" className="transition hover:text-white">
                Portal
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">Contact</div>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-white">
                {siteConfig.email}
              </a>
              <span>USD + MXN subscriptions</span>
              <span>{new Date().getFullYear()} Dexcore. {copy[locale].footer.rights}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

type PreferenceSwitchProps = {
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
};

function PreferenceSwitch({ locale, currency, setLocale, setCurrency }: PreferenceSwitchProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
            locale === "en" ? "bg-white text-black" : "text-muted hover:text-white"
          )}
        >
          <Globe2 size={14} />
          EN
        </button>
        <button
          type="button"
          onClick={() => setLocale("es")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
            locale === "es" ? "bg-white text-black" : "text-muted hover:text-white"
          )}
        >
          <Globe2 size={14} />
          ES
        </button>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setCurrency("usd")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
            currency === "usd" ? "bg-brand text-white" : "text-muted hover:text-white"
          )}
        >
          <BadgeDollarSign size={14} />
          USD
        </button>
        <button
          type="button"
          onClick={() => setCurrency("mxn")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
            currency === "mxn" ? "bg-brand text-white" : "text-muted hover:text-white"
          )}
        >
          <ChevronDown size={14} />
          MXN
        </button>
      </div>
    </div>
  );
}
