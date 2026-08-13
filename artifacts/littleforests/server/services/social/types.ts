export type PublishStatus = "published" | "failed" | "not_configured";

export interface PublishResult {
  ok: boolean;
  status: PublishStatus;
  detail: string;
  externalId?: string;
}

export function notConfigured(missingVars: string[]): PublishResult {
  return {
    ok: false,
    status: "not_configured",
    detail: `Missing environment variable(s): ${missingVars.join(", ")}. Add these to your server .env (see .env.example) once the account is set up, then try again.`,
  };
}
