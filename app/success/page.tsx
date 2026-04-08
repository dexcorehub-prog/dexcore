"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Sparkles,
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

  const onboardingHref = useMemo(() => {
    if (!sessionId) return "/onboarding";
    return `/onboarding?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
        <CheckCircle2 className="text-brand" size={44} />

        <h1 className="mt-6 text-4xl font-black tracking-tight">
          {isSpanish
            ? "Pago recibido. Tu acceso ya está activo."
            : "Payment received. Your access is already active."}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          {isSpanish
            ? "Dexcore activó tu suscripción. El siguiente paso es completar tu onboarding para que la herramienta trabaje sola con tus datos reales."
            : "Dexcore activated your subscription. Your next step is to complete onboarding so the system can run with your real business details."}
        </p>

        {!loading && !sessionId && (
          <div className="mt-6 rounded-[22px] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
            {isSpanish
              ? "No encontramos un session_id válido. Puedes volver al inicio o entrar desde el checkout/success para cargar tu resumen."
              : "We could not find a valid session_id. You can return home or re-enter from the checkout/success flow to load your summary."}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
            icon={Sparkles}
            label={isSpanish ? "Onboarding" : "Onboarding"}
            value={
              summary?.onboardingStatus === "completed"
                ? isSpanish
                  ? "Completo"
                  : "Complete"
                : isSpanish
                  ? "Pendiente"
                  : "Pending"
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
            href={onboardingHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
          >
            {summary?.onboardingStatus === "completed"
              ? isSpanish
                ? "Actualizar onboarding"
                : "Update onboarding"
              : isSpanish
                ? "Completar onboarding"
                : "Complete onboarding"}
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/portal"
            className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
          >
            {isSpanish ? "Portal del cliente" : "Client portal"}
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
