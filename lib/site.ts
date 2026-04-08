import type { Locale } from "@/lib/plans";
import { getSiteUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Dexcore",
  shortName: "Dexcore",
  description:
    "Premium bilingual AI-native agency site for service businesses in Mexico and the United States.",
  url: getSiteUrl(),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@dexcore.com",
  regionTagline: {
    en: "Created in Mexico. Built to sell in Mexico and the United States.",
    es: "Creado en México. Hecho para vender en México y Estados Unidos.",
  },
  keywords: [
    "AI agency Mexico",
    "service business automation",
    "Stripe Mexico subscriptions",
    "bilingual agency website",
    "lead generation system",
    "Dexcore",
  ],
};

export const copy: Record<
  Locale,
  {
    nav: {
      features: string;
      process: string;
      pricing: string;
      faq: string;
      billing: string;
      cta: string;
    };
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      primary: string;
      secondary: string;
      cardTitle: string;
      cardBody: string;
    };
    pain: {
      title: string;
      subtitle: string;
      bullets: string[];
    };
    process: {
      title: string;
      steps: { title: string; body: string }[];
    };
    features: {
      title: string;
      items: { title: string; body: string }[];
    };
    industries: {
      title: string;
      subtitle: string;
      list: string[];
    };
    pricing: {
      title: string;
      subtitle: string;
      monthly: string;
      setupFrom: string;
      checkout: string;
      featured: string;
      note: string;
    };
    faq: {
      title: string;
      items: { q: string; a: string }[];
    };
    finalCta: {
      title: string;
      subtitle: string;
      primary: string;
      secondary: string;
    };
    form: {
      title: string;
      name: string;
      email: string;
      company: string;
      region: string;
      service: string;
      message: string;
      submit: string;
      sending: string;
      success: string;
      consent: string;
      placeholders: {
        name: string;
        email: string;
        company: string;
        service: string;
        message: string;
      };
    };
    footer: {
      rights: string;
      privacy: string;
      terms: string;
      billing: string;
      madeIn: string;
    };
    cookies: {
      title: string;
      body: string;
      acceptAll: string;
      essentialOnly: string;
      save: string;
      analytics: string;
      marketing: string;
    };
    billingLookup: {
      title: string;
      body: string;
      email: string;
      button: string;
      loading: string;
      notFound: string;
      help: string;
    };
    status: {
      success: string;
      cancel: string;
      backHome: string;
      retry: string;
    };
  }
