import type React from "react"

import { useRef, useState } from "react"
import { Upload, X, ImageIcon, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Architecture, UploadStatus } from "../PresignedUrlPlaybook"

interface MultipleUploadProps {
  architecture: Architecture
  onUploadStatusChange: (statuses: UploadStatus[]) => void
  currentUser: string
}

interface FileWithPreview {
  file: File
  preview: string | null
  id: string
}

export function MultipleUpload({ architecture, onUploadStatusChange, currentUser }: MultipleUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [maxUploads, setMaxUploads] = useState(5)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    const newFiles: FileWithPreview[] = selectedFiles.slice(0, maxUploads - files.length).map((file) => {
      const preview: string | null = null

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, preview: reader.result as string } : f)))
        }
        reader.readAsDataURL(file)
      }

      const id = crypto.randomUUID()
      return { file, preview, id }
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    const uploadStatuses: UploadStatus[] = files.map((fileWithPreview) => ({
      id: fileWithPreview.id,
      filename: fileWithPreview.file.name,
      status: "uploading",
      progress: 0,
    }))

    onUploadStatusChange(uploadStatuses)

    // Simulate upload progress for each file
    uploadStatuses.forEach((uploadStatus, index) => {
      let progress = 0
      const interval = setInterval(
        () => {
          progress += 10
          uploadStatus.progress = progress

          if (progress >= 100) {
            clearInterval(interval)
            uploadStatus.status = "success"
            uploadStatus.url = files[index].preview || undefined
          }

          onUploadStatusChange([...uploadStatuses])
        },
        300 + index * 100,
      )
    })
  }

  const handleForceDelete = () => {
    console.log("[v0] Force deleting multiple upload images for user:", currentUser)
    setFiles([])
    onUploadStatusChange([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="max-uploads">Maximum uploads</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Button variant="outline" size="icon" onClick={() => setMaxUploads((v) => Math.max(1, v - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="max-uploads"
              type="number"
              value={maxUploads}
              onChange={(e) => setMaxUploads(Math.max(1, Number.parseInt(e.target.value) || 1))}
              min={1}
              max={20}
              className="text-center"
            />
            <Button variant="outline" size="icon" onClick={() => setMaxUploads((v) => Math.min(20, v + 1))}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={files.length >= maxUploads}>
          <Upload className="h-4 w-4 mr-2" />
          Select Files
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,video/*"
        multiple
        className="hidden"
      />

      {files.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center border-border">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No files selected (max {maxUploads})</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {files.map((fileWithPreview) => (
            <div key={fileWithPreview.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
              {fileWithPreview.preview ? (
                <img
                  src={fileWithPreview.preview || "/placeholder.svg"}
                  alt={fileWithPreview.file.name}
                  className="h-12 w-12 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileWithPreview.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(fileWithPreview.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleUpload} disabled={files.length === 0} className="flex-1">
          Upload {files.length} {files.length === 1 ? "File" : "Files"}
        </Button>
        <Button variant="destructive" onClick={handleForceDelete} disabled={!currentUser}>
          <Trash2 className="h-4 w-4 mr-2" />
          Force Delete
        </Button>
      </div>
    </div>
  )
}
