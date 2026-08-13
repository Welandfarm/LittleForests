// WhatsApp Business Platform (Cloud API).
//
//   Admin -> POST /api/social/whatsapp/send -> this service -> WhatsApp Cloud API
//
// Required env vars (see .env.example):
//   WHATSAPP_ACCESS_TOKEN
//   WHATSAPP_PHONE_NUMBER_ID
//
// Per the plan, WhatsApp has stricter messaging rules than Facebook/Instagram
// — this is deliberately NOT a "send to anybody" endpoint. It sends to a
// single explicit recipient at a time (e.g. a broadcast list managed
// elsewhere, or triggered per-recipient from an approved template), rather
// than looping over an address book automatically.

import { notConfigured, type PublishResult } from "./types";

const GRAPH_API_VERSION = "v19.0";

interface WhatsAppSendInput {
  to: string; // E.164 phone number, e.g. "2547XXXXXXXX"
  message: string;
}

function getWhatsAppConfig() {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  const missing: string[] = [];
  if (!WHATSAPP_ACCESS_TOKEN) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!WHATSAPP_PHONE_NUMBER_ID) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  return { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, missing };
}

export async function sendWhatsAppMessage(input: WhatsAppSendInput): Promise<PublishResult> {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, missing } = getWhatsAppConfig();
  if (missing.length) return notConfigured(missing);

  if (!input.to) {
    return { ok: false, status: "failed", detail: "A recipient phone number is required to send a WhatsApp message." };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: input.to,
          type: "text",
          text: { body: input.message },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, status: "failed", detail: data?.error?.message || "WhatsApp send failed" };
    }
    return {
      ok: true,
      status: "published",
      detail: `Sent to ${input.to}`,
      externalId: data?.messages?.[0]?.id,
    };
  } catch (err: any) {
    return { ok: false, status: "failed", detail: err?.message || "WhatsApp send failed" };
  }
}

// Convenience helper for the "share" pattern the plan calls out — copy or
// build a wa.me deep link rather than sending automatically.
export function buildWhatsAppShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
