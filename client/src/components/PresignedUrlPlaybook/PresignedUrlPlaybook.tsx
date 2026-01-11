import { useState } from "react";
import { ArchitectureNavigator } from "./components/architecture-nav";
import { UploadSection } from "./components/upload-section";
import { StatusTable } from "./components/status-table";
import { InfoDrawer } from "./components/info-drawer";
import { UserSelector } from "./components/user-selector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type Architecture =
  | "DB_FIRST_EVENTBRIDGE"
  | "UPLOAD_FIRST_DB"
  | "SERVER_SIDE_UPLOAD"
  | "TWO_PHASE_COMMIT"
  | "IDEMPOTENT_RETRY"
  | "CLIENT_ACK";

export type UploadMode = "SINGLE" | "MULTIPLE" | "MULTIPART";
const queryClient = new QueryClient();

export default function App() {
  const [currentArchitecture, setCurrentArchitecture] = useState<Architecture>(
    "DB_FIRST_EVENTBRIDGE"
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  return (
    <div className=" bg-background">
      <QueryClientProvider client={queryClient}>
        <InfoDrawer
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          architecture={currentArchitecture}
        />

        <div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
          <UserSelector
            currentUser={currentUser}
            onUserChange={setCurrentUser}
          />

          <ArchitectureNavigator
            currentArchitecture={currentArchitecture}
            onArchitectureChange={setCurrentArchitecture}
            onInfoClick={() => setIsInfoOpen(true)}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
            <UploadSection
              architecture={currentArchitecture}
              currentUser={currentUser}
            />

            <StatusTable />
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
}
