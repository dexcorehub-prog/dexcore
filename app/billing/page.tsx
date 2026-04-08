"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard } from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";
import { copy } from "@/lib/site";

export default function BillingPage() {
  const { locale } = useSitePreferences();
  const t = copy[locale].billingLookup;
  const isSpanish = locale === "es";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || t.notFound);
      }

      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : t.notFound;
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-brand/10 to-white/[0.03] p-6 shadow-soft sm:rounded-[32px] sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
            <CreditCard className="text-brand" size={22} />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{t.body}</p>
          <div className="mt-6 space-y-2 text-sm text-white/85 sm:mt-8 sm:space-y-3">
            <p>• {isSpanish ? "búsqueda del portal de Stripe por correo" : "Stripe customer portal lookup by email"}</p>
            <p>• {isSpanish ? "autogestión de suscripción" : "subscription self-management"}</p>
            <p>• {isSpanish ? "regreso seguro a Dexcore" : "safe return to Dexcore"}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              {isSpanish ? "Volver al inicio" : "Back home"}
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              {isSpanish ? "Portal del cliente" : "Client portal"}
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-soft sm:rounded-[32px] sm:p-8">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/85">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                required
                className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? t.loading : t.button}
              <ArrowRight size={16} />
            </button>
          </form>

          {feedback && <p className="mt-4 text-sm text-brand">{feedback}</p>}
          <p className="mt-4 text-xs leading-6 text-muted">{t.help}</p>
        </div>
      </div>
    </div>
  );
}
