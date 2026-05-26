import { useState, useCallback, useRef } from "react";

interface UploadResult {
  objectPath: string;
  publicUrl: string;
}

interface UseImageUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const uploadFile = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!file.type.startsWith("image/")) {
      const msg = "Only image files are supported.";
      setError(msg);
      optionsRef.current.onError?.(msg);
      return null;
    }

    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!urlRes.ok) {
        const d = await urlRes.json().catch(() => ({}));
        throw new Error(d.error || "Failed to request upload URL");
      }

      const { uploadURL, objectPath } = await urlRes.json();
      setProgress(40);

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putRes.ok) throw new Error("Failed to upload file to storage");
      setProgress(100);

      const publicUrl = `/api/storage/objects/${objectPath.replace(/^\//, "")}`;
      const result: UploadResult = { objectPath, publicUrl };
      optionsRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      optionsRef.current.onError?.(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadFile, isUploading, error, progress };
}
