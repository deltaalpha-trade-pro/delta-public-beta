import Image from "next/image"
import { PUBLIC_WHALEZ_BRAND_PRODUCTS } from "@/lib/brand/product-registry"

export function BrandFamilySection() {
  const products = PUBLIC_WHALEZ_BRAND_PRODUCTS.filter((product) => product.id !== "whalez-ai-ecosystem")

  return (
    <section aria-labelledby="brand-family-title" className="py-20 md:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">One ecosystem</span>
          <h2 id="brand-family-title" className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            One visual identity. Distinct product signatures.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The Whalez-AI Ecosystem uses one visual grammar across its public products. Each mark carries a specific role,
            while the shared geometry, palette and interaction language keep the family recognizable.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group rounded-2xl border border-border bg-background/55 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/80"
            >
              <div className="flex h-20 items-center justify-center rounded-xl border border-white/10 bg-black/10">
                <Image src={product.mark} alt={`${product.name} brand mark`} width={72} height={72} className="h-16 w-16 object-contain transition-transform group-hover:scale-105" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{product.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
