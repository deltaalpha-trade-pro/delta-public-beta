import { PtnPrnGraduation } from "@/components/simulation/ptn-prn-graduation"
import { BridgeAgentValidation } from "@/components/simulation/bridge-agent-validation"
import { TradingChart } from "@/components/simulation/trading-chart"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Shield, AlertTriangle } from "lucide-react"

export default function SimulationPage() {
  return (
    <div>
      <TradingChart />
    </div>
  );
}
