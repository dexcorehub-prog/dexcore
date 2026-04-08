"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Copy,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RefreshCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-context";

type Locale = "es" | "en";
type Currency = "usd" | "mxn";
type LeadStage = "new" | "quoted" | "followUp" | "won";

type Lead = {
  id: string;
  name: string;
  company: string;
  service: string;
  area: string;
  channel: string;
  notes: string;
  stage: LeadStage;
  quoteTotal: number | null;
};

type QuickLeadForm = {
  name: string;
  company: string;
  service: string;
  area: string;
  channel: string;
  notes: string;
};

type QuoteForm = {
  service: string;
  scope: string;
  basePrice: string;
  extras: string;
  travel: string;
  rush: string;
  tax: string;
};

type DailyControl = {
  reviewed: boolean;
  quoted: boolean;
  followUp: boolean;
};

type WorkspaceState = {
  leads: Lead[];
  selectedLeadId: string | null;
  quoteForm: QuoteForm;
  nextStep: string;
  dailyControl: DailyControl;
};

type TutorialTarget = "step1" | "step2" | "step3" | "step4" | "step5" | "setup";

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const STORAGE_KEY = "dexcore-workspace-state-v66";
const TUTORIAL_STORAGE_KEY = "dexcore-workspace-tutorial-dismissed-v1";
const pipelineOrder: LeadStage[] = ["new", "quoted", "followUp", "won"];

const blankLeadForm: QuickLeadForm = {
  name: "",
  company: "",
  service: "",
  area: "",
  channel: "",
  notes: "",
};

const blankQuoteForm: QuoteForm = {
  service: "",
  scope: "",
  basePrice: "",
  extras: "",
  travel: "",
  rush: "",
  tax: "8.25",
};

const defaultDailyControl: DailyControl = {
  reviewed: false,
  quoted: false,
  followUp: false,
};

function createInitialLeads(): Lead[] {
  return [
    {
      id: "lead-carlos",
      name: "Carlos Mendoza",
      company: "Mendoza Rentals",
      service: "Camera installation",
      area: "Houston, TX",
      channel: "Website",
      notes: "Needs 4 cameras and attic cable review.",
      stage: "new",
      quoteTotal: null,
    },
    {
      id: "lead-ana",
      name: "Ana Torres",
      company: "Torres Dental",
      service: "TV Mounting",
      area: "League City, TX",
      channel: "Referral",
      notes: "Asked for scheduling this week.",
      stage: "quoted",
      quoteTotal: 260,
    },
    {
      id: "lead-john",
      name: "John Walker",
      company: "Walker Logistics",
      service: "Structured cabling",
      area: "Pasadena, TX",
      channel: "Google Ads",
      notes: "Comparing options. Follow up tomorrow.",
      stage: "followUp",
      quoteTotal: 540,
    },
  ];
}

