"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";
import { formatPrice } from "@/lib/utils";

type CustomerStatus = {
  email: string | null;
  customerName: string | null;
  companyName: string;
  planId: string | null;
  planName: string | null;
  subscriptionStatus: string;
  onboardingStatus: string;
  latestSessionId: string | null;
  serviceType: string;
  serviceArea: string;
  goals: string;
  website: string;
  preferredLaunchDate: string;
  monthlyAmount: number | null;
  currency: "usd" | "mxn" | null;
  billingStatus: string;
};

export default function ClientPortalPage() {
  const { locale } = useSitePreferences();
  const isSpanish = locale === "es";

  const [initialEmail, setInitialEmail] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<CustomerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email") || "";
    setInitialEmail(emailFromUrl);
    setEmail(emailFromUrl);
    setParamsReady(true);
  }, []);

  useEffect(() => {
    if (!paramsReady || !initialEmail) return;
    void lookup(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsReady, initialEmail]);

  async function lookup(targetEmail?: string) {
    const emailToUse = (targetEmail || email).trim();
    if (!emailToUse) return;

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `/api/customer-status?email=${encodeURIComponent(emailToUse)}`,
      );
      const data = (await response.json()) as CustomerStatus & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to find customer status.");
      }

      setStatus(data);
    } catch (error) {
      setStatus(null);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to find customer status.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function openBilling() {
    if (!status?.email) return;

    setPortalLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: status.email }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to open billing portal.");
      }

      window.location.href = data.url;
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to open billing portal.",
      );
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await lookup();
  }

  const monthlyLabel = useMemo(() => {
    if (!status?.monthlyAmount || !status.currency) return "—";
    return formatPrice(status.monthlyAmount / 100, status.currency, locale);
  }, [status, locale]);

  const onboardingHref = useMemo(() => {
    if (!status?.latestSessionId) return "/onboarding";
    return `/onboarding?session_id=${encodeURIComponent(status.latestSessionId)}`;
  }, [status?.latestSessionId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-brand/10 to-white/[0.03] p-8 shadow-soft">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
            <LayoutDashboard className="text-brand" size={22} />
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight">
            {isSpanish ? "Portal del cliente" : "Client portal"}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-8 text-muted">
            {isSpanish
              ? "Aquí validas si la suscripción está activa, si el onboarding quedó completo y qué plan está corriendo."
              : "This is where you verify whether the subscription is active, whether onboarding is complete, and which plan is running."}
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/85">Email</span>
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : null}
              {loading
                ? isSpanish
                  ? "Buscando..."
                  : "Looking up..."
                : isSpanish
                  ? "Revisar estado"
                  : "Check status"}
            </button>
          </form>

          {feedback && (
            <div className="mt-5 rounded-[22px] border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <div className="flex items-center gap-2 font-medium">
                <CircleAlert size={16} />
                {feedback}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
          {status ? (
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                  label={isSpanish ? "Plan" : "Plan"}
                  value={status.planName || status.planId || "Dexcore"}
                />
                <MetricCard
                  label={isSpanish ? "Suscripción" : "Subscription"}
                  value={status.subscriptionStatus}
                  capitalize
                />
                <MetricCard
                  label={isSpanish ? "Onboarding" : "Onboarding"}
                  value={status.onboardingStatus}
                  capitalize
                />
                <MetricCard
                  label={isSpanish ? "Mensualidad" : "Monthly"}
                  value={monthlyLabel}
                />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm text-white/90">
                <div className="font-semibold text-white">
                  {status.companyName || status.customerName || status.email}
                </div>
                <div className="mt-2 text-muted">{status.email}</div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {isSpanish ? "Servicio" : "Service"}
                    </div>
                    <div className="mt-1">{status.serviceType || "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {isSpanish ? "Área" : "Area"}
                    </div>
                    <div className="mt-1">{status.serviceArea || "—"}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Website
                    </div>
                    <div className="mt-1 break-all">
                      {status.website || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {isSpanish ? "Lanzamiento" : "Launch"}
                    </div>
                    <div className="mt-1">
                      {status.preferredLaunchDate || "—"}
                    </div>
                  </div>
                </div>

                {status.goals && (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {isSpanish ? "Meta principal" : "Primary goal"}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap text-white/85">
                      {status.goals}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openBilling}
                  disabled={portalLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1 disabled:opacity-70"
                >
                  {portalLoading
                    ? isSpanish
                      ? "Abriendo..."
                      : "Opening..."
                    : isSpanish
                      ? "Administrar facturación"
                      : "Manage billing"}
                </button>

                {status.latestSessionId && (
                  <Link
                    href={onboardingHref}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
                  >
                    {status.onboardingStatus === "completed"
                      ? isSpanish
                        ? "Actualizar onboarding"
                        : "Update onboarding"
                      : isSpanish
                        ? "Completar onboarding"
                        : "Complete onboarding"}
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-muted">
              <CheckCircle2 className="mx-auto text-brand" size={22} />
              <p className="mt-4">
                {isSpanish
                  ? "Busca tu email para ver si tu plan ya está activo y si el onboarding quedó cerrado."
                  : "Look up your email to see whether your plan is active and whether onboarding is complete."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 shadow-soft">
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div
        className={`mt-2 text-2xl font-bold ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
