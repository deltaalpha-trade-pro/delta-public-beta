# External Rail & Security Facts V1

Status date: 30 September 2026

This document records external facts used to shape the platform boundary. It is evidence, not a legal opinion or licensing determination.

## Paystack

Paystack's current transaction API documents initialization from the backend using the secret key, with amount represented in subunits and a unique reference. It also exposes server-side transaction verification by reference.

Source: https://paystack.com/docs/api/transaction/

Paystack's webhook documentation states that public webhook events should be verified using the x-paystack-signature HMAC SHA512 signature before processing.

Source: https://paystack.com/docs/payments/webhooks/

Architecture consequence:
- Paystack secret keys stay in private server infrastructure.
- DeltaAlpha browser code never receives provider secrets.
- Provider success is not inferred from a browser callback alone.
- The existing webhook path remains signature-verified and provider-verified.
- The settlement gateway remains the provider/finality boundary.

## WebAuthn

W3C published Web Authentication Level 3 as a Recommendation on 25 August 2026. It defines scoped public-key credentials for strong web authentication.

Source: https://www.w3.org/TR/webauthn-3/

Architecture consequence:
- passkeys/WebAuthn belong in the authentication authority.
- DeltaAlpha and Whalez-AI Core expose security status, not a second credential authority.
- Future MFA/passkey work should terminate at runplane-auth.

## Backend service identity

OWASP ASVS 5.0's backend communication requirement calls for individual service accounts, short-term tokens, or certificate-based authentication rather than unchanging privileged API keys/shared accounts.

Source: https://cornucopia.owasp.org/taxonomy/asvs-5.0/13-configuration/02-backend-communication-configuration

Architecture consequence:
- the new WST bridge is short-lived and server-side.
- it is a transitional transport identity layer, not a financial authority.
- the hardening path is per-service asymmetric workload identity or mTLS.

## Nigeria payment controls

The Central Bank of Nigeria's current reforms page records 2026 measures including multi-factor authentication for instant-payment preference changes, stronger identity verification for online account opening/reactivation, real-time enterprise fraud monitoring, and one-device mobile-banking linkage with a temporary transaction limit for a newly activated device.

Source: https://www.cbn.gov.ng/AboutCBN/Reforms.html

Architecture consequence:
- account security is a first-class domain.
- customer risk and verification are upstream of payment capability.
- live payment operations must remain jurisdiction- and policy-gated.

## Nigeria digital investment / digital assets

SEC Nigeria maintains a current directory of registered FinTech operators, including digital investment/fund/portfolio management and virtual-asset categories. In August 2026, SEC announced additional VASPs entering ARIP and stated that AIP is conditional and is not a final licence.

Sources:
https://sec.gov.ng/fintech-and-innovation-hub-finport/registered-fintech-operators/
https://sec.gov.ng/for-investors/sec-nigeria-clears-additional-vasps-for-accelerated-regulatory-incubation-programme/

SEC's Robo-Advisory Rules state that a robo adviser wishing to perform portfolio management must apply to the Commission to be registered as a Fund/Portfolio Manager.

Source: https://sec.gov.ng/wp-content/uploads/2023/04/Rules-on-Robo-Advisory-Services_Executed-30-August-2021.pdf

Architecture consequence:
- Investment and Coach remain capability surfaces until their exact regulated activity is classified.
- Portfolio state is separated from advisory authority.
- Live investment routes require jurisdictional and partner eligibility evidence.