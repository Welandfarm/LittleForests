// Marketing/content email sending.
//
//   Admin -> POST /api/social/email/send -> this service -> provider
//
// Two supported paths, chosen by whichever env vars are present:
//
// 1) Dedicated email provider (recommended for deliverability/analytics).
//    Required env vars:
//      EMAIL_PROVIDER_API_KEY
//      EMAIL_FROM_ADDRESS
//
// 2) Gmail API (if Little Forests sends from a Google Workspace mailbox).
//    Required env vars:
//      GMAIL_CLIENT_ID
//      GMAIL_CLIENT_SECRET
//      GMAIL_REFRESH_TOKEN
//      EMAIL_FROM_ADDRESS
//
// Only the envelope/transport differs between the two — callers just call
// `sendMarketingEmail`.

import { notConfigured, type PublishResult } from "./types";

interface EmailSendInput {
  to: string; // single recipient or comma-separated list / list id, depending on provider
  subject: string;
  body: string; // plain text; provider-specific HTML wrapping can be added later
}

function hasDedicatedProvider() {
  return Boolean(process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM_ADDRESS);
}

function hasGmailConfig() {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.EMAIL_FROM_ADDRESS
  );
}

async function sendViaDedicatedProvider(input: EmailSendInput): Promise<PublishResult> {
  // Generic REST call — swap the URL/payload shape for your chosen provider
  // (e.g. Resend, Postmark, SendGrid, Mailgun) once an account exists.
  try {
    const res = await fetch("https://api.your-email-provider.com/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM_ADDRESS,
        to: input.to,
        subject: input.subject,
        text: input.body,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, status: "failed", detail: data?.message || "Email provider send failed" };
    }
    return { ok: true, status: "published", detail: `Email sent to ${input.to}`, externalId: data?.id };
  } catch (err: any) {
    return { ok: false, status: "failed", detail: err?.message || "Email provider send failed" };
  }
}

async function sendViaGmail(input: EmailSendInput): Promise<PublishResult> {
  // The Gmail API requires an OAuth2 access token minted from the stored
  // refresh token, then a call to users.messages.send with a base64url
  // encoded RFC 2822 message. Wire this up once the Google Cloud project +
  // OAuth consent + refresh token exist; kept as a clear stub until then.
  return {
    ok: false,
    status: "failed",
    detail:
      "Gmail credentials are present but Gmail API sending isn't wired up yet — implement sendViaGmail() in server/services/social/email.ts using the stored GMAIL_REFRESH_TOKEN.",
  };
}

export async function sendMarketingEmail(input: EmailSendInput): Promise<PublishResult> {
  if (hasDedicatedProvider()) return sendViaDedicatedProvider(input);
  if (hasGmailConfig()) return sendViaGmail(input);

  return notConfigured([
    "EMAIL_PROVIDER_API_KEY + EMAIL_FROM_ADDRESS (dedicated provider)",
    "— or — GMAIL_CLIENT_ID + GMAIL_CLIENT_SECRET + GMAIL_REFRESH_TOKEN + EMAIL_FROM_ADDRESS (Gmail API)",
  ]);
}
