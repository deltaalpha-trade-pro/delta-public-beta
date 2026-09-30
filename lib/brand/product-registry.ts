export type WhalezBrandProduct = {
  id: string
  name: string
  family: "ecosystem" | "intelligence" | "platform" | "rail" | "asset"
  mark: string
  public: boolean
  description: string
}

export const WHALEZ_BRAND_PRODUCTS: readonly WhalezBrandProduct[] = [
  { id: "whalez-ai-ecosystem", name: "Whalez-AI Ecosystem", family: "ecosystem", mark: "/brand/whalez-ai-ecosystem.svg", public: true, description: "Umbrella ecosystem and system-of-record identity." },
  { id: "whalez-ai", name: "Whalez-AI", family: "intelligence", mark: "/brand/whalez-ai-ecosystem.svg", public: true, description: "One intelligence expressed through many capabilities and delegated roles." },
  { id: "deltaalpha-trade-pro", name: "DeltaAlpha-Trade-Pro", family: "platform", mark: "/brand/deltaalpha-trade-pro.svg", public: true, description: "Public financial operating platform and user gateway." },
  { id: "whalezchain", name: "WhalezChain", family: "rail", mark: "/brand/whalezchain.svg", public: true, description: "Native economic state, provenance and finality rail." },
  { id: "whz", name: "WHZ", family: "asset", mark: "/brand/whz.svg", public: true, description: "WhalezChain native asset identity." },
  { id: "ptn", name: "PTN", family: "asset", mark: "/brand/ptn.svg", public: true, description: "WhalezChain trade-note identity." },
  { id: "prn", name: "PRN", family: "asset", mark: "/brand/prn.svg", public: true, description: "WhalezChain receipt/finality-state identity." },
] as const

export const PUBLIC_WHALEZ_BRAND_PRODUCTS = WHALEZ_BRAND_PRODUCTS.filter((product) => product.public)
