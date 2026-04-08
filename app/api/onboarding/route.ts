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
  isExpandedCustomer,
} from "@/lib/dexcore-subscriptions";

type OnboardingPayload = {
  sessionId: string;
  contactName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  serviceType?: string;
  serviceArea?: string;
  preferredLaunchDate?: string;
  goals?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OnboardingPayload;

    if (!body.sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId." },
        { status: 400 },
      );
    }

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(body.sessionId, {
      expand: ["customer", "subscription"],
    });

    if (session.status !== "complete") {
      return NextResponse.json(
        { error: "Checkout session is not complete yet." },
        { status: 400 },
      );
    }

    const customer = session.customer as
      | string
      | Stripe.Customer
      | Stripe.DeletedCustomer
      | null;
    const subscription = session.subscription as
      | string
      | Stripe.Subscription
      | null;

    const customerId = getCustomerId(customer);
    const subscriptionId = getSubscriptionId(subscription);

    if (!customerId || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing customer or subscription for onboarding." },
        { status: 400 },
      );
    }

    const existingCustomerMetadata = isExpandedCustomer(customer)
      ? customer.metadata
      : undefined;
    const existingSubscriptionMetadata =
      subscription && typeof subscription !== "string"
        ? subscription.metadata
        : {};

    const checkoutEmail =
      getCheckoutEmail(session, customer)?.trim().toLowerCase() || "";
    const normalizedEmail = body.email?.trim().toLowerCase() || checkoutEmail;
    const contactName =
      body.contactName?.trim() ||
      (isExpandedCustomer(customer) ? customer.name || "" : "");
    const companyName =
      body.companyName?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_company_name");
    const serviceType =
      body.serviceType?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_service_type");
    const serviceArea =
      body.serviceArea?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_service_area");
    const preferredLaunchDate =
      body.preferredLaunchDate?.trim() ||
      getMetadataValue(
        existingCustomerMetadata,
        "dexcore_preferred_launch_date",
      );
    const goals =
      body.goals?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_goals");
    const notes =
      body.notes?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_notes");
    const website =
      body.website?.trim() ||
      getMetadataValue(existingCustomerMetadata, "dexcore_website");

    const metadata = {
      ...existingCustomerMetadata,
      dexcore_onboarding_status: "completed",
      dexcore_onboarding_completed_at: new Date().toISOString(),
      dexcore_latest_session_id: session.id,
      dexcore_contact_name: contactName,
      dexcore_company_name: companyName,
      dexcore_service_type: serviceType,
      dexcore_service_area: serviceArea,
      dexcore_preferred_launch_date: preferredLaunchDate,
      dexcore_goals: goals,
      dexcore_notes: notes,
      dexcore_website: website,
    };

    await stripe.customers.update(customerId, {
      name: contactName || undefined,
      email: normalizedEmail || undefined,
      phone: body.phone?.trim() || undefined,
      metadata,
    });

    await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        ...existingSubscriptionMetadata,
        planId: getMetadataValue(session.metadata, "planId"),
        currency: getMetadataValue(session.metadata, "currency"),
        locale: getMetadataValue(session.metadata, "locale"),
        dexcore_onboarding_status: "completed",
        dexcore_onboarding_completed_at: new Date().toISOString(),
        dexcore_company_name: companyName,
        dexcore_service_type: serviceType,
        dexcore_service_area: serviceArea,
        dexcore_preferred_launch_date: preferredLaunchDate,
      },
    });

    const siteUrl = getSiteUrl();
    const adminEmail =
      process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const portalUrl = normalizedEmail
      ? `${siteUrl}/portal?email=${encodeURIComponent(normalizedEmail)}`
      : `${siteUrl}/portal`;
    const workspaceUrl = `${siteUrl}/workspace?session_id=${encodeURIComponent(session.id)}`;
    const billingUrl = `${siteUrl}/billing`;

    const summaryList = `
      <ul>
        <li><strong>Contact:</strong> ${escapeHtml(contactName || "-")}</li>
        <li><strong>Company:</strong> ${escapeHtml(companyName || "-")}</li>
        <li><strong>Email:</strong> ${escapeHtml(normalizedEmail || "-")}</li>
        <li><strong>Phone:</strong> ${escapeHtml(body.phone || "-")}</li>
        <li><strong>Service type:</strong> ${escapeHtml(serviceType || "-")}</li>
        <li><strong>Service area:</strong> ${escapeHtml(serviceArea || "-")}</li>
        <li><strong>Website:</strong> ${escapeHtml(website || "-")}</li>
        <li><strong>Preferred launch date:</strong> ${escapeHtml(preferredLaunchDate || "-")}</li>
      </ul>
      <p><strong>Goals:</strong><br/>${escapeHtml(goals || "-").replace(/\n/g, "<br/>")}</p>
      <p><strong>Notes:</strong><br/>${escapeHtml(notes || "-").replace(/\n/g, "<br/>")}</p>
    `;

    const warnings: string[] = [];

    if (adminEmail) {
      try {
        await sendTransactionalEmail({
          to: adminEmail,
          subject: `New Dexcore setup saved: ${companyName || contactName || normalizedEmail || "client"}`,
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
              <h2>Dexcore business setup saved</h2>
              ${summaryList}
              <p><a href="${workspaceUrl}">Open workspace</a> · <a href="${portalUrl}">Open client portal</a> · <a href="${billingUrl}">Open billing lookup</a></p>
            </div>
          `,
        });
      } catch (error) {
        warnings.push(
          error instanceof Error
            ? error.message
            : "Unable to notify ops inbox.",
        );
      }
    }

    if (normalizedEmail) {
      try {
        await sendTransactionalEmail({
          to: normalizedEmail,
          subject: `Dexcore setup saved${companyName ? ` for ${companyName}` : ""}`,
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
              <h2>Your Dexcore setup is saved</h2>
              <p>Your workspace is already active. We saved your business details and you can continue using Dexcore right away.</p>
              <p><a href="${workspaceUrl}">Open workspace</a></p>
              <p><a href="${portalUrl}">Open client portal</a> · <a href="${billingUrl}">Manage billing</a></p>
            </div>
          `,
        });
      } catch (error) {
        warnings.push(
          error instanceof Error ? error.message : "Unable to notify customer.",
        );
      }
    }

    return NextResponse.json({
      success: true,
      portalUrl,
      workspaceUrl,
      warnings,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete onboarding.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
