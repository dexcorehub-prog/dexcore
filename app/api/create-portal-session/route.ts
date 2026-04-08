import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const stripe = getStripeServer();
    const customers = await stripe.customers.list({ email, limit: 1 });

    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ error: "No billing profile found for that email." }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${getSiteUrl()}/billing`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open billing portal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
