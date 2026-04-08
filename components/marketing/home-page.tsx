"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  Languages,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Workflow,
} from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";
import { plans } from "@/lib/plans";
import { copy } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function HomePage() {
  const { locale, currency } = useSitePreferences();
  const t = copy[locale];
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<string | null>(
    null,
  );

  const isSpanish = locale === "es";
  const featureIcons = [
    Languages,
    CircleDollarSign,
    Lock,
    Radar,
    ShieldCheck,
    Sparkles,
  ];

  const heroHighlights = isSpanish
    ? [
        "Pipeline de leads",
        "Cotizador rápido",
        "Seguimiento listo para copiar",
        "Cobros con Stripe",
      ]
    : [
        "Lead pipeline workspace",
        "Fast quote builder",
        "Follow-up ready to copy",
        "Stripe-powered billing",
      ];

  async function handleCheckout(planId: string) {
    try {
      setCheckoutLoadingId(planId);
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId, currency, locale }),
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      window.alert(message);
    } finally {
      setCheckoutLoadingId(null);
    }
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingForm(true);
    setFormStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to send your request right now.",
        );
      }

      setFormStatus(t.form.success);
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setFormStatus(message);
    } finally {
      setSubmittingForm(false);
    }
  }

  const pricingCards = useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      monthly: formatPrice(plan.prices[currency], currency, locale),
      setup: formatPrice(plan.setupFee[currency], currency, locale),
    }));
  }, [currency, locale]);

  const stats = [
    {
      icon: TimerReset,
      value: "< 60 sec",
      label: isSpanish
        ? "para empezar a trabajar un lead"
        : "to start working a lead",
    },
    {
      icon: BadgeCheck,
      value: isSpanish ? "2 mercados" : "2 markets",
      label: isSpanish ? "México + Estados Unidos" : "Mexico + United States",
    },
    {
      icon: Languages,
      value: isSpanish ? "2 idiomas" : "2 languages",
      label: isSpanish ? "inglés y español" : "English and Spanish",
    },
    {
      icon: Lock,
      value: isSpanish ? "1 sistema" : "1 system",
      label: isSpanish
        ? "pipeline + cotización + cobro"
        : "pipeline + quoting + billing",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-hero pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:26px_26px] opacity-[0.08]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-flex rounded-full border border-brand/30 bg-white/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:px-4 sm:text-xs sm:tracking-[0.24em]">
              {t.hero.eyebrow}
            </div>
            <h1 className="mt-5 max-w-4xl text-[2.35rem] font-black leading-[0.98] tracking-tight sm:mt-6 sm:text-5xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#pricing"
                className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-1 hover:bg-[#255cf0] sm:w-auto"
              >
                {t.hero.primary}
                <ArrowRight size={16} />
              </a>
              <a
                href="#features"
                className="btn-secondary inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] sm:w-auto"
              >
                {t.hero.secondary}
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:mt-6 sm:gap-3 sm:text-xs">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                {isSpanish ? "precio introductorio" : "intro pricing"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                {isSpanish ? "hecho en México" : "built in Mexico"}
              </span>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 sm:inline-flex">
                Stripe • EN/ES • USD/MXN
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
              {[
                { icon: Globe2, label: "EN / ES" },
                { icon: CircleDollarSign, label: "USD / MXN" },
                {
                  icon: Workflow,
                  label: isSpanish ? "Herramienta lista" : "Workspace ready",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                  className={cn(
                    "rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-soft sm:rounded-[28px] sm:p-5",
                    index === 2 && "hidden sm:block",
                  )}
                >
                  <item.icon className="mb-3 text-brand sm:mb-4" size={20} />
                  <div className="text-sm font-semibold text-white">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-brand/30 via-transparent to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-soft backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/50">
                    {isSpanish
                      ? "Dexcore edición lanzamiento"
                      : "Dexcore Launch Edition"}
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {t.hero.cardTitle}
                  </div>
                </div>
                <div className="rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand">
                  {isSpanish ? "Lanzamiento" : "Intro pricing"}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-muted">
                {t.hero.cardBody}
              </p>

              <div className="mt-8 grid gap-4">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-black/30"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-brand" size={18} />
                      <span className="text-sm text-white/90">{item}</span>
                    </div>
                    <ArrowRight
                      className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70"
                      size={16}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-black/30 p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/50">
                  {isSpanish ? "stack de lanzamiento" : "Launch stack"}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Next.js",
                    "TypeScript",
                    "Stripe",
                    isSpanish ? "Pipeline" : "Pipeline",
                    isSpanish ? "Cotizador" : "Quote builder",
                    isSpanish ? "Bilingüe" : "Bilingual",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30 py-6 sm:py-8">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className={cn(
                "rounded-[20px] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[24px] sm:p-5",
                index > 1 && "hidden sm:block",
              )}
            >
              <stat.icon className="mb-3 text-brand sm:mb-4" size={18} />
              <div className="text-xl font-black sm:text-2xl">{stat.value}</div>
              <div className="mt-2 text-sm leading-6 text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
        id="features"
      >
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.26em] text-white/40">
            Dexcore
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {t.features.title}
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {t.features.items.map((item, index) => {
            const Icon = featureIcons[index];
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                className={cn(
                  "group rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-glow sm:rounded-[30px] sm:p-6",
                  index > 3 && "hidden md:block",
                )}
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 sm:size-12">
                  <Icon className="text-brand" size={18} />
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section
        className="border-y border-white/10 bg-panel/70 py-14 sm:py-20"
        id="process"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl"
          >
            <div className="text-xs uppercase tracking-[0.26em] text-white/40">
              {isSpanish ? "flujo" : "Flow"}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {t.process.title}
            </h2>
          </motion.div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-4">
            {t.process.steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/30 sm:rounded-[30px] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/35">
                    0{index + 1}
                  </div>
                  <div className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand sm:text-xs">
                    Dexcore
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight sm:mt-8">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted sm:mt-4">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto hidden max-w-7xl px-4 py-20 sm:px-6 md:grid lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:px-8">
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-xs uppercase tracking-[0.26em] text-white/40">
            {isSpanish ? "dolor" : "Pain"}
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {t.pain.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            {t.pain.subtitle}
          </p>
          <div className="mt-8 grid gap-4">
            {t.pain.bullets.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
              >
                <BadgeCheck className="mt-0.5 shrink-0 text-brand" size={18} />
                <span className="text-sm leading-7 text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 rounded-[32px] border border-white/10 bg-gradient-to-b from-brand/10 to-white/[0.03] p-7 shadow-soft lg:mt-0"
        >
          <div className="text-xs uppercase tracking-[0.26em] text-white/40">
            {t.industries.subtitle}
          </div>
          <h3 className="mt-4 text-3xl font-black tracking-tight">
            {t.industries.title}
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {t.industries.list.map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-medium text-white/90"
              >
                <Building2 className="text-brand" size={16} />
                {industry}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section
        className="border-y border-white/10 bg-black/40 py-14 sm:py-20"
        id="pricing"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-3xl"
          >
            <div className="text-xs uppercase tracking-[0.26em] text-white/40">
              {isSpanish ? "precios" : "Pricing"}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {t.pricing.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              {t.pricing.subtitle}
            </p>
            <div className="mt-5 inline-flex rounded-full border border-brand/25 bg-brand/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand sm:text-xs">
              {isSpanish
                ? "Oferta inicial para primeros clientes"
                : "Early-client launch pricing"}
            </div>
          </motion.div>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 xl:grid-cols-3">
            {pricingCards.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                whileInView="visible"
                initial="hidden"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
                className={cn(
                  "relative rounded-[28px] border p-5 shadow-soft transition duration-300 hover:-translate-y-1 sm:rounded-[32px] sm:p-6",
                  plan.featured
                    ? "card-premium border-brand/40 bg-gradient-to-b from-brand/14 via-white/[0.04] to-white/[0.03] shadow-glow"
                    : "card-premium border-white/10 bg-white/[0.03]",
                )}
              >
                {plan.badge && (
                  <div className="absolute right-4 top-4 rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand sm:right-5 sm:top-5 sm:text-xs">
                    {locale === "es" ? t.pricing.featured : plan.badge}
                  </div>
                )}
                <div className="text-2xl font-black tracking-tight">
                  {plan.title[locale]}
                </div>
                <p className="mt-3 max-w-xs text-sm leading-7 text-muted">
                  {plan.description[locale]}
                </p>

                <div className="mt-7 flex items-end gap-2 sm:mt-8">
                  <div className="text-4xl font-black tracking-tight sm:text-5xl">
                    {plan.monthly}
                  </div>
                  <div className="pb-1 text-sm text-muted">
                    {t.pricing.monthly}
                  </div>
                </div>

                <div className="mt-3 text-sm text-white/75">
                  {t.pricing.setupFrom}{" "}
                  <span className="font-semibold text-white">{plan.setup}</span>
                  <span className="ml-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {isSpanish ? "bajo" : "low"}
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:mt-8">
                  {plan.features[locale].map((feature, featureIndex) => (
                    <div
                      key={feature}
                      className={cn(
                        "flex items-center gap-3 text-sm text-white/90",
                        featureIndex > 3 && "hidden md:flex",
                      )}
                    >
                      <CheckCircle2 className="shrink-0 text-brand" size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={checkoutLoadingId === plan.id}
                  className="btn-light mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-[#f3f6fb] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-10"
                >
                  {checkoutLoadingId === plan.id
                    ? isSpanish
                      ? "Cargando..."
                      : "Loading..."
                    : t.pricing.checkout}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-7 text-muted sm:mt-6">
            {t.pricing.note}
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
        id="faq"
      >
        <motion.div
          variants={fadeUp}
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl"
        >
          <div className="text-xs uppercase tracking-[0.26em] text-white/40">
            FAQ
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {t.faq.title}
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:mt-10">
          {t.faq.items.map((item, index) => (
            <motion.details
              key={item.q}
              variants={fadeUp}
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.36, delay: index * 0.05 }}
              className={cn(
                "group rounded-[22px] border border-white/10 bg-white/[0.03] p-5 open:border-brand/35 sm:rounded-[24px] sm:p-6",
                index > 2 && "hidden md:block",
              )}
            >
              <summary className="cursor-pointer list-none text-base font-semibold tracking-tight sm:text-lg">
                {item.q}
              </summary>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-panel/80 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="hidden lg:block"
          >
            <div className="text-xs uppercase tracking-[0.26em] text-white/40">
              {isSpanish ? "soporte" : "Support"}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {t.finalCta.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted">
              {t.finalCta.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-1"
              >
                {t.finalCta.primary}
                <ArrowRight size={16} />
              </a>
              <a
                href="/billing"
                className="btn-secondary inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                {t.finalCta.secondary}
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-[28px] border border-white/10 bg-black/30 p-5 shadow-soft sm:rounded-[32px] sm:p-6 lg:mt-0"
            id="contact"
          >
            <h3 className="text-2xl font-black tracking-tight">
              {t.form.title}
            </h3>
            <form
              className="mt-6 grid gap-4 sm:mt-8"
              onSubmit={handleContactSubmit}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t.form.name}
                  name="name"
                  required
                  placeholder={t.form.placeholders.name}
                />
                <Field
                  label={t.form.email}
                  name="email"
                  type="email"
                  required
                  placeholder={t.form.placeholders.email}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t.form.company}
                  name="company"
                  placeholder={t.form.placeholders.company}
                />
                <Field
                  label={t.form.service}
                  name="service"
                  placeholder={t.form.placeholders.service}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={t.form.region}
                  name="region"
                  placeholder="Mexico / United States"
                />
                <Field
                  label="Website"
                  name="website"
                  placeholder=""
                  className="hidden"
                />
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-white/85">
                  {t.form.message}
                </span>
                <textarea
                  name="message"
                  required
                  placeholder={t.form.placeholders.message}
                  className="min-h-[120px] rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20 sm:min-h-[140px]"
                />
              </label>

              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="currency" value={currency} />

              <button
                type="submit"
                disabled={submittingForm}
                className="btn-light mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-black transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingForm ? t.form.sending : t.form.submit}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-muted">
              {t.form.consent}
            </p>
            {formStatus && (
              <p className="mt-4 text-sm text-brand">{formStatus}</p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  className,
}: FieldProps) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-white/85">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}
