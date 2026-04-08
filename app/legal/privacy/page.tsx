import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Dexcore privacy policy and cookies disclosure."
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
        <div className="text-xs uppercase tracking-[0.26em] text-white/40">Legal</div>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Privacy Policy / Política de Privacidad</h1>

        <div className="mt-8 grid gap-10 text-sm leading-8 text-muted">
          <section>
            <h2 className="text-xl font-bold text-white">English</h2>
            <p className="mt-3">
              Dexcore respects your privacy. We collect only the information reasonably required to
              respond to inquiries, provide services, process billing, improve site performance, and
              comply with legal obligations.
            </p>
            <p>
              Information may include your name, email, company, service request details, billing
              details handled by Stripe, device data, and consent preferences.
            </p>
            <p>
              We use essential cookies for core site functionality. Optional analytics and marketing
              preferences are stored locally in your browser when you choose them through the cookie
              banner.
            </p>
            <p>
              Payment information is processed by Stripe and is not stored directly by Dexcore on this
              site. If you subscribe, Stripe may process billing information according to its own
              privacy practices.
            </p>
            <p>
              Dexcore may use service providers such as hosting, analytics, email delivery, and
              payments to operate the site. We only share data with processors when necessary to
              deliver the service.
            </p>
            <p>
              You may request access, correction, or deletion of your inquiry data by contacting
              Dexcore through the email listed on the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Español</h2>
            <p className="mt-3">
              Dexcore respeta tu privacidad. Solo recopilamos la información razonablemente necesaria
              para responder solicitudes, prestar servicios, procesar cobros, mejorar el rendimiento
              del sitio y cumplir obligaciones legales.
            </p>
            <p>
              La información puede incluir tu nombre, correo, empresa, detalles de tu solicitud,
              información de cobro gestionada por Stripe, datos básicos del dispositivo y preferencias
              de consentimiento.
            </p>
            <p>
              Usamos cookies esenciales para funciones básicas del sitio. Las preferencias opcionales
              de analítica y marketing se guardan localmente en tu navegador cuando las eliges en el
              banner de cookies.
            </p>
            <p>
              La información de pago es procesada por Stripe y no es almacenada directamente por
              Dexcore en este sitio. Si te suscribes, Stripe puede procesar la información de cobro de
              acuerdo con sus propias políticas.
            </p>
            <p>
              Dexcore puede usar proveedores como hosting, analítica, email y pagos para operar el
              sitio. Solo compartimos datos con procesadores cuando es necesario para prestar el
              servicio.
            </p>
            <p>
              Puedes solicitar acceso, corrección o eliminación de tus datos de contacto escribiendo al
              correo mostrado en el sitio.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-bold text-white">Cookies</h2>
            <p className="mt-3">
              Essential cookies support the basic operation of Dexcore. Optional analytics and
              marketing preferences are controlled through the banner and stored locally. You can clear
              your browser storage at any time to reset your choices.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