function formatMoney(amount: number, currency: Currency, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

function safeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function truncateText(value: string, max = 88) {
  if (!value) return "";
  return value.length <= max ? value : `${value.slice(0, max).trim()}…`;
}

function buildFollowUpMessage(
  locale: Locale,
  lead: Lead | null,
  total: number,
  currency: Currency,
  nextStep: string,
) {
  if (!lead) {
    return locale === "es"
      ? "Selecciona un lead para generar el seguimiento."
      : "Select a lead to generate the follow-up.";
  }

  const amount = formatMoney(total, currency, locale);

  if (locale === "es") {
    return `Hola ${lead.name}, gracias por contactar a ${lead.company || "Dexcore"}. Ya tenemos una propuesta inicial por ${amount} para ${lead.service || "tu servicio solicitado"}. Siguiente paso recomendado: ${nextStep || "confirmar detalles y agendar."}`;
  }

  return `Hi ${lead.name}, thanks for contacting ${lead.company || "Dexcore"}. We already have a starting proposal for ${amount} for ${lead.service || "your requested service"}. Recommended next step: ${nextStep || "confirm details and schedule the next step."}`;
}

async function copyTextWithFallback(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export default function WorkspacePage() {
  const { locale: rawLocale, currency: rawCurrency } = useSitePreferences();

  const locale: Locale = rawLocale === "es" ? "es" : "en";
  const currency: Currency = rawCurrency === "mxn" ? "mxn" : "usd";
  const isSpanish = locale === "es";

  const text = {
    headerEyebrow: isSpanish ? "Herramienta activa" : "Tool active",
    headerTitle: isSpanish
      ? "Dexcore ya está listo para trabajar."
      : "Dexcore is ready to work.",
    headerBody: isSpanish
      ? "Tu cliente paga y entra directo a una herramienta operativa: capturas lead, cotizas, das seguimiento y organizas el avance sin perderte."
      : "Your client pays and enters directly into an operating tool: capture the lead, quote, follow up, and organize progress without losing the thread.",
    quickActions: {
      portal: isSpanish ? "Portal del cliente" : "Client portal",
      billing: isSpanish ? "Facturación" : "Billing",
      setup: isSpanish ? "Setup opcional" : "Optional setup",
      reload: isSpanish ? "Recargar workspace" : "Reload workspace",
      tutorial: isSpanish ? "Tutorial" : "Tutorial",
    },
    step1: {
      eyebrow: isSpanish ? "Paso 01" : "Step 01",
      title: isSpanish ? "Captura rápida" : "Quick capture",
      body: isSpanish
        ? "Agrega un lead en segundos. Entra al pipeline y queda listo para cotizar."
        : "Add a lead in seconds. It goes into the pipeline and is ready for quoting.",
      name: isSpanish ? "Nombre del lead" : "Lead name",
      company: isSpanish ? "Empresa" : "Company",
      service: isSpanish ? "Servicio" : "Service",
      area: isSpanish ? "Área" : "Area",
      channel: isSpanish ? "Canal" : "Channel",
      notes: isSpanish ? "Notas rápidas del lead" : "Quick lead notes",
      notesPlaceholder: isSpanish
        ? "Detalles, urgencia, referencia, etc."
        : "Details, urgency, referral source, etc.",
      addLead: isSpanish ? "Agregar lead" : "Add lead",
    },
    step2: {
      eyebrow: isSpanish ? "Paso 02" : "Step 02",
      title: "Pipeline",
      body: isSpanish
        ? "Organiza los leads por etapa con tarjetas limpias, acciones claras y sin amontonar la información."
        : "Organize leads by stage with clean cards, clear actions, and no cramped information.",
      stage: {
        new: isSpanish ? "Nuevos" : "New",
        quoted: isSpanish ? "Cotizados" : "Quoted",
        followUp: isSpanish ? "Seguimiento" : "Follow-up",
        won: isSpanish ? "Ganados" : "Won",
      },
      empty: isSpanish ? "Sin leads aquí" : "No leads here",
      openLead: isSpanish ? "Abrir lead" : "Open lead",
      moveTo: {
        new: isSpanish ? "Mover a nuevo" : "Move to new",
        quoted: isSpanish ? "Mover a cotizado" : "Move to quoted",
        followUp: isSpanish ? "Mover a seguimiento" : "Move to follow-up",
        won: isSpanish ? "Mover a ganado" : "Move to won",
      },
    },
    step3: {
      eyebrow: isSpanish ? "Paso 03" : "Step 03",
      title: isSpanish ? "Cotización" : "Quote builder",
      body: isSpanish
        ? "Arma una cotización limpia para el lead activo."
        : "Build a clean quote for the active lead.",
      service: isSpanish ? "Servicio" : "Service",
      scope: isSpanish ? "Alcance / detalles" : "Scope / details",
      base: isSpanish ? "Precio base" : "Base price",
      extras: isSpanish ? "Extras" : "Extras",
      travel: isSpanish ? "Viáticos" : "Travel",
      rush: isSpanish ? "Urgencia" : "Rush fee",
      tax: isSpanish ? "Impuesto %" : "Tax %",
      subtotal: isSpanish ? "Subtotal" : "Subtotal",
      taxAmount: isSpanish ? "Impuesto" : "Tax",
      total: isSpanish ? "Total" : "Total",
      save: isSpanish ? "Guardar cotización" : "Save quote",
    },
    step4: {
      eyebrow: isSpanish ? "Paso 04" : "Step 04",
      title: isSpanish ? "Seguimiento" : "Follow-up",
      body: isSpanish
        ? "Genera el siguiente mensaje listo para copiar y enviar."
        : "Generate the next message ready to copy and send.",
      nextStep: isSpanish
        ? "Siguiente paso recomendado"
        : "Recommended next step",
      followUpMessage: isSpanish
        ? "Mensaje de seguimiento"
        : "Follow-up message",
      copy: isSpanish ? "Copiar seguimiento" : "Copy follow-up",
      copied: isSpanish ? "Seguimiento copiado." : "Follow-up copied.",
      copyError: isSpanish
        ? "No se pudo copiar automáticamente. Intenta otra vez."
        : "Could not copy automatically. Try again.",
    },
    step5: {
      eyebrow: isSpanish ? "Paso 05" : "Step 05",
      title: isSpanish ? "Control diario" : "Daily control",
      body: isSpanish
        ? "Marca el avance de la operación sin perder el hilo del lead."
        : "Track operation progress without losing the lead flow.",
      reviewed: isSpanish ? "Lead revisado" : "Lead reviewed",
      quoted: isSpanish
        ? "Cotización enviada o guardada"
        : "Quote sent or saved",
      followUp: isSpanish ? "Seguimiento programado" : "Follow-up scheduled",
      open: isSpanish ? "Abierto" : "Open",
      done: isSpanish ? "Hecho" : "Done",
    },
    optionalSetup: {
      title: isSpanish ? "Setup opcional" : "Optional setup",
      body: isSpanish
        ? "Si quieres personalizar más, agrega datos del negocio después. No bloquea la herramienta."
        : "If you want deeper customization, add business details later. It does not block the tool.",
      setup: isSpanish ? "Abrir setup" : "Open setup",
    },
    activeLead: isSpanish ? "Lead activo" : "Active lead",
    noLeadSelected: isSpanish
      ? "Selecciona un lead del pipeline para trabajar con él."
      : "Select a lead from the pipeline to work with it.",
    welcome: isSpanish
      ? "Pago confirmado. Ya puedes usar tu herramienta."
      : "Payment confirmed. You can now use your tool.",
  };

  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [welcome, setWelcome] = useState(false);

  const [leadForm, setLeadForm] = useState<QuickLeadForm>(blankLeadForm);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteForm>(blankQuoteForm);
  const [nextStep, setNextStep] = useState(
    isSpanish
      ? "Confirmar fotos del sitio y proponer horario hoy."
      : "Confirm site photos and propose timing today.",
  );
  const [dailyControl, setDailyControl] =
    useState<DailyControl>(defaultDailyControl);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const step1Ref = useRef<HTMLElement | null>(null);
  const step2Ref = useRef<HTMLElement | null>(null);
  const step3Ref = useRef<HTMLElement | null>(null);
  const step4Ref = useRef<HTMLElement | null>(null);
  const step5Ref = useRef<HTMLElement | null>(null);
  const setupRef = useRef<HTMLDivElement | null>(null);

  const tutorialSteps = useMemo(
    () => [
      {
        target: "step1" as TutorialTarget,
        title: isSpanish ? "Captura rápida" : "Quick capture",
        body: isSpanish
          ? "Aquí agregas un lead nuevo en segundos. Se manda al pipeline para empezar a trabajar sin perder tiempo."
          : "Add a new lead here in seconds. It goes directly into the pipeline so you can start working right away.",
      },
      {
        target: "step2" as TutorialTarget,
        title: isSpanish ? "Pipeline organizado" : "Organized pipeline",
        body: isSpanish
          ? "Aquí ves cada lead por etapa. Primero abres el lead, luego lo mueves de nuevo a cotizado, seguimiento o ganado."
          : "View each lead by stage here. First open the lead, then move it from new to quoted, follow-up, or won.",
      },
      {
        target: "step3" as TutorialTarget,
        title: isSpanish ? "Cotización" : "Quote builder",
        body: isSpanish
          ? "Con el lead activo, aquí armas la cotización, calculas subtotal, impuesto y total, y la guardas."
          : "With the active lead, build the quote here, calculate subtotal, tax, and total, then save it.",
      },
      {
        target: "step4" as TutorialTarget,
        title: isSpanish ? "Seguimiento" : "Follow-up",
        body: isSpanish
          ? "Genera un mensaje profesional listo para copiar y enviar al cliente por WhatsApp, SMS o correo."
          : "Generate a professional follow-up message ready to copy and send by WhatsApp, SMS, or email.",
      },
      {
        target: "step5" as TutorialTarget,
        title: isSpanish ? "Control diario" : "Daily control",
        body: isSpanish
          ? "Marca lo que ya revisaste, cotizaste o programaste para no perder el avance operativo."
          : "Track what has been reviewed, quoted, or scheduled so you never lose operational progress.",
      },
      {
        target: "setup" as TutorialTarget,
        title: isSpanish ? "Setup opcional" : "Optional setup",
        body: isSpanish
          ? "Esto no bloquea la herramienta. Sirve para personalizar más el negocio después."
          : "This does not block the tool. Use it later if you want deeper business customization.",
      },
    ],
    [isSpanish],
  );

  function getTutorialTargetElement(target: TutorialTarget) {
    switch (target) {
      case "step1":
        return step1Ref.current;
      case "step2":
        return step2Ref.current;
      case "step3":
        return step3Ref.current;
      case "step4":
        return step4Ref.current;
      case "step5":
        return step5Ref.current;
      case "setup":
        return setupRef.current;
      default:
        return null;
    }
  }

  function closeTutorial() {
    setTutorialOpen(false);
    window.localStorage.setItem(TUTORIAL_STORAGE_KEY, "1");
  }

  function restartTutorial() {
    setTutorialStep(0);
    setTutorialOpen(true);
  }

  function nextTutorialStep() {
    if (tutorialStep >= tutorialSteps.length - 1) {
      closeTutorial();
      return;
    }
    setTutorialStep((current) => current + 1);
  }

  function prevTutorialStep() {
    setTutorialStep((current) => Math.max(current - 1, 0));
  }

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id") || "");
    setWelcome(params.get("welcome") === "1");

    const tutorialDismissed = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!tutorialDismissed) {
      setTutorialOpen(true);
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<WorkspaceState>;
        const restoredLeads =
          Array.isArray(parsed.leads) && parsed.leads.length > 0
            ? parsed.leads
            : createInitialLeads();

        setLeads(restoredLeads);
        setSelectedLeadId(
          parsed.selectedLeadId || restoredLeads[0]?.id || null,
        );
        setQuoteForm(parsed.quoteForm || blankQuoteForm);
        setNextStep(
          parsed.nextStep ||
            (locale === "es"
              ? "Confirmar fotos del sitio y proponer horario hoy."
              : "Confirm site photos and propose timing today."),
        );
        setDailyControl(parsed.dailyControl || defaultDailyControl);
      } catch {
        const seeded = createInitialLeads();
        setLeads(seeded);
        setSelectedLeadId(seeded[0]?.id || null);
      }
    } else {
      const seeded = createInitialLeads();
      setLeads(seeded);
      setSelectedLeadId(seeded[0]?.id || null);
    }
  }, [locale]);

  useEffect(() => {
    if (!mounted) return;

    const payload: WorkspaceState = {
      leads,
      selectedLeadId,
      quoteForm,
      nextStep,
      dailyControl,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [mounted, leads, selectedLeadId, quoteForm, nextStep, dailyControl]);

  useEffect(() => {
    if (!tutorialOpen) return;

    const currentStep = tutorialSteps[tutorialStep];
    const element = getTutorialTargetElement(currentStep.target);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    const updateSpotlight = () => {
      const rect = element.getBoundingClientRect();
      const padding = 12;

      const top = Math.max(rect.top - padding, 8);
      const left = Math.max(rect.left - padding, 8);
      const width = Math.min(
        rect.width + padding * 2,
        window.innerWidth - left - 8,
      );
      const height = rect.height + padding * 2;

      setSpotlight({
        top,
        left,
        width,
        height,
      });
    };

    const handleFrameUpdate = () => {
      window.requestAnimationFrame(updateSpotlight);
    };

    updateSpotlight();

    window.addEventListener("resize", handleFrameUpdate);
    window.addEventListener("scroll", handleFrameUpdate, true);

    return () => {
      window.removeEventListener("resize", handleFrameUpdate);
      window.removeEventListener("scroll", handleFrameUpdate, true);
    };
  }, [tutorialOpen, tutorialStep, tutorialSteps]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId],
  );

  const leadsByStage = useMemo(
    () => ({
      new: leads.filter((lead) => lead.stage === "new"),
      quoted: leads.filter((lead) => lead.stage === "quoted"),
      followUp: leads.filter((lead) => lead.stage === "followUp"),
      won: leads.filter((lead) => lead.stage === "won"),
    }),
    [leads],
  );

  useEffect(() => {
    if (!selectedLead) return;

    setQuoteForm((current) => ({
      ...current,
      service: current.service || selectedLead.service || "",
      scope: current.scope || selectedLead.notes || "",
    }));
  }, [selectedLead]);

  const subtotal = useMemo(() => {
    return (
      safeNumber(quoteForm.basePrice) +
      safeNumber(quoteForm.extras) +
      safeNumber(quoteForm.travel) +
      safeNumber(quoteForm.rush)
    );
  }, [quoteForm]);

  const taxAmount = useMemo(() => {
    return subtotal * (safeNumber(quoteForm.tax) / 100);
  }, [subtotal, quoteForm]);

  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const followUpMessage = useMemo(
    () => buildFollowUpMessage(locale, selectedLead, total, currency, nextStep),
    [locale, selectedLead, total, currency, nextStep],
  );

  function updateLeadForm<K extends keyof QuickLeadForm>(
    key: K,
    value: QuickLeadForm[K],
  ) {
    setLeadForm((current) => ({ ...current, [key]: value }));
  }

  function updateQuoteForm<K extends keyof QuoteForm>(
    key: K,
    value: QuoteForm[K],
  ) {
    setQuoteForm((current) => ({ ...current, [key]: value }));
  }

  function addLead() {
    if (!leadForm.name.trim() || !leadForm.service.trim()) {
      setFeedback(
        isSpanish
          ? "Agrega al menos el nombre del lead y el servicio."
          : "Add at least the lead name and the service.",
      );
      return;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadForm.name.trim(),
      company: leadForm.company.trim(),
      service: leadForm.service.trim(),
      area: leadForm.area.trim(),
      channel: leadForm.channel.trim(),
      notes: leadForm.notes.trim(),
      stage: "new",
      quoteTotal: null,
    };

    setLeads((current) => [newLead, ...current]);
    setSelectedLeadId(newLead.id);
    setLeadForm(blankLeadForm);
    setFeedback(isSpanish ? "Lead agregado." : "Lead added.");
  }

  function selectLead(leadId: string) {
    setSelectedLeadId(leadId);
    setFeedback(null);
    setDailyControl((current) => ({
      ...current,
      reviewed: true,
    }));
  }

  function moveLeadStage(leadId: string, nextStage: LeadStage) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              stage: nextStage,
            }
          : lead,
      ),
    );
    setFeedback(isSpanish ? "Lead actualizado." : "Lead updated.");
  }

  function saveQuote() {
    if (!selectedLead) {
      setFeedback(
        isSpanish
          ? "Selecciona un lead antes de guardar la cotización."
          : "Select a lead before saving the quote.",
      );
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id
          ? {
              ...lead,
              service: quoteForm.service.trim() || lead.service,
              notes: quoteForm.scope.trim() || lead.notes,
              quoteTotal: total,
              stage: "quoted",
            }
          : lead,
      ),
    );

    setDailyControl((current) => ({
      ...current,
      quoted: true,
    }));

    setFeedback(isSpanish ? "Cotización guardada." : "Quote saved.");
  }

  async function copyFollowUp() {
    const success = await copyTextWithFallback(followUpMessage);
    setDailyControl((current) => ({
      ...current,
      followUp: success ? true : current.followUp,
    }));
    setFeedback(success ? text.step4.copied : text.step4.copyError);
  }

  function toggleDailyControl(key: keyof DailyControl) {
    setDailyControl((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function reloadWorkspace() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setFeedback(
        isSpanish ? "No hay cambios guardados." : "No saved changes found.",
      );
      return;
    }

    try {
      const parsed = JSON.parse(saved) as WorkspaceState;
      setLeads(parsed.leads || createInitialLeads());
      setSelectedLeadId(parsed.selectedLeadId || parsed.leads?.[0]?.id || null);
      setQuoteForm(parsed.quoteForm || blankQuoteForm);
      setNextStep(parsed.nextStep || "");
      setDailyControl(parsed.dailyControl || defaultDailyControl);
      setFeedback(isSpanish ? "Workspace recargado." : "Workspace reloaded.");
    } catch {
      setFeedback(
        isSpanish
          ? "No se pudo recargar el workspace."
          : "Could not reload the workspace.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-5 shadow-soft sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                {text.headerEyebrow}
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {text.headerTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                {text.headerBody}
              </p>

              {welcome && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                  <Sparkles size={16} />
                  {text.welcome}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={restartTutorial}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                <Sparkles size={15} />
                {text.quickActions.tutorial}
              </button>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                {text.quickActions.portal}
              </Link>
              <Link
                href="/billing"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                {text.quickActions.billing}
              </Link>
              <Link
                href={
                  sessionId
                    ? `/onboarding?session_id=${encodeURIComponent(sessionId)}`
                    : "/onboarding"
                }
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                {text.quickActions.setup}
              </Link>
              <button
                type="button"
                onClick={reloadWorkspace}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                <RefreshCcw size={15} />
                {text.quickActions.reload}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/85">
              {feedback}
            </div>
          )}
        </section>

        <section
          ref={step1Ref}
          className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-soft sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand">
              <Plus size={18} />
            </div>

            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                {text.step1.eyebrow}
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                {text.step1.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                {text.step1.body}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Field
              label={text.step1.name}
              value={leadForm.name}
              onChange={(value) => updateLeadForm("name", value)}
            />
            <Field
              label={text.step1.company}
              value={leadForm.company}
              onChange={(value) => updateLeadForm("company", value)}
            />
            <Field
              label={text.step1.service}
              value={leadForm.service}
              onChange={(value) => updateLeadForm("service", value)}
            />
            <Field
              label={text.step1.area}
              value={leadForm.area}
              onChange={(value) => updateLeadForm("area", value)}
            />
            <Field
              label={text.step1.channel}
              value={leadForm.channel}
              onChange={(value) => updateLeadForm("channel", value)}
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label={text.step1.notes}
              value={leadForm.notes}
              onChange={(value) => updateLeadForm("notes", value)}
              placeholder={text.step1.notesPlaceholder}
            />
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={addLead}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#3a67ff] sm:w-auto"
            >
              <Plus size={16} />
              {text.step1.addLead}
            </button>
          </div>
        </section>

        <section
          ref={step2Ref}
          className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-soft sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand">
              <FolderKanban size={18} />
            </div>

            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                {text.step2.eyebrow}
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                {text.step2.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                {text.step2.body}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pipelineOrder.map((stageKey) => {
              const stageLeads = leadsByStage[stageKey];

              return (
                <div
                  key={stageKey}
                  className="flex min-h-[320px] flex-col rounded-[24px] border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {text.step2.stage[stageKey]}
                    </div>
                    <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/80">
                      {stageLeads.length}
                    </div>
                  </div>

                  <div className="mt-4 flex-1 space-y-4">
                    {stageLeads.length === 0 ? (
                      <div className="flex h-full min-h-[180px] items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/40">
                        {text.step2.empty}
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const isSelected = selectedLeadId === lead.id;

                        const moveButtons = [
                          stageKey !== "new" && {
                            label: text.step2.moveTo.new,
                            stage: "new" as LeadStage,
                          },
                          stageKey !== "quoted" && {
                            label: text.step2.moveTo.quoted,
                            stage: "quoted" as LeadStage,
                          },
                          stageKey !== "followUp" && {
                            label: text.step2.moveTo.followUp,
                            stage: "followUp" as LeadStage,
                          },
                          stageKey !== "won" && {
                            label: text.step2.moveTo.won,
                            stage: "won" as LeadStage,
                          },
                        ].filter(Boolean) as {
                          label: string;
                          stage: LeadStage;
                        }[];

                        return (
                          <div
                            key={lead.id}
                            className={`rounded-[20px] border p-4 transition ${
                              isSelected
                                ? "border-brand/60 bg-brand/10 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="break-words text-lg font-bold leading-snug text-white">
                                  {lead.name}
                                </h3>
                                <p className="mt-1 break-words text-sm text-white/55">
                                  {lead.company || "—"}
                                </p>
                              </div>

                              {typeof lead.quoteTotal === "number" &&
                              lead.quoteTotal > 0 ? (
                                <div className="shrink-0 rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                                  {formatMoney(
                                    lead.quoteTotal,
                                    currency,
                                    locale,
                                  )}
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-4 space-y-2">
                              <p className="break-words text-sm font-medium leading-6 text-white">
                                {lead.service || "—"}
                              </p>
                              <p className="break-words text-sm leading-6 text-white/60">
                                {lead.area || "—"}
                              </p>
                              {lead.notes ? (
                                <p className="break-words text-sm leading-6 text-white/72">
                                  {truncateText(lead.notes)}
                                </p>
                              ) : null}
                            </div>

                            <div className="mt-5 space-y-2">
                              <button
                                type="button"
                                onClick={() => selectLead(lead.id)}
                                className="w-full rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:border-brand/35 hover:bg-white/[0.08]"
                              >
                                {text.step2.openLead}
                              </button>

                              <div className="grid gap-2">
                                {moveButtons.map((move) => (
                                  <button
                                    key={`${lead.id}-${move.stage}`}
                                    type="button"
                                    onClick={() =>
                                      moveLeadStage(lead.id, move.stage)
                                    }
                                    className="w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/85 transition hover:border-brand/35 hover:bg-white/[0.08]"
                                  >
                                    {move.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <section
            ref={step3Ref}
            className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-soft sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand">
                <CircleDollarSign size={18} />
              </div>

              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {text.step3.eyebrow}
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                  {text.step3.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {text.step3.body}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                {text.activeLead}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">
                {selectedLead ? selectedLead.name : text.noLeadSelected}
              </div>
              {selectedLead && (
                <div className="mt-2 text-sm text-white/60">
                  {selectedLead.company || "—"} · {selectedLead.service || "—"}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field
                label={text.step3.service}
                value={quoteForm.service}
                onChange={(value) => updateQuoteForm("service", value)}
              />
              <Field
                label={text.step3.base}
                value={quoteForm.basePrice}
                onChange={(value) => updateQuoteForm("basePrice", value)}
                type="number"
              />
              <Field
                label={text.step3.extras}
                value={quoteForm.extras}
                onChange={(value) => updateQuoteForm("extras", value)}
                type="number"
              />
              <Field
                label={text.step3.travel}
                value={quoteForm.travel}
                onChange={(value) => updateQuoteForm("travel", value)}
                type="number"
              />
              <Field
                label={text.step3.rush}
                value={quoteForm.rush}
                onChange={(value) => updateQuoteForm("rush", value)}
                type="number"
              />
              <Field
                label={text.step3.tax}
                value={quoteForm.tax}
                onChange={(value) => updateQuoteForm("tax", value)}
                type="number"
              />
            </div>

            <div className="mt-4">
              <TextAreaField
                label={text.step3.scope}
                value={quoteForm.scope}
                onChange={(value) => updateQuoteForm("scope", value)}
                placeholder={
                  isSpanish
                    ? "Qué incluye, condiciones, tiempos, etc."
                    : "What is included, conditions, timing, etc."
                }
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetricMini
                label={text.step3.subtotal}
                value={formatMoney(subtotal, currency, locale)}
              />
              <MetricMini
                label={text.step3.taxAmount}
                value={formatMoney(taxAmount, currency, locale)}
              />
              <MetricMini
                label={text.step3.total}
                value={formatMoney(total, currency, locale)}
                highlight
              />
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={saveQuote}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#3a67ff]"
              >
                {text.step3.save}
              </button>
            </div>
          </section>

          <div className="space-y-6">
            <section
              ref={step4Ref}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-soft sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand">
                  <MessageSquare size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {text.step4.eyebrow}
                  </div>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                    {text.step4.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    {text.step4.body}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <TextAreaField
                  label={text.step4.nextStep}
                  value={nextStep}
                  onChange={setNextStep}
                  placeholder={
                    isSpanish
                      ? "Escribe el siguiente paso recomendado"
                      : "Write the recommended next step"
                  }
                  rows={4}
                />
              </div>

              <div className="mt-4">
                <TextAreaField
                  label={text.step4.followUpMessage}
                  value={followUpMessage}
                  onChange={() => {}}
                  readOnly
                  rows={6}
                />
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={copyFollowUp}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  <Copy size={16} />
                  {text.step4.copy}
                </button>
              </div>
            </section>

            <section
              ref={step5Ref}
              className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-soft sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-brand">
                  <ClipboardList size={18} />
                </div>

                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {text.step5.eyebrow}
                  </div>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                    {text.step5.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    {text.step5.body}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <ChecklistRow
                  label={text.step5.reviewed}
                  checked={dailyControl.reviewed}
                  checkedText={text.step5.done}
                  uncheckedText={text.step5.open}
                  onClick={() => toggleDailyControl("reviewed")}
                />
                <ChecklistRow
                  label={text.step5.quoted}
                  checked={dailyControl.quoted}
                  checkedText={text.step5.done}
                  uncheckedText={text.step5.open}
                  onClick={() => toggleDailyControl("quoted")}
                />
                <ChecklistRow
                  label={text.step5.followUp}
                  checked={dailyControl.followUp}
                  checkedText={text.step5.done}
                  uncheckedText={text.step5.open}
                  onClick={() => toggleDailyControl("followUp")}
                />
              </div>

              <div
                ref={setupRef}
                className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                  {text.optionalSetup.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {text.optionalSetup.body}
                </p>
                <div className="mt-5">
                  <Link
                    href={
                      sessionId
                        ? `/onboarding?session_id=${encodeURIComponent(sessionId)}`
                        : "/onboarding"
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                  >
                    {text.optionalSetup.setup}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        <TutorialOverlay
          open={tutorialOpen}
          spotlight={spotlight}
          step={tutorialStep}
          totalSteps={tutorialSteps.length}
          title={tutorialSteps[tutorialStep]?.title || ""}
          body={tutorialSteps[tutorialStep]?.body || ""}
          onClose={closeTutorial}
          onPrev={prevTutorialStep}
          onNext={nextTutorialStep}
          isFirst={tutorialStep === 0}
          isLast={tutorialStep === tutorialSteps.length - 1}
          labels={{
            close: isSpanish ? "Cerrar tutorial" : "Close tutorial",
            prev: isSpanish ? "Anterior" : "Previous",
            next: isSpanish ? "Siguiente" : "Next",
            finish: isSpanish ? "Finalizar" : "Finish",
            step: isSpanish ? "Paso" : "Step",
          }}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/85">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white/85">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-8 text-white placeholder:text-white/30 outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/20 read-only:cursor-default read-only:bg-white/[0.02]"
      />
    </label>
  );
}

function MetricMini({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border p-4 ${
        highlight
          ? "border-brand/30 bg-brand/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function ChecklistRow({
  label,
  checked,
  checkedText,
  uncheckedText,
  onClick,
}: {
  label: string;
  checked: boolean;
  checkedText: string;
  uncheckedText: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-black/20 px-4 py-4 text-left transition hover:border-brand/30 hover:bg-black/30"
    >
      <span className="text-sm font-medium text-white">{label}</span>
      <span
        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
          checked
            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            : "border border-white/10 bg-white/[0.04] text-white/60"
        }`}
      >
        {checked ? checkedText : uncheckedText}
      </span>
    </button>
  );
}

function TutorialOverlay({
  open,
  spotlight,
  step,
  totalSteps,
  title,
  body,
  onClose,
  onPrev,
  onNext,
  isFirst,
  isLast,
  labels,
}: {
  open: boolean;
  spotlight: SpotlightRect | null;
  step: number;
  totalSteps: number;
  title: string;
  body: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  labels: {
    close: string;
    prev: string;
    next: string;
    finish: string;
    step: string;
  };
}) {
  if (!open || !spotlight) return null;

  const overlayStyle =
    "fixed z-[120] bg-black/70 backdrop-blur-[1px] transition-all duration-300";

  return (
    <>
      <div
        className={overlayStyle}
        style={{ top: 0, left: 0, width: "100vw", height: spotlight.top }}
      />
      <div
        className={overlayStyle}
        style={{
          top: spotlight.top,
          left: 0,
          width: spotlight.left,
          height: spotlight.height,
        }}
      />
      <div
        className={overlayStyle}
        style={{
          top: spotlight.top,
          left: spotlight.left + spotlight.width,
          width: `calc(100vw - ${spotlight.left + spotlight.width}px)`,
          height: spotlight.height,
        }}
      />
      <div
        className={overlayStyle}
        style={{
          top: spotlight.top + spotlight.height,
          left: 0,
          width: "100vw",
          height: `calc(100vh - ${spotlight.top + spotlight.height}px)`,
        }}
      />

      <div
        className="pointer-events-none fixed z-[121] rounded-[30px] border border-blue-300/45 shadow-[0_0_0_1px_rgba(96,165,250,0.25),0_0_45px_rgba(37,99,235,0.35)] transition-all duration-300"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
        }}
      >
        <div className="absolute inset-0 animate-pulse rounded-[30px] ring-2 ring-blue-400/50" />
      </div>

      <div className="fixed bottom-4 right-4 z-[122] w-[min(430px,calc(100vw-2rem))] rounded-[30px] border border-blue-300/20 bg-[#2563eb] p-5 text-white shadow-[0_18px_55px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-blue-100/80">
              {labels.step} {step + 1} / {totalSteps}
            </div>
            <h3 className="mt-2 text-2xl font-black leading-tight">{title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-blue-50">{body}</p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={isFirst}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            {labels.prev}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {isLast ? labels.finish : labels.next}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
