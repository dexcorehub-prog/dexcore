"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";
import { copy } from "@/lib/site";

export default function CancelPage() {
  const { locale } = useSitePreferences();
  const t = copy[locale].status;
  const isSpanish = locale === "es";

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-soft sm:rounded-[32px] sm:p-8">
        <AlertTriangle className="text-brand" size={40} />
        <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">{t.cancel}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
          {isSpanish
            ? "No se capturó ningún pago. Puedes volver al inicio, revisar los planes y reintentar cuando quieras."
            : "No payment was captured. You can go back home, review the plans, and try again whenever you are ready."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/"
            className="rounded-full bg-brand px-6 py-4 text-center text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
          >
            {t.retry}
          </Link>
          <Link
            href="/billing"
            className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-center text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
          >
            {isSpanish ? "Facturación" : "Billing"}
          </Link>
        </div>
      </div>
    </div>
  );
}
