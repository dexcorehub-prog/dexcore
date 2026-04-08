import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlanById } from "@/lib/plans";
import { getStripeServer } from "@/lib/stripe";
import {
  getCheckoutEmail,
  getCheckoutName,
  getCustomerId,
  getMetadataValue,
  getSubscriptionId,
  isExpandedCustomer
} from "@/lib/dexcore-subscriptions";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"]
    });

    const customer = session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null;
    const subscription = session.subscription as string | Stripe.Subscription | null;
    const planId = getMetadataValue(session.metadata, "planId");
    const plan = getPlanById(planId);

    const customerMetadata = isExpandedCustomer(customer) ? customer.metadata : undefined;
    const subscriptionMetadata = subscription && typeof subscription !== "string" ? subscription.metadata : undefined;
    const onboardingStatus =
      getMetadataValue(customerMetadata, "dexcore_onboarding_status") ||
      getMetadataValue(subscriptionMetadata, "dexcore_onboarding_status") ||
      "pending";

    return NextResponse.json({
      sessionId: session.id,
      customerId: getCustomerId(customer),
      customerEmail: getCheckoutEmail(session, customer),
      customerName: getCheckoutName(session, customer),
      subscriptionId: getSubscriptionId(subscription),
      subscriptionStatus: typeof subscription === "string" ? null : subscription?.status || null,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      planId,
      planTitle: plan?.title.en || planId,
      onboardingStatus,
      latestSessionId:
        getMetadataValue(customerMetadata, "dexcore_latest_session_id") || session.id
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
