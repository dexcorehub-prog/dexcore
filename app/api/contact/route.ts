import { NextRequest, NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  region?: string;
  service?: string;
  message?: string;
  locale?: string;
  currency?: string;
  website?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const payload = {
      name: body.name,
      email: body.email,
      company: body.company || "",
      region: body.region || "",
      service: body.service || "",
      message: body.message,
      locale: body.locale || "en",
      currency: body.currency || "usd",
      submittedAt: new Date().toISOString()
    };

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactTo = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    if (resendApiKey && contactTo) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Dexcore <onboarding@resend.dev>",
          to: [contactTo],
          subject: `New Dexcore lead from ${payload.name}`,
          reply_to: payload.email,
          text: `
Name: ${payload.name}
Email: ${payload.email}
Company: ${payload.company}
Region: ${payload.region}
Service: ${payload.service}
Locale: ${payload.locale}
Currency: ${payload.currency}

Message:
${payload.message}
          `.trim()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend error: ${errorText}`);
      }
    } else {
      console.log("Dexcore lead received (no outbound email configured):", payload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit contact form.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
