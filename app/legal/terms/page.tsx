import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Dexcore terms of service."
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-soft">
        <div className="text-xs uppercase tracking-[0.26em] text-white/40">Legal</div>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Terms of Service / Términos del Servicio</h1>

        <div className="mt-8 grid gap-10 text-sm leading-8 text-muted">
          <section>
            <h2 className="text-xl font-bold text-white">English</h2>
            <p className="mt-3">
              By using Dexcore, you agree to use the site lawfully and not attempt to interfere with
              its functionality, security, or payment flows.
            </p>
            <p>
              Subscription purchases, billing changes, renewals, and cancellations may be managed
              through Stripe and its customer portal. Service scopes, custom work, and implementation
              details should be confirmed in written proposals or agreements.
            </p>
            <p>
              Dexcore provides website, automation, and conversion-focused systems. Unless explicitly
              agreed otherwise, no guarantee is made regarding a specific revenue outcome, search rank,
              or ad performance.
            </p>
            <p>
              You remain responsible for the legality of your business, your marketing claims, your
              uploaded content, and your compliance obligations in the jurisdictions where you operate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Español</h2>
            <p className="mt-3">
              Al usar Dexcore, aceptas utilizar el sitio de forma legal y no intentar interferir con
              su funcionamiento, seguridad o flujos de pago.
            </p>
            <p>
              Las suscripciones, cambios de cobro, renovaciones y cancelaciones pueden administrarse a
              través de Stripe y su customer portal. Los alcances de servicio, trabajo personalizado e
              implementación deben confirmarse por escrito en propuestas o acuerdos.
            </p>
            <p>
              Dexcore ofrece sitios, automatizaciones y sistemas orientados a conversión. Salvo acuerdo
              expreso, no se garantiza un resultado específico de ingresos, posicionamiento en
              buscadores o rendimiento de anuncios.
            </p>
            <p>
              Tú sigues siendo responsable de la legalidad de tu negocio, de tus afirmaciones
              comerciales, del contenido que subas y de tus obligaciones de cumplimiento en los países
              donde operes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
