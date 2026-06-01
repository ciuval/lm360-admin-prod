// ADMIN_EMAIL_04B
// LoveMatch360 admin notification sender - DRY RUN ONLY.
// No real email. No Resend call. No database updates.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const FUNCTION_VERSION = "ADMIN_EMAIL_04_DRY_RUN_ONLY";
const SAFE_RECIPIENT = "servizioclienti@lovematch360.com";

type JsonRecord = Record<string, unknown>;

type QueueRow = {
  recipient_email: string;
  subject: string;
  status: string;
  created_at: string;
};

function jsonResponse(body: JsonRecord, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function parseBatchLimit(rawValue: string | undefined): number {
  const parsed = Number.parseInt(rawValue ?? "5", 10);
  if (!Number.isFinite(parsed)) return 5;
  if (parsed < 1) return 1;
  if (parsed > 10) return 10;
  return parsed;
}

function safeSubject(value: string | null | undefined): string {
  const raw = String(value ?? "").replace(/\s+/g, " ").trim();
  return raw.length <= 120 ? raw : raw.slice(0, 117) + "...";
}

function safeErrorMessage(value: unknown): string {
  return String(value ?? "unknown_error")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/service_role[A-Za-z0-9._-]*/gi, "service_role[redacted]")
    .slice(0, 240);
}

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return jsonResponse({
      ok: false,
      code: "METHOD_NOT_ALLOWED",
      function_version: FUNCTION_VERSION,
      allowed_method: "POST",
    }, 405);
  }

  const expectedSecret = Deno.env.get("ADMIN_EMAIL_SECRET") ?? "";
  const receivedSecret = req.headers.get("x-admin-email-secret") ?? "";

  if (!expectedSecret) {
    return jsonResponse({
      ok: false,
      code: "CONFIG_MISSING_ADMIN_EMAIL_SECRET",
      function_version: FUNCTION_VERSION,
      real_email_sent: false,
    }, 500);
  }

  if (receivedSecret !== expectedSecret) {
    return jsonResponse({
      ok: false,
      code: "UNAUTHORIZED",
      function_version: FUNCTION_VERSION,
      real_email_sent: false,
    }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({
      ok: false,
      code: "CONFIG_MISSING_SUPABASE_SERVER_ENV",
      function_version: FUNCTION_VERSION,
      real_email_sent: false,
      missing: {
        SUPABASE_URL: !supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !serviceRoleKey,
      },
    }, 500);
  }

  const batchLimit = parseBatchLimit(Deno.env.get("ADMIN_EMAIL_BATCH_LIMIT"));
  const configuredDryRun = (Deno.env.get("ADMIN_EMAIL_DRY_RUN") ?? "true").toLowerCase();
  const configuredSenderEnabled = (Deno.env.get("ADMIN_EMAIL_SENDER_ENABLED") ?? "false").toLowerCase();

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("admin_notification_queue")
    .select("recipient_email,subject,status,created_at")
    .eq("status", "pending")
    .eq("recipient_email", SAFE_RECIPIENT)
    .order("created_at", { ascending: true })
    .limit(batchLimit);

  if (error) {
    return jsonResponse({
      ok: false,
      code: "QUEUE_READ_FAILED",
      function_version: FUNCTION_VERSION,
      real_email_sent: false,
      detail: safeErrorMessage(error.message),
    }, 500);
  }

  const rows = (Array.isArray(data) ? data : []) as QueueRow[];

  const previews = rows.map((row, index) => ({
    preview_index: index + 1,
    recipient_policy: "servizioclienti",
    subject: safeSubject(row.subject),
    status: row.status,
    created_at: row.created_at,
    would_send: false,
    dry_run: true,
    idempotency_key_pattern: "lm360-admin-notification-{queue_id}",
  }));

  return jsonResponse({
    ok: true,
    function_version: FUNCTION_VERSION,
    mode: "DRY_RUN_ONLY",
    dry_run_forced_by_code: true,
    configured_dry_run: configuredDryRun,
    configured_sender_enabled: configuredSenderEnabled,
    real_email_sent: false,
    resend_called: false,
    queue_updated: false,
    audit_log_updated: false,
    batch_limit: batchLimit,
    pending_notifications_found: previews.length,
    previews,
    safety: {
      browser_email_send: "blocked",
      secrets_in_response: false,
      raw_user_email_output: false,
      raw_user_uuid_output: false,
    },
    next_step: "ADMIN_EMAIL_05_COMMIT_DRY_RUN_FUNCTION_THEN_LOCAL_REVIEW",
  });
});
