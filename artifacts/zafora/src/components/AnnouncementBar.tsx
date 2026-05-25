import { useState, useEffect } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import { X, Megaphone } from "lucide-react";
import { Link } from "wouter";

const DISMISSED_KEY = "zafora_announcement_dismissed";

export default function AnnouncementBar() {
  const { data } = useGetSiteSettings("announcement_bar");
  const [dismissed, setDismissed] = useState(false);

  const bar = (() => {
    try {
      if (data?.value) return JSON.parse(data.value);
    } catch {}
    return null;
  })();

  useEffect(() => {
    if (bar?.message) {
      const stored = sessionStorage.getItem(DISMISSED_KEY);
      if (stored === bar.message) setDismissed(true);
    }
  }, [bar?.message]);

  if (!bar?.enabled || !bar?.message || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, bar.message);
    setDismissed(true);
  };

  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium relative"
      style={{ backgroundColor: bar.bgColor || "#173f35", color: bar.textColor || "#ffffff" }}
    >
      <Megaphone size={14} className="shrink-0 opacity-80" />
      <span>{bar.message}</span>
      {bar.link && bar.linkText && (
        bar.link.startsWith("http") ? (
          <a href={bar.link} target="_blank" rel="noopener noreferrer"
            className="underline text-xs opacity-80 hover:opacity-100 transition-opacity shrink-0">
            {bar.linkText}
          </a>
        ) : (
          <Link href={bar.link}
            className="underline text-xs opacity-80 hover:opacity-100 transition-opacity shrink-0">
            {bar.linkText}
          </Link>
        )
      )}
      {bar.dismissible && (
        <button
          onClick={handleDismiss}
          className="absolute right-4 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
