import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Architecture } from "../PresignedUrlPlaybook"

interface InfoDrawerProps {
  isOpen: boolean
  onClose: () => void
  architecture: Architecture
}

const ARCHITECTURE_INFO: Record<
  Architecture,
  {
    title: string
    description: string
    pros: string[]
    cons: string[]
    useCase: string
  }
> = {
  DB_FIRST_EVENTBRIDGE: {
    title: "DB First + EventBridge",
    description:
      "Create database record first, then upload to S3. Use EventBridge to handle post-upload events and update the database with the final S3 URL.",
    pros: [
      "Immediate database record creation",
      "Decoupled architecture with event-driven updates",
      "Easy to track upload lifecycle",
      "Can trigger multiple downstream processes",
    ],
    cons: [
      "Orphaned database records if upload fails",
      "More complex architecture",
      "Requires EventBridge setup",
      "Potential consistency issues",
    ],
    useCase: "Best for systems requiring immediate record tracking with eventual consistency acceptable.",
  },
  UPLOAD_FIRST_DB: {
    title: "Upload First → DB",
    description:
      "Upload file to S3 using presigned URL first, then create database record with the S3 URL only after successful upload.",
    pros: [
      "No orphaned database records",
      "Simple and straightforward flow",
      "Strong consistency guarantee",
      "Easy to implement and debug",
    ],
    cons: [
      "No tracking until upload completes",
      "Client must handle database creation",
      "Potential orphaned S3 objects if DB write fails",
      "Longer perceived latency",
    ],
    useCase:
      "Best for simple upload flows where consistency is critical and tracking before completion is not required.",
  },
  SERVER_SIDE_UPLOAD: {
    title: "Server-Side Upload",
    description:
      "Client sends file to server, server uploads to S3 and creates database record. All logic handled server-side with full control.",
    pros: [
      "Full server control over upload",
      "Atomic database and storage operations",
      "Easy to add validation and processing",
      "Consistent error handling",
    ],
    cons: [
      "Increased server load and bandwidth",
      "Slower for large files",
      "Not utilizing presigned URLs",
      "Scalability concerns with many uploads",
    ],
    useCase: "Best when server-side validation, processing, or transformation is required before storage.",
  },
  TWO_PHASE_COMMIT: {
    title: "Two-Phase Commit",
    description:
      "Create pending database record, upload to S3, then confirm/commit the record. Allows rollback if either phase fails.",
    pros: ["Transactional guarantees", "Can rollback on failure", "Tracking from the start", "Strong consistency"],
    cons: [
      "Complex implementation",
      "Requires cleanup of pending records",
      "Higher latency",
      "More prone to edge cases",
    ],
    useCase: "Best for systems requiring transactional guarantees and the ability to rollback on partial failures.",
  },
  IDEMPOTENT_RETRY: {
    title: "Idempotent Retry",
    description:
      "Design upload and database operations to be idempotent, allowing safe retries. Use unique identifiers to prevent duplicate records.",
    pros: [
      "Handles network failures gracefully",
      "Safe automatic retries",
      "Eventual consistency guaranteed",
      "Resilient to transient errors",
    ],
    cons: [
      "Requires careful idempotency design",
      "More complex client logic",
      "Potential for temporary inconsistency",
      "Requires unique identifiers",
    ],
    useCase: "Best for unreliable networks where retries are common and eventual consistency is acceptable.",
  },
  CLIENT_ACK: {
    title: "Client Acknowledgment",
    description:
      "Server creates presigned URL and pending record, client uploads and sends acknowledgment, server confirms and finalizes record.",
    pros: [
      "Server knows about upload immediately",
      "Client-driven completion",
      "Good tracking capabilities",
      "Flexible error handling",
    ],
    cons: [
      "Client must send acknowledgment",
      "Requires cleanup of unacknowledged records",
      "Acknowledgment can fail",
      "More round trips",
    ],
    useCase: "Best when you need upload tracking but want clients to control when the upload is considered complete.",
  },
}

export function InfoDrawer({ isOpen, onClose, architecture }: InfoDrawerProps) {
  const info = ARCHITECTURE_INFO[architecture]

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 bg-card border-b shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{info.title}</h3>
                <Badge variant="outline" className="font-mono">
                  {architecture}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-3xl">{info.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-success">Advantages</h4>
              <ul className="space-y-1.5 text-sm">
                {info.pros.map((pro, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-destructive">Disadvantages</h4>
              <ul className="space-y-1.5 text-sm">
                {info.cons.map((con, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-destructive mt-0.5">✗</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Best Use Case</h4>
              <p className="text-sm text-muted-foreground">{info.useCase}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
