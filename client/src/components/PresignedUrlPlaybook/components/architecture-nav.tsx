import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Architecture } from "../PresignedUrlPlaybook"

const ARCHITECTURES: Architecture[] = [
  "DB_FIRST_EVENTBRIDGE",
  "UPLOAD_FIRST_DB",
  "SERVER_SIDE_UPLOAD",
  "TWO_PHASE_COMMIT",
  "IDEMPOTENT_RETRY",
  "CLIENT_ACK",
]

const ARCHITECTURE_LABELS: Record<Architecture, string> = {
  DB_FIRST_EVENTBRIDGE: "DB First + EventBridge",
  UPLOAD_FIRST_DB: "Upload First → DB",
  SERVER_SIDE_UPLOAD: "Server-Side Upload",
  TWO_PHASE_COMMIT: "Two-Phase Commit",
  IDEMPOTENT_RETRY: "Idempotent Retry",
  CLIENT_ACK: "Client Acknowledgment",
}

interface ArchitectureNavigatorProps {
  currentArchitecture: Architecture
  onArchitectureChange: (arch: Architecture) => void
  onInfoClick: () => void
}

export function ArchitectureNavigator({
  currentArchitecture,
  onArchitectureChange,
  onInfoClick,
}: ArchitectureNavigatorProps) {
  const currentIndex = ARCHITECTURES.indexOf(currentArchitecture)

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + ARCHITECTURES.length) % ARCHITECTURES.length
    onArchitectureChange(ARCHITECTURES[newIndex])
  }

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % ARCHITECTURES.length
    onArchitectureChange(ARCHITECTURES[newIndex])
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" size="icon" onClick={handlePrevious} className="shrink-0 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Badge variant="outline" className="font-mono text-xs">
              {currentIndex + 1} / {ARCHITECTURES.length}
            </Badge>
            <Select value={currentArchitecture} onValueChange={onArchitectureChange}>
              <SelectTrigger className="w-[280px] h-auto py-2 text-lg font-bold ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ARCHITECTURES.map((arch) => (
                  <SelectItem key={arch} value={arch} className="text-base py-3">
                    {ARCHITECTURE_LABELS[arch]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={onInfoClick} className="shrink-0">
              <Info className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-1.5">
            {ARCHITECTURES.map((arch, idx) => (
              <button
                key={arch}
                onClick={() => onArchitectureChange(arch)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-muted hover:bg-primary/50"
                }`}
                title={ARCHITECTURE_LABELS[arch]}
              />
            ))}
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={handleNext} className="shrink-0 bg-transparent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
