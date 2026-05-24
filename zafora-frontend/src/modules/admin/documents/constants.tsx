import type { ReactNode } from "react";
import {
  FileText, Lock, Globe, Users, Building2, FileCheck, BookOpen, Info,
} from "lucide-react";

type DocTypeInfo = { value?: string; label: string; icon: ReactNode };
type VisibilityInfo = { value?: string; label: string; icon: ReactNode; color: string };

export const DOC_TYPES: DocTypeInfo[] = [
  { value: "capability_statement", label: "Capability Statement", icon: <FileCheck className="h-4 w-4" /> },
  { value: "case_study", label: "Case Study", icon: <BookOpen className="h-4 w-4" /> },
  { value: "compliance", label: "Compliance Document", icon: <Lock className="h-4 w-4" /> },
  { value: "teaser", label: "Project Teaser", icon: <FileText className="h-4 w-4" /> },
  { value: "proposal", label: "Proposal", icon: <FileText className="h-4 w-4" /> },
  { value: "report", label: "Report / Analysis", icon: <Info className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <FileText className="h-4 w-4" /> },
];

export const VISIBILITY_OPTIONS: VisibilityInfo[] = [
  { value: "public", label: "Everyone can see it", icon: <Globe className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
  { value: "government_only", label: "Government only", icon: <Building2 className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  { value: "investor_only", label: "Investors only", icon: <Users className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  { value: "admin_only", label: "Only you (admin)", icon: <Lock className="h-4 w-4" />, color: "bg-gray-100 text-gray-600" },
];

export function getDocType(value: string): DocTypeInfo {
  return DOC_TYPES.find(d => d.value === value) ?? { label: value, icon: <FileText className="h-4 w-4" /> };
}

export function getVisibility(value: string): VisibilityInfo {
  return VISIBILITY_OPTIONS.find(v => v.value === value) ?? { label: value, icon: <Globe className="h-4 w-4" />, color: "bg-gray-100 text-gray-600" };
}

export function getPreviewUrl(fileUrl: string): string | null {
  if (!fileUrl) return null;
  try {
    const url = new URL(fileUrl);
    if (url.hostname.includes("drive.google.com")) {
      return fileUrl.replace(/\/view(\?.*)?$/, "/preview").replace(/\/edit(\?.*)?$/, "/preview");
    }
    if (url.hostname.includes("dropbox.com")) {
      url.searchParams.set("raw", "1");
      return url.toString().replace("www.dropbox.com", "dl.dropboxusercontent.com");
    }
    if (url.hostname.includes("1drv.ms") || url.hostname.includes("onedrive.live.com")) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    }
    if (fileUrl.toLowerCase().endsWith(".pdf") || url.searchParams.has("export=download")) {
      return fileUrl;
    }
    return null;
  } catch {
    return null;
  }
}
