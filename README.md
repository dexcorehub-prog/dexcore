# Dexcore Platform

Dexcore is a polished bilingual launch system for an AI-native service business built in Mexico for customers in Mexico and the United States.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Stripe Checkout + Customer Portal + Webhooks
- Built-in SEO via Next metadata, sitemap, robots, schema markup

## Core features
- English / Spanish switch
- USD / MXN pricing switch
- Premium dark UI with professional motion
- Introductory launch pricing tuned for early client acquisition
- Subscription checkout with Stripe
- **One-time setup fee on the first invoice + recurring monthly billing**
- Success page that reads the real Checkout Session
- **Automated onboarding flow after payment**
- **Client portal lookup by email**
- Billing portal lookup by email
- Legal pages: Terms + Privacy + cookies disclosure
- Structured data + Open Graph + sitemap + robots
- Cookie consent banner with stored preferences
- Contact form with optional Resend integration

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Stripe setup
Add your live or test Stripe keys to `.env.local`.

### Webhook events to listen for
Use a webhook endpoint that points to:

```bash
/api/stripe/webhook
```

Suggested events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Test locally with Stripe CLI
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then copy the generated webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Email / notifications
If `RESEND_API_KEY` is configured:
- the contact form can send operational emails
- the webhook can send a welcome email after checkout
- onboarding completion can notify the Dexcore inbox and the customer

Recommended variables:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=Dexcore <hello@dexcore.com>
CONTACT_TO_EMAIL=hello@dexcore.com
```

## Launch flow
1. Visitor chooses a plan.
2. Stripe Checkout charges the recurring plan **plus** the one-time setup fee on the first invoice.
3. Success page loads the real session and sends the customer to onboarding.
4. Onboarding writes business details into Stripe customer/subscription metadata.
5. Client portal lets the customer verify plan status, onboarding status, and billing access.

## Currency and market notes
This project is configured for USD and MXN presentment at the application layer. Prices are defined in code and the checkout session is created dynamically so you don't need dashboard Price IDs to get started.

## Deploy
Deploy to Netlify, Vercel, or any Node-compatible host. Set all required environment variables in production.

## Branding
- Name: Dexcore
- Positioning: AI systems for real-world service businesses
- Region: Created in Mexico, serving Mexico and the United States
