import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { getMetadataValue } from "@/lib/dexcore-subscriptions";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Missing email." }, { status: 400 });
  }

  try {
    const stripe = getStripeServer();
    const customers = await stripe.customers.list({ email, limit: 10 });
    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json({ error: "No customer found for that email." }, { status: 404 });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 20
    });

    const preferredStatuses: Stripe.Subscription.Status[] = ["active", "trialing", "past_due", "incomplete", "canceled", "unpaid", "paused", "incomplete_expired"];
    const selectedSubscription =
      preferredStatuses
        .map((status) => subscriptions.data.find((subscription) => subscription.status === status))
        .find(Boolean) || subscriptions.data[0];

    if (!selectedSubscription) {
      return NextResponse.json({ error: "No subscription found for that customer." }, { status: 404 });
    }

    const subscription = await stripe.subscriptions.retrieve(selectedSubscription.id, {
      expand: ["items.data.price.product"]
    });

    const firstItem = subscription.items.data[0];
    const price = firstItem?.price;
    const product = typeof price?.product === "string" ? null : price?.product;
    const productName = product && "name" in product ? product.name : null;

    return NextResponse.json({
      email: customer.email,
      customerName: customer.name,
      companyName: getMetadataValue(customer.metadata, "dexcore_company_name"),
      planId:
        getMetadataValue(subscription.metadata, "planId") ||
        getMetadataValue(customer.metadata, "dexcore_plan_id") ||
        null,
      planName: productName,
      subscriptionStatus: subscription.status,
      onboardingStatus:
        getMetadataValue(customer.metadata, "dexcore_onboarding_status") ||
        getMetadataValue(subscription.metadata, "dexcore_onboarding_status") ||
        "pending",
      latestSessionId: getMetadataValue(customer.metadata, "dexcore_latest_session_id") || null,
      serviceType: getMetadataValue(customer.metadata, "dexcore_service_type"),
      serviceArea: getMetadataValue(customer.metadata, "dexcore_service_area"),
      goals: getMetadataValue(customer.metadata, "dexcore_goals"),
      website: getMetadataValue(customer.metadata, "dexcore_website"),
      preferredLaunchDate: getMetadataValue(customer.metadata, "dexcore_preferred_launch_date"),
      monthlyAmount: price?.unit_amount || null,
      currency: price?.currency || subscription.currency || null,
      currentPeriodEnd: subscription.items.data[0]?.current_period_end || null,
      billingStatus: getMetadataValue(customer.metadata, "dexcore_billing_status") || "current"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to look up customer status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
