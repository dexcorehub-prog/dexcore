import Stripe from "stripe";

export function isExpandedCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): customer is Stripe.Customer {
  if (!customer || typeof customer === "string") return false;
  if ("deleted" in customer && customer.deleted) return false;
  return true;
}

export function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
) {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

export function getSubscriptionId(subscription: string | Stripe.Subscription | null | undefined) {
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

export function getCheckoutEmail(
  session: Stripe.Checkout.Session,
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null
) {
  return session.customer_details?.email || (isExpandedCustomer(customer) ? customer.email : null) || null;
}

export function getCheckoutName(
  session: Stripe.Checkout.Session,
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null
) {
  return session.customer_details?.name || (isExpandedCustomer(customer) ? customer.name : null) || null;
}

export function getMetadataValue(metadata: Stripe.Metadata | null | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}
