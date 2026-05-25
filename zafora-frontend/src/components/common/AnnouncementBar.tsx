"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type AnnouncementBarData = {
  enabled: boolean;
  message: string;
  link?: string;
  linkText?: string;
  dismissible?: boolean;
  bgColor?: string;
  textColor?: string;
};

type Props = {
  data: AnnouncementBarData | null;
};

const STORAGE_KEY = "zafora_bar_dismissed";

export default function AnnouncementBar({ data }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wasDismissed = sessionStorage.getItem(STORAGE_KEY);
      if (wasDismissed) setDismissed(true);
    }
  }, []);

  if (!data || !data.enabled || !data.message || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  const bg = data.bgColor || "#173f35";
  const color = data.textColor || "#ffffff";

  return (
    <div
      className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium"
      style={{ backgroundColor: bg, color }}
    >
      <span>{data.message}</span>
      {data.link && data.linkText && (
        <Link
          href={data.link}
          className="underline opacity-80 text-xs hover:opacity-100 transition-opacity"
          style={{ color }}
        >
          {data.linkText}
        </Link>
      )}
      {data.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
