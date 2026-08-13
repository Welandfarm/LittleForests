// Facebook Page + Instagram publishing via the Meta Graph API.
//
// Architecture (per the plan): Admin UI never talks to Meta directly.
//   Admin -> POST /api/social/facebook/publish -> this service -> Graph API
//
// Required env vars (see .env.example):
//   META_APP_ID
//   META_APP_SECRET
//   META_ACCESS_TOKEN         (long-lived Page/System User token)
//   META_PAGE_ID
//   META_INSTAGRAM_ACCOUNT_ID
//
// Until those are set, calls resolve to a clean "not_configured" result
// instead of throwing, so the Admin UI can show a helpful message rather
// than a crash.

import { notConfigured, type PublishResult } from "./types";

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

interface FacebookPublishInput {
  message: string;
  link?: string;
}

interface InstagramPublishInput {
  caption: string;
  imageUrl: string; // Instagram requires a publicly reachable image/video URL
}

function getMetaConfig() {
  const {
    META_ACCESS_TOKEN,
    META_PAGE_ID,
    META_INSTAGRAM_ACCOUNT_ID,
  } = process.env;

  const missing: string[] = [];
  if (!META_ACCESS_TOKEN) missing.push("META_ACCESS_TOKEN");
  if (!META_PAGE_ID) missing.push("META_PAGE_ID");

  return { META_ACCESS_TOKEN, META_PAGE_ID, META_INSTAGRAM_ACCOUNT_ID, missing };
}

export async function publishToFacebook(input: FacebookPublishInput): Promise<PublishResult> {
  const { META_ACCESS_TOKEN, META_PAGE_ID, missing } = getMetaConfig();
  if (missing.length) return notConfigured(missing);

  try {
    const params = new URLSearchParams({
      message: input.message,
      access_token: META_ACCESS_TOKEN as string,
    });
    if (input.link) params.set("link", input.link);

    const res = await fetch(`${GRAPH_API_BASE}/${META_PAGE_ID}/feed`, {
      method: "POST",
      body: params,
    });
    const data = await res.json();

    if (!res.ok) {
      return { ok: false, status: "failed", detail: data?.error?.message || "Facebook publish failed" };
    }
    return { ok: true, status: "published", detail: "Published to Facebook Page", externalId: data.id };
  } catch (err: any) {
    return { ok: false, status: "failed", detail: err?.message || "Facebook publish failed" };
  }
}

export async function publishToInstagram(input: InstagramPublishInput): Promise<PublishResult> {
  const { META_ACCESS_TOKEN, META_INSTAGRAM_ACCOUNT_ID, missing } = getMetaConfig();
  if (missing.length || !META_INSTAGRAM_ACCOUNT_ID) {
    return notConfigured([...missing, ...(META_INSTAGRAM_ACCOUNT_ID ? [] : ["META_INSTAGRAM_ACCOUNT_ID"])]);
  }
  if (!input.imageUrl) {
    return { ok: false, status: "failed", detail: "Instagram requires an image or video URL — attach media before publishing." };
  }

  try {
    // Step 1: create a media container
    const containerParams = new URLSearchParams({
      image_url: input.imageUrl,
      caption: input.caption,
      access_token: META_ACCESS_TOKEN as string,
    });
    const containerRes = await fetch(`${GRAPH_API_BASE}/${META_INSTAGRAM_ACCOUNT_ID}/media`, {
      method: "POST",
      body: containerParams,
    });
    const containerData = await containerRes.json();
    if (!containerRes.ok) {
      return { ok: false, status: "failed", detail: containerData?.error?.message || "Instagram container creation failed" };
    }

    // Step 2: publish the container
    const publishParams = new URLSearchParams({
      creation_id: containerData.id,
      access_token: META_ACCESS_TOKEN as string,
    });
    const publishRes = await fetch(`${GRAPH_API_BASE}/${META_INSTAGRAM_ACCOUNT_ID}/media_publish`, {
      method: "POST",
      body: publishParams,
    });
    const publishData = await publishRes.json();
    if (!publishRes.ok) {
      return { ok: false, status: "failed", detail: publishData?.error?.message || "Instagram publish failed" };
    }

    return { ok: true, status: "published", detail: "Published to Instagram", externalId: publishData.id };
  } catch (err: any) {
    return { ok: false, status: "failed", detail: err?.message || "Instagram publish failed" };
  }
}
