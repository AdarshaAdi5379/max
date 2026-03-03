"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        onChange(data.url);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  if (value) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
        <Image src={value} alt="Product" fill className="object-cover" sizes="400px" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-1 hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <>
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop an image here, or click to select
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            JPEG, PNG, WebP (max 5MB)
          </p>
        </>
      )}
    </div>
  );
}
