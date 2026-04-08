import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number,
  currency: "usd" | "mxn",
  locale: "en" | "es",
) {
  const language = locale === "es" ? "es-MX" : "en-US";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSiteUrl() {
  const fallback =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000";

  return fallback.replace(/\/$/, "");
}
