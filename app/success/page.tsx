"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";
import { formatPrice } from "@/lib/utils";

type SessionSummary = {
  sessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  subscriptionStatus: string | null;
  amountTotal: number | null;
  currency: "usd" | "mxn" | null;
  planId: string;
  planTitle: string;
  onboardingStatus: string;
  latestSessionId?: string | null;
};

export default function SuccessPage() {
  const { locale } = useSitePreferences();
  const isSpanish = locale === "es";

  const [sessionId, setSessionId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id") || "";
    setSessionId(id);
    setParamsReady(true);
  }, []);

  useEffect(() => {
    if (!paramsReady) return;

    if (!sessionId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/session-details?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await response.json()) as SessionSummary & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load your checkout details.",
          );
        }

        if (!cancelled) {
          setSummary(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load your checkout details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [paramsReady, sessionId]);

  const workspaceHref = useMemo(() => {
    if (!sessionId) return "/workspace";
    return `/workspace?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  const setupHref = useMemo(() => {
    if (!sessionId) return "/onboarding";
    return `/onboarding?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
        <CheckCircle2 className="text-brand" size={44} />
        <h1 className="mt-6 text-4xl font-black tracking-tight">
          {isSpanish
            ? "Pago recibido. Tu herramienta ya está lista."
            : "Payment received. Your tool is ready to use."}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          {isSpanish
            ? "Dexcore activó tu suscripción y desbloqueó tu espacio de trabajo. Puedes empezar a usar la herramienta ahora mismo. La configuración del negocio es opcional y la puedes completar después si quieres personalizarla más."
            : "Dexcore activated your subscription and unlocked your workspace. You can start using the tool right now. Business setup is optional and can be completed later if you want more personalization."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatusCard
            icon={BadgeCheck}
            label={isSpanish ? "Estado" : "Status"}
            value={
              loading
                ? isSpanish
                  ? "Cargando..."
                  : "Loading..."
                : summary?.subscriptionStatus || "active"
            }
          />
          <StatusCard
            icon={CreditCard}
            label={isSpanish ? "Cobro inicial" : "Initial charge"}
            value={
              summary?.amountTotal && summary.currency
                ? formatPrice(
                    summary.amountTotal / 100,
                    summary.currency,
                    locale,
                  )
                : isSpanish
                  ? "Procesado"
                  : "Processed"
            }
          />
          <StatusCard
            icon={Wrench}
            label={isSpanish ? "Espacio" : "Workspace"}
            value={isSpanish ? "Activo" : "Active"}
          />
          <StatusCard
            icon={Sparkles}
            label={isSpanish ? "Setup negocio" : "Business setup"}
            value={
              summary?.onboardingStatus === "completed"
                ? isSpanish
                  ? "Guardado"
                  : "Saved"
                : isSpanish
                  ? "Opcional"
                  : "Optional"
            }
          />
        </div>

        {summary && (
          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Plan
                </div>
                <div className="mt-2 text-2xl font-black">
                  {summary.planTitle}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Email
                </div>
                <div className="mt-2 text-base text-white/90">
                  {summary.customerEmail || "—"}
                </div>
              </div>
            </div>
            {summary.customerName && (
              <p className="mt-4 text-sm text-muted">{summary.customerName}</p>
            )}
          </div>
        )}

        {error && <p className="mt-5 text-sm text-rose-300">{error}</p>}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={workspaceHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
          >
            {isSpanish ? "Abrir herramienta" : "Open workspace"}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={setupHref}
            className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
          >
            {isSpanish
              ? "Configurar negocio (opcional)"
              : "Business setup (optional)"}
          </Link>
          <Link
            href="/billing"
            className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
          >
            {isSpanish ? "Facturación" : "Billing"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-soft">
      <Icon className="text-brand" size={18} />
      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-xl font-bold capitalize">{value}</div>
    </div>
  );
}
