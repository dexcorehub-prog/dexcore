export type TransactionalEmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendTransactionalEmail(payload: TransactionalEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Dexcore <hello@dexcore.com>";

  if (!apiKey) {
    return { sent: false, reason: "missing_api_key" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Unable to send email: ${message}`);
  }

  return { sent: true as const };
}
