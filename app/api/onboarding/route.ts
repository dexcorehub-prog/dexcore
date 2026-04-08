import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl } from "@/lib/utils";
import { getStripeServer } from "@/lib/stripe";
import { sendTransactionalEmail } from "@/lib/email";
import {
  getCheckoutEmail,
  getCustomerId,
  getMetadataValue,
  getSubscriptionId,
  isExpandedCustomer
} from "@/lib/dexcore-subscriptions";

type OnboardingPayload = {
  sessionId: string;
  contactName: string;
  companyName: string;
  email: string;
  phone?: string;
  website?: string;
  serviceType: string;
  serviceArea: string;
  preferredLaunchDate?: string;
  goals: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OnboardingPayload;

    if (!body.sessionId || !body.contactName || !body.companyName || !body.email || !body.serviceType || !body.serviceArea || !body.goals) {
      return NextResponse.json({ error: "Missing required onboarding fields." }, { status: 400 });
    }

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(body.sessionId, {
      expand: ["customer", "subscription"]
    });

    if (session.status !== "complete") {
      return NextResponse.json({ error: "Checkout session is not complete yet." }, { status: 400 });
    }

    const customer = session.customer as string | Stripe.Customer | Stripe.DeletedCustomer | null;
    const subscription = session.subscription as string | Stripe.Subscription | null;

    const customerId = getCustomerId(customer);
    const subscriptionId = getSubscriptionId(subscription);

    if (!customerId || !subscriptionId) {
      return NextResponse.json({ error: "Missing customer or subscription for onboarding." }, { status: 400 });
    }

    const existingCustomerMetadata = isExpandedCustomer(customer) ? customer.metadata : undefined;
    const normalizedEmail = body.email.trim().toLowerCase();
    const metadata = {
      ...existingCustomerMetadata,
      dexcore_onboarding_status: "completed",
      dexcore_onboarding_completed_at: new Date().toISOString(),
      dexcore_latest_session_id: session.id,
      dexcore_contact_name: body.contactName.trim(),
      dexcore_company_name: body.companyName.trim(),
      dexcore_service_type: body.serviceType.trim(),
      dexcore_service_area: body.serviceArea.trim(),
      dexcore_preferred_launch_date: body.preferredLaunchDate?.trim() || "",
      dexcore_goals: body.goals.trim(),
      dexcore_notes: body.notes?.trim() || "",
      dexcore_website: body.website?.trim() || ""
    };

    await stripe.customers.update(customerId, {
      name: body.contactName.trim(),
      email: normalizedEmail,
      phone: body.phone?.trim() || undefined,
      metadata
    });

    const existingSubscriptionMetadata =
      subscription && typeof subscription !== "string" ? subscription.metadata : {};

    await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        ...existingSubscriptionMetadata,
        planId: getMetadataValue(session.metadata, "planId"),
        currency: getMetadataValue(session.metadata, "currency"),
        locale: getMetadataValue(session.metadata, "locale"),
        dexcore_onboarding_status: "completed",
        dexcore_onboarding_completed_at: new Date().toISOString(),
        dexcore_company_name: body.companyName.trim(),
        dexcore_service_type: body.serviceType.trim(),
        dexcore_service_area: body.serviceArea.trim(),
        dexcore_preferred_launch_date: body.preferredLaunchDate?.trim() || ""
      }
    });

    const siteUrl = getSiteUrl();
    const adminEmail = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const portalUrl = `${siteUrl}/portal?email=${encodeURIComponent(normalizedEmail)}`;
    const billingUrl = `${siteUrl}/billing`;

    const summaryList = `
      <ul>
        <li><strong>Contact:</strong> ${escapeHtml(body.contactName)}</li>
        <li><strong>Company:</strong> ${escapeHtml(body.companyName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(body.phone || "-")}</li>
        <li><strong>Service type:</strong> ${escapeHtml(body.serviceType)}</li>
        <li><strong>Service area:</strong> ${escapeHtml(body.serviceArea)}</li>
        <li><strong>Website:</strong> ${escapeHtml(body.website || "-")}</li>
        <li><strong>Preferred launch date:</strong> ${escapeHtml(body.preferredLaunchDate || "-")}</li>
      </ul>
      <p><strong>Goals:</strong><br/>${escapeHtml(body.goals).replace(/\n/g, "<br/>")}</p>
      <p><strong>Notes:</strong><br/>${escapeHtml(body.notes || "-").replace(/\n/g, "<br/>")}</p>
    `;

    if (adminEmail) {
      await sendTransactionalEmail({
        to: adminEmail,
        subject: `New Dexcore onboarding: ${body.companyName}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2>New Dexcore onboarding completed</h2>
            ${summaryList}
            <p><a href="${portalUrl}">Open client portal</a> · <a href="${billingUrl}">Open billing lookup</a></p>
          </div>
        `
      });
    }

    await sendTransactionalEmail({
      to: normalizedEmail,
      subject: `Dexcore onboarding received for ${body.companyName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2>Welcome to Dexcore</h2>
          <p>We received your onboarding for <strong>${escapeHtml(body.companyName)}</strong>.</p>
          <p>Your subscription is active and your onboarding is now marked as complete.</p>
          <p>You can review your client status anytime here:</p>
          <p><a href="${portalUrl}">Open client portal</a></p>
          <p>Need billing changes? Use this link:</p>
          <p><a href="${billingUrl}">Manage billing</a></p>
        </div>
      `
    });

    return NextResponse.json({ success: true, portalUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete onboarding.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
