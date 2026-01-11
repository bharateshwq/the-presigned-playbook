"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, X, FileIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Architecture, UploadStatus } from "../PresignedUrlPlaybook"

interface MultipartUploadProps {
  architecture: Architecture
  onUploadStatusChange: (statuses: UploadStatus[]) => void
  currentUser: string
}

export function MultipartUpload({ architecture, onUploadStatusChange, currentUser }: MultipartUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadProgress(0)
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    const uploadStatus: UploadStatus = {
      id: crypto.randomUUID(),
      filename: file.name,
      status: "uploading",
      progress: 0,
    }

    onUploadStatusChange([uploadStatus])

    // Simulate multipart upload with chunks
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)
      uploadStatus.progress = progress

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
        uploadStatus.status = "success"
      }

      onUploadStatusChange([uploadStatus])
    }, 200)
  }

  const handleClear = () => {
    setFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleForceDelete = () => {
    console.log("[v0] Force deleting multipart upload images for user:", currentUser)
    handleClear()
    onUploadStatusChange([])
  }

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" id="multipart-file-input" />

      <div className="border-2 border-dashed rounded-lg p-8 transition-colors border-border hover:border-muted-foreground">
        <label htmlFor="multipart-file-input" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Upload large files with multipart</p>
              <p className="text-sm text-muted-foreground">Ideal for files larger than 100MB</p>
            </div>
          </div>
        </label>
      </div>

      {file && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!isUploading && (
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-center text-muted-foreground">Uploading chunks... {uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleUpload} disabled={!file || isUploading} className="flex-1">
          {isUploading ? "Uploading..." : "Start Multipart Upload"}
        </Button>
        <Button variant="destructive" onClick={handleForceDelete} disabled={!currentUser || isUploading}>
          <Trash2 className="h-4 w-4 mr-2" />
          Force Delete
        </Button>
      </div>
    </div>
  )
}
