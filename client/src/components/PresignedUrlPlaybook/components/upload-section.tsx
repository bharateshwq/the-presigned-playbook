import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SingleUpload } from "./single-upload";
import { MultipleUpload } from "./multiple-upload";
import { MultipartUpload } from "./multipart-upload";
import type { Architecture, UploadMode } from "../PresignedUrlPlaybook";

interface UploadSectionProps {
  architecture: Architecture;
  currentUser: string;
}

export function UploadSection({
  architecture,
  currentUser,
}: UploadSectionProps) {
  const [activeMode, setActiveMode] = useState<UploadMode>("SINGLE");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>
          Test the {architecture.replace(/_/g, " ").toLowerCase()} architecture
          with different upload modes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeMode}
          onValueChange={(v) => setActiveMode(v as UploadMode)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="SINGLE">Single</TabsTrigger>
            <TabsTrigger value="MULTIPLE">Multiple</TabsTrigger>
            <TabsTrigger value="MULTIPART">Multipart</TabsTrigger>
          </TabsList>

          <TabsContent value="SINGLE" className="mt-6">
            <SingleUpload
              architecture={architecture}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="MULTIPLE" className="mt-6">
            <MultipleUpload
              architecture={architecture}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="MULTIPART" className="mt-6">
            <MultipartUpload
              architecture={architecture}
              currentUser={currentUser}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
