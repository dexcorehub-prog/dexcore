"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";

type SessionSummary = {
  sessionId: string;
  customerEmail: string | null;
  customerName: string | null;
  subscriptionStatus: string | null;
  planTitle: string;
  onboardingStatus: string;
};

type OnboardingState = {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  serviceType: string;
  serviceArea: string;
  preferredLaunchDate: string;
  goals: string;
  notes: string;
};

const initialState: OnboardingState = {
  contactName: "",
  companyName: "",
  email: "",
  phone: "",
  website: "",
  serviceType: "",
  serviceArea: "",
  preferredLaunchDate: "",
  goals: "",
  notes: "",
};

export default function OnboardingPage() {
  const { locale } = useSitePreferences();
  const isSpanish = locale === "es";

  const [sessionId, setSessionId] = useState("");
  const [paramsReady, setParamsReady] = useState(false);
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [form, setForm] = useState<OnboardingState>(initialState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

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

    async function loadSession() {
      try {
        const response = await fetch(
          `/api/session-details?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await response.json()) as SessionSummary & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Unable to load session details.");
        }

        if (cancelled) return;

        setSession(data);
        setForm((current) => ({
          ...current,
          contactName: current.contactName || data.customerName || "",
          email: current.email || data.customerEmail || "",
        }));
      } catch (error) {
        if (!cancelled) {
          setFeedback(
            error instanceof Error
              ? error.message
              : "Unable to load session details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [paramsReady, sessionId]);

  const headerTitle = useMemo(
    () =>
      isSpanish
        ? "Activa tu espacio de trabajo en 3 minutos"
        : "Activate your workspace in 3 minutes",
    [isSpanish],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          ...form,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        portalUrl?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to complete onboarding.");
      }

      setPortalUrl(data.portalUrl || null);
      setFeedback(
        isSpanish
          ? "Listo. Tu onboarding quedó guardado y Dexcore ya tiene tus datos operativos."
          : "Done. Your onboarding is saved and Dexcore now has your operating details.",
      );
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to complete onboarding.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-brand/10 to-white/[0.03] p-8 shadow-soft">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
            <ClipboardList className="text-brand" size={22} />
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight">
            {headerTitle}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-8 text-muted">
            {isSpanish
              ? "Después del pago, este paso termina la activación. Guardamos tus datos en Stripe para que Dexcore tenga el plan, el negocio y el estado del onboarding listos sin depender de mensajes sueltos."
              : "After payment, this is the activation step. We save your details in Stripe so Dexcore has your plan, business, and onboarding status ready without depending on scattered messages."}
          </p>

          <div className="mt-8 space-y-3 text-sm text-white/85">
            <p>
              •{" "}
              {isSpanish
                ? "Se enlaza con la suscripción real que ya pagaste"
                : "It links to the real subscription you already paid for"}
            </p>
            <p>
              •{" "}
              {isSpanish
                ? "Marca onboarding como completo"
                : "Marks onboarding as complete"}
            </p>
            <p>
              •{" "}
              {isSpanish
                ? "Envía resumen al correo operativo si está configurado"
                : "Sends a summary to the ops inbox if configured"}
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm text-white/85">
            <div className="font-semibold text-white">
              {session?.planTitle || "Dexcore"}
            </div>
            <div className="mt-2 text-muted">
              {session?.customerEmail || form.email || "—"}
            </div>
            <div className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/55">
              {loading
                ? isSpanish
                  ? "cargando"
                  : "loading"
                : session?.onboardingStatus === "completed"
                  ? isSpanish
                    ? "completo"
                    : "complete"
                  : isSpanish
                    ? "pendiente"
                    : "pending"}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/billing"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              {isSpanish ? "Facturación" : "Billing"}
            </Link>

            <Link
              href="/portal"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              {isSpanish ? "Portal del cliente" : "Client portal"}
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
          {!loading && !sessionId && (
            <div className="mb-6 rounded-[22px] border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
              {isSpanish
                ? "No encontramos un session_id válido. Vuelve desde la pantalla de pago o success para completar tu onboarding."
                : "We could not find a valid session_id. Please return from the payment or success screen to complete your onboarding."}
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={isSpanish ? "Nombre de contacto" : "Contact name"}
                value={form.contactName}
                onChange={(value) =>
                  setForm((current) => ({ ...current, contactName: value }))
                }
                required
              />
              <Input
                label={isSpanish ? "Empresa" : "Company"}
                value={form.companyName}
                onChange={(value) =>
                  setForm((current) => ({ ...current, companyName: value }))
                }
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({ ...current, email: value }))
                }
                required
              />
              <Input
                label={isSpanish ? "Teléfono" : "Phone"}
                value={form.phone}
                onChange={(value) =>
                  setForm((current) => ({ ...current, phone: value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Website"
                value={form.website}
                onChange={(value) =>
                  setForm((current) => ({ ...current, website: value }))
                }
                placeholder="https://"
              />
              <Input
                label={isSpanish ? "Servicio principal" : "Main service"}
                value={form.serviceType}
                onChange={(value) =>
                  setForm((current) => ({ ...current, serviceType: value }))
                }
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={isSpanish ? "Área de servicio" : "Service area"}
                value={form.serviceArea}
                onChange={(value) =>
                  setForm((current) => ({ ...current, serviceArea: value }))
                }
                required
              />
              <Input
                label={
                  isSpanish
                    ? "Fecha objetivo de lanzamiento"
                    : "Target launch date"
                }
                type="date"
                value={form.preferredLaunchDate}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    preferredLaunchDate: value,
                  }))
                }
              />
            </div>

            <Textarea
              label={isSpanish ? "Meta principal" : "Primary goal"}
              value={form.goals}
              onChange={(value) =>
                setForm((current) => ({ ...current, goals: value }))
              }
              required
              placeholder={
                isSpanish
                  ? "Ejemplo: quiero más citas agendadas y responder más rápido."
                  : "Example: I want more booked calls and faster lead response."
              }
            />

            <Textarea
              label={isSpanish ? "Notas adicionales" : "Additional notes"}
              value={form.notes}
              onChange={(value) =>
                setForm((current) => ({ ...current, notes: value }))
              }
              placeholder={
                isSpanish
                  ? "Accesos, restricciones, links, horarios o cualquier detalle importante."
                  : "Access, restrictions, links, hours, or any detail that matters."
              }
            />

            <button
              type="submit"
              disabled={submitting || !sessionId}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? isSpanish
                  ? "Guardando..."
                  : "Saving..."
                : isSpanish
                  ? "Completar onboarding"
                  : "Complete onboarding"}
              <ArrowRight size={16} />
            </button>
          </form>

          {feedback && (
            <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-white/90">
              <div className="flex items-center gap-2 font-semibold text-white">
                <CheckCircle2 className="text-brand" size={16} />
                {feedback}
              </div>

              {portalUrl && (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand"
                >
                  {isSpanish
                    ? "Abrir portal del cliente"
                    : "Open client portal"}
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/85">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/85">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        rows={5}
        className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
