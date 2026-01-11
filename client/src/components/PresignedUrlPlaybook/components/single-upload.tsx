import type React from "react";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Architecture } from "../PresignedUrlPlaybook";
import usePresignedUrl from "../hooks/usePresignedUrl";

interface SingleUploadProps {
  architecture: Architecture;
  currentUser: string;
}

export function SingleUpload({ architecture, currentUser }: SingleUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = usePresignedUrl();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    mutate({
      baseURL: "http://localhost:8080/media/db-then-presigned-url",
      presignedType: "single",
      userName: "bharatesh",
    });
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleForceDelete = () => {
    console.log(
      "[v0] Force deleting single upload images for user:",
      currentUser
    );
    handleClear();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,video/*"
        className="hidden"
        id="single-file-input"
      />

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          file
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label htmlFor="single-file-input" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  Images and videos supported
                </p>
              </div>
            </div>
          </label>
        )}
      </div>

      {file && (
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium flex-1 truncate">
            {file.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleUpload} disabled={!file} className="flex-1">
          Upload File
        </Button>
        <Button
          variant="destructive"
          onClick={handleForceDelete}
          disabled={!currentUser}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Force Delete
        </Button>
      </div>
    </div>
  );
}
