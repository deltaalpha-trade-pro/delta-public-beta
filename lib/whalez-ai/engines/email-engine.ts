import { config, type EmailEvent } from "../config";

/**
 * Email is disabled on the Delta Public Beta surface.
 * All notifications are orchestrator-owned (internal execution plane).
 */

export type EmailProvider = "disabled";

export type EmailRecipient = string | string[];

export interface EmailSendRequest {
  to: EmailRecipient;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface EmailSendResult {
  ok: false;
  disabled: true;
  provider: EmailProvider;
  error: string;
}

export function getAvailableEvents(): readonly EmailEvent[] {
  return config.email.events;
}

export function isEmailEnabled(): boolean {
  return false;
}

export async function sendEmail(_req: EmailSendRequest): Promise<EmailSendResult> {
  return {
    ok: false,
    disabled: true,
    provider: "disabled",
    error: "Email disabled in this deployment (orchestrator-owned).",
  };
}

/** Convenience aliases for callers that might use an engine object */
export const EmailEngine = {
  getAvailableEvents,
  isEnabled: isEmailEnabled,
  send: sendEmail,
  sendEmail,
};

export default EmailEngine;
