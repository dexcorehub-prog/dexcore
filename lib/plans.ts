export type Currency = "usd" | "mxn";
export type Locale = "en" | "es";

export type Plan = {
  id: "starter" | "growth" | "pro";
  badge?: string;
  featured?: boolean;
  prices: Record<Currency, number>;
  setupFee: Record<Currency, number>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  features: Record<Locale, string[]>;
};

export const plans: Plan[] = [
  {
    id: "starter",
    prices: { usd: 19, mxn: 399 },
    setupFee: { usd: 19, mxn: 399 },
    title: { en: "Starter", es: "Starter" },
    description: {
      en: "Best entry plan to start using Dexcore with the core workspace.",
      es: "El mejor plan de entrada para empezar a usar Dexcore con el workspace base.",
    },
    features: {
      en: [
        "Dexcore workspace access",
        "Lead pipeline",
        "Fast quote builder",
        "Follow-up message generator",
        "Bilingual interface (EN/ES)",
        "USD / MXN pricing switch",
      ],
      es: [
        "Acceso al workspace de Dexcore",
        "Pipeline de leads",
        "Cotizador rápido",
        "Generador de seguimiento",
        "Interfaz bilingüe (EN/ES)",
        "Cambio de moneda USD / MXN",
      ],
    },
  },
  {
    id: "growth",
    badge: "Launch Offer",
    featured: true,
    prices: { usd: 39, mxn: 799 },
    setupFee: { usd: 39, mxn: 799 },
    title: { en: "Growth", es: "Growth" },
    description: {
      en: "Recommended launch plan for operators who want the full core flow with billing access.",
      es: "Plan recomendado de lanzamiento para operadores que quieren el flujo central completo con acceso a facturación.",
    },
    features: {
      en: [
        "Everything in Starter",
        "Stripe subscription checkout",
        "Billing portal access",
        "Client portal access",
        "Launch-ready autoservice flow",
        "Best fit for daily use",
      ],
      es: [
        "Todo lo de Starter",
        "Checkout de suscripción con Stripe",
        "Acceso al portal de facturación",
        "Acceso al portal del cliente",
        "Flujo autoservicio listo para lanzamiento",
        "La mejor opción para uso diario",
      ],
    },
  },
  {
    id: "pro",
    prices: { usd: 69, mxn: 1399 },
    setupFee: { usd: 59, mxn: 1199 },
    title: { en: "Pro", es: "Pro" },
    description: {
      en: "Best for businesses that want the full Dexcore system plus higher-touch rollout support.",
      es: "Ideal para negocios que quieren el sistema completo de Dexcore más apoyo de rollout de mayor nivel.",
    },
    features: {
      en: [
        "Everything in Growth",
        "Priority rollout support",
        "Help adapting Dexcore to your niche",
        "More guided launch assistance",
        "Best fit for teams wanting a stronger setup",
        "Built for more serious operators",
      ],
      es: [
        "Todo lo de Growth",
        "Soporte prioritario de rollout",
        "Ayuda para adaptar Dexcore a tu nicho",
        "Más acompañamiento de lanzamiento",
        "Ideal para equipos que quieren una mejor implementación",
        "Hecho para operadores más serios",
      ],
    },
  },
];

export function getPlanById(planId: string) {
  return plans.find((plan) => plan.id === planId);
}
