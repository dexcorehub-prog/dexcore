import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/utils";
import { sendTransactionalEmail } from "@/lib/email";
import { getCheckoutEmail, getCustomerId, getMetadataValue, getSubscriptionId } from "@/lib/dexcore-subscriptions";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ received: true, warning: "Missing STRIPE_WEBHOOK_SECRET" });
  }

  try {
    const stripe = getStripeServer();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
    }

    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = getCustomerId(session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null);
        const subscriptionId = getSubscriptionId(session.subscription as string | Stripe.Subscription | null);
        const customerEmail = getCheckoutEmail(session);
        const siteUrl = getSiteUrl();

        if (customerId) {
          await stripe.customers.update(customerId, {
            metadata: {
              dexcore_plan_id: getMetadataValue(session.metadata, "planId"),
              dexcore_locale: getMetadataValue(session.metadata, "locale"),
              dexcore_currency: getMetadataValue(session.metadata, "currency"),
              dexcore_latest_session_id: session.id,
              dexcore_onboarding_status: "pending",
              dexcore_billing_status: "current"
            }
          });
        }

        if (subscriptionId) {
          await stripe.subscriptions.update(subscriptionId, {
            metadata: {
              planId: getMetadataValue(session.metadata, "planId"),
              locale: getMetadataValue(session.metadata, "locale"),
              currency: getMetadataValue(session.metadata, "currency"),
              dexcore_latest_session_id: session.id,
              dexcore_onboarding_status: "pending"
            }
          });
        }

        if (customerEmail) {
          await sendTransactionalEmail({
            to: customerEmail,
            subject: "Your Dexcore subscription is active",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
                <h2>Dexcore payment received</h2>
                <p>Your subscription is active. Finish your setup so Dexcore can start with the right business details.</p>
                <p><a href="${siteUrl}/onboarding?session_id=${session.id}">Complete onboarding</a></p>
                <p><a href="${siteUrl}/billing">Manage billing</a></p>
              </div>
            `
          });
        }

        console.log("Checkout completed:", session.id, session.customer, session.subscription);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        await stripe.customers.update(customerId, {
          metadata: {
            dexcore_billing_status: subscription.status
          }
        });
        console.log("Subscription update:", subscription.id, subscription.status);
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          await stripe.customers.update(customerId, {
            metadata: {
              dexcore_billing_status: event.type === "invoice.payment_succeeded" ? "current" : "payment_failed"
            }
          });
        }
        console.log("Invoice event:", invoice.id, event.type);
        break;
      }
      default:
        console.log("Unhandled Stripe event:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
