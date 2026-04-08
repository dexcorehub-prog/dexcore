import type { Locale } from "@/lib/plans";
import { getSiteUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Dexcore",
  shortName: "Dexcore",
  description:
    "Premium bilingual operating system for service businesses in Mexico and the United States.",
  url: getSiteUrl(),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@dexcore.com",
  regionTagline: {
    en: "Created in Mexico. Built to sell in Mexico and the United States.",
    es: "Creado en México. Hecho para vender en México y Estados Unidos.",
  },
  keywords: [
    "service business operating system",
    "lead pipeline software",
    "quote builder",
    "follow-up tool",
    "Stripe Mexico subscriptions",
    "bilingual service business system",
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
      title: "Premium operating system for real-world service businesses.",
      subtitle:
        "Dexcore helps service operators capture leads, organize pipeline, build quotes, follow up faster, and charge professionally with a bilingual, conversion-ready system.",
      primary: "See launch pricing",
      secondary: "See features",
      cardTitle: "Operations without chaos.",
      cardBody:
        "From the first click to recurring payment, Dexcore gives service businesses a cleaner system to capture demand, quote faster, follow up harder, and operate with more control.",
    },
    pain: {
      title:
        "Most service businesses are still leaking revenue through manual chaos.",
      subtitle:
        "Slow replies, lost leads, weak follow-up, scattered tools, and ugly websites make a bad sales system feel normal.",
      bullets: [
        "Leads go cold while the owner is on-site",
        "Teams answer in different ways and miss details",
        "Quotes are made manually and follow-up is inconsistent",
        "Most websites look okay but sell poorly",
      ],
    },
    process: {
      title: "How Dexcore works",
      steps: [
        {
          title: "Capture",
          body: "Bring traffic into a cleaner bilingual site with stronger trust, better structure, and better lead capture.",
        },
        {
          title: "Organize",
          body: "Move each lead through a visible pipeline so the business always knows what is new, quoted, or ready for follow-up.",
        },
        {
          title: "Quote",
          body: "Build a fast quote inside the workspace and keep the lead tied to the amount and service details.",
        },
        {
          title: "Follow up",
          body: "Generate the next message, keep control of progress, and manage billing without needing scattered tools.",
        },
      ],
    },
    features: {
      title:
        "Built for operators who need a system that performs, not just a site that exists.",
      items: [
        {
          title: "Bilingual experience",
          body: "Serve English and Spanish audiences with one polished interface.",
        },
        {
          title: "Dual-currency pricing",
          body: "Display and sell in USD and MXN with a simple switch.",
        },
        {
          title: "Lead pipeline workspace",
          body: "Move leads by stage and keep daily operations more organized.",
        },
        {
          title: "Quote builder",
          body: "Prepare faster quotes with totals, extras, travel, rush, and tax.",
        },
        {
          title: "Follow-up engine",
          body: "Generate professional next-step messages that are ready to copy and send.",
        },
        {
          title: "Stripe subscriptions",
          body: "Charge recurring plans securely with checkout and billing portal support.",
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
          a: "The customer is sent directly into the workspace to start using the tool immediately. Billing and optional setup remain available without blocking access.",
        },
        {
          q: "Can I use my own Stripe Mexico account?",
          a: "Yes. Add your live keys and webhook secret to the environment variables and deploy.",
        },
        {
          q: "Is this only a landing page?",
          a: "No. It is a conversion-ready front-end system with a workspace, billing access, legal pages, consent flows, contact API scaffolding, and payment endpoints.",
        },
      ],
    },
    finalCta: {
      title: "Need help, support, or a custom rollout?",
      subtitle:
        "Dexcore is built for autoservice, but you can still contact us if you want help with setup, niche adaptation, or launch questions.",
      primary: "Contact Dexcore",
      secondary: "Manage Billing",
    },
    form: {
      title: "Request support or a custom rollout",
      name: "Name",
      email: "Email",
      company: "Company",
      region: "Region",
      service: "Primary service",
      message: "What do you need help with?",
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
          "We need help adapting Dexcore to our niche, pricing, or launch setup.",
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
      title: "Sistema operativo premium para negocios de servicios reales.",
      subtitle:
        "Dexcore ayuda a negocios de servicios a captar leads, organizar pipeline, cotizar más rápido, dar seguimiento mejor y cobrar de forma profesional con un sistema bilingüe listo para convertir.",
      primary: "Ver precios de lanzamiento",
      secondary: "Ver funciones",
      cardTitle: "Operación sin caos.",
      cardBody:
        "Desde el primer clic hasta el pago recurrente, Dexcore le da a negocios de servicios un sistema más limpio para captar demanda, cotizar más rápido, dar seguimiento más duro y operar con más control.",
    },
    pain: {
      title:
        "La mayoría de los negocios de servicios sigue perdiendo dinero por el caos manual.",
      subtitle:
        "Respuestas lentas, leads perdidos, seguimiento débil, herramientas dispersas y sitios feos hacen que un mal sistema de ventas parezca normal.",
      bullets: [
        "Los leads se enfrían mientras el dueño anda en campo",
        "El equipo responde diferente y se les van detalles",
        "Las cotizaciones se hacen a mano y el seguimiento es inconsistente",
        "Muchos sitios se ven decentes, pero venden mal",
      ],
    },
    process: {
      title: "Cómo funciona Dexcore",
      steps: [
        {
          title: "Captura",
          body: "Lleva tráfico a un sitio bilingüe más limpio, con mejor confianza, mejor estructura y mejor captura de leads.",
        },
        {
          title: "Organiza",
          body: "Mueve cada lead por un pipeline visible para saber siempre qué está nuevo, cotizado o listo para seguimiento.",
        },
        {
          title: "Cotiza",
          body: "Arma cotizaciones rápidas dentro del workspace y deja el lead ligado al monto y a los detalles del servicio.",
        },
        {
          title: "Da seguimiento",
          body: "Genera el siguiente mensaje, conserva control del avance y administra cobros sin depender de herramientas sueltas.",
        },
      ],
    },
    features: {
      title:
        "Hecho para operadores que necesitan un sistema que funcione, no solo un sitio que exista.",
      items: [
        {
          title: "Experiencia bilingüe",
          body: "Atiende audiencias en inglés y español con una sola interfaz pulida.",
        },
        {
          title: "Precios en dos monedas",
          body: "Muestra y vende en USD y MXN con un switch simple.",
        },
        {
          title: "Workspace con pipeline",
          body: "Mueve leads por etapa y organiza mejor la operación diaria.",
        },
        {
          title: "Cotizador rápido",
          body: "Prepara cotizaciones más rápido con totales, extras, viáticos, urgencia e impuesto.",
        },
        {
          title: "Motor de seguimiento",
          body: "Genera mensajes profesionales listos para copiar y enviar.",
        },
        {
          title: "Suscripciones con Stripe",
          body: "Cobra planes recurrentes de forma segura con checkout y portal de facturación.",
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
          q: "¿Qué pasa justo después del checkout?",
          a: "El cliente entra directo al workspace para usar la herramienta de inmediato. La facturación y el setup opcional siguen disponibles sin bloquear el acceso.",
        },
        {
          q: "¿Puedo usar mi cuenta de Stripe México?",
          a: "Sí. Solo agrega tus llaves live y tu webhook secret en variables de entorno y despliega.",
        },
        {
          q: "¿Es solo una landing?",
          a: "No. Es un sistema listo para conversión con workspace, acceso a billing, legales, cookies, API de contacto y endpoints de pago.",
        },
      ],
    },
    finalCta: {
      title: "¿Necesitas ayuda, soporte o un rollout personalizado?",
      subtitle:
        "Dexcore está hecho para autoservicio, pero también puedes contactarnos si quieres ayuda con setup, adaptación a tu nicho o dudas de lanzamiento.",
      primary: "Contactar a Dexcore",
      secondary: "Administrar facturación",
    },
    form: {
      title: "Solicita soporte o un rollout personalizado",
      name: "Nombre",
      email: "Correo",
      company: "Empresa",
      region: "Región",
      service: "Servicio principal",
      message: "¿Con qué necesitas ayuda?",
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
          "Necesitamos ayuda para adaptar Dexcore a nuestro nicho, precios o lanzamiento.",
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