> = {
  en: {
    nav: {
      features: "Features",
      process: "Process",
      pricing: "Pricing",
      faq: "FAQ",
      billing: "Billing",
      cta: "See pricing",
    },
    hero: {
      eyebrow: "Created in Mexico • Built for Mexico & the USA",
      title: "Premium AI systems for real-world service businesses.",
      subtitle:
        "Dexcore helps service operators capture, qualify, follow up, and close more leads with a bilingual, professional, conversion-ready system.",
      primary: "See launch pricing",
      secondary: "See pricing",
      cardTitle: "Operational clarity, not chaos.",
      cardBody:
        "From the first click to recurring payment, Dexcore gives you a cleaner system that looks serious, sells harder, and starts with launch pricing designed to win early clients.",
    },
    pain: {
      title:
        "Most service businesses are still leaking revenue through manual chaos.",
      subtitle:
        "Slow replies, lost leads, weak follow-up, scattered tools, and ugly websites make a bad sales system feel normal.",
      bullets: [
        "Leads go cold while the owner is on-site",
        "Teams answer in different ways and miss details",
        "No consistent path from inquiry to payment",
        "Most websites look okay but sell poorly",
      ],
    },
    process: {
      title: "How Dexcore works",
      steps: [
        {
          title: "Capture",
          body: "Drive traffic to a premium bilingual site with stronger trust, cleaner messaging, and better conversion structure.",
        },
        {
          title: "Qualify",
          body: "Filter incoming leads with a smarter form so you get better information before wasting time.",
        },
        {
          title: "Automate",
          body: "Route follow-ups, billing flows, and contact requests through cleaner operations and Stripe-powered payments.",
        },
        {
          title: "Close",
          body: "Convert more demand with a stronger offer, better speed, and a system clients can actually trust.",
        },
      ],
    },
    features: {
      title:
        "Built for operators who need a site that performs, not just one that exists.",
      items: [
        {
          title: "Bilingual UX",
          body: "Serve English and Spanish audiences with one polished interface.",
        },
        {
          title: "Dual-currency pricing",
          body: "Display and sell in USD and MXN with a simple switch.",
        },
        {
          title: "Stripe subscriptions",
          body: "Charge recurring plans securely with checkout and customer portal support.",
        },
        {
          title: "SEO-ready structure",
          body: "Metadata, schema, robots, sitemap, Open Graph, and clean page hierarchy.",
        },
        {
          title: "Cookie compliance",
          body: "Consent banner with stored preferences and privacy disclosure.",
        },
        {
          title: "Professional motion",
          body: "Subtle, premium animations that add polish without looking gimmicky.",
        },
      ],
    },
    industries: {
      title: "Best fit industries",
      subtitle: "Start with a niche that wins fast.",
      list: [
        "Camera installation",
        "Cable / networking",
        "Landscaping",
        "HVAC",
        "Electricians",
        "Roofing",
        "Tech field services",
        "Home service teams",
      ],
    },
    pricing: {
      title: "Launch pricing that is easier to say yes to.",
      subtitle:
        "Low launch monthly plans with a very small one-time implementation fee.",
      monthly: "/ month",
      setupFrom: "One-time setup",
      checkout: "Checkout",
      featured: "Launch offer",
      note: "Launch pricing is intentionally aggressive so early clients can start fast. The setup fee stays low and is charged only on the first invoice, then the monthly subscription continues automatically.",
    },
    faq: {
      title: "Questions clients will ask",
      items: [
        {
          q: "Can this sell in both Mexico and the United States?",
          a: "Yes. The site copy, currency switch, and regional messaging are designed for both markets.",
        },
        {
          q: "Does it support recurring payments?",
          a: "Yes. Stripe checkout and billing portal routes are already scaffolded for subscription workflows.",
        },
        {
          q: "What happens right after checkout?",
          a: "The customer lands on a success page, can complete onboarding, and can use the client portal or billing portal without waiting for manual confirmation.",
        },
        {
          q: "Can I use my own Stripe Mexico account?",
          a: "Yes. Add your live keys and webhook secret to the environment variables and deploy.",
        },
        {
          q: "Is this only a landing page?",
          a: "No. It is a conversion-ready front-end system with legal pages, consent flows, contact API scaffolding, and payment endpoints.",
        },
      ],
    },
    finalCta: {
      title: "Launch a system that looks premium and closes harder.",
      subtitle:
        "Dexcore is designed to feel serious from the first second and convert across Mexico and the United States.",
      primary: "Launch Dexcore",
      secondary: "Manage Billing",
    },
    form: {
      title: "Tell Dexcore about your business",
      name: "Name",
      email: "Email",
      company: "Company",
      region: "Region",
      service: "Primary service",
      message: "What do you need?",
      submit: "Send Request",
      sending: "Sending...",
      success: "Thanks. Your request was sent successfully.",
      consent:
        "By sending this form, you agree to the Privacy Policy and Terms.",
      placeholders: {
        name: "Your name",
        email: "name@company.com",
        company: "Dexcore Services",
        service: "Camera installation",
        message:
          "We need a premium bilingual website with subscriptions and better lead flow.",
      },
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      billing: "Billing",
      madeIn: "Created in Mexico. Serving Mexico & the United States.",
    },
    cookies: {
      title: "Cookie preferences",
      body: "Dexcore uses essential cookies for core functionality and optional cookies for analytics and marketing preferences.",
      acceptAll: "Accept all",
      essentialOnly: "Essential only",
      save: "Save preferences",
      analytics: "Analytics cookies",
      marketing: "Marketing cookies",
    },
    billingLookup: {
      title: "Open your billing portal",
      body: "Enter the email used at checkout and Dexcore will try to locate your Stripe customer profile.",
      email: "Checkout email",
      button: "Open Billing Portal",
      loading: "Opening...",
      notFound: "We could not find a billing profile for that email.",
      help: "Need help? Contact Dexcore support.",
    },
    status: {
      success: "Payment confirmed. Welcome to Dexcore.",
      cancel: "Checkout canceled. You can review the plans and try again.",
      backHome: "Back home",
      retry: "Try again",
    },
  },
  es: {
    nav: {
      features: "Funciones",
      process: "Proceso",
      pricing: "Precios",
      faq: "FAQ",
      billing: "Facturación",
      cta: "Ver precios",
    },
    hero: {
      eyebrow: "Creado en México • Hecho para México y USA",
      title: "Sistemas premium con IA para negocios de servicios reales.",
      subtitle:
        "Dexcore ayuda a negocios de servicios a captar, calificar, dar seguimiento y cerrar más leads con un sistema bilingüe, profesional y listo para convertir.",
      primary: "Ver precios de lanzamiento",
      secondary: "Ver funciones",
      cardTitle: "Claridad operativa, no caos.",
      cardBody:
        "Desde el primer clic hasta el pago recurrente, Dexcore te da un sistema más limpio, más serio y más vendedor, con precios de lanzamiento pensados para cerrar más rápido.",
    },
    pain: {
      title:
        "La mayoría de los negocios de servicios sigue perdiendo dinero por el caos manual.",
      subtitle:
        "Respuestas lentas, leads perdidos, seguimiento débil, herramientas dispersas y sitios feos hacen que un mal sistema de ventas parezca normal.",
      bullets: [
        "Los leads se enfrían mientras el dueño anda en campo",
        "El equipo responde diferente y se les van detalles",
        "No existe un camino consistente desde la consulta hasta el pago",
        "Muchos sitios se ven decentes, pero venden mal",
      ],
    },
    process: {
      title: "Cómo funciona Dexcore",
      steps: [
        {
          title: "Captura",
          body: "Lleva tráfico a un sitio premium bilingüe con más confianza, mejor mensaje y mejor estructura de conversión.",
        },
        {
          title: "Califica",
          body: "Filtra leads con un formulario más inteligente para obtener mejor información antes de perder tiempo.",
        },
        {
          title: "Automatiza",
          body: "Mueve seguimientos, cobros y solicitudes de contacto con operaciones más limpias y pagos con Stripe.",
        },
        {
          title: "Cierra",
          body: "Convierte más demanda con una oferta más fuerte, mejor velocidad y un sistema en el que sí confían.",
        },
      ],
    },
    features: {
      title:
        "Hecho para operadores que necesitan un sitio que funcione, no uno que solo exista.",
      items: [
        {
          title: "UX bilingüe",
          body: "Atiende audiencias en inglés y español con una sola interfaz pulida.",
        },
        {
          title: "Precios en dos monedas",
          body: "Muestra y vende en USD y MXN con un switch simple.",
        },
        {
          title: "Suscripciones con Stripe",
          body: "Cobra planes recurrentes de forma segura con checkout y portal de clientes.",
        },
        {
          title: "Estructura SEO lista",
          body: "Metadata, schema, robots, sitemap, Open Graph y jerarquía limpia.",
        },
        {
          title: "Cumplimiento de cookies",
          body: "Banner de consentimiento con preferencias guardadas y aviso de privacidad.",
        },
        {
          title: "Animación profesional",
          body: "Animaciones sutiles y premium que elevan el sitio sin verse exageradas.",
        },
      ],
    },
    industries: {
      title: "Industrias ideales",
      subtitle: "Empieza por un nicho que cierre rápido.",
      list: [
        "Instalación de cámaras",
        "Cableado / redes",
        "Landscaping",
        "HVAC",
        "Electricistas",
        "Roofing",
        "Servicios técnicos en campo",
        "Equipos de home services",
      ],
    },
    pricing: {
      title: "Precios de lanzamiento más fáciles de aceptar.",
      subtitle:
        "Planes mensuales de lanzamiento con una cuota de implementación muy baja por una sola vez.",
      monthly: "/ mes",
      setupFrom: "Setup único",
      checkout: "Pagar",
      featured: "Oferta de lanzamiento",
      note: "El precio de lanzamiento está puesto agresivo a propósito para cerrar primeros clientes más rápido. El setup también va bajo para facilitar el arranque y solo se cobra en la primera factura.",
    },
    faq: {
      title: "Preguntas que sí te van a hacer",
      items: [
        {
          q: "¿Esto sirve para vender en México y Estados Unidos?",
          a: "Sí. El copy, el cambio de moneda y la mensajería regional fueron pensados para ambos mercados.",
        },
        {
          q: "¿Soporta pagos recurrentes?",
          a: "Sí. Ya trae rutas base para Stripe Checkout y Billing Portal orientadas a suscripciones.",
        },
        {
          q: "¿Puedo usar mi cuenta de Stripe México?",
          a: "Sí. Solo agrega tus llaves live y tu webhook secret en variables de entorno y despliega.",
        },
        {
          q: "¿Es solo una landing?",
          a: "No. Es un sistema front-end listo para conversión con legales, cookies, API de contacto y endpoints de pago.",
        },
      ],
    },
    finalCta: {
      title: "Lanza un sistema que se vea premium y cierre más duro.",
      subtitle:
        "Dexcore está diseñado para verse serio desde el primer segundo y convertir tanto en México como en Estados Unidos.",
      primary: "Lanzar Dexcore",
      secondary: "Administrar facturación",
    },
    form: {
      title: "Cuéntale a Dexcore sobre tu negocio",
      name: "Nombre",
      email: "Correo",
      company: "Empresa",
      region: "Región",
      service: "Servicio principal",
      message: "¿Qué necesitas?",
      submit: "Enviar solicitud",
      sending: "Enviando...",
      success: "Gracias. Tu solicitud fue enviada correctamente.",
      consent:
        "Al enviar este formulario aceptas la Política de Privacidad y los Términos.",
      placeholders: {
        name: "Tu nombre",
        email: "nombre@empresa.com",
        company: "Dexcore Services",
        service: "Instalación de cámaras",
        message:
          "Necesitamos un sitio premium bilingüe con suscripciones y mejor flujo de leads.",
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      privacy: "Privacidad",
      terms: "Términos",
      billing: "Facturación",
      madeIn: "Creado en México. Sirviendo a México y Estados Unidos.",
    },
    cookies: {
      title: "Preferencias de cookies",
      body: "Dexcore usa cookies esenciales para funciones básicas y cookies opcionales para analítica y marketing.",
      acceptAll: "Aceptar todo",
      essentialOnly: "Solo esenciales",
      save: "Guardar preferencias",
      analytics: "Cookies de analítica",
      marketing: "Cookies de marketing",
    },
    billingLookup: {
      title: "Abre tu portal de facturación",
      body: "Escribe el correo que usaste en el checkout y Dexcore intentará encontrar tu perfil de Stripe.",
      email: "Correo de checkout",
      button: "Abrir portal",
      loading: "Abriendo...",
      notFound: "No encontramos un perfil de facturación con ese correo.",
      help: "¿Necesitas ayuda? Contacta a soporte de Dexcore.",
    },
    status: {
      success: "Pago confirmado. Bienvenido a Dexcore.",
      cancel:
        "Checkout cancelado. Puedes revisar los planes e intentar otra vez.",
      backHome: "Volver al inicio",
      retry: "Intentar de nuevo",
    },
  },
};
