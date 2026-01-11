import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"


export function StatusTable() {
 

  

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Upload Status</CardTitle>
        <CardDescription>
          Real-time monitoring of file uploads
          {/* Placeholder for WebSocket/SSE integration */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  )
}
