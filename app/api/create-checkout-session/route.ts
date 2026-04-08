import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/lib/plans";
import { getSiteUrl } from "@/lib/utils";
import { getStripeServer } from "@/lib/stripe";

type RequestPayload = {
  planId: string;
  currency: "usd" | "mxn";
  locale: "en" | "es";
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestPayload;
    const plan = getPlanById(body.planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    if (body.currency !== "usd" && body.currency !== "mxn") {
      return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    }

    const stripe = getStripeServer();
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: body.locale === "es" ? "es" : "en",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      phone_number_collection: { enabled: true },
      tax_id_collection: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: body.currency,
            unit_amount: plan.prices[body.currency] * 100,
            recurring: { interval: "month" },
            product_data: {
              name: `Dexcore ${plan.title.en}`,
              description: plan.description[body.locale],
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: body.currency,
            unit_amount: plan.setupFee[body.currency] * 100,
            product_data: {
              name: `Dexcore ${plan.title.en} Setup`,
              description:
                body.locale === "es"
                  ? "Cargo único de implementación y configuración inicial."
                  : "One-time implementation and launch configuration fee.",
            },
          },
        },
      ],
      metadata: {
        planId: plan.id,
        currency: body.currency,
        locale: body.locale,
        setupFee: String(plan.setupFee[body.currency]),
      },
      subscription_data: {
        metadata: {
          planId: plan.id,
          currency: body.currency,
          locale: body.locale,
          dexcore_onboarding_status: "pending",
        },
      },
      success_url: `${siteUrl}/workspace?session_id={CHECKOUT_SESSION_ID}&welcome=1`,
      cancel_url: `${siteUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
