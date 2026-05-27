"use client";

import { useRef } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import type { StorageFolder } from "@/src/lib/constants/storage";

interface PhotoUploadFieldProps {
  folder: StorageFolder;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  previewShape?: "square" | "circle";
}

export function PhotoUploadField({
  folder,
  label,
  value,
  onChange,
  placeholder = "Paste URL or upload a file",
  hint,
  previewShape = "square",
}: PhotoUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, error } = useImageUpload({
    folder,
    onSuccess: (result) => onChange(result.publicUrl),
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    e.target.value = "";
  };

  const previewClass =
    previewShape === "circle"
      ? "h-14 w-14 rounded-full object-cover border border-[#e5ded3] mt-1"
      : "h-16 w-16 rounded-xl object-cover border border-[#e5ded3] mt-1";

  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-[#10231f] block">{label}</label>}
      {hint && <p className="text-[11px] text-[#8a958f]">{hint}</p>}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white min-w-0"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e5ded3] text-sm font-semibold text-[#173f35] bg-white hover:bg-[#f0ebe3] transition-colors disabled:opacity-50 shrink-0"
        >
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span className="hidden sm:inline">{isUploading ? "Uploading…" : "Upload"}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <X size={12} />
          {error}
        </p>
      )}
      {value && (
        <img
          src={value}
          alt=""
          className={previewClass}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
      )}
    </div>
  );
}
