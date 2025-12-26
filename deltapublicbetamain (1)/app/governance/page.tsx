import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LawCard } from "@/components/governance/law-card"
import { FrameworkDiagram } from "@/components/governance/framework-diagram"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, BookOpen, Shield, Workflow } from "lucide-react"

const laws = [
  {
    id: "LAW-001",
    title: "Token Genesis Allocation Protocol",
    category: "allocation" as const,
    description: "Defines the initial distribution of PTN, PRN, and WHZ tokens across ecosystem funds and reserves.",
    status: "active" as const,
  },
  {
    id: "LAW-002",
    title: "AI Decision Authority Framework",
    category: "governance" as const,
    description: "Establishes the scope and limitations of AI-driven recommendations within the ecosystem.",
    status: "active" as const,
  },
  {
    id: "LAW-003",
    title: "Transaction Verification Standards",
    category: "compliance" as const,
    description: "Outlines the validation requirements for all Whalezchain transactions and smart contract executions.",
    status: "active" as const,
  },
  {
    id: "LAW-004",
    title: "Fund Rebalancing Protocol",
    category: "operations" as const,
    description:
      "Governs the periodic rebalancing of token allocations across ecosystem funds based on performance metrics.",
    status: "active" as const,
  },
  {
    id: "LAW-005",
    title: "Beta Participant Rights",
    category: "governance" as const,
    description: "Defines the rights, responsibilities, and protections afforded to beta program participants.",
    status: "active" as const,
  },
  {
    id: "LAW-006",
    title: "Cross-Token Exchange Rules",
    category: "operations" as const,
    description: "Establishes the mechanisms and limitations for exchanging between PTN, PRN, and WHZ tokens.",
    status: "pending" as const,
  },
]

export default function GovernancePage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ecosystem Law Center</h1>
                <p className="text-muted-foreground">Constitutional frameworks and governance rules</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                6 Active Laws
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                1 Pending Review
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Total Laws
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Constitutional rules</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">All systems aligned</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-amber-400" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-xs text-muted-foreground">Rule categories</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Scale className="w-4 h-4 text-accent" />
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">Today</p>
                <p className="text-xs text-muted-foreground">Framework current</p>
              </CardContent>
            </Card>
          </div>

          {/* Framework Diagram */}
          <div className="mb-8">
            <FrameworkDiagram />
          </div>

          {/* Laws Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Constitutional Laws</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {laws.map((law) => (
                <LawCard key={law.id} {...law} />
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              The Ecosystem Law Center documents the constitutional frameworks governing the WHALEZ-AI ecosystem. These
              laws are designed to ensure fair, transparent, and AI-assisted operations across all platform functions.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
