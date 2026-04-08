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
      en: "For local businesses that need a cleaner lead flow fast.",
      es: "Para negocios locales que necesitan un flujo de leads más limpio rápido."
    },
    features: {
      en: [
        "Premium landing page",
        "Contact + qualification form",
        "Basic automation flows",
        "USD / MXN pricing support",
        "Cookie consent + legal pages",
        "Email lead notifications"
      ],
      es: [
        "Landing page premium",
        "Formulario de contacto y calificación",
        "Automatizaciones básicas",
        "Soporte de precios en USD / MXN",
        "Cookies + páginas legales",
        "Notificaciones por email"
      ]
    }
  },
  {
    id: "growth",
    badge: "Launch Offer",
    featured: true,
    prices: { usd: 39, mxn: 799 },
    setupFee: { usd: 39, mxn: 799 },
    title: { en: "Growth", es: "Growth" },
    description: {
      en: "For service businesses that want stronger qualification and follow-up.",
      es: "Para negocios de servicios que quieren mejor calificación y seguimiento."
    },
    features: {
      en: [
        "Everything in Starter",
        "Stripe subscription checkout",
        "Billing portal access",
        "Enhanced conversion sections",
        "Professional motion system",
        "SEO + schema markup + sitemap"
      ],
      es: [
        "Todo lo de Starter",
        "Checkout de suscripción con Stripe",
        "Acceso a portal de facturación",
        "Secciones de conversión mejoradas",
        "Sistema de animaciones profesional",
        "SEO + schema markup + sitemap"
      ]
    }
  },
  {
    id: "pro",
    prices: { usd: 69, mxn: 1399 },
    setupFee: { usd: 59, mxn: 1199 },
    title: { en: "Pro", es: "Pro" },
    description: {
      en: "For operators who want a premium conversion engine and room to expand.",
      es: "Para operadores que quieren una máquina premium de conversión con espacio para crecer."
    },
    features: {
      en: [
        "Everything in Growth",
        "Advanced onboarding copy",
        "Priority design support",
        "Regional MX / US messaging",
        "Launch checklist included",
        "Scaffold ready for CRM and dashboards"
      ],
      es: [
        "Todo lo de Growth",
        "Copy avanzado de onboarding",
        "Soporte de diseño prioritario",
        "Mensajería regional MX / US",
        "Checklist de lanzamiento incluido",
        "Base lista para CRM y dashboards"
      ]
    }
  }
];

export function getPlanById(planId: string) {
  return plans.find((plan) => plan.id === planId);
}
