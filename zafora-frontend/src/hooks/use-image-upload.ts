import { useState, useCallback } from "react";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";

interface PresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

interface UploadResult {
  key: string;
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

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      if (!file.type.startsWith("image/")) {
        const msg = "Only image files are supported.";
        setError(msg);
        options.onError?.(msg);
        return null;
      }

      setIsUploading(true);
      setError(null);
      setProgress(10);

      try {
        const { data } = await apiAxios.post<PresignResponse>(API.STORAGE.PRESIGN, {
          fileName: file.name,
          size: file.size,
          contentType: file.type,
        });

        setProgress(40);

        const putRes = await fetch(data.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!putRes.ok) throw new Error("Failed to upload file to storage");
        setProgress(100);

        const result: UploadResult = { key: data.key, publicUrl: data.publicUrl };
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        options.onError?.(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  return { uploadFile, isUploading, error, progress };
}
