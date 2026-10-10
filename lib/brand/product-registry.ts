export type WhalezBrandProduct = {
  id: string
  name: string
  family: "ecosystem" | "intelligence" | "platform" | "rail" | "asset"
  mark: string
  public: boolean
  description: string
}

export const WHALEZ_BRAND_PRODUCTS: readonly WhalezBrandProduct[] = [
  { id: "whalez-ai-ecosystem", name: "Whalez-AI Ecosystem", family: "ecosystem", mark: "/brand/whalez-ai-ecosystem.svg", public: true, description: "Umbrella ecosystem and product identity." },
  { id: "whalez-ai", name: "Whalez-AI", family: "intelligence", mark: "/brand/whalez-ai-ecosystem.svg", public: true, description: "One intelligence expressed through many customer-facing capabilities." },
  { id: "deltaalpha-trade-pro", name: "DeltaAlpha-Trade-Pro", family: "platform", mark: "/brand/deltaalpha-trade-pro.svg", public: true, description: "Public financial operating platform and user gateway." },
  { id: "whalezchain", name: "WhalezChain", family: "rail", mark: "/brand/whalezchain.svg", public: false, description: "Internal ecosystem state and provenance component; not listed as a public product." },
  { id: "whz", name: "WHZ", family: "asset", mark: "/brand/whz.svg", public: false, description: "Native ecosystem asset identity; not listed as a public product." },
  { id: "ptn", name: "PTN", family: "asset", mark: "/brand/ptn.svg", public: false, description: "Native trade-note identity; not listed as a public product." },
  { id: "prn", name: "PRN", family: "asset", mark: "/brand/prn.svg", public: false, description: "Native receipt-note identity; not listed as a public product." },
] as const

export const PUBLIC_WHALEZ_BRAND_PRODUCTS = WHALEZ_BRAND_PRODUCTS.filter((product) => product.public)
