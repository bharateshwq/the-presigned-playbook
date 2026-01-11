import { User, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface UserSelectorProps {
  currentUser: string;
  onUserChange: (user: string) => void;
}

export function UserSelector({ currentUser, onUserChange }: UserSelectorProps) {
  const handleDeleteUser = () => {
    onUserChange("");
  };

  return (
    <Card className="mb-6 p-4 border  bg-card">
      <Label htmlFor="user-input" className="flex items-center gap-2 ">
        <User className="h-4 w-4" />
        Current User
      </Label>
      <div className="flex gap-2">
        <Input
          id="user-input"
          type="text"
          placeholder="Enter user ID or name..."
          value={currentUser}
          onChange={(e) => onUserChange(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDeleteUser}
          disabled={!currentUser}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
