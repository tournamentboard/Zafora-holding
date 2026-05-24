"use client";

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
  labelMap?: Record<string, string>;
}

const DEFAULT_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewed: "bg-purple-100 text-purple-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  proposal_sent: "bg-orange-100 text-orange-700",
  in_progress: "bg-teal-100 text-teal-700",
  closed: "bg-gray-100 text-gray-600",
  rejected: "bg-red-100 text-red-600",
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
};

const DEFAULT_LABELS: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  in_progress: "In Progress",
  closed: "Closed Won",
  rejected: "Not a Fit",
  active: "Active",
  inactive: "Inactive",
  published: "Published",
  draft: "Draft",
  archived: "Archived",
  pending: "Pending",
  approved: "Approved",
};

export default function StatusBadge({ status, colorMap, labelMap }: StatusBadgeProps) {
  const colors = { ...DEFAULT_COLORS, ...colorMap };
  const labels = { ...DEFAULT_LABELS, ...labelMap };
  const colorClass = colors[status] ?? "bg-gray-100 text-gray-600";
  const label = labels[status] ?? status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
