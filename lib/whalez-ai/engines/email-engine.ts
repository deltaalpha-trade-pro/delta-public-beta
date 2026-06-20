import { config, type EmailEvent, type WhalesAiResponse } from "../config"

/**
 * Email Engine - AI-controlled email automation
 * Accepts commands ONLY from Layer 3 (Whalez-AI)
 *
 * PUBLIC mode: log + simulate
 * INTERNAL mode: send real emails
 */

type EmailTemplate = {
  subject: string
  body: string
}

type EmailPayload = {
  event: EmailEvent
  to: string
  data?: Record<string, string>
}

const templates: Record<EmailEvent, EmailTemplate> = {
  beta_request: {
    subject: "Beta Access Request Received",
    body: "Your beta access request has been received. We will review and respond shortly.",
  },
  beta_approved: {
    subject: "Beta Access Approved",
    body: "Congratulations! Your beta access has been approved. You can now access the platform.",
  },
  waitlist: {
    subject: "Added to Waitlist",
    body: "You have been added to our waitlist. We will notify you when access becomes available.",
  },
  simulation_update: {
    subject: "Simulation Update",
    body: "Your simulation session has been updated. View your results in the dashboard.",
  },
}

/**
 * Process email event - called only from Layer 3
 */
export async function processEmailEvent(payload: EmailPayload): Promise<WhalesAiResponse> {
  // Validate event type
  if (!config.email.events.includes(payload.event)) {
    return {
      success: false,
      error: `Invalid email event: ${payload.event}`,
    }
  }

  const template = templates[payload.event]
  const processedTemplate = applyTemplateData(template, payload.data)

  // PUBLIC mode: log + simulate
  if (!config.INTERNAL_MODE) {
    logEmailEvent(payload, "simulated")
    return {
      success: true,
      data: {
        mode: "SIMULATION_ONLY",
        event: payload.event,
        to: maskEmail(payload.to),
        template: processedTemplate.subject,
        message: "Email would be sent in production",
      },
      simulationOnly: true,
    }
  }

  // INTERNAL mode: send real email
  try {
    const result = await sendEmail(payload.to, processedTemplate)
    logEmailEvent(payload, "sent")
    return {
      success: true,
      data: {
        mode: "INTERNAL",
        event: payload.event,
        messageId: result.messageId,
      },
    }
  } catch (error) {
    logEmailEvent(payload, "failed")
    return {
      success: false,
      error: error instanceof Error ? error.message : "Email send failed",
    }
  }
}

/**
 * Apply template data placeholders
 */
function applyTemplateData(template: EmailTemplate, data?: Record<string, string>): EmailTemplate {
  if (!data) return template

  let subject = template.subject
  let body = template.body

  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`
    subject = subject.replace(placeholder, value)
    body = body.replace(placeholder, value)
  }

  return { subject, body }
}

/**
 * Send email via configured provider (Resend/Postmark compatible)
 */
async function sendEmail(to: string, template: EmailTemplate): Promise<{ messageId: string }> {
  const provider = config.email.provider

  // Resend API
  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "noreply@delta.whalez.ai",
        to,
        subject: template.subject,
        text: template.body,
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`)
    }

    const result = await response.json()
    return { messageId: result.id }
  }

  // Postmark API
  if (provider === "postmark") {
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": process.env.POSTMARK_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        From: process.env.EMAIL_FROM || "noreply@delta.whalez.ai",
        To: to,
        Subject: template.subject,
        TextBody: template.body,
      }),
    })

    if (!response.ok) {
      throw new Error(`Postmark API error: ${response.statusText}`)
    }

    const result = await response.json()
    return { messageId: result.MessageID }
  }

  throw new Error(`Unknown email provider: ${provider}`)
}

/**
 * Log email event for telemetry
 */
function logEmailEvent(payload: EmailPayload, status: "simulated" | "sent" | "failed"): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[EMAIL-ENGINE] ${status.toUpperCase()}:`, {
      event: payload.event,
      to: maskEmail(payload.to),
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Mask email for logging (privacy)
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return "***@***"
  const maskedLocal = local.slice(0, 2) + "***"
  return `${maskedLocal}@${domain}`
}

/**
 * Get available email events (public-safe)
 */
export function getAvailableEvents(): readonly EmailEvent[] {
  return config.email.events
}
