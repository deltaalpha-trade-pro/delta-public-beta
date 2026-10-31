import "server-only"

export type Readiness = "configured-not-verified" | "disabled" | "unverified"
export type IntegrationReadiness = {
  tidio: {
    widget: Readiness
    webhook: Readiness
    plan: "unverified"
    operatorInbox: "unverified"
    customerEscalation: "manual-human-only"
  }
  whalezMail: {
    ingestion: Readiness
    authenticatedRelay: Readiness
    providerDelivery: "unverified"
    inboundSupportInbox: "unverified"
    auditReceipts: "unverified"
  }
  governance: {
    liveSettlement: "blocked"
    productionMinting: "blocked"
    founderAuthority: "not-delegated"
    adminOperations: "read-only"
  }
}
const configured = (name: string): boolean => Boolean(process.env[name]?.trim())
const enabled = (name: string): boolean => process.env[name] === "true"

export function adminIntegrationReadiness(): IntegrationReadiness {
  const relayPresent = configured("WHALEZ_MAIL_INGEST_URL") && configured("WHALEZ_INTERNAL_RELAY_TOKEN")
  // Environment presence is NOT proof that a provider has accepted or delivered an event.
  return {
    tidio: {
      widget: configured("NEXT_PUBLIC_TIDIO_PUBLIC_KEY") ? "configured-not-verified" : "disabled",
      webhook: enabled("TIDIO_WEBHOOK_ENABLED") && configured("TIDIO_WEBHOOK_SECRET") && relayPresent
        ? "configured-not-verified" : "disabled",
      plan: "unverified",
      operatorInbox: "unverified",
      customerEscalation: "manual-human-only",
    },
    whalezMail: {
      ingestion: configured("WHALEZ_MAIL_INGEST_URL") ? "configured-not-verified" : "disabled",
      authenticatedRelay: relayPresent ? "configured-not-verified" : "disabled",
      providerDelivery: "unverified",
      inboundSupportInbox: "unverified",
      auditReceipts: "unverified",
    },
    governance: {
      liveSettlement: "blocked",
      productionMinting: "blocked",
      founderAuthority: "not-delegated",
      adminOperations: "read-only",
    },
  }
}
